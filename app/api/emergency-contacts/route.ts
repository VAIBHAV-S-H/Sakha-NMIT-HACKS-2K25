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

    const contacts = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS)
      .find({ userId: currentUser.id })
      .toArray()
    
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching emergency contacts:", error)
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
    const { name, phone, relationship } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newContact = {
      userId: currentUser.id,
      name,
      phone,
      relationship,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).insertOne(newContact)
    
    return NextResponse.json({
      ...newContact,
      _id: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating emergency contact:", error)
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
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    // Check if contact exists and belongs to current user
    const existingContact = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).findOne({
      _id: new ObjectId(id),
      userId: currentUser.id
    })

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found or not authorized" }, { status: 404 })
    }

    // Update contact
    await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        } 
      }
    )
    
    // Get updated contact
    const updatedContact = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).findOne({
      _id: new ObjectId(id)
    })
    
    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error("Error updating emergency contact:", error)
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
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    // Check if contact exists and belongs to current user
    const existingContact = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).findOne({
      _id: new ObjectId(id),
      userId: currentUser.id
    })

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found or not authorized" }, { status: 404 })
    }

    // Delete contact
    const result = await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting emergency contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 