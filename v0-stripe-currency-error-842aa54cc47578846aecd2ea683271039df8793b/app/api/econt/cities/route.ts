// app/api/econt/cities/route.ts
import { NextResponse } from "next/server"
import { parseStringPromise } from "xml2js"
import { neon } from "@neondatabase/serverless" // Import neon
import type { EcontCity } from "@/lib/econt-api"
import { ECONT_CONFIG } from "@/lib/econt-api"

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
    }
    return "" // Should not happen
  })
}

// Use production credentials and endpoint
const ECONT_USERNAME = "bobikab04@gmail.com" // Your production username
const ECONT_PASSWORD = "Bobi04077812@" // Your production password
const ECONT_API_URL = ECONT_CONFIG.PRODUCTION.SERVICE_TOOL // Production endpoint

const sql = neon(process.env.DATABASE_URL!) // Initialize Neon client

export async function POST(request: Request) {
  try {
    const { countryCode } = await request.json()
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

    // 1. Check cache first
    const cachedCities = await sql`
      SELECT data, last_fetched_at
      FROM econt_cities
      WHERE id = ${countryCode} AND last_fetched_at > NOW() - INTERVAL '24 hours'
    `

    if (cachedCities.length > 0) {
      console.log("Serving cities from cache for country:", countryCode)
      return NextResponse.json(cachedCities[0].data)
    }

    // 2. If not in cache or stale, fetch from Econt API
    const xmlRequestBody = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <client>
    <username>${escapeXml(ECONT_USERNAME)}</username>
    <password>${escapeXml(ECONT_PASSWORD)}</password>
  </client>
  <request_type>cities</request_type>
  <cities>
    <country_code>${escapeXml(countryCode)}</country_code>
  </cities>
</request>`.trim()

    console.log("Econt API Request Body (Cities):", xmlRequestBody)
    console.log("Using HTTPS endpoint:", ECONT_API_URL)

    // Create Basic Authentication header
    const basicAuth = Buffer.from(`${ECONT_USERNAME}:${ECONT_PASSWORD}`).toString("base64")

    const response = await fetch(ECONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Authorization: `Basic ${basicAuth}`,
        "User-Agent": "Mozilla/5.0 (compatible; EcontAPI/1.0)",
        Accept: "text/xml, application/xml, /",
        "Cache-Control": "no-cache",
      },
      body: `xml=${encodeURIComponent(xmlRequestBody)}`,
    })

    console.log("Response Status (Cities):", response.status, response.statusText)

    const contentType = response.headers.get("Content-Type")
    const responseText = await response.text()

    console.log("Response Content-Type (Cities):", contentType)
    console.log("Response Length (Cities):", responseText.length)
    console.log("Full Response (Cities):", responseText)

    if (!response.ok) {
      console.error("HTTP Error (Cities):", response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (contentType && contentType.includes("text/html")) {
      console.error("Received HTML response instead of XML (Cities)")
      throw new Error("Received HTML response instead of XML")
    }

    const trimmedResponse = responseText.trim()
    if (!trimmedResponse.startsWith("<?xml") && !trimmedResponse.startsWith("<response")) {
      console.error("Response doesn't look like XML (Cities):", trimmedResponse.substring(0, 100))
      throw new Error(`Response doesn't appear to be XML: ${trimmedResponse.substring(0, 50)}...`)
    }

    let parsedData: any
    try {
      parsedData = await parseStringPromise(responseText, { explicitArray: false, trim: true })
      console.log("XML parsed successfully (Cities)")
      console.log("Parsed data structure (Cities):", JSON.stringify(parsedData, null, 2))
    } catch (parseError: any) {
      console.error("XML Parsing Error (Cities):", parseError.message)
      console.error("Problematic content (Cities):", responseText.substring(0, 500))
      throw new Error(`XML parsing failed: ${parseError.message}`)
    }

    if (parsedData.response && parsedData.response.error) {
      const errorMessage = parsedData.response.error.message || "Unknown Econt API error"
      const errorCode = parsedData.response.error.code || "Unknown error code"
      console.error("Econt API returned error (Cities):", errorCode, errorMessage)
      throw new Error(`Econt API error [${errorCode}]: ${errorMessage}`)
    }

    const cities: EcontCity[] = []
    const rawCities = parsedData.response?.cities?.e || parsedData.response?.cities?.city

    if (rawCities) {
      const citiesArray = Array.isArray(rawCities) ? rawCities : [rawCities]
      citiesArray.forEach((city: any) => {
        cities.push({
          id: city.id,
          postCode: city.post_code,
          name: city.name,
          nameEn: city.name_en,
          regionName: city.region,
          regionNameEn: city.region_en,
          country: {
            id: city.id_country,
            code2: "", // Not provided in this response, fill if available elsewhere
            code3: countryCode,
            name: "", // Not provided in this response
            nameEn: "", // Not provided in this response
            isEU: false, // Not provided in this response
          },
          phoneCode: "", // Not provided in this response
          location: {
            latitude: Number.parseFloat(city.location?.latitude || "0"),
            longitude: Number.parseFloat(city.location?.longitude || "0"),
          },
          expressCityDeliveries: city.express_city_deliveries === "1",
        })
      })
    }

    // 3. Store/Update in cache
    await sql`
      INSERT INTO econt_cities (id, data, last_fetched_at)
      VALUES (${countryCode}, ${JSON.stringify(cities)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        last_fetched_at = NOW();
    `
    console.log("Cities data cached for country:", countryCode)

    console.log(`Successfully parsed ${cities.length} cities`)
    return NextResponse.json(cities)
  } catch (error: any) {
    console.error("Error in /api/econt/cities route:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cities from Econt API",
        details: error.message || "Unknown error",
        suggestion:
          "The Econt API might be experiencing issues or returning unexpected content. Please check the API documentation or contact Econt support.",
        debug: {
          endpoint: ECONT_API_URL,
          username: ECONT_USERNAME,
        },
      },
      { status: 500 },
    )
  }
}
