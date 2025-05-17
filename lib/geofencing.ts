export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface GeoFence {
  id: string
  name: string
  type: "safe" | "caution" | "danger"
  points: GeoPoint[]
  radius?: number // For circular geofences
  createdBy?: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: Date
  speed?: number
  heading?: number
}

/**
 * Calculate distance between two points in kilometers using the Haversine formula
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(point2.latitude - point1.latitude)
  const dLon = toRadians(point2.longitude - point1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a point is inside a circular geofence
 */
export function isPointInCircularGeofence(point: GeoPoint, center: GeoPoint, radiusKm: number): boolean {
  const distance = calculateDistance(point, center)
  return distance <= radiusKm
}

/**
 * Check if a point is inside a polygon geofence using ray casting algorithm
 */
export function isPointInPolygonGeofence(point: GeoPoint, polygon: GeoPoint[]): boolean {
  if (polygon.length < 3) return false

  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude
    const yi = polygon[i].latitude
    const xj = polygon[j].longitude
    const yj = polygon[j].latitude

    const intersect =
      yi > point.latitude !== yj > point.latitude &&
      point.longitude < ((xj - xi) * (point.latitude - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

/**
 * Check if a user is inside a geofence
 */
export function isUserInGeofence(userLocation: UserLocation, geofence: GeoFence): boolean {
  const userPoint: GeoPoint = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
  }

  // For circular geofences
  if (geofence.radius && geofence.points.length === 1) {
    return isPointInCircularGeofence(userPoint, geofence.points[0], geofence.radius)
  }

  // For polygon geofences
  return isPointInPolygonGeofence(userPoint, geofence.points)
}

/**
 * Find all geofences that contain the user's location
 */
export function findContainingGeofences(userLocation: UserLocation, geofences: GeoFence[]): GeoFence[] {
  return geofences.filter((geofence) => isUserInGeofence(userLocation, geofence))
}

/**
 * Check if a user has entered or exited geofences
 */
export function detectGeofenceTransitions(
  currentLocation: UserLocation,
  previousLocation: UserLocation | null,
  geofences: GeoFence[],
): { entered: GeoFence[]; exited: GeoFence[] } {
  const currentGeofences = findContainingGeofences(currentLocation, geofences)

  if (!previousLocation) {
    return {
      entered: currentGeofences,
      exited: [],
    }
  }

  const previousGeofences = findContainingGeofences(previousLocation, geofences)

  const currentIds = new Set(currentGeofences.map((g) => g.id))
  const previousIds = new Set(previousGeofences.map((g) => g.id))

  const entered = currentGeofences.filter((g) => !previousIds.has(g.id))
  const exited = previousGeofences.filter((g) => !currentIds.has(g.id))

  return { entered, exited }
}

/**
 * Create a circular geofence
 */
export function createCircularGeofence(
  id: string,
  name: string,
  type: "safe" | "caution" | "danger",
  center: GeoPoint,
  radiusKm: number,
  metadata?: Record<string, any>,
): GeoFence {
  return {
    id,
    name,
    type,
    points: [center],
    radius: radiusKm,
    createdAt: new Date(),
    metadata,
  }
}

/**
 * Create a polygon geofence
 */
export function createPolygonGeofence(
  id: string,
  name: string,
  type: "safe" | "caution" | "danger",
  points: GeoPoint[],
  metadata?: Record<string, any>,
): GeoFence {
  if (points.length < 3) {
    throw new Error("A polygon geofence must have at least 3 points")
  }

  return {
    id,
    name,
    type,
    points,
    createdAt: new Date(),
    metadata,
  }
}

