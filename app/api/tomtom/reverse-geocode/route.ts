import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get("latitude")
  const longitude = searchParams.get("longitude")

  if (!latitude || !longitude) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "TomTom API key is not configured" }, { status: 500 })
    }

    // Call TomTom Reverse Geocoding API
    const response = await fetch(
      `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${apiKey}&radius=100`,
    )

    if (!response.ok) {
      throw new Error(`TomTom API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in reverse geocoding:", error)
    return NextResponse.json({ error: "Failed to reverse geocode location" }, { status: 500 })
  }
}

