// User types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  profileImage?: string
  rating: number
  reviewCount: number
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EmergencyContact {
  id: string
  userId: string
  name: string
  phone: string
  relationship: string
  priority: number
  createdAt: Date
  updatedAt: Date
}

// Travel companion types
export interface TravelRequest {
  id: string
  userId: string
  fromLocation: Location
  toLocation: Location
  date: Date
  time: string
  travelMode: TravelMode
  seats?: number
  price?: number
  notes?: string
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
  preferences?: TravelPreferences
}

export interface TravelPreferences {
  womenOnly: boolean
  noSmoking: boolean
  noPets: boolean
  quietRide: boolean
  luggageSpace: boolean
  maxPassengers?: number
  otherPreferences?: string
}

export interface TravelMatch {
  id: string
  requestId: string
  companionId: string
  status: MatchStatus
  createdAt: Date
  updatedAt: Date
}

export interface TravelReview {
  id: string
  reviewerId: string
  reviewedId: string
  travelMatchId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  address: string
  latitude: number
  longitude: number
  placeId?: string
  name?: string
}

export interface RouteOptions {
  avoidThreatLocations: boolean
  avoidHighways: boolean
  avoidTolls: boolean
  avoidFerries: boolean
  preferSafeAreas: boolean
  maxDetourTime?: number // in minutes
  maxDetourDistance?: number // in kilometers
}

// Health monitoring types
export interface HealthData {
  id: string
  userId: string
  heartRate?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  bodyTemperature?: number
  oxygenSaturation?: number
  stressLevel?: number
  timestamp: Date
}

export interface DistressEvent {
  id: string
  userId: string
  location: Location
  timestamp: Date
  type: "manual" | "automatic"
  healthDataId?: string
  status: "active" | "resolved" | "false_alarm"
  resolvedAt?: Date
}

// Community types
export interface CommunityPost {
  id: string
  userId: string
  title: string
  content: string
  images?: string[]
  likes: number
  commentCount: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CommunityComment {
  id: string
  postId: string
  userId: string
  content: string
  likes: number
  createdAt: Date
  updatedAt: Date
}

// Threat location types
export interface ThreatLocation {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  threatLevel: ThreatLevel
  reportedBy: string
  reportedAt: Date
  verified: boolean
  verifiedBy?: string
  verifiedAt?: Date
  votes: number
  reportCount: number
  lastReportDate: Date
  category?: ThreatCategory
  timeOfDay?: TimeOfDay[]
  images?: string[]
}

// Geofence types
export interface GeoFence {
  id: string
  name: string
  type: "safe" | "caution" | "danger" | "custom"
  points: GeoPoint[]
  radius?: number // in kilometers, for circular geofences
  metadata?: {
    description?: string
    createdBy?: string
    createdAt?: Date
    updatedAt?: Date
    color?: string
    icon?: string
    [key: string]: any
  }
}

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  speed?: number
  heading?: number
}

export interface SafetyAlert {
  id: string
  userId: string
  type: "geofence" | "threat" | "sos" | "system"
  message: string
  location: Location
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high" | "critical"
  relatedEntityId?: string // ID of related geofence, threat, etc.
  actions?: SafetyAlertAction[]
}

export interface SafetyAlertAction {
  label: string
  type: "call" | "message" | "navigate" | "dismiss" | "custom"
  data?: any
}

// Enums
export type TravelMode = "car" | "bus" | "train" | "walk" | "bike" | "other"
export type RequestStatus = "active" | "completed" | "cancelled" | "expired"
export type MatchStatus = "pending" | "accepted" | "rejected" | "completed"
export type ThreatLevel = "low" | "medium" | "high"
export type ThreatCategory = "harassment" | "theft" | "assault" | "poorLighting" | "isolation" | "other"
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night" | "allDay"

