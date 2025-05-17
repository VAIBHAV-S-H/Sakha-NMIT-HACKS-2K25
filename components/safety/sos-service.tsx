"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Shield, Check } from "lucide-react"
import { type EmergencyContact, type SOSMessage, sendEmergencyAlerts } from "@/lib/twilio"
import type { UserLocation, GeoFence } from "@/lib/geofencing"

interface SOSServiceProps {
  userId: string
  userName: string
  emergencyContacts: EmergencyContact[]
  onStatusChange?: (status: "idle" | "alert" | "sos" | "safe") => void
}

export function SOSService({ userId, userName, emergencyContacts, onStatusChange }: SOSServiceProps) {
  const [status, setStatus] = useState<"idle" | "alert" | "sos" | "safe">("idle")
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [currentGeofences, setCurrentGeofences] = useState<GeoFence[]>([])

  const { toast } = useToast()

  // Start location tracking when component mounts
  useEffect(() => {
    startLocationTracking()

    return () => {
      // Clean up location tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  // Update status when it changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status)
    }
  }, [status, onStatusChange])

  // Start tracking user location
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    // Watch for location changes
    const id = navigator.geolocation.watchPosition(handleLocationUpdate, handleLocationError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })

    setWatchId(id)
  }

  // Handle location updates
  const handleLocationUpdate = (position: GeolocationPosition) => {
    const newLocation: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(),
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
    }

    setLocation(newLocation)

    // Check for geofence transitions
    updateGeofenceStatus(newLocation)
  }

  // Handle location errors
  const handleLocationError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error)

    toast({
      title: "Location Error",
      description: `Could not get your location: ${error.message}`,
      variant: "destructive",
    })
  }

  // Update geofence status
  const updateGeofenceStatus = async (userLocation: UserLocation) => {
    try {
      // Call the geofencing API to check for transitions
      const response = await fetch("/api/geofencing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "update",
          userId,
          location: userLocation,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update current geofences
        setCurrentGeofences(data.currentGeofences || [])

        // Check for dangerous areas
        const dangerZones = (data.currentGeofences || []).filter((geofence: GeoFence) => geofence.type === "danger")

        const cautionZones = (data.currentGeofences || []).filter((geofence: GeoFence) => geofence.type === "caution")

        // Automatically trigger alerts based on geofence type
        if (dangerZones.length > 0 && status === "idle") {
          // User has entered a danger zone
          setStatus("alert")

          toast({
            title: "Safety Alert",
            description: `You've entered an area marked as potentially unsafe: ${dangerZones[0].name}`,
            variant: "destructive",
          })

          // Optionally send alerts to emergency contacts
          if (emergencyContacts.length > 0) {
            sendAutomaticAlert("alert", dangerZones[0])
          }
        } else if (cautionZones.length > 0 && status === "idle") {
          // User has entered a caution zone
          toast({
            title: "Caution",
            description: `You've entered an area that requires caution: ${cautionZones[0].name}`,
            variant: "default",
          })
        }
      }
    } catch (error) {
      console.error("Error updating geofence status:", error)
    }
  }

  // Trigger SOS alert
  const triggerSOS = async () => {
    if (!location) {
      // Try to get current location if not already available
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          })
        })

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
        })
      } catch (error) {
        console.error("Failed to get location for SOS:", error)
        toast({
          title: "Location Error",
          description: "Could not get your location. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)
    setStatus("sos")

    try {
      // Get the current location (either from state or newly acquired)
      const currentLocation = location || {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        timestamp: new Date(),
      }

      // Prepare SOS message
      const message: SOSMessage = {
        userName,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        timestamp: new Date(),
        messageType: "sos",
        details: "Emergency SOS triggered manually",
      }

      console.log("Sending SOS to contacts:", emergencyContacts)

      // Send alerts to emergency contacts
      if (emergencyContacts.length > 0) {
        const result = await sendEmergencyAlerts(emergencyContacts, message, { sms: true, call: true })

        console.log("SOS alert result:", result)

        if (result.success) {
          toast({
            title: "SOS Alert Sent",
            description: `Emergency alerts sent to ${emergencyContacts.length} contacts`,
            variant: "default",
          })
        } else {
          console.error("Error sending alerts:", result)
          toast({
            title: "Alert Error",
            description: "There was an error sending some alerts. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "No Contacts",
          description: "No emergency contacts found. Please add contacts in settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error triggering SOS:", error)

      toast({
        title: "SOS Error",
        description: "There was an error sending the SOS alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mark as safe
  const markAsSafe = async () => {
    if (!location) return

    setLoading(true)

    try {
      // Prepare safe message
      const message: SOSMessage = {
        userName,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        timestamp: new Date(),
        messageType: "safe",
        details: "User has marked themselves as safe",
      }

      // Send safe notification to emergency contacts
      if (emergencyContacts.length > 0 && (status === "sos" || status === "alert")) {
        await sendEmergencyAlerts(emergencyContacts, message, { sms: true, call: false })
      }

      setStatus("safe")

      toast({
        title: "Marked as Safe",
        description: "You have been marked as safe. Your emergency contacts have been notified.",
        variant: "default",
      })

      // Reset status after a delay
      setTimeout(() => {
        setStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("Error marking as safe:", error)
    } finally {
      setLoading(false)
    }
  }

  // Send automatic alert based on geofence
  const sendAutomaticAlert = async (alertType: "alert" | "sos", geofence: GeoFence) => {
    if (!location) return

    try {
      // Prepare alert message
      const message: SOSMessage = {
        userName,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        timestamp: new Date(),
        messageType: alertType,
        details: `Automatic ${alertType} triggered: User entered ${geofence.name} (${geofence.type} zone)`,
      }

      // Send alerts to emergency contacts
      if (emergencyContacts.length > 0) {
        await sendEmergencyAlerts(emergencyContacts, message, { sms: true, call: alertType === "sos" })
      }
    } catch (error) {
      console.error("Error sending automatic alert:", error)
    }
  }

  // Render different buttons based on status
  const renderActionButton = () => {
    switch (status) {
      case "idle":
        return (
          <Button
            variant="destructive"
            className="w-full py-6 text-lg font-bold"
            onClick={triggerSOS}
            disabled={loading}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Trigger Emergency SOS
          </Button>
        )

      case "alert":
      case "sos":
        return (
          <div className="space-y-2">
            <Button variant="destructive" className="w-full py-6 text-lg font-bold animate-pulse" disabled={true}>
              <AlertTriangle className="mr-2 h-5 w-5" />
              {status === "sos" ? "SOS Alert Active" : "Safety Alert Active"}
            </Button>

            <Button variant="outline" className="w-full" onClick={markAsSafe} disabled={loading}>
              <Check className="mr-2 h-4 w-4" />
              I'm Safe Now
            </Button>
          </div>
        )

      case "safe":
        return (
          <Button
            variant="outline"
            className="w-full py-6 text-lg font-bold bg-green-50 text-green-700 border-green-200"
            disabled={true}
          >
            <Shield className="mr-2 h-5 w-5" />
            Marked as Safe
          </Button>
        )
    }
  }

  return (
    <div className="space-y-4">
      {renderActionButton()}

      {location && (
        <div className="text-xs text-muted-foreground text-center">
          Your location is being tracked for safety purposes.
          {currentGeofences.length > 0 && (
            <div className="mt-1">Current area: {currentGeofences.map((g) => g.name).join(", ")}</div>
          )}
        </div>
      )}
    </div>
  )
}

