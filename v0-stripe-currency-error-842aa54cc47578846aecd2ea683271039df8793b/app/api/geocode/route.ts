import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { street, postalCode, cityName, latitude, longitude } = await req.json()

  if (latitude !== undefined && longitude !== undefined) {
    try {
      console.log(`[v0] Attempting reverse geocoding for coordinates: ${latitude}, ${longitude}`)

      const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=bg`
      console.log(`[v0] Google Geocoding URL (key hidden)`)

      const response = await fetch(googleUrl)
      const data = await response.json()

      console.log(`[v0] Google Geocoding response status: ${data.status}`)

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0]
        console.log(`[v0] Full address from Google:`, result.formatted_address)
        console.log(`[v0] Address components:`, JSON.stringify(result.address_components, null, 2))

        // Extract address components from Google's response
        const components = result.address_components
        let streetName = ""
        let houseNumber = ""
        let city = ""
        let postcode = ""

        components.forEach((component: any) => {
          const types = component.types
          if (types.includes("route")) {
            streetName = component.long_name
          }
          if (types.includes("street_number")) {
            houseNumber = component.long_name
          }
          if (types.includes("locality")) {
            city = component.long_name
          }
          if (types.includes("postal_code")) {
            postcode = component.long_name
          }
          // Additional fallbacks for street
          if (!streetName && types.includes("neighborhood")) {
            streetName = component.long_name
          }
          if (!streetName && types.includes("sublocality")) {
            streetName = component.long_name
          }
        })

        console.log(
          `[v0] Extracted parts - Street: ${streetName}, House: ${houseNumber}, City: ${city}, Postcode: ${postcode}`,
        )

        let fullAddress = ""
        if (streetName && houseNumber) {
          fullAddress = `ул. ${streetName} ${houseNumber}, ${city}${postcode ? ` ${postcode}` : ""}, България`
        } else if (streetName) {
          fullAddress = `ул. ${streetName}, ${city}${postcode ? ` ${postcode}` : ""}, България`
        } else {
          fullAddress = `${city}${postcode ? ` ${postcode}` : ""}, България`
        }

        console.log(`[v0] Final formatted address: ${fullAddress}`)

        return NextResponse.json({
          city: city || "София",
          postalCode: postcode || "1000",
          street: streetName || city || "София",
          streetNumber: houseNumber,
          fullAddress: fullAddress,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        })
      } else {
        console.error(`[v0] Google Geocoding error:`, data.status)
        throw new Error(`Geocoding failed: ${data.status}`)
      }
    } catch (error) {
      console.error("[v0] Reverse geocoding error:", error)

      return NextResponse.json({
        city: "София",
        postalCode: "1000",
        street: "София",
        streetNumber: "",
        fullAddress: `София, България`,
        latitude: latitude,
        longitude: longitude,
        error: error.message,
      })
    }
  }

  // Handle Forward Geocoding (address to latitude, longitude) - existing logic
  if (!street || !cityName) {
    return NextResponse.json({ error: "Street and city name are required for geocoding." }, { status: 400 })
  }

  // In a real application, you would call an external geocoding API here.
  if (cityName === "София" && street.includes("Витоша")) {
    return NextResponse.json({
      latitude: 42.6738,
      longitude: 23.3636,
    })
  } else {
    // Simulate a generic response or error for other addresses
    return NextResponse.json({ error: "Address not found or outside simulated area" }, { status: 404 })
  }
}
