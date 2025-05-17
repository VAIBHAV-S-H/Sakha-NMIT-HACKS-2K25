import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const userName = searchParams.get("userName") || "User"
  const latitude = searchParams.get("latitude") || ""
  const longitude = searchParams.get("longitude") || ""

  // Create TwiML response for the emergency call
  const twiml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="woman">
        Emergency alert from SAHELI safety app. ${userName} has triggered an SOS alert and may need immediate assistance.
        ${latitude && longitude ? `Their current location coordinates are: Latitude ${latitude}, Longitude ${longitude}.` : ""}
        This is an automated emergency call. Please stay on the line for more information or contact emergency services.
      </Say>
      <Pause length="1"/>
      <Say voice="woman">
        To hear this message again, press 1. To acknowledge this alert, press 2.
      </Say>
      <Gather numDigits="1" action="/api/twilio/emergency-call-action" method="GET">
        <Say voice="woman">Please press a key now.</Say>
      </Gather>
      <Say voice="woman">
        No key was pressed. Repeating the emergency message.
      </Say>
      <Redirect>/api/twilio/emergency-call</Redirect>
    </Response>
  `

  // Return TwiML response
  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}

