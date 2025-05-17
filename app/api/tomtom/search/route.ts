import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const radius = searchParams.get("radius") || "10000" // Default 10km
  const limit = searchParams.get("limit") || "5"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "TomTom API key is not configured" }, { status: 500 })
    }

    // Build the URL
    let url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&limit=${limit}`

    // Add center point if provided
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}&radius=${radius}`
    }

    // Call TomTom Search API
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`TomTom API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in location search:", error)
    return NextResponse.json({ error: "Failed to search locations" }, { status: 500 })
  }
}

