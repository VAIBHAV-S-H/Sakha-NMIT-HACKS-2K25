import { type NextRequest, NextResponse } from "next/server"
import { makeEmergencyCall, type EmergencyContact, type SOSMessage } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.contact || !body.message) {
      return NextResponse.json({ error: "Contact and message are required" }, { status: 400 })
    }

    const contact: EmergencyContact = body.contact
    const message: SOSMessage = body.message

    // Make call
    const result = await makeEmergencyCall(contact, message)

    if (result.success) {
      return NextResponse.json({
        success: true,
        callId: result.callId,
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to make call" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error making call:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

