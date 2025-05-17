import { NextResponse } from "next/server"
import twilio from "twilio"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { userId, message, location, contactIds } = await request.json()

    if (!userId || !message) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Missing Twilio credentials")
      return NextResponse.json({ error: "Twilio configuration missing" }, { status: 500 })
    }

    const client = twilio(accountSid, authToken)

    // Get emergency contacts
    let contacts = []
    if (contactIds && contactIds.length > 0) {
      // Get specific contacts if IDs are provided
      contacts = await Promise.all(
        contactIds.map(async (id: string) => {
          const allContacts = await db.getEmergencyContacts(userId)
          return allContacts.find((contact) => contact.id === id)
        }),
      )
      contacts = contacts.filter(Boolean) // Remove any undefined results
    } else {
      // Get all contacts if no IDs are provided
      contacts = await db.getEmergencyContacts(userId)
    }

    // Sort contacts by priority
    contacts.sort((a, b) => a.priority - b.priority)

    if (contacts.length === 0) {
      return NextResponse.json({ error: "No emergency contacts found" }, { status: 404 })
    }

    // Format location string if available
    const locationStr = location
      ? `\nCurrent location: ${location.address || "Unknown"}\nCoordinates: ${location.latitude}, ${location.longitude}`
      : "\nLocation information not available"

    // Format the message with location
    const fullMessage = `${message}${locationStr}\n\nThis is an automated emergency alert from SAHELI Women's Safety App.`

    // Send SMS to each contact
    const results = await Promise.all(
      contacts.map(async (contact) => {
        try {
          const sms = await client.messages.create({
            body: fullMessage,
            from: twilioPhoneNumber,
            to: contact.phone,
          })

          console.log(`SMS sent to ${contact.name} (${contact.phone}): ${sms.sid}`)

          return {
            contactId: contact.id,
            contactName: contact.name,
            status: "sent",
            sid: sms.sid,
          }
        } catch (error) {
          console.error(`Failed to send SMS to ${contact.name} (${contact.phone}):`, error)

          return {
            contactId: contact.id,
            contactName: contact.name,
            status: "failed",
            error: error instanceof Error ? error.message : String(error),
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      messagesSent: results.filter((r) => r.status === "sent").length,
      messagesFailed: results.filter((r) => r.status === "failed").length,
      details: results,
    })
  } catch (error) {
    console.error("Error sending emergency SMS:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send emergency SMS" },
      { status: 500 },
    )
  }
}

