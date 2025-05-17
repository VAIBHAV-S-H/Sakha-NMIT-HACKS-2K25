import { Twilio } from "twilio"

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

let twilioClient: Twilio | null = null

// Initialize the Twilio client only on the server
if (accountSid && authToken) {
  twilioClient = new Twilio(accountSid, authToken)
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface SOSMessage {
  userName: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  timestamp: Date
  messageType: "sos" | "alert" | "safe"
  details?: string
}

/**
 * Send an emergency SMS to a contact
 */
export async function sendEmergencySMS(
  contact: EmergencyContact,
  message: SOSMessage,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // For development/testing, log the message that would be sent
  console.log(`Would send SMS to ${contact.phone}: ${formatEmergencyMessage(message)}`)

  if (!twilioClient || !twilioPhoneNumber) {
    console.error("Twilio not configured properly", { accountSid, authToken, twilioPhoneNumber })
    return {
      success: false,
      error: "Twilio not configured properly",
    }
  }

  try {
    // Format the message
    const messageBody = formatEmergencyMessage(message)

    // Send the SMS
    const twilioMessage = await twilioClient.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: contact.phone,
    })

    console.log("SMS sent successfully", twilioMessage.sid)
    return {
      success: true,
      messageId: twilioMessage.sid,
    }
  } catch (error) {
    console.error("Error sending Twilio SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending SMS",
    }
  }
}

// Helper function to format emergency messages
function formatEmergencyMessage(message: SOSMessage): string {
  const locationLink = `https://maps.google.com/?q=${message.location.latitude},${message.location.longitude}`
  const address = message.location.address ? `near ${message.location.address}` : ""

  let messageBody = ""

  switch (message.messageType) {
    case "sos":
      messageBody = `EMERGENCY: ${message.userName} has triggered an SOS alert ${address}. Current location: ${locationLink}`
      break
    case "alert":
      messageBody = `ALERT: ${message.userName} may be in a potentially unsafe situation ${address}. Current location: ${locationLink}`
      break
    case "safe":
      messageBody = `${message.userName} has marked themselves as safe. Current location: ${locationLink}`
      break
  }

  if (message.details) {
    messageBody += `\nDetails: ${message.details}`
  }

  return messageBody
}

/**
 * Make an emergency call to a contact
 */
export async function makeEmergencyCall(
  contact: EmergencyContact,
  message: SOSMessage,
): Promise<{ success: boolean; callId?: string; error?: string }> {
  if (!twilioClient || !twilioPhoneNumber) {
    return {
      success: false,
      error: "Twilio not configured properly",
    }
  }

  try {
    // Create a TwiML response for the call
    const twimlUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/emergency-call?userName=${encodeURIComponent(message.userName)}&latitude=${message.location.latitude}&longitude=${message.location.longitude}`

    // Make the call
    const call = await twilioClient.calls.create({
      url: twimlUrl,
      from: twilioPhoneNumber,
      to: contact.phone,
    })

    return {
      success: true,
      callId: call.sid,
    }
  } catch (error) {
    console.error("Error making Twilio call:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error making call",
    }
  }
}

/**
 * Send emergency alerts to multiple contacts
 */
export async function sendEmergencyAlerts(
  contacts: EmergencyContact[],
  message: SOSMessage,
  options: { sms: boolean; call: boolean },
): Promise<{ success: boolean; results: any[]; error?: string }> {
  const results = []
  let hasError = false

  for (const contact of contacts) {
    if (options.sms) {
      const smsResult = await sendEmergencySMS(contact, message)
      results.push({ type: "sms", contact, ...smsResult })
      if (!smsResult.success) hasError = true
    }

    if (options.call) {
      const callResult = await makeEmergencyCall(contact, message)
      results.push({ type: "call", contact, ...callResult })
      if (!callResult.success) hasError = true
    }
  }

  return {
    success: !hasError,
    results,
  }
}

