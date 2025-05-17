import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    if (!body.locations || !Array.isArray(body.locations) || body.locations.length < 2) {
      return NextResponse.json({ error: "At least two locations are required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "TomTom API key is not configured" }, { status: 500 })
    }

    // Format locations for TomTom API
    const locations = body.locations.map((loc: [number, number]) => {
      return {
        point: {
          latitude: loc[1],
          longitude: loc[0],
        },
      }
    })

    // Build request options
    const requestOptions: any = {
      key: apiKey,
      locations,
      traffic: body.traffic !== false,
    }

    if (body.avoid && Array.isArray(body.avoid) && body.avoid.length > 0) {
      requestOptions.avoid = body.avoid
    }

    // Call TomTom Routing API
    const response = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/json?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestOptions),
    })

    if (!response.ok) {
      throw new Error(`TomTom API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error calculating route:", error)
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 })
  }
}

