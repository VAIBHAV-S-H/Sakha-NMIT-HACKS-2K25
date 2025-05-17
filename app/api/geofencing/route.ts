import { type NextRequest, NextResponse } from "next/server"
import { type GeoFence, type UserLocation, detectGeofenceTransitions } from "@/lib/geofencing"

// This would typically come from a database
// For demo purposes, we're using in-memory storage
let geofences: GeoFence[] = []
const userLocations: Record<string, UserLocation[]> = {}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (userId) {
    // Return geofences for a specific user
    return NextResponse.json({
      geofences: geofences.filter((g) => g.createdBy === userId),
    })
  }

  // Return all geofences
  return NextResponse.json({ geofences })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different operations
    switch (body.operation) {
      case "create":
        // Create a new geofence
        if (!body.geofence) {
          return NextResponse.json({ error: "Geofence data is required" }, { status: 400 })
        }

        // Add the geofence to our collection
        geofences.push({
          ...body.geofence,
          createdAt: new Date(),
        })

        return NextResponse.json({
          success: true,
          geofence: body.geofence,
        })

      case "update":
        // Update user location and check for geofence transitions
        if (!body.userId || !body.location) {
          return NextResponse.json({ error: "User ID and location are required" }, { status: 400 })
        }

        const userId = body.userId
        const newLocation: UserLocation = {
          ...body.location,
          timestamp: new Date(),
        }

        // Initialize user location history if it doesn't exist
        if (!userLocations[userId]) {
          userLocations[userId] = []
        }

        // Get previous location
        const previousLocation =
          userLocations[userId].length > 0 ? userLocations[userId][userLocations[userId].length - 1] : null

        // Add new location to history
        userLocations[userId].push(newLocation)

        // Limit history size
        if (userLocations[userId].length > 100) {
          userLocations[userId] = userLocations[userId].slice(-100)
        }

        // Detect geofence transitions
        const transitions = detectGeofenceTransitions(newLocation, previousLocation, geofences)

        return NextResponse.json({
          success: true,
          transitions,
          currentGeofences: transitions.entered,
        })

      case "delete":
        // Delete a geofence
        if (!body.geofenceId) {
          return NextResponse.json({ error: "Geofence ID is required" }, { status: 400 })
        }

        // Remove the geofence from our collection
        geofences = geofences.filter((g) => g.id !== body.geofenceId)

        return NextResponse.json({
          success: true,
          deletedId: body.geofenceId,
        })

      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in geofencing API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

