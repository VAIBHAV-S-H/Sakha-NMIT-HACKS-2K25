import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const status = searchParams.get("status")
    const userId = currentUser.id
    const userOnly = searchParams.get("userOnly") === "true"

    if (id) {
      // Get a specific travel request
      const request = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).findOne({
        _id: new ObjectId(id)
      })

      if (!request) {
        return NextResponse.json({ error: "Travel request not found" }, { status: 404 })
      }

      // Check if user is authorized to view this request
      if (request.userId !== userId && !currentUser.email.includes("admin")) {
        return NextResponse.json({ error: "Not authorized to view this request" }, { status: 403 })
      }

      return NextResponse.json(request)
    }

    // Build query
    const query: any = {}
    
    // Filter by status if provided
    if (status) {
      query.status = status
    }
    
    // Filter by user if userOnly is true
    if (userOnly) {
      query.userId = userId
    }

    // Get all travel requests matching query
    const requests = await db.collection(COLLECTIONS.TRAVEL_REQUESTS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching travel requests:", error)
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
      fromLocation, 
      toLocation, 
      date, 
      time, 
      travelMode, 
      seats, 
      price, 
      notes,
      preferences
    } = body

    // Validate required fields
    if (!fromLocation || !toLocation || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new travel request
    const newRequest = {
      userId: currentUser.id,
      fromLocation,
      toLocation,
      date: new Date(date),
      time,
      travelMode: travelMode || "walking",
      seats: seats || 1,
      price: price || 0,
      notes: notes || "",
      preferences: preferences || {
        womenOnly: false,
        noSmoking: false,
        noPets: false,
        quietRide: false,
        luggageSpace: false,
        maxPassengers: 4
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).insertOne(newRequest)
    
    return NextResponse.json({
      ...newRequest,
      _id: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating travel request:", error)
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
      return NextResponse.json({ error: "Travel request ID is required" }, { status: 400 })
    }

    // Check if request exists and belongs to current user
    const existingRequest = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).findOne({
      _id: new ObjectId(id),
      userId: currentUser.id
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Travel request not found or not authorized" }, { status: 404 })
    }

    // Update request
    await db.collection(COLLECTIONS.TRAVEL_REQUESTS).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        } 
      }
    )
    
    // Get updated request
    const updatedRequest = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).findOne({
      _id: new ObjectId(id)
    })
    
    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating travel request:", error)
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
      return NextResponse.json({ error: "Travel request ID is required" }, { status: 400 })
    }

    // Check if request exists and belongs to current user
    const existingRequest = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).findOne({
      _id: new ObjectId(id),
      userId: currentUser.id
    })

    if (!existingRequest) {
      return NextResponse.json({ error: "Travel request not found or not authorized" }, { status: 404 })
    }

    // Delete request
    const result = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete travel request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting travel request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 