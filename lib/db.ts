import type {
  User,
  EmergencyContact,
  TravelRequest,
  TravelMatch,
  TravelReview,
  HealthData,
  DistressEvent,
  CommunityPost,
  CommunityComment,
  TravelMode,
  RequestStatus,
  ThreatLocation,
  ThreatLevel,
  GeoFence,
  SafetyAlert,
  RouteOptions,
  ThreatCategory,
  TimeOfDay,
} from "./types"

// Mock database for demonstration
// In a real app, this would be replaced with actual database calls
class Database {
  private users: Map<string, User> = new Map()
  private emergencyContacts: Map<string, EmergencyContact[]> = new Map()
  private travelRequests: Map<string, TravelRequest[]> = new Map()
  private travelMatches: Map<string, TravelMatch[]> = new Map()
  private travelReviews: Map<string, TravelReview[]> = new Map()
  private healthData: Map<string, HealthData[]> = new Map()
  private distressEvents: Map<string, DistressEvent[]> = new Map()
  private communityPosts: CommunityPost[] = []
  private communityComments: Map<string, CommunityComment[]> = new Map()
  private threatLocations: ThreatLocation[] = [
    {
      id: "threat_1",
      name: "Dark Alley",
      description: "Poorly lit alley with reported incidents of harassment",
      latitude: 12.9716,
      longitude: 77.5946,
      threatLevel: "high",
      reportedBy: "user_1",
      reportedAt: new Date("2023-01-15"),
      verified: true,
      verifiedBy: "admin_1",
      verifiedAt: new Date("2023-01-16"),
      votes: 15,
      reportCount: 5,
      lastReportDate: new Date("2023-03-10"),
      category: "poorLighting",
      timeOfDay: ["evening", "night"],
      images: ["/images/threat-locations/dark-alley.jpg"],
    },
    {
      id: "threat_2",
      name: "Isolated Bus Stop",
      description: "Bus stop with poor visibility and few people around",
      latitude: 12.9796,
      longitude: 77.5906,
      threatLevel: "medium",
      reportedBy: "user_2",
      reportedAt: new Date("2023-02-10"),
      verified: true,
      verifiedBy: "admin_1",
      verifiedAt: new Date("2023-02-11"),
      votes: 8,
      reportCount: 3,
      lastReportDate: new Date("2023-02-28"),
      category: "isolation",
      timeOfDay: ["evening", "night"],
      images: ["/images/threat-locations/bus-stop.jpg"],
    },
    {
      id: "threat_3",
      name: "Unlit Park Area",
      description: "Section of the park with no lighting at night",
      latitude: 12.9656,
      longitude: 77.6026,
      threatLevel: "medium",
      reportedBy: "user_3",
      reportedAt: new Date("2023-03-05"),
      verified: false,
      votes: 3,
      reportCount: 1,
      lastReportDate: new Date("2023-03-05"),
      category: "poorLighting",
      timeOfDay: ["night"],
      images: ["/images/threat-locations/unlit-park.jpg"],
    },
    {
      id: "threat_4",
      name: "Harassment Hotspot",
      description: "Multiple reports of verbal harassment in this area",
      latitude: 12.9726,
      longitude: 77.5976,
      threatLevel: "high",
      reportedBy: "user_4",
      reportedAt: new Date("2023-04-12"),
      verified: true,
      verifiedBy: "admin_2",
      verifiedAt: new Date("2023-04-14"),
      votes: 22,
      reportCount: 8,
      lastReportDate: new Date("2023-05-20"),
      category: "harassment",
      timeOfDay: ["morning", "afternoon", "evening"],
      images: ["/images/threat-locations/street-corner.jpg"],
    },
    {
      id: "threat_5",
      name: "Theft-Prone Market",
      description: "Multiple reports of pickpocketing and bag snatching",
      latitude: 12.9686,
      longitude: 77.5986,
      threatLevel: "medium",
      reportedBy: "user_5",
      reportedAt: new Date("2023-05-05"),
      verified: true,
      verifiedBy: "admin_1",
      verifiedAt: new Date("2023-05-07"),
      votes: 12,
      reportCount: 6,
      lastReportDate: new Date("2023-06-15"),
      category: "theft",
      timeOfDay: ["afternoon", "evening"],
      images: ["/images/threat-locations/market.jpg"],
    },
  ]
  private geofences: GeoFence[] = []
  private safetyAlerts: SafetyAlert[] = []

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData()
  }

  private initializeSampleData() {
    // Add sample users
    const user1: User = {
      id: "user_1",
      email: "priya@example.com",
      name: "Priya Sharma",
      phone: "+91 9876543210",
      profileImage: "/images/users/priya.jpg",
      rating: 4.8,
      reviewCount: 15,
      verified: true,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    }

    const user2: User = {
      id: "user_2",
      email: "neha@example.com",
      name: "Neha Patel",
      phone: "+91 9876543211",
      profileImage: "/images/users/neha.jpg",
      rating: 4.5,
      reviewCount: 8,
      verified: true,
      createdAt: new Date("2023-01-05"),
      updatedAt: new Date("2023-01-05"),
    }

    this.users.set(user1.id, user1)
    this.users.set(user2.id, user2)

    // Add sample travel requests
    const request1: TravelRequest = {
      id: "request_1",
      userId: "user_1",
      fromLocation: {
        address: "Indiranagar, Bangalore",
        latitude: 12.9784,
        longitude: 77.6408,
        name: "Indiranagar",
      },
      toLocation: {
        address: "Koramangala, Bangalore",
        latitude: 12.9352,
        longitude: 77.6245,
        name: "Koramangala",
      },
      date: new Date("2023-07-15"),
      time: "18:30",
      travelMode: "car",
      seats: 2,
      price: 150,
      notes: "Leaving from office, can pick up on the way",
      status: "active",
      createdAt: new Date("2023-07-10"),
      updatedAt: new Date("2023-07-10"),
      preferences: {
        womenOnly: true,
        noSmoking: true,
        noPets: false,
        quietRide: false,
        luggageSpace: true,
        maxPassengers: 2,
      },
    }

    const request2: TravelRequest = {
      id: "request_2",
      userId: "user_2",
      fromLocation: {
        address: "Whitefield, Bangalore",
        latitude: 12.9698,
        longitude: 77.7499,
        name: "Whitefield",
      },
      toLocation: {
        address: "Electronic City, Bangalore",
        latitude: 12.8399,
        longitude: 77.677,
        name: "Electronic City",
      },
      date: new Date("2023-07-16"),
      time: "09:00",
      travelMode: "car",
      seats: 3,
      price: 200,
      notes: "Daily commute to work",
      status: "active",
      createdAt: new Date("2023-07-11"),
      updatedAt: new Date("2023-07-11"),
      preferences: {
        womenOnly: true,
        noSmoking: true,
        noPets: true,
        quietRide: true,
        luggageSpace: false,
      },
    }

    this.travelRequests.set(user1.id, [request1])
    this.travelRequests.set(user2.id, [request2])

    // Add sample geofences
    const safeZone1: GeoFence = {
      id: "geofence_1",
      name: "Home Safe Zone",
      type: "safe",
      points: [{ latitude: 12.9784, longitude: 77.6408 }],
      radius: 0.5, // 500m radius
      metadata: {
        description: "Area around home with good lighting and security",
        createdBy: "user_1",
        createdAt: new Date("2023-06-01"),
        color: "#4DFFB8",
        icon: "home",
      },
    }

    const cautionZone1: GeoFence = {
      id: "geofence_2",
      name: "Park Area",
      type: "caution",
      points: [{ latitude: 12.9794, longitude: 77.6398 }],
      radius: 0.3, // 300m radius
      metadata: {
        description: "Park area with limited lighting at night",
        createdBy: "user_1",
        createdAt: new Date("2023-06-02"),
        color: "#FFAD4D",
        icon: "tree",
      },
    }

    const dangerZone1: GeoFence = {
      id: "geofence_3",
      name: "Isolated Street",
      type: "danger",
      points: [{ latitude: 12.9774, longitude: 77.6428 }],
      radius: 0.2, // 200m radius
      metadata: {
        description: "Isolated area with history of incidents",
        createdBy: "user_2",
        createdAt: new Date("2023-06-03"),
        color: "#FF4D4D",
        icon: "alert-triangle",
      },
    }

    this.geofences = [safeZone1, cautionZone1, dangerZone1]

    // Add sample safety alerts
    const alert1: SafetyAlert = {
      id: "alert_1",
      userId: "user_1",
      type: "geofence",
      message: "You are entering a caution zone: Park Area",
      location: {
        address: "Near Indiranagar Park",
        latitude: 12.9794,
        longitude: 77.6398,
      },
      timestamp: new Date("2023-07-12T20:30:00"),
      read: false,
      priority: "medium",
      relatedEntityId: "geofence_2",
      actions: [
        {
          label: "View Details",
          type: "navigate",
          data: "/safety/geofences/geofence_2",
        },
        {
          label: "Dismiss",
          type: "dismiss",
        },
      ],
    }

    const alert2: SafetyAlert = {
      id: "alert_2",
      userId: "user_1",
      type: "threat",
      message: "You are near a reported threat location: Dark Alley",
      location: {
        address: "MG Road, Bangalore",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      timestamp: new Date("2023-07-13T21:15:00"),
      read: true,
      priority: "high",
      relatedEntityId: "threat_1",
      actions: [
        {
          label: "View Details",
          type: "navigate",
          data: "/safety/threats/threat_1",
        },
        {
          label: "Call Emergency",
          type: "call",
          data: "emergency",
        },
        {
          label: "Dismiss",
          type: "dismiss",
        },
      ],
    }

    this.safetyAlerts = [alert1, alert2]
  }

  // User methods
  async createUser(userData: Omit<User, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">): Promise<User> {
    const id = `user_${Date.now()}`
    const newUser: User = {
      id,
      ...userData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(id, newUser)
    return newUser
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Emergency contacts methods
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return this.emergencyContacts.get(userId) || []
  }

  async addEmergencyContact(
    contact: Omit<EmergencyContact, "id" | "createdAt" | "updatedAt">,
  ): Promise<EmergencyContact> {
    const id = `contact_${Date.now()}`
    const newContact: EmergencyContact = {
      id,
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userContacts = this.emergencyContacts.get(contact.userId) || []
    userContacts.push(newContact)
    this.emergencyContacts.set(contact.userId, userContacts)

    return newContact
  }

  async updateEmergencyContact(id: string, contactData: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
    const userId = contactData.userId
    if (!userId) return null

    const contacts = this.emergencyContacts.get(userId) || []
    const contactIndex = contacts.findIndex((c) => c.id === id)

    if (contactIndex === -1) return null

    const updatedContact = {
      ...contacts[contactIndex],
      ...contactData,
      updatedAt: new Date(),
    }

    contacts[contactIndex] = updatedContact
    this.emergencyContacts.set(userId, contacts)

    return updatedContact
  }

  async deleteEmergencyContact(id: string, userId: string): Promise<boolean> {
    const contacts = this.emergencyContacts.get(userId) || []
    const filteredContacts = contacts.filter((c) => c.id !== id)

    if (filteredContacts.length === contacts.length) return false

    this.emergencyContacts.set(userId, filteredContacts)
    return true
  }

  // Travel request methods
  async createTravelRequest(
    requestData: Omit<TravelRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<TravelRequest> {
    const id = `request_${Date.now()}`
    const newRequest: TravelRequest = {
      id,
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userRequests = this.travelRequests.get(requestData.userId) || []
    userRequests.push(newRequest)
    this.travelRequests.set(requestData.userId, userRequests)

    return newRequest
  }

  async getTravelRequests(filters?: {
    userId?: string
    status?: RequestStatus
    travelMode?: TravelMode
    fromDate?: Date
    toDate?: Date
    womenOnly?: boolean
    noSmoking?: boolean
    noPets?: boolean
  }): Promise<TravelRequest[]> {
    let allRequests: TravelRequest[] = []

    // Collect all requests
    for (const requests of this.travelRequests.values()) {
      allRequests = [...allRequests, ...requests]
    }

    // Apply filters
    if (filters) {
      if (filters.userId) {
        allRequests = allRequests.filter((r) => r.userId === filters.userId)
      }

      if (filters.status) {
        allRequests = allRequests.filter((r) => r.status === filters.status)
      }

      if (filters.travelMode) {
        allRequests = allRequests.filter((r) => r.travelMode === filters.travelMode)
      }

      if (filters.fromDate) {
        allRequests = allRequests.filter((r) => r.date >= filters.fromDate)
      }

      if (filters.toDate) {
        allRequests = allRequests.filter((r) => r.date <= filters.toDate)
      }

      if (filters.womenOnly) {
        allRequests = allRequests.filter((r) => r.preferences?.womenOnly === true)
      }

      if (filters.noSmoking) {
        allRequests = allRequests.filter((r) => r.preferences?.noSmoking === true)
      }

      if (filters.noPets) {
        allRequests = allRequests.filter((r) => r.preferences?.noPets === true)
      }
    }

    return allRequests
  }

  // Health data methods
  async addHealthData(data: Omit<HealthData, "id" | "timestamp">): Promise<HealthData> {
    const id = `health_${Date.now()}`
    const newData: HealthData = {
      id,
      ...data,
      timestamp: new Date(),
    }

    const userHealthData = this.healthData.get(data.userId) || []
    userHealthData.push(newData)
    this.healthData.set(data.userId, userHealthData)

    return newData
  }

  async getHealthData(userId: string, limit = 10): Promise<HealthData[]> {
    const userHealthData = this.healthData.get(userId) || []
    return userHealthData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }

  // Distress events methods
  async createDistressEvent(
    eventData: Omit<DistressEvent, "id" | "timestamp" | "status" | "resolvedAt">,
  ): Promise<DistressEvent> {
    const id = `event_${Date.now()}`
    const newEvent: DistressEvent = {
      id,
      ...eventData,
      timestamp: new Date(),
      status: "active",
    }

    const userEvents = this.distressEvents.get(eventData.userId) || []
    userEvents.push(newEvent)
    this.distressEvents.set(eventData.userId, userEvents)

    return newEvent
  }

  async resolveDistressEvent(
    id: string,
    userId: string,
    status: "resolved" | "false_alarm",
  ): Promise<DistressEvent | null> {
    const events = this.distressEvents.get(userId) || []
    const eventIndex = events.findIndex((e) => e.id === id)

    if (eventIndex === -1) return null

    const updatedEvent = {
      ...events[eventIndex],
      status,
      resolvedAt: new Date(),
    }

    events[eventIndex] = updatedEvent
    this.distressEvents.set(userId, events)

    return updatedEvent
  }

  // Community methods
  async createCommunityPost(
    postData: Omit<CommunityPost, "id" | "likes" | "commentCount" | "createdAt" | "updatedAt">,
  ): Promise<CommunityPost> {
    const id = `post_${Date.now()}`
    const newPost: CommunityPost = {
      id,
      ...postData,
      likes: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.communityPosts.push(newPost)
    return newPost
  }

  async getCommunityPosts(limit = 20, offset = 0, tag?: string): Promise<CommunityPost[]> {
    let filteredPosts = this.communityPosts

    if (tag) {
      filteredPosts = filteredPosts.filter((p) => p.tags.includes(tag))
    }

    return filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(offset, offset + limit)
  }

  async addCommunityComment(
    commentData: Omit<CommunityComment, "id" | "likes" | "createdAt" | "updatedAt">,
  ): Promise<CommunityComment> {
    const id = `comment_${Date.now()}`
    const newComment: CommunityComment = {
      id,
      ...commentData,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const postComments = this.communityComments.get(commentData.postId) || []
    postComments.push(newComment)
    this.communityComments.set(commentData.postId, postComments)

    // Update comment count on post
    const postIndex = this.communityPosts.findIndex((p) => p.id === commentData.postId)
    if (postIndex !== -1) {
      this.communityPosts[postIndex].commentCount += 1
    }

    return newComment
  }

  // Threat location methods
  async getThreatLocations(filters?: {
    verified?: boolean
    threatLevel?: ThreatLevel
    category?: ThreatCategory
    timeOfDay?: TimeOfDay
    minVotes?: number
    minReports?: number
    radius?: number
    center?: { latitude: number; longitude: number }
  }): Promise<ThreatLocation[]> {
    let filteredLocations = this.threatLocations

    if (filters) {
      if (filters.verified !== undefined) {
        filteredLocations = filteredLocations.filter((location) => location.verified === filters.verified)
      }

      if (filters.threatLevel) {
        filteredLocations = filteredLocations.filter((location) => location.threatLevel === filters.threatLevel)
      }

      if (filters.category) {
        filteredLocations = filteredLocations.filter((location) => location.category === filters.category)
      }

      if (filters.timeOfDay) {
        filteredLocations = filteredLocations.filter(
          (location) =>
            location.timeOfDay?.includes(filters.timeOfDay as TimeOfDay) || location.timeOfDay?.includes("allDay"),
        )
      }

      if (filters.minVotes !== undefined) {
        filteredLocations = filteredLocations.filter((location) => location.votes >= filters.minVotes!)
      }

      if (filters.minReports !== undefined) {
        filteredLocations = filteredLocations.filter((location) => location.reportCount >= filters.minReports!)
      }

      if (filters.radius && filters.center) {
        filteredLocations = filteredLocations.filter((location) => {
          // Calculate distance using Haversine formula
          const R = 6371 // Earth's radius in km
          const dLat = this.toRad(location.latitude - filters.center!.latitude)
          const dLon = this.toRad(location.longitude - filters.center!.longitude)
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(filters.center!.latitude)) *
              Math.cos(this.toRad(location.latitude)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const distance = R * c

          return distance <= filters.radius!
        })
      }
    }

    return filteredLocations
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180
  }

  async getThreatLocationById(id: string): Promise<ThreatLocation | null> {
    const location = this.threatLocations.find((location) => location.id === id)
    return location || null
  }

  async createThreatLocation(
    locationData: Omit<
      ThreatLocation,
      "id" | "reportedAt" | "verified" | "verifiedBy" | "verifiedAt" | "votes" | "reportCount" | "lastReportDate"
    >,
  ): Promise<ThreatLocation> {
    const id = `threat_${Date.now()}`
    const newLocation: ThreatLocation = {
      id,
      ...locationData,
      reportedAt: new Date(),
      lastReportDate: new Date(),
      verified: false,
      votes: 0,
      reportCount: 1,
    }

    this.threatLocations.push(newLocation)
    return newLocation
  }

  async updateThreatLocation(id: string, locationData: Partial<ThreatLocation>): Promise<ThreatLocation | null> {
    const locationIndex = this.threatLocations.findIndex((location) => location.id === id)

    if (locationIndex === -1) return null

    const updatedLocation = {
      ...this.threatLocations[locationIndex],
      ...locationData,
    }

    this.threatLocations[locationIndex] = updatedLocation
    return updatedLocation
  }

  async deleteThreatLocation(id: string): Promise<boolean> {
    const initialLength = this.threatLocations.length
    this.threatLocations = this.threatLocations.filter((location) => location.id !== id)
    return this.threatLocations.length < initialLength
  }

  async verifyThreatLocation(id: string, adminId: string): Promise<ThreatLocation | null> {
    const locationIndex = this.threatLocations.findIndex((location) => location.id === id)

    if (locationIndex === -1) return null

    const updatedLocation = {
      ...this.threatLocations[locationIndex],
      verified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    }

    this.threatLocations[locationIndex] = updatedLocation
    return updatedLocation
  }

  async voteThreatLocation(id: string, increment: boolean): Promise<ThreatLocation | null> {
    const locationIndex = this.threatLocations.findIndex((location) => location.id === id)

    if (locationIndex === -1) return null

    const updatedLocation = {
      ...this.threatLocations[locationIndex],
      votes: this.threatLocations[locationIndex].votes + (increment ? 1 : -1),
    }

    this.threatLocations[locationIndex] = updatedLocation
    return updatedLocation
  }

  async reportThreatLocation(id: string): Promise<ThreatLocation | null> {
    const locationIndex = this.threatLocations.findIndex((location) => location.id === id)

    if (locationIndex === -1) return null

    const updatedLocation = {
      ...this.threatLocations[locationIndex],
      reportCount: this.threatLocations[locationIndex].reportCount + 1,
      lastReportDate: new Date(),
    }

    this.threatLocations[locationIndex] = updatedLocation
    return updatedLocation
  }

  // Geofence methods
  async getGeofences(userId?: string, type?: "safe" | "caution" | "danger" | "custom"): Promise<GeoFence[]> {
    let filteredGeofences = this.geofences

    if (userId) {
      filteredGeofences = filteredGeofences.filter((geofence) => geofence.metadata?.createdBy === userId)
    }

    if (type) {
      filteredGeofences = filteredGeofences.filter((geofence) => geofence.type === type)
    }

    return filteredGeofences
  }

  async getGeofenceById(id: string): Promise<GeoFence | null> {
    const geofence = this.geofences.find((geofence) => geofence.id === id)
    return geofence || null
  }

  async createGeofence(geofenceData: Omit<GeoFence, "id">): Promise<GeoFence> {
    const id = `geofence_${Date.now()}`
    const newGeofence: GeoFence = {
      id,
      ...geofenceData,
    }

    this.geofences.push(newGeofence)
    return newGeofence
  }

  async updateGeofence(id: string, geofenceData: Partial<GeoFence>): Promise<GeoFence | null> {
    const geofenceIndex = this.geofences.findIndex((geofence) => geofence.id === id)

    if (geofenceIndex === -1) return null

    const updatedGeofence = {
      ...this.geofences[geofenceIndex],
      ...geofenceData,
      metadata: {
        ...this.geofences[geofenceIndex].metadata,
        ...geofenceData.metadata,
        updatedAt: new Date(),
      },
    }

    this.geofences[geofenceIndex] = updatedGeofence
    return updatedGeofence
  }

  async deleteGeofence(id: string): Promise<boolean> {
    const initialLength = this.geofences.length
    this.geofences = this.geofences.filter((geofence) => geofence.id !== id)
    return this.geofences.length < initialLength
  }

  // Safety alerts methods
  async getSafetyAlerts(userId: string, read?: boolean): Promise<SafetyAlert[]> {
    let filteredAlerts = this.safetyAlerts.filter((alert) => alert.userId === userId)

    if (read !== undefined) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.read === read)
    }

    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async createSafetyAlert(alertData: Omit<SafetyAlert, "id" | "timestamp" | "read">): Promise<SafetyAlert> {
    const id = `alert_${Date.now()}`
    const newAlert: SafetyAlert = {
      id,
      ...alertData,
      timestamp: new Date(),
      read: false,
    }

    this.safetyAlerts.push(newAlert)
    return newAlert
  }

  async markSafetyAlertAsRead(id: string, userId: string): Promise<SafetyAlert | null> {
    const alertIndex = this.safetyAlerts.findIndex((alert) => alert.id === id && alert.userId === userId)

    if (alertIndex === -1) return null

    const updatedAlert = {
      ...this.safetyAlerts[alertIndex],
      read: true,
    }

    this.safetyAlerts[alertIndex] = updatedAlert
    return updatedAlert
  }

  async deleteSafetyAlert(id: string, userId: string): Promise<boolean> {
    const initialLength = this.safetyAlerts.length
    this.safetyAlerts = this.safetyAlerts.filter((alert) => !(alert.id === id && alert.userId === userId))
    return this.safetyAlerts.length < initialLength
  }

  // Route planning methods
  async calculateSafeRoute(
    startLocation: { latitude: number; longitude: number },
    endLocation: { latitude: number; longitude: number },
    options: RouteOptions,
  ): Promise<any> {
    // In a real implementation, this would call an external routing API
    // and process the results to avoid threat locations

    // For this mock implementation, we'll return a simulated route
    const simulatedRoute = {
      distance: 5.2, // km
      duration: 15, // minutes
      avoidedThreats: options.avoidThreatLocations ? 2 : 0,
      preferredSafeAreas: options.preferSafeAreas ? 1 : 0,
      waypoints: [
        { latitude: startLocation.latitude, longitude: startLocation.longitude },
        { latitude: startLocation.latitude + 0.005, longitude: startLocation.longitude + 0.005 },
        { latitude: startLocation.latitude + 0.01, longitude: startLocation.longitude + 0.01 },
        { latitude: endLocation.latitude, longitude: endLocation.longitude },
      ],
      threatLocationsAvoided: options.avoidThreatLocations
        ? this.threatLocations.slice(0, 2).map((threat) => ({
            id: threat.id,
            name: threat.name,
            threatLevel: threat.threatLevel,
            distance: 0.3, // km from route
          }))
        : [],
    }

    return simulatedRoute
  }
}

// Export a singleton instance
export const db = new Database()

