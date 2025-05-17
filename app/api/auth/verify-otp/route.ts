import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp-service';

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Identifier and OTP are required.' },
        { status: 400 }
      );
    }

    const isValid = verifyOtp(identifier, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP.' },
        { status: 400 }
      );
    }

    // In a real app, you would create and return a JWT token here
    // For this demo, we'll just return a success message
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
      user: {
        id: `user_${Date.now()}`,
        email: identifier,
        name: identifier.split('@')[0] || 'User',
      }
    });
  } catch (error: any) {
    console.error('Error in OTP verification process:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
} 