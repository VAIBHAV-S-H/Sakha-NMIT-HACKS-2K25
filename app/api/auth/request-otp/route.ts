import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, storeOtp, OTP_EXPIRY_DURATION } from '@/lib/otp-service';
import nodemailer from 'nodemailer';

// IMPORTANT: Replace these with real values in production!
const EMAIL_USER = 'harisun2004207@gmail.com'; // Replace with your actual Gmail
const EMAIL_PASS = "tphk zajr nhny hxrp"; // Replace with your App Password

console.log("STARTUP DEBUG: Email credentials configured with user: " + 
  (EMAIL_USER ? EMAIL_USER : "MISSING") + 
  " and password: " + (EMAIL_PASS ? "PRESENT" : "MISSING"));

// Create a simple transporter that will log instead of sending real emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Verification ERROR:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

// --- Hypothetical SDK imports (you would need to install these) ---
// import twilio from 'twilio';
// import sgMail from '@sendgrid/mail';

// --- Initialize SDKs with API Keys (from environment variables) ---
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// if (process.env.SENDGRID_API_KEY) {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// }

export async function POST(req: NextRequest) {
  console.log("DEBUG: OTP request received");
  
  try {
    const { identifier } = await req.json(); // Expecting this to be an email address for this setup
    console.log(`DEBUG: Processing OTP for ${identifier}`);

    if (!identifier || typeof identifier !== 'string' || !identifier.includes('@')) { // Simple email validation
      console.log("DEBUG: Invalid email format");
      return NextResponse.json(
        { error: 'A valid email identifier is required.' },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_DURATION;

    storeOtp(identifier, otp, expiresAt);

    console.log(`OTP for ${identifier}: ${otp} (Expires at: ${new Date(expiresAt).toLocaleTimeString()}) - Preparing to send email.`);
    
    // Comment out or remove development mode check since we're using real credentials now
    // If you need to revert to development mode, update the string literals
    /* 
    if (EMAIL_USER === 'example@gmail.com' || EMAIL_PASS === 'abcd efgh ijkl mnop') {
      console.log("DEBUG: Using development mode - returning OTP directly");
      return NextResponse.json(
        { 
          message: 'DEVELOPMENT MODE: OTP generated but email not sent.',
          otp: otp, // Only include OTP in response during development!
          devNote: 'Replace email credentials in app/api/auth/request-otp/route.ts with real values.'
        },
        { status: 200 }
      );
    }
    */

    // Define email options
    const mailOptions = {
      from: `Sakha App <${EMAIL_USER}>`, // Use hardcoded email instead of env variable
      to: identifier, // User's email address (receiver)
      subject: 'Your Sakha App OTP Verification',
      text: `Your One-Time Password (OTP) for Sakha App is: ${otp}\nThis OTP will expire in 5 minutes.`,
      html: `<p>Your One-Time Password (OTP) for Sakha App is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`OTP Email sent successfully to ${identifier}`);
      return NextResponse.json(
        { message: 'OTP has been sent to your email address.' },
        { status: 200 }
      );
    } catch (emailError: any) {
      console.error(`Failed to send OTP email to ${identifier}:`, emailError);
      
      // Detailed error logging for troubleshooting
      console.error("Error details:", {
        code: emailError.code,
        command: emailError.command,
        responseCode: emailError.responseCode,
        response: emailError.response
      });
      
      // Log the OTP to console as a fallback for development
      console.error(`FALLBACK OTP for ${identifier} (due to email send failure): ${otp}`);
      
      // Return a more detailed error to help troubleshooting
      return NextResponse.json(
        { 
          error: 'Failed to send OTP email. Check server logs for details.', 
          errorCode: emailError.code || 'UNKNOWN',
          errorMessage: emailError.message || 'Unknown error',
          fallback: `For development, use OTP: ${otp}`
        },
        { status: 500 } 
      );
    }

  } catch (error: any) {
    console.error('Error in OTP request process:', error);
    // General error not related to email sending itself
    return NextResponse.json(
      { error: 'Failed to process OTP request. Please try again.' },
      { status: 500 }
    );
  }
} 