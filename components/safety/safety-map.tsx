"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Shield, AlertTriangle, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"

// Mock data for geofences
const geofences = [
  { id: 1, name: "Home", type: "safe", lat: 12.9716, lng: 77.5946, radius: 500 },
  { id: 2, name: "Office", type: "safe", lat: 12.9783, lng: 77.6408, radius: 300 },
  { id: 3, name: "Market Area", type: "caution", lat: 12.9552, lng: 77.6245, radius: 400 },
  { id: 4, name: "Park", type: "caution", lat: 12.9827, lng: 77.5933, radius: 250 },
  { id: 5, name: "Downtown", type: "danger", lat: 12.9698, lng: 77.7499, radius: 600 },
]

// Define types
interface UserLocation {
  latitude: number
  longitude: number
}

interface ThreatLocation {
  _id: string
  name: string
  description: string
  latitude: number
  longitude: number
  threatLevel: "high" | "medium" | "low"
  category?: string
  reportedAt: string
  verified: boolean
  votes: number
  reportCount: number
}

const formatCategory = (category: string) => {
  return category
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function SafetyMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeZone, setActiveZone] = useState<string>("all")
  const { theme } = useTheme()
  const [mapInitialized, setMapInitialized] = useState(false)
  const markersRef = useRef<any[]>([])
  const threatMarkersRef = useRef<any[]>([])
  const [threatLocations, setThreatLocations] = useState<ThreatLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch threat locations from API
  useEffect(() => {
    const fetchThreatLocations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/threat-locations')
        if (!response.ok) {
          throw new Error('Failed to fetch threat locations')
        }
        const data = await response.json()
        setThreatLocations(data)
      } catch (err) {
        console.error('Error fetching threat locations:', err)
        setError('Failed to load threat locations')
      } finally {
        setLoading(false)
      }
    }
    
    fetchThreatLocations()
  }, [])

  useEffect(() => {
    // This is a mock implementation since we can't actually load TomTom Maps
    // In a real implementation, you would initialize the map here
    if (mapRef.current && !mapInitialized) {
      const mockMapInit = () => {
        console.log("Map initialized with theme:", theme)
        setMapInitialized(true)
        
        // In a real implementation, once the map is initialized, 
        // we would render the threat locations on the map
        if (threatLocations.length > 0) {
          console.log(`Rendering ${threatLocations.length} threat locations on map`)
        }
      }

      // Simulate map initialization delay
      const timer = setTimeout(mockMapInit, 500)
      return () => clearTimeout(timer)
    }
  }, [mapRef, theme, mapInitialized, threatLocations])

  const filterGeofences = (type: string) => {
    setActiveZone(type)
    // In a real implementation, you would filter the map layers here
    console.log(`Filtering geofences to show: ${type}`)
  }

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Safety Map</CardTitle>
            <CardDescription>View and manage your safety zones</CardDescription>
          </div>
          <Button variant="outline" className="text-foreground border-border hover:bg-muted">
            <MapPin className="h-4 w-4 mr-2" />
            Current Location
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeZone} onValueChange={filterGeofences} className="w-full">
          <div className="px-6 pb-2">
            <TabsList className="grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">
                All Zones
              </TabsTrigger>
              <TabsTrigger value="safe" className="text-xs">
                Safe
              </TabsTrigger>
              <TabsTrigger value="caution" className="text-xs">
                Caution
              </TabsTrigger>
              <TabsTrigger value="danger" className="text-xs">
                Danger
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Map container */}
          <div
            ref={mapRef}
            className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 relative overflow-hidden"
            style={{
              backgroundImage: "url('/placeholder.svg?height=300&width=600')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!mapInitialized || loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saheli-rose mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {loading ? "Loading threat locations..." : "Loading map..."}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-saheli-danger mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : null}
            
            {/* Display threat location markers on the map */}
            {/* This would be implemented with actual map markers in a real implementation */}
            {mapInitialized && threatLocations.length > 0 && (
              <div className="absolute bottom-2 right-2 bg-background/80 p-2 rounded-md text-xs">
                {threatLocations.length} threat locations loaded
              </div>
            )}
          </div>

          {/* Geofence list */}
          <div className="p-4 border-t">
            <h4 className="text-sm font-medium mb-2">Threat Locations</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
              {threatLocations.length > 0 ? (
                threatLocations.map((location) => (
                  <div
                    key={location._id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex items-center">
                      {location.threatLevel === "low" && <Shield className="h-4 w-4 text-saheli-info mr-2" />}
                      {location.threatLevel === "medium" && <AlertTriangle className="h-4 w-4 text-saheli-warning mr-2" />}
                      {location.threatLevel === "high" && <AlertCircle className="h-4 w-4 text-saheli-danger mr-2" />}
                      <span className="text-sm font-medium">{location.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        location.threatLevel === "low"
                          ? "border-saheli-info text-saheli-info bg-saheli-info/10"
                          : location.threatLevel === "medium"
                            ? "border-saheli-warning text-saheli-warning bg-saheli-warning/10"
                            : "border-saheli-danger text-saheli-danger bg-saheli-danger/10"
                      }
                    >
                      {location.threatLevel}
                    </Badge>
                  </div>
                ))
              ) : loading ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Loading locations...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-sm text-saheli-danger">{error}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No threat locations found</p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Fix map markers rendering
const addUserMarker = (map: any, location: UserLocation) => {
  if (!map) return

  // Clear existing user marker
  markersRef.current.forEach((marker) => {
    if (marker.isUserMarker) {
      marker.remove()
    }
  })

  // Create a custom marker element with proper DOM structure
  const markerElement = document.createElement("div")
  markerElement.className = "user-marker"

  // Create inner elements
  const outerCircle = document.createElement("div")
  outerCircle.className =
    "w-10 h-10 bg-saheli-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg"

  const innerCircle = document.createElement("div")
  innerCircle.className = "w-8 h-8 bg-saheli-primary rounded-full flex items-center justify-center"

  const centerDot = document.createElement("div")
  centerDot.className = "w-6 h-6 bg-white rounded-full"

  // Assemble the marker
  innerCircle.appendChild(centerDot)
  outerCircle.appendChild(innerCircle)
  markerElement.appendChild(outerCircle)

  // Add marker to the map
  const marker = window.tomtom.L.marker([location.latitude, location.longitude], {
    element: markerElement,
  }).addTo(map)

  marker.isUserMarker = true
  markersRef.current.push(marker)

  return marker
}

// Fix threat location markers
const renderThreatLocations = (map: any, locations: ThreatLocation[]) => {
  // Clear existing threat markers
  threatMarkersRef.current.forEach((marker) => marker.remove())
  threatMarkersRef.current = []

  locations.forEach((location) => {
    // Create marker element based on threat level
    const markerElement = document.createElement("div")
    markerElement.className = "threat-marker"

    let color
    switch (location.threatLevel) {
      case "high":
        color = "#f98661" // tan-hide (accent)
        break
      case "medium":
        color = "#f48c4c" // jaffa (orange)
        break
      case "low":
        color = "#748478" // xanadu (green)
        break
      default:
        color = "#9a9c9c" // edward (gray)
    }

    // Create DOM elements instead of using innerHTML
    const outerDiv = document.createElement("div")
    outerDiv.className = "flex items-center justify-center w-10 h-10 marker-pulse"

    const middleDiv = document.createElement("div")
    middleDiv.className = "w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"

    const innerDiv = document.createElement("div")
    innerDiv.className = "w-6 h-6 rounded-full flex items-center justify-center"
    innerDiv.style.backgroundColor = color

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "16")
    svg.setAttribute("height", "16")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")
    svg.setAttribute("stroke", "white")
    svg.setAttribute("stroke-width", "2")
    svg.setAttribute("stroke-linecap", "round")
    svg.setAttribute("stroke-linejoin", "round")

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z")

    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line1.setAttribute("x1", "12")
    line1.setAttribute("y1", "9")
    line1.setAttribute("x2", "12")
    line1.setAttribute("y2", "13")

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line2.setAttribute("x1", "12")
    line2.setAttribute("y1", "17")
    line2.setAttribute("x2", "12.01")
    line2.setAttribute("y2", "17")

    svg.appendChild(path)
    svg.appendChild(line1)
    svg.appendChild(line2)
    innerDiv.appendChild(svg)
    middleDiv.appendChild(innerDiv)
    outerDiv.appendChild(middleDiv)
    markerElement.appendChild(outerDiv)

    // Add marker to the map
    const marker = window.tomtom.L.marker([location.latitude, location.longitude], {
      element: markerElement,
    }).addTo(map)

    // Add popup with info
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold">${location.name}</h3>
        <p>${location.description}</p>
        <p class="text-xs mt-1">Reported: ${new Date(location.reportedAt).toLocaleDateString()}</p>
        <p class="text-xs">Reports: ${location.reportCount} | Votes: ${location.votes}</p>
      </div>
    `)

    threatMarkersRef.current.push(marker)
  })
}

