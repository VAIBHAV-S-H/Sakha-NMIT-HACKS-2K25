// Map service using TomTom and Mapbox APIs
import { toast } from "@/components/ui/use-toast"

// Types
export type Coordinates = {
  lat: number
  lng: number
}

export type MapMarker = {
  id: string
  coordinates: Coordinates
  type: "threat" | "safe" | "user" | "companion" | "destination" | "pickup"
  title: string
  description?: string
}

export type RouteOptions = {
  avoid?: string[]
  traffic?: boolean
}

// TomTom API key from environment variables
const TOMTOM_API_KEY = "9ddViCepPxfLnXAkp7xRjpXPMEXbSUuv"

// Base URLs
const TOMTOM_BASE_URL = "https://api.tomtom.com"
const MAPBOX_BASE_URL = "https://api.mapbox.com"

// Map service functions
export const mapService = {
  // Geocoding: Convert address to coordinates
  async geocode(address: string): Promise<Coordinates | null> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error("Geocoding failed")
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          lat: result.position.lat,
          lng: result.position.lon,
        }
      }

      return null
    } catch (error) {
      console.error("Geocoding error:", error)
      toast({
        title: "Location Error",
        description: "Could not find the location. Please try a different address.",
        variant: "destructive",
      })
      return null
    }
  },

  // Reverse geocoding: Convert coordinates to address
  async reverseGeocode(coordinates: Coordinates): Promise<string | null> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/search/2/reverseGeocode/${coordinates.lat},${coordinates.lng}.json?key=${TOMTOM_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error("Reverse geocoding failed")
      }

      const data = await response.json()

      if (data.addresses && data.addresses.length > 0) {
        return data.addresses[0].address.freeformAddress
      }

      return null
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return null
    }
  },

  // Calculate route between two points
  async calculateRoute(origin: Coordinates, destination: Coordinates, options: RouteOptions = {}): Promise<any> {
    try {
      let url = `${TOMTOM_BASE_URL}/routing/1/calculateRoute/${origin.lat},${origin.lng}:${destination.lat},${destination.lng}/json?key=${TOMTOM_API_KEY}`

      // Add options to URL
      if (options.avoid && options.avoid.length > 0) {
        url += `&avoid=${options.avoid.join(",")}`
      }

      if (options.traffic) {
        url += "&traffic=true"
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Route calculation failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Route calculation error:", error)
      toast({
        title: "Route Error",
        description: "Could not calculate the route. Please try again.",
        variant: "destructive",
      })
      return null
    }
  },

  // Search for places nearby
  async searchNearby(coordinates: Coordinates, query: string, radius = 1000): Promise<any> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/search/2/poiSearch/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&lat=${coordinates.lat}&lon=${coordinates.lng}&radius=${radius}`,
      )

      if (!response.ok) {
        throw new Error("Nearby search failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Nearby search error:", error)
      return null
    }
  },

  // Get traffic incidents in an area
  async getTrafficIncidents(coordinates: Coordinates, radius = 5000): Promise<any> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/traffic/services/4/incidentDetails?key=${TOMTOM_API_KEY}&bbox=${coordinates.lat - 0.1},${coordinates.lng - 0.1},${coordinates.lat + 0.1},${coordinates.lng + 0.1}`,
      )

      if (!response.ok) {
        throw new Error("Traffic incidents request failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Traffic incidents error:", error)
      return null
    }
  },

  // Get static map image URL (using Mapbox)
  getStaticMapUrl(coordinates: Coordinates, markers: MapMarker[] = [], zoom = 14, width = 600, height = 400): string {
    // Using Mapbox for static maps
    const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    let url = `${MAPBOX_BASE_URL}/styles/v1/mapbox/streets-v11/static/`

    // Add markers if provided
    if (markers.length > 0) {
      const markerString = markers
        .map((marker) => {
          const color =
            marker.type === "threat"
              ? "ff0000"
              : marker.type === "safe"
                ? "00ff00"
                : marker.type === "user"
                  ? "0000ff"
                  : marker.type === "companion"
                    ? "ff00ff"
                    : marker.type === "destination"
                      ? "ffff00"
                      : "ff7e00"

          return `pin-s-${marker.type.charAt(0)}+${color}(${marker.coordinates.lng},${marker.coordinates.lat})`
        })
        .join(",")

      url += `${markerString}/`
    }

    // Add center coordinates and zoom
    url += `${coordinates.lng},${coordinates.lat},${zoom},0,0/${width}x${height}`

    // Add access token
    url += `?access_token=${MAPBOX_ACCESS_TOKEN}`

    return url
  },
}

export default mapService

