'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface OtpAuthFormProps {
  onAuthSuccess: (identifier: string) => void; // Callback when OTP is verified successfully
  identifierLabel?: string; // e.g., "Phone Number" or "Email"
  identifierPlaceholder?: string;
}

export function OtpAuthForm({
  onAuthSuccess,
  identifierLabel = 'Email or Phone Number',
  identifierPlaceholder = 'Enter your email or phone',
}: OtpAuthFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your ' + identifierLabel.toLowerCase());
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request OTP');
      }
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: data.message || 'An OTP has been sent to your identifier.',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Requesting OTP',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }
      toast({
        title: 'Authentication Successful',
        description: data.message || 'You have been successfully authenticated!',
        className: 'bg-green-500 text-white',
      });
      onAuthSuccess(identifier); // Notify parent component
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Verifying OTP',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Authenticate</h1>
        <p className="text-sm text-gray-600">
          {otpSent ? 'Enter the OTP sent to your identifier.' : `We'll send an OTP to your ${identifierLabel.toLowerCase()}.`}
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              {identifierLabel}
            </label>
            <Input
              id="identifier"
              type="text" // Could be 'email' or 'tel' depending on expected identifier
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={identifierPlaceholder}
              disabled={isLoading}
              required
              className="mt-1 w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Request OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              One-Time Password (OTP)
            </label>
            <Input
              id="otp"
              type="text" // Using text to allow for easy input, could be 'number' but has quirks
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              disabled={isLoading}
              required
              className="mt-1 w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify OTP & Proceed
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setOtpSent(false);
              setError(null);
              setOtp(''); // Clear OTP input
            }}
            disabled={isLoading}
            className="w-full text-sm"
          >
            Change {identifierLabel} or resend OTP?
          </Button>
        </form>
      )}
    </div>
  );
} 