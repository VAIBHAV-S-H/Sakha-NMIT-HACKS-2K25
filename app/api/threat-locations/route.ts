import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      // Get a specific threat location
      const location = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({ 
        _id: new ObjectId(id) 
      })

      if (!location) {
        return NextResponse.json({ error: "Threat location not found" }, { status: 404 })
      }

      return NextResponse.json(location)
    }

    // Filter parameters
    const verified = searchParams.get("verified") === "true" ? true : 
                     searchParams.get("verified") === "false" ? false : undefined
    const threatLevel = searchParams.get("threatLevel")
    const category = searchParams.get("category")
    const timeOfDay = searchParams.get("timeOfDay")
    
    // Build query
    const query: any = {}
    if (verified !== undefined) query.verified = verified
    if (threatLevel) query.threatLevel = threatLevel
    if (category) query.category = category
    if (timeOfDay) query.timeOfDay = timeOfDay

    // Get all threat locations matching query
    const locations = await db.collection(COLLECTIONS.THREAT_LOCATIONS)
      .find(query)
      .toArray()
    
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching threat locations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      latitude, 
      longitude, 
      threatLevel,
      category,
      timeOfDay,
      images
    } = body

    // Validate required fields
    if (!name || !description || latitude === undefined || longitude === undefined || !threatLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new threat location
    const newLocation = {
      name,
      description,
      latitude,
      longitude,
      threatLevel,
      category,
      timeOfDay,
      images,
      reportedBy: currentUser.id,
      reportedAt: new Date(),
      verified: false,
      votes: 0,
      reportCount: 1,
      lastReportDate: new Date()
    }

    const result = await db.collection(COLLECTIONS.THREAT_LOCATIONS).insertOne(newLocation)

    return NextResponse.json({
      ...newLocation,
      _id: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating threat location:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "Location ID is required" }, { status: 400 })
    }

    // Get the existing location
    const existingLocation = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!existingLocation) {
      return NextResponse.json({ error: "Threat location not found" }, { status: 404 })
    }

    // Only allow updates by the original reporter or an admin
    if (existingLocation.reportedBy !== currentUser.id && !currentUser.email.includes("admin")) {
      return NextResponse.json({ error: "Not authorized to update this location" }, { status: 403 })
    }

    // Update the location
    await db.collection(COLLECTIONS.THREAT_LOCATIONS).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    // Get the updated document
    const updatedLocation = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({
      _id: new ObjectId(id)
    })
    
    return NextResponse.json(updatedLocation)
  } catch (error) {
    console.error("Error updating threat location:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Location ID is required" }, { status: 400 })
    }

    // Get the existing location
    const existingLocation = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!existingLocation) {
      return NextResponse.json({ error: "Threat location not found" }, { status: 404 })
    }

    // Only allow deletion by the original reporter or an admin
    if (existingLocation.reportedBy !== currentUser.id && !currentUser.email.includes("admin")) {
      return NextResponse.json({ error: "Not authorized to delete this location" }, { status: 403 })
    }

    // Delete the location
    const result = await db.collection(COLLECTIONS.THREAT_LOCATIONS).deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete threat location" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting threat location:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

