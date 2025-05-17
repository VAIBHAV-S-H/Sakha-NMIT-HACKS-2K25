import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"
import { auth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const currentUser = auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { id, action } = body

    if (!id) {
      return NextResponse.json({ error: "Location ID is required" }, { status: 400 })
    }

    if (action !== "upvote" && action !== "downvote") {
      return NextResponse.json({ error: "Invalid action. Use 'upvote' or 'downvote'" }, { status: 400 })
    }

    // Get the existing location
    const existingLocation = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!existingLocation) {
      return NextResponse.json({ error: "Threat location not found" }, { status: 404 })
    }

    // Update vote count
    const increment = action === "upvote" ? 1 : -1
    
    await db.collection(COLLECTIONS.THREAT_LOCATIONS).updateOne(
      { _id: new ObjectId(id) },
      { $inc: { votes: increment } }
    )
    
    // If this is a downvote below 0, ensure votes don't go negative
    if (action === "downvote" && existingLocation.votes <= 0) {
      await db.collection(COLLECTIONS.THREAT_LOCATIONS).updateOne(
        { _id: new ObjectId(id) },
        { $set: { votes: 0 } }
      )
    }
    
    // Get the updated document
    const updatedLocation = await db.collection(COLLECTIONS.THREAT_LOCATIONS).findOne({
      _id: new ObjectId(id)
    })
    
    return NextResponse.json(updatedLocation)
  } catch (error) {
    console.error("Error voting for threat location:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

