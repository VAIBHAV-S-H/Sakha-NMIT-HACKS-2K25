'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SOSButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSOS = async () => {
    try {
      setIsLoading(true);
      
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Send SOS alert
      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success('SOS alert sent successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      toast.error('Failed to send SOS alert. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSOS}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full max-w-xs"
    >
      {isLoading ? 'Sending SOS...' : 'SOS'}
    </Button>
  );
} 