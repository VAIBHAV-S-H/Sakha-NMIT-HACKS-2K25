"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, X, AlertTriangle, CheckCircle2, Video, Mic } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sosActivated, setSOSActivated] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [sosStatus, setSOSStatus] = useState<"pending" | "sending" | "sent" | "cancelled" | "error">("pending")
  const [errorMessage, setErrorMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  
  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  // Handle long press for SOS activation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    const totalTime = 3000 // 3 seconds to activate

    if (isPressed && !sosActivated) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            setIsPressed(false)
            setSOSActivated(true)
            setShowDialog(true)
            return 100
          }
          return newProgress
        })
      }, totalTime / 50) // Update progress smoothly
    } else if (!isPressed && !sosActivated) {
      setProgress(0)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPressed, sosActivated])

  // Handle countdown for SOS cancellation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (showDialog && sosStatus === "pending") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            sendSOS()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [showDialog, sosStatus])

  // Stop recording when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleTouchStart = () => {
    setIsPressed(true)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  // Function to start video and audio recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingComplete(false);
      recordedChunksRef.current = [];

      // Request permissions for both audio and video
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      // Store the stream reference to stop tracks later
      streamRef.current = stream;

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create a video blob from the recorded chunks
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm'
          });
          
          // Save the recording
          saveRecording(blob);
        }
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        setIsRecording(false);
        setRecordingComplete(true);
      };

      // Store the mediaRecorder reference
      mediaRecorderRef.current = mediaRecorder;

      // Start recording
      mediaRecorder.start();

      // Stop recording after 10 seconds
      setTimeout(() => {
        stopRecording();
      }, 10000);

      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Function to save the recording
  const saveRecording = (blob: Blob) => {
    try {
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Create a filename with timestamp and location
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `sos-evidence-${timestamp}.webm`;
      
      // Add to DOM, trigger download, then clean up
      document.body.appendChild(a);
      a.click();
      
      // Small delay before cleanup to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      console.log("Evidence recording saved successfully");
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  const sendSOS = async () => {
    setSOSStatus("sending")
    
    try {
      // Start recording immediately when SOS is triggered
      await startRecording();
      
      // Get current user location with high accuracy
      const position = await getCurrentPosition();
      const { latitude, longitude, accuracy } = position.coords;
      
      console.log("Sending SOS with precise location:", { latitude, longitude, accuracy });
      
      // Call the SOS API endpoint which uses trigger.py
      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latitude, 
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
          isRecording: true // Indicate that recording is being made
        }),
      });
      
      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("SOS API returned error status:", response.status, errorText);
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("SOS API response:", result);
      
      if (result.status === "success") {
        setSOSStatus("sent");
      } else {
        throw new Error(result.message || "Failed to send SOS alert");
      }
    } catch (error) {
      console.error("Error sending SOS alert:", error);
      let errorMsg = "Unknown error occurred";
      
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMsg = JSON.stringify(error);
      }
      
      setSOSStatus("error");
      setErrorMessage(errorMsg);
    }
  }

  // Helper function to get current position with high accuracy
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      }
    });
  };

  const cancelSOS = () => {
    setSOSActivated(false)
    setShowDialog(false)
    setSOSStatus("cancelled")
    setCountdown(10)
    setProgress(0)
    
    // Stop recording if it's in progress
    stopRecording();
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulsing background effect */}
          <div
            className={`absolute inset-0 rounded-full ${sosActivated ? "bg-red-500 animate-ping" : "bg-primary/50"} opacity-30`}
          ></div>

          <Button
            className={`h-16 w-16 rounded-full shadow-lg ${
              sosActivated ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
            } text-white font-bold text-lg relative z-10`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AlertCircle className="h-8 w-8" />
          </Button>

          {/* Progress indicator */}
          {progress > 0 && progress < 100 && (
            <div className="absolute -inset-1 rounded-full">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="4"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  r="46"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: 289.27,
                    strokeDashoffset: 289.27 - (289.27 * progress) / 100,
                    transformOrigin: "50% 50%",
                    transform: "rotate(-90deg)",
                  }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* SOS Activation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className={`text-center text-xl font-serif ${
                sosStatus === "sent" ? "text-green-500" : 
                sosStatus === "error" ? "text-orange-500" : 
                "text-red-500"
              }`}
            >
              {sosStatus === "pending" && (
                <div className="flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 mr-2 animate-pulse" />
                  SOS Emergency Alert
                </div>
              )}
              {sosStatus === "sending" && (
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending SOS Alert
                </div>
              )}
              {sosStatus === "sent" && (
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 mr-2 text-green-500" />
                  SOS Alert Sent
                </div>
              )}
              {sosStatus === "error" && (
                <div className="flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-500" />
                  SOS Alert Error
                </div>
              )}
            </DialogTitle>
            
            {sosStatus === "pending" && (
              <DialogDescription className="text-center font-sans">
                Emergency services and your contacts will be notified in{" "}
                <span className="font-bold text-red-500">{countdown}</span> seconds
              </DialogDescription>
            )}
            
            {sosStatus === "sending" && (
              <DialogDescription className="text-center font-sans">
                Notifying emergency contacts and services...
              </DialogDescription>
            )}
            
            {sosStatus === "sent" && (
              <DialogDescription className="text-center font-sans">
                Help is on the way. Stay calm and in a safe location if possible.
              </DialogDescription>
            )}
            
            {sosStatus === "error" && (
              <DialogDescription className="text-center font-sans">
                There was a problem sending the alert: {errorMessage}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {/* Recording status indicators */}
          {sosStatus === "sending" && isRecording && (
            <div className="flex items-center justify-center gap-2 text-xs bg-red-50 dark:bg-red-900/30 p-1 rounded mt-2">
              <span className="animate-pulse text-red-600">●</span>
              <Video className="h-3 w-3 text-red-600" />
              <Mic className="h-3 w-3 text-red-600" />
              <span>Recording evidence</span>
            </div>
          )}
          
          {sosStatus === "sent" && recordingComplete && (
            <div className="flex items-center justify-center gap-2 text-xs bg-green-50 dark:bg-green-900/30 p-1 rounded mt-2">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span>Evidence recording saved</span>
            </div>
          )}

          {sosStatus === "pending" && (
            <div className="space-y-4">
              <Progress value={(10 - countdown) * 10} className="h-2" indicatorClassName="bg-red-500" />

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200 font-sans">
                  Your current location and personal information will be shared with your emergency contacts and local
                  authorities. A 10-second video and audio recording will be made and saved to your device as evidence.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="font-sans" onClick={cancelSOS}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white font-sans" onClick={sendSOS}>
                  <Phone className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              </div>
            </div>
          )}

          {sosStatus === "sending" && (
            <div className="flex justify-center py-4">
              <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {sosStatus === "sent" && (
            <div className="space-y-4 w-full">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200 font-sans">
                  Your emergency contacts have been notified. Emergency services have been dispatched to your
                  location. {recordingComplete && "Evidence has been recorded and saved to your device."}
                </p>
              </div>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-sans"
                onClick={() => setShowDialog(false)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Okay
              </Button>
            </div>
          )}

          {sosStatus === "error" && (
            <div className="space-y-4 w-full">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-sans">
                  There was a problem sending the SOS alert. Please try again or contact emergency services directly.
                  {recordingComplete && " Evidence recording was saved to your device."}
                </p>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-sans"
                onClick={() => {
                  setSOSStatus("pending");
                  setCountdown(10);
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

