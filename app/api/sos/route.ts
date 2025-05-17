import { NextResponse } from 'next/server';
import twilio from 'twilio';
import type { Twilio } from 'twilio';

// Direct Twilio credentials (replace with your actual credentials)
const TWILIO_ACCOUNT_SID = "ACd7d92cde826c1e7e9519a6c0811d4e53";
const TWILIO_AUTH_TOKEN = "c457d017fd5921d89593385ddd452ec9";
const TWILIO_PHONE_NUMBER = "+17155788944";
const EMERGENCY_CONTACT = "+918431297102";

// Validate Twilio credentials
if (!TWILIO_ACCOUNT_SID || TWILIO_ACCOUNT_SID === "ACd7d92cde826c1e7e9519a6c0811d4e53") {
  console.error("Missing or invalid TWILIO_ACCOUNT_SID");
}

if (!TWILIO_AUTH_TOKEN || TWILIO_AUTH_TOKEN === "c457d017fd5921d89593385ddd452ec9") {
  console.error("Missing or invalid TWILIO_AUTH_TOKEN");
}

if (!TWILIO_PHONE_NUMBER) {
  console.error("Missing TWILIO_PHONE_NUMBER");
}

if (!EMERGENCY_CONTACT) {
  console.error("Missing EMERGENCY_CONTACT");
}

// Initialize Twilio client
let client: Twilio | undefined;
try {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("Twilio client initialized successfully");
} catch (err) {
  console.error("Failed to initialize Twilio client:", err);
}

interface TwilioError {
  code?: number | string;
  message?: string;
  toString: () => string;
}

export async function POST(request: Request) {
  try {
    console.log("SOS API called: Preparing to send emergency alert");
    
    // Check if Twilio client is properly initialized
    if (!client) {
      console.error("Twilio client not initialized");
      return NextResponse.json(
        { status: "error", message: "Twilio service is not available" },
        { status: 503 }
      );
    }
    
    const data = await request.json();
    console.log("Received data:", data);
    
    const latitude = data.latitude || "12.9719"; // Default lat
    const longitude = data.longitude || "77.5937"; // Default long
    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const messageBody = `🚨 SOS Alert! I need help! My location: ${googleMapsLink}`;
    console.log("Preparing message with location:", googleMapsLink);

    try {
      // For testing/development, we can add a mock mode that doesn't actually call Twilio
      const isMockMode = process.env.MOCK_TWILIO === 'true';
      
      let sms, call;
      
      if (isMockMode) {
        console.log("[MOCK MODE] Skipping actual Twilio API calls");
        sms = { sid: 'MOCK_SMS_SID' };
        call = { sid: 'MOCK_CALL_SID' };
      } else {
        // Send SOS SMS
        console.log("Sending SMS...");
        sms = await client.messages.create({
          body: messageBody,
          from: TWILIO_PHONE_NUMBER,
          to: EMERGENCY_CONTACT
        });
        console.log("SMS sent successfully:", sms.sid);

        // Make an emergency call
        console.log("Initiating emergency call...");
        call = await client.calls.create({
          twiml: `<Response><Say>${messageBody}</Say></Response>`,
          from: TWILIO_PHONE_NUMBER,
          to: EMERGENCY_CONTACT
        });
        console.log("Call initiated successfully:", call.sid);
      }

      return NextResponse.json({
        status: "success",
        message: "SOS alert sent successfully.",
        smsSid: sms.sid,
        callSid: call.sid,
        mockMode: isMockMode
      });
    } catch (twilioError: unknown) {
      console.error("Twilio API Error:", twilioError);
      console.error("Error details:", JSON.stringify(twilioError, null, 2));
      
      // Check for common Twilio errors
      let errorMessage = "Failed to send alert via Twilio";
      let errorCode = "UNKNOWN";
      const twilioErr = twilioError as TwilioError;
      
      if (twilioErr.code === 21608) {
        errorMessage = "The Twilio phone number is not a valid, SMS-capable phone number";
      } else if (twilioErr.code === 21211) {
        errorMessage = "The 'To' phone number is invalid";
      } else if (twilioErr.code === 20003) {
        errorMessage = "Authentication error - check Twilio credentials";
      }
      
      return NextResponse.json(
        { 
          status: "error", 
          message: errorMessage,
          errorCode: errorCode,
          errorDetails: twilioErr.toString()
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("SOS API General Error:", error);
    console.error("Error type:", typeof error);
    
    const err = error as Error;
    console.error("Error stack:", err?.stack || "No stack trace");
    
    return NextResponse.json(
      { 
        status: "error", 
        message: err instanceof Error ? err.message : "Unknown error processing the request",
        errorDetails: JSON.stringify(error)
      },
      { status: 500 }
    );
  }
} 