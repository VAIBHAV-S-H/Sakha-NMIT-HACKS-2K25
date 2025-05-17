import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get the digit pressed by the user
  const searchParams = request.nextUrl.searchParams
  const digits = searchParams.get("Digits") || ""

  let twiml = ""

  // Handle different responses based on the digit pressed
  if (digits === "1") {
    // Repeat the message
    twiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Redirect>/api/twilio/emergency-call</Redirect>
      </Response>
    `
  } else if (digits === "2") {
    // Acknowledge the alert
    twiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="woman">
          Thank you for acknowledging this alert. The user will be notified that you have received their emergency message.
          Please take appropriate action to assist them. Goodbye.
        </Say>
        <Hangup/>
      </Response>
    `

    // Here you would typically update a database to mark the alert as acknowledged
    // This would be implemented based on your application's data model
  } else {
    // Invalid input
    twiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="woman">
          Invalid input. Please try again.
        </Say>
        <Redirect>/api/twilio/emergency-call</Redirect>
      </Response>
    `
  }

  // Return TwiML response
  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}

