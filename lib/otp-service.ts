// In-memory OTP storage (for demo purposes)
// In a production app, this would use Redis or a database
type OtpStore = {
  [identifier: string]: {
    otp: string;
    expiresAt: number;
  };
};

const otpStore: OtpStore = {};

// OTP validity period in milliseconds (5 minutes)
export const OTP_EXPIRY_DURATION = 5 * 60 * 1000;

/**
 * Generates a random 6-digit OTP
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Stores an OTP for the given identifier
 */
export function storeOtp(identifier: string, otp: string, expiresAt: number): void {
  otpStore[identifier] = {
    otp,
    expiresAt,
  };
}

/**
 * Verifies an OTP for the given identifier
 * @returns true if OTP is valid, false otherwise
 */
export function verifyOtp(identifier: string, otp: string): boolean {
  const storedData = otpStore[identifier];
  
  // If no OTP is stored for this identifier or it's expired
  if (!storedData || Date.now() > storedData.expiresAt) {
    return false;
  }

  // Check if OTP matches
  const isValid = storedData.otp === otp;
  
  // If OTP is valid, clear it to prevent reuse
  if (isValid) {
    clearOtp(identifier);
  }
  
  return isValid;
}

/**
 * Clears the stored OTP for the given identifier
 */
export function clearOtp(identifier: string): void {
  delete otpStore[identifier];
}

/**
 * Cleans up expired OTPs from the store
 * Should be called periodically in a production app
 */
export function cleanupExpiredOtps(): void {
  const now = Date.now();
  
  Object.keys(otpStore).forEach((identifier) => {
    if (otpStore[identifier].expiresAt < now) {
      delete otpStore[identifier];
    }
  });
} 