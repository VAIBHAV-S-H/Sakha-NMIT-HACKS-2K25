"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Navigation, AlertTriangle } from "lucide-react"
import type { UserLocation } from "@/lib/geofencing"

interface LocationTrackerProps {
  userId: string
  onLocationUpdate?: (location: UserLocation) => void
  showControls?: boolean
}

export function LocationTracker({ userId, onLocationUpdate, showControls = true }: LocationTrackerProps) {
  const [tracking, setTracking] = useState(false)
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()
  const lastUpdateRef = useRef<Date>(new Date())

  // Start tracking automatically if controls are hidden
  useEffect(() => {
    if (!showControls) {
      startTracking()
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [showControls])

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    // Clear any existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }

    // Start watching position
    const id = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })

    setWatchId(id)
    setTracking(true)
    setError(null)

    toast({
      title: "Location Tracking Started",
      description: "Your location is now being tracked for safety purposes.",
    })
  }

  // Stop location tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    setTracking(false)

    toast({
      title: "Location Tracking Stopped",
      description: "Your location is no longer being tracked.",
    })
  }

  // Handle position updates
  const handlePositionUpdate = (position: GeolocationPosition) => {
    const now = new Date()
    const newLocation: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: now,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
    }

    setLocation(newLocation)

    // Only update the server if enough time has passed (to avoid too many requests)
    if (now.getTime() - lastUpdateRef.current.getTime() > 10000) {
      // 10 seconds
      lastUpdateRef.current = now

      // Call the callback if provided
      if (onLocationUpdate) {
        onLocationUpdate(newLocation)
      }

      // Update the server with the new location
      updateServerLocation(newLocation)
    }
  }

  // Handle position errors
  const handlePositionError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error)

    let errorMessage = "Unknown error getting your location"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied. Please enable location services for safety features."
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable. Please check your device settings."
        break
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again."
        break
    }

    setError(errorMessage)
    setTracking(false)

    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive",
    })
  }

  // Update the server with the new location
  const updateServerLocation = async (location: UserLocation) => {
    try {
      await fetch("/api/geofencing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "update",
          userId,
          location,
        }),
      })
    } catch (error) {
      console.error("Error updating server location:", error)
    }
  }

  // Get a formatted address for the current location
  const getLocationAddress = async () => {
    if (!location) return

    try {
      const response = await fetch(
        `/api/tomtom/reverse-geocode?latitude=${location.latitude}&longitude=${location.longitude}`,
      )
      const data = await response.json()

      if (data.addresses && data.addresses.length > 0) {
        const address = data.addresses[0].address
        return address.freeformAddress
      }
    } catch (error) {
      console.error("Error getting location address:", error)
    }

    return null
  }

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">Location Tracking</h3>
            <p className="text-xs text-muted-foreground">
              {tracking ? "Your location is being tracked for safety" : "Enable tracking for safety features"}
            </p>
          </div>

          {tracking ? (
            <Button variant="outline" size="sm" onClick={stopTracking}>
              Stop Tracking
            </Button>
          ) : (
            <Button size="sm" onClick={startTracking}>
              <MapPin className="mr-2 h-4 w-4" />
              Start Tracking
            </Button>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 rounded-lg text-sm text-red-800 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {tracking && location && (
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Navigation className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Location Active</span>
            </div>
            <Badge className="bg-green-500">Tracking</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
            <div>
              <span className="font-medium">Latitude:</span> {location.latitude.toFixed(6)}
            </div>
            <div>
              <span className="font-medium">Longitude:</span> {location.longitude.toFixed(6)}
            </div>
            {location.accuracy && (
              <div>
                <span className="font-medium">Accuracy:</span> {location.accuracy.toFixed(1)}m
              </div>
            )}
            {location.speed && (
              <div>
                <span className="font-medium">Speed:</span> {(location.speed * 3.6).toFixed(1)} km/h
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

