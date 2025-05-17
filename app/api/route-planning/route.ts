import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"

// Define types
interface RouteRequest {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  avoidThreats?: boolean
  avoidHighThreats?: boolean
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
}

interface Location {
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
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body: RouteRequest = await request.json()
    
    const {
      startLat,
      startLng,
      endLat,
      endLng,
      avoidThreats = true,
      avoidHighThreats = true,
      timeOfDay = 'evening'
    } = body
    
    // Validate required fields
    if (startLat === undefined || startLng === undefined || endLat === undefined || endLng === undefined) {
      return NextResponse.json({ error: "Missing required coordinates" }, { status: 400 })
    }
    
    // Create start and end locations
    const startLocation = { latitude: startLat, longitude: startLng }
    const endLocation = { latitude: endLat, longitude: endLng }
    
    // Get threat locations to avoid if requested
    let threatLocations: ThreatLocation[] = []
    
    if (avoidThreats) {
      // Build query to get relevant threat locations
      const query: any = { verified: true }
      
      // Only avoid high threats if specified
      if (avoidHighThreats) {
        query.threatLevel = "high"
      }
      
      // Get threat locations
      threatLocations = await db.collection(COLLECTIONS.THREAT_LOCATIONS)
        .find(query)
        .toArray()
    }
    
    // Calculate route avoiding threat locations
    const route = calculateSafeRoute(startLocation, endLocation, threatLocations)
    
    return NextResponse.json(route)
  } catch (error) {
    console.error("Error planning route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate the distance between two points
function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371 // Earth's radius in km
  const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180)
  const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.latitude * (Math.PI / 180)) *
    Math.cos(point2.latitude * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to determine if a point is too close to a threat
function isTooCloseToThreat(point: Location, threats: ThreatLocation[], safetyRadius: number): boolean {
  for (const threat of threats) {
    const distance = calculateDistance(point, { latitude: threat.latitude, longitude: threat.longitude })
    if (distance < safetyRadius) {
      return true
    }
  }
  return false
}

// Calculate a safe route that avoids threat locations
function calculateSafeRoute(start: Location, end: Location, threats: ThreatLocation[]) {
  // Define the safety radius (in km) to keep away from threats
  const safetyRadius = 0.5 // 500 meters
  
  // Create a direct route
  const directDistance = calculateDistance(start, end)
  
  // Check if there are any threats to avoid
  if (threats.length === 0) {
    // If no threats, just return the direct route
    return {
      route: [
        { latitude: start.latitude, longitude: start.longitude },
        { latitude: end.latitude, longitude: end.longitude }
      ],
      distance: directDistance,
      duration: Math.round(directDistance * 12), // Rough estimate: 5 km/h walking speed = 12 min/km
      hasThreatDetours: false,
      avoidedThreats: []
    }
  }
  
  // Simple waypoint generation for safer route
  // In a real implementation, this would be much more sophisticated
  // using actual routing algorithms and APIs
  
  // Find threats close to the direct path
  const avoidedThreats = threats.filter(threat => {
    // Simplified check: is the threat relatively close to the direct path?
    const distToStart = calculateDistance(start, { latitude: threat.latitude, longitude: threat.longitude })
    const distToEnd = calculateDistance(end, { latitude: threat.latitude, longitude: threat.longitude })
    
    // If the sum of distances from the threat to both endpoints is close to the direct distance,
    // then the threat is near the path
    return distToStart + distToEnd < directDistance * 1.3
  })
  
  if (avoidedThreats.length === 0) {
    // No threats near the path
    return {
      route: [
        { latitude: start.latitude, longitude: start.longitude },
        { latitude: end.latitude, longitude: end.longitude }
      ],
      distance: directDistance,
      duration: Math.round(directDistance * 12),
      hasThreatDetours: false,
      avoidedThreats: []
    }
  }
  
  // Generate waypoints to create a route that avoids threats
  // In a real implementation, this would use a proper pathfinding algorithm
  const waypoints = generateSafeWaypoints(start, end, avoidedThreats, safetyRadius)
  
  // Calculate the total distance of the safe route
  let safeDistance = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    safeDistance += calculateDistance(waypoints[i], waypoints[i + 1])
  }
  
  return {
    route: waypoints,
    distance: safeDistance,
    duration: Math.round(safeDistance * 12),
    hasThreatDetours: true,
    avoidedThreats: avoidedThreats.map(threat => ({
      id: threat._id,
      name: threat.name,
      threatLevel: threat.threatLevel,
      latitude: threat.latitude,
      longitude: threat.longitude
    }))
  }
}

// Generate waypoints for a safer route
function generateSafeWaypoints(start: Location, end: Location, threats: ThreatLocation[], safetyRadius: number) {
  // This is a simplified implementation that generates waypoints around threats
  // In a real implementation, you would use a proper routing algorithm
  
  const waypoints = [{ latitude: start.latitude, longitude: start.longitude }]
  
  // For each threat close to the path, create a detour waypoint
  threats.forEach(threat => {
    const threatLocation = { latitude: threat.latitude, longitude: threat.longitude }
    
    // Create a waypoint that's perpendicular to the direct path and away from the threat
    const midLat = (start.latitude + end.latitude) / 2
    const midLng = (start.longitude + end.longitude) / 2
    
    // Direction vector from middle point to threat
    const dirLat = threatLocation.latitude - midLat
    const dirLng = threatLocation.longitude - midLng
    const length = Math.sqrt(dirLat * dirLat + dirLng * dirLng)
    
    // Normalized and inverted direction vector (away from threat)
    const normDirLat = -dirLat / length
    const normDirLng = -dirLng / length
    
    // Create a waypoint at a safe distance in the opposite direction of the threat
    const waypointLat = threatLocation.latitude + normDirLat * safetyRadius * 1.5
    const waypointLng = threatLocation.longitude + normDirLng * safetyRadius * 1.5
    
    waypoints.push({ latitude: waypointLat, longitude: waypointLng })
  })
  
  // Add the destination
  waypoints.push({ latitude: end.latitude, longitude: end.longitude })
  
  return waypoints
} 