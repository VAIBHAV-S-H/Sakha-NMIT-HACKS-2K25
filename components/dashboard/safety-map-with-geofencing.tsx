"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Navigation, Loader2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { initMap, searchLocations, calculateRoute, reverseGeocode } from "@/lib/leaflet-maps"
import { type GeoFence, type UserLocation, createCircularGeofence, createPolygonGeofence } from "@/lib/geofencing"

export function SafetyMapWithGeofencing() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isDrawingGeofence, setIsDrawingGeofence] = useState(false)
  const [geofenceType, setGeofenceType] = useState<"safe" | "caution" | "danger">("safe")
  const [geofenceShape, setGeofenceShape] = useState<"circle" | "polygon">("circle")
  const [geofenceRadius, setGeofenceRadius] = useState(0.5) // in km
  const [geofenceName, setGeofenceName] = useState("")
  const [geofencePoints, setGeofencePoints] = useState<{ lat: number; lng: number }[]>([])
  const [showGeofenceDialog, setShowGeofenceDialog] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const tomtomMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const geofencesRef = useRef<GeoFence[]>([])
  const drawingLayerRef = useRef<any>(null)

  // Initialize the map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return

      const apiKey = "" // No API key needed for Leaflet

      try {
        // Clear any existing map instance
        if (tomtomMapRef.current) {
          tomtomMapRef.current.remove()
          tomtomMapRef.current = null
        }

        // Default to a central location if user location is not available
        const defaultLocation: [number, number] = [77.5946, 12.9716] // Bangalore

        // Try to get user's current location
        let userPos: UserLocation | null = null
        try {
          const position = await getCurrentPosition()
          userPos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          }
          setUserLocation(userPos)
        } catch (locationError) {
          console.warn("Could not get user location:", locationError)
        }

        // Initialize the map with user's location or default
        const mapCenter = userPos ? [userPos.longitude, userPos.latitude] : defaultLocation

        // Make sure the TomTom SDK is loaded
        if (!window.L) {
          console.error("TomTom SDK not loaded")
          setLoading(false)
          return
        }
          const map = await initMap("safety-map", {
            center: mapCenter as [number, number],
            zoom: 13
          });
        
        map.setView(mapCenter, 13);

        tomtomMapRef.current = map

        // Add user marker if location is available
        if (userPos) {
          addUserMarker(map, userPos)
        }

        // Load geofences from API
        await loadGeofences()

        // Render geofences on the map
        renderGeofences(map)

        // Set up map click handler for geofence drawing
        setupMapClickHandler(map)

        setLoading(false)
      } catch (error) {
        console.error("Error initializing map:", error)
        setLoading(false)
      }
    }

    // Initialize map when component mounts
    initializeMap()

    return () => {
      // Clean up map instance
      if (tomtomMapRef.current) {
        tomtomMapRef.current.remove()
      }
    }
  }, [])

  // Get current position as a Promise
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      }
    })
  }

  // Load geofences from API
  const loadGeofences = async () => {
    try {
      const response = await fetch("/api/geofencing")
      const data = await response.json()

      if (data.geofences) {
        geofencesRef.current = data.geofences
      }
    } catch (error) {
      console.error("Error loading geofences:", error)
    }
  }

  // Add user marker to the map
  const addUserMarker = (map: any, location: UserLocation) => {
    if (!map) return

    // Clear existing user marker
    markersRef.current.forEach((marker) => {
      if (marker.isUserMarker) {
        marker.remove()
      }
    })

    // Create a custom marker element
    const markerElement = document.createElement("div")
    markerElement.className = "user-marker"
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
        <div class="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
          <div class="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
    `

    // Add marker to the map
    const marker = window.L.marker([location.latitude, location.longitude], {
      element: markerElement,
    }).addTo(map)

    marker.isUserMarker = true
    markersRef.current.push(marker)

    return marker
  }

  // Render geofences on the map
  const renderGeofences = (map: any) => {
    if (!map) return

    // Clear existing geofence layers
    markersRef.current.forEach((marker) => {
      if (marker.isGeofenceLayer) {
        marker.remove()
      }
    })

    geofencesRef.current.forEach((geofence) => {
      if (geofence.radius && geofence.points.length === 1) {
        // Render circular geofence
        const center = geofence.points[0]
        let color = ""
        const fillOpacity = 0.2

        switch (geofence.type) {
          case "safe":
            color = "#10b981" // green
            break
          case "caution":
            color = "#f59e0b" // amber
            break
          case "danger":
            color = "#ef4444" // red
            break
        }

        const circle = window.L.circle([center.latitude, center.longitude], {
          radius: geofence.radius * 1000, // Convert km to meters
          color,
          fillColor: color,
          fillOpacity,
          weight: 2,
        }).addTo(map)

        // Add a popup with geofence information
        circle.bindPopup(`
          <div>
            <h3 class="font-bold">${geofence.name}</h3>
            <p>${geofence.metadata?.description || ""}</p>
            <p class="text-sm">Type: ${geofence.type}</p>
          </div>
        `)

        circle.isGeofenceLayer = true
        markersRef.current.push(circle)
      } else if (geofence.points.length >= 3) {
        // Render polygon geofence
        const points = geofence.points.map((point) => [point.latitude, point.longitude])
        let color = ""
        const fillOpacity = 0.2

        switch (geofence.type) {
          case "safe":
            color = "#10b981" // green
            break
          case "caution":
            color = "#f59e0b" // amber
            break
          case "danger":
            color = "#ef4444" // red
            break
        }

        const polygon = window.L.polygon(points, {
          color,
          fillColor: color,
          fillOpacity,
          weight: 2,
        }).addTo(map)

        // Add a popup with geofence information
        polygon.bindPopup(`
          <div>
            <h3 class="font-bold">${geofence.name}</h3>
            <p>${geofence.metadata?.description || ""}</p>
            <p class="text-sm">Type: ${geofence.type}</p>
          </div>
        `)

        polygon.isGeofenceLayer = true
        markersRef.current.push(polygon)
      }
    })
  }

  // Set up map click handler for geofence drawing
  const setupMapClickHandler = (map: any) => {
    if (!map) return

    map.on("click", (e: any) => {
      if (isDrawingGeofence) {
        const latlng = e.latlng

        if (geofenceShape === "circle" && geofencePoints.length === 0) {
          // For circle, we just need the center point
          setGeofencePoints([{ lat: latlng.lat, lng: latlng.lng }])

          // Show dialog to complete geofence creation
          setShowGeofenceDialog(true)
        } else if (geofenceShape === "polygon") {
          // For polygon, we add points until the user completes the shape
          const newPoints = [...geofencePoints, { lat: latlng.lat, lng: latlng.lng }]
          setGeofencePoints(newPoints)

          // Update the drawing layer
          updateDrawingLayer(map, newPoints)

          // If we have at least 3 points, show the complete button
          if (newPoints.length >= 3 && !showGeofenceDialog) {
            setShowGeofenceDialog(true)
          }
        }
      }
    })
  }

  // Update the drawing layer for polygon geofences
  const updateDrawingLayer = (map: any, points: { lat: number; lng: number }[]) => {
    if (!map) return

    // Remove existing drawing layer
    if (drawingLayerRef.current) {
      drawingLayerRef.current.remove()
    }

    if (points.length < 2) return

    // Create a polyline for the drawing
    let color = ""
    switch (geofenceType) {
      case "safe":
        color = "#10b981" // green
        break
      case "caution":
        color = "#f59e0b" // amber
        break
      case "danger":
        color = "#ef4444" // red
        break
    }

    const polyline = window.L.polyline(
      points.map((p) => [p.lat, p.lng]),
      {
        color,
        weight: 3,
        dashArray: "5, 10",
        opacity: 0.7,
      },
    ).addTo(map)

    drawingLayerRef.current = polyline
  }

  // Start drawing a geofence
  const startDrawingGeofence = (shape: "circle" | "polygon", type: "safe" | "caution" | "danger") => {
    setIsDrawingGeofence(true)
    setGeofenceShape(shape)
    setGeofenceType(type)
    setGeofencePoints([])
    setGeofenceName("")

    // Remove existing drawing layer
    if (drawingLayerRef.current) {
      drawingLayerRef.current.remove()
      drawingLayerRef.current = null
    }
  }

  // Cancel drawing a geofence
  const cancelDrawingGeofence = () => {
    setIsDrawingGeofence(false)
    setGeofencePoints([])
    setShowGeofenceDialog(false)

    // Remove existing drawing layer
    if (drawingLayerRef.current) {
      drawingLayerRef.current.remove()
      drawingLayerRef.current = null
    }
  }

  // Save the geofence
  const saveGeofence = async () => {
    if (geofencePoints.length === 0 || !geofenceName) return

    try {
      let newGeofence: GeoFence

      if (geofenceShape === "circle") {
        // Create a circular geofence
        const center = geofencePoints[0]

        newGeofence = createCircularGeofence(
          `geofence-${Date.now()}`,
          geofenceName,
          geofenceType,
          { latitude: center.lat, longitude: center.lng },
          geofenceRadius,
          { description: `${geofenceType} area` },
        )
      } else {
        // Create a polygon geofence
        const points = geofencePoints.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
        }))

        newGeofence = createPolygonGeofence(`geofence-${Date.now()}`, geofenceName, geofenceType, points, {
          description: `${geofenceType} area`,
        })
      }

      // Save the geofence to the API
      const response = await fetch("/api/geofencing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "create",
          geofence: newGeofence,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new geofence to our local state
        geofencesRef.current.push(newGeofence)

        // Render the geofence on the map
        renderGeofences(tomtomMapRef.current)

        // Reset the drawing state
        cancelDrawingGeofence()
      }
    } catch (error) {
      console.error("Error saving geofence:", error)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !tomtomMapRef.current) return

    setLoading(true)

    try {
      const apiKey = "" // No API key needed for Leaflet

      // Get center coordinates for search
      const center: [number, number] = userLocation
        ? [userLocation.longitude, userLocation.latitude]
        : [77.5946, 12.9716] // Default to Bangalore

      const results = await searchLocations({
        query: searchQuery,
        center,
        radius: 10000, // 10km radius
        limit: 5,
      })

      if (results && results.results) {
        setSearchResults(results.results)
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error("Error searching locations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle location selection from search results
  const handleLocationSelect = (result: any) => {
    if (!tomtomMapRef.current) return

    const map = tomtomMapRef.current
    const position = result.position

    // Clear existing search result markers
    markersRef.current.forEach((marker) => {
      if (marker.isSearchMarker) {
        marker.remove()
      }
    })

    // Add marker for the selected location
    const marker = window.L.marker([position.lat, position.lng]).addTo(map)
    marker.isSearchMarker = true
    markersRef.current.push(marker)

    // Center map on the selected location
    map.setView([position.lat, position.lng], 15)

    // Close search results
    setShowSearchResults(false)

    // Calculate route if user location is available
    if (userLocation) {
      calculateSafeRoute([userLocation.longitude, userLocation.latitude], [position.lng, position.lat])
    }
  }

  // Calculate and display a safe route
  const calculateSafeRoute = async (start: [number, number], end: [number, number]) => {
    if (!tomtomMapRef.current) return

    setLoading(true)

    try {
      const apiKey = "" // No API key needed for Leaflet

      // Remove existing routes
      if (tomtomMapRef.current.safeRoute) {
        tomtomMapRef.current.safeRoute.remove()
      }

      // Calculate route
      const routeResponse = await calculateRoute({
        locations: [start, end],
        avoid: ["unpavedRoads", "carpools", "ferries"],
      })

      if (routeResponse && routeResponse.routes && routeResponse.routes.length > 0) {
        const route = routeResponse.routes[0]

        // Create a GeoJSON feature from the route geometry
        const routeGeoJSON = {
          type: "Feature",
          geometry: route.legs[0].points,
          properties: {},
        }

        // Add the route to the map
        const routeLayer = window.L.geoJson(routeGeoJSON, {
          style: {
            color: "#3b82f6",
            weight: 6,
            opacity: 0.8,
            lineCap: "round",
            lineJoin: "round",
          },
        }).addTo(tomtomMapRef.current)

        // Store the route layer for later removal
        tomtomMapRef.current.safeRoute = routeLayer

        // Add route summary information
        const summary = route.summary
        const travelTimeMinutes = Math.round(summary.travelTimeInSeconds / 60)
        const distanceKm = (summary.lengthInMeters / 1000).toFixed(1)

        // Add a popup with route information
        routeLayer
          .bindPopup(`
          <div>
            <h3 class="font-bold">Safe Route</h3>
            <p>Distance: ${distanceKm} km</p>
            <p>Estimated time: ${travelTimeMinutes} min</p>
            <p class="text-sm text-green-600">This route avoids unsafe areas</p>
          </div>
        `)
          .openPopup()
      }
    } catch (error) {
      console.error("Error calculating route:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle current location button click
  const handleCurrentLocation = async () => {
    if (!tomtomMapRef.current) return

    setLoading(true)

    try {
      const position = await getCurrentPosition()
      const userPos: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
      }

      setUserLocation(userPos)

      // Update user marker
      addUserMarker(tomtomMapRef.current, userPos)

      // Center map on user location
      tomtomMapRef.current.setView([userPos.latitude, userPos.longitude], 15)
    } catch (error) {
      console.error("Error getting current location:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a location..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
              <ul className="py-1">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(result)}
                  >
                    <div className="font-medium">{result.poi?.name || result.address.freeformAddress}</div>
                    <div className="text-sm text-muted-foreground">{result.address.freeformAddress}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button variant="outline" onClick={handleCurrentLocation}>
          <Navigation className="h-4 w-4 mr-2" />
          Current
        </Button>
      </div>

      <div className="relative h-[400px] bg-slate-100 rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        <div id="safety-map" ref={mapRef} className="w-full h-full" />

        {isDrawingGeofence && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md z-10">
            <p className="text-sm font-medium mb-2">
              {geofenceShape === "circle"
                ? "Click on the map to place a circular geofence"
                : "Click on the map to add points to your polygon geofence"}
            </p>
            <Button variant="outline" size="sm" className="w-full" onClick={cancelDrawingGeofence}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dialog open={showGeofenceDialog} onOpenChange={setShowGeofenceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Geofence</DialogTitle>
              <DialogDescription>Define the properties for your new geofence.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="geofence-name">Geofence Name</Label>
                <Input
                  id="geofence-name"
                  placeholder="e.g., Home Safe Zone"
                  value={geofenceName}
                  onChange={(e) => setGeofenceName(e.target.value)}
                />
              </div>

              {geofenceShape === "circle" && (
                <div className="space-y-2">
                  <Label htmlFor="geofence-radius">Radius (km)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="geofence-radius"
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={geofenceRadius}
                      onChange={(e) => setGeofenceRadius(Number.parseFloat(e.target.value))}
                    />
                    <span className="text-sm text-muted-foreground">km</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Geofence Type</Label>
                <RadioGroup
                  value={geofenceType}
                  onValueChange={(value) => setGeofenceType(value as "safe" | "caution" | "danger")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="safe" id="safe" />
                    <Label htmlFor="safe" className="text-green-600">
                      Safe Zone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="caution" id="caution" />
                    <Label htmlFor="caution" className="text-yellow-600">
                      Caution Zone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="danger" id="danger" />
                    <Label htmlFor="danger" className="text-red-600">
                      Danger Zone
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={cancelDrawingGeofence}>
                Cancel
              </Button>
              <Button onClick={saveGeofence} disabled={!geofenceName}>
                Save Geofence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="justify-start" onClick={() => startDrawingGeofence("circle", "safe")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Safe Zone
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => startDrawingGeofence("circle", "caution")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Caution Zone
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => startDrawingGeofence("circle", "danger")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Danger Zone
        </Button>
      </div>

      {/* Map legend */}
      <div className="p-3 border rounded-lg">
        <div className="text-sm font-medium mb-2">Safety Levels</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs">Safe Area</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-xs">Caution</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs">Avoid</span>
          </div>
        </div>
      </div>
    </div>
  )
}

