// app/api/econt/offices/route.ts
import { NextResponse } from "next/server"
import { parseStringPromise } from "xml2js"
import { neon } from "@neondatabase/serverless" // Import neon
import type { EcontOffice } from "@/lib/econt-api"
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
const ECONT_API_URL = ECONT_CONFIG.PRODUCTION.SERVICE_TOOL // Correct production endpoint from lib/econt-api.ts

const sql = neon(process.env.DATABASE_URL!) // Initialize Neon client

export async function POST(request: Request) {
  try {
    const { cityId } = await request.json()
    
    if (!cityId) {
      return NextResponse.json({ error: "cityId is required" }, { status: 400 })
    }
    
    console.log("[v0] Fetching offices for city ID:", cityId)

    // 1. Check cache first - use city_id as a string for consistency
    const cityIdStr = String(cityId)
    const cachedOffices = await sql`
      SELECT data, last_fetched_at
      FROM econt_offices
      WHERE city_id = ${cityIdStr} AND last_fetched_at > NOW() - INTERVAL '24 hours'
    `

    if (cachedOffices.length > 0 && Array.isArray(cachedOffices[0].data) && cachedOffices[0].data.length > 0) {
      console.log("[v0] Serving offices from cache for city ID:", cityIdStr, "count:", cachedOffices[0].data.length)
      return NextResponse.json(cachedOffices[0].data)
    }
    
    console.log("[v0] Cache miss or empty, fetching from Econt API for city ID:", cityIdStr)

    // 2. If not in cache or stale, fetch from Econt API
    const xmlRequestBody = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <client>
    <username>${escapeXml(ECONT_USERNAME)}</username>
    <password>${escapeXml(ECONT_PASSWORD)}</password>
  </client>
  <request_type>offices</request_type>
  <offices>
    <city_id>${escapeXml(cityId)}</city_id>
  </offices>
</request>`.trim()

    console.log("Econt API Request Body (Offices):", xmlRequestBody)
    console.log("Using HTTPS endpoint (Offices):", ECONT_API_URL)

    // Create Basic Authentication header
    const basicAuth = Buffer.from(`${ECONT_USERNAME}:${ECONT_PASSWORD}`).toString("base64")

    const response = await fetch(ECONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", // Correct Content-Type
        Authorization: `Basic ${basicAuth}`,
        "User-Agent": "Mozilla/5.0 (compatible; EcontAPI/1.0)",
        Accept: "text/xml, application/xml, /",
        "Cache-Control": "no-cache",
      },
      body: `xml=${encodeURIComponent(xmlRequestBody)}`, // Correct body format
    })

    console.log("Response Status (Offices):", response.status, response.statusText)

    const contentType = response.headers.get("Content-Type")
    const responseText = await response.text()

    console.log("Response Content-Type (Offices):", contentType)
    console.log("Response Length (Offices):", responseText.length)
    console.log("Full Response (Offices):", responseText)

    if (!response.ok) {
      console.error("HTTP Error (Offices):", response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (contentType && contentType.includes("text/html")) {
      console.error("Received HTML response instead of XML (Offices)")
      throw new Error("Received HTML response instead of XML")
    }

    const trimmedResponse = responseText.trim()
    if (!trimmedResponse.startsWith("<?xml") && !trimmedResponse.startsWith("<response")) {
      console.error("Response doesn't look like XML (Offices):", trimmedResponse.substring(0, 100))
      throw new Error(`Response doesn't appear to be XML: ${trimmedResponse.substring(0, 50)}...`)
    }

    let parsedData: any
    try {
      parsedData = await parseStringPromise(responseText, { explicitArray: false, trim: true })
      console.log("XML parsed successfully (Offices)")
      console.log("Parsed data structure (Offices):", JSON.stringify(parsedData, null, 2))
    } catch (parseError: any) {
      console.error("XML Parsing Error (Offices):", parseError.message)
      console.error("Problematic content (Offices):", responseText.substring(0, 500))
      throw new Error(`XML parsing failed: ${parseError.message}`)
    }

    if (parsedData.response && parsedData.response.error) {
      const errorMessage = parsedData.response.error.message || "Unknown Econt API error"
      const errorCode = parsedData.response.error.code || "Unknown error code"
      console.error("Econt API returned error (Offices):", errorCode, errorMessage)
      throw new Error(`Econt API error [${errorCode}]: ${errorMessage}`)
    }

    const offices: EcontOffice[] = []

    let rawOffices = parsedData.response?.offices?.e || parsedData.response?.offices?.office

    if (!rawOffices && parsedData.response?.offices) {
      rawOffices = parsedData.response.offices
    }

    console.log("Raw offices data (Offices):", rawOffices)

    if (rawOffices) {
      const officesArray = Array.isArray(rawOffices) ? rawOffices : [rawOffices]
      officesArray.forEach((office: any) => {
        offices.push({
          id: office.id,
          name: office.name,
          nameEn: office.name_en,
          officeCode: office.office_code,
          isMachine: office.is_machine === "1",
          isDrive: office.is_drive === "1",
          cityId: office.id_city,
          postCode: office.post_code,
          cityName: office.city_name,
          cityNameEn: office.city_name_en,
          location: {
            latitude: Number.parseFloat(office.latitude),
            longitude: Number.parseFloat(office.longitude),
          },
          address: `${office.address_details?.street_name || ""} ${office.address_details?.num || ""}, ${
            office.city_name
          }, ${office.post_code}`,
          addressDetails: office.address_details,
          phone: office.phone,
          email: office.email,
          workBegin: office.work_begin,
          workEnd: office.work_end,
          workBeginSaturday: office.work_begin_saturday,
          workEndSaturday: office.work_end_saturday,
          timePriority: office.time_priority,
          updatedTime: office.updated_time,
          hubCode: office.hub_code,
          hubName: office.hub_name,
          hubNameEn: office.hub_name_en,
        })
      })
    }

    // 3. Store/Update in cache - use city_id as both id and city_id for consistency
    const cacheKey = `offices_${cityIdStr}`
    await sql`
      INSERT INTO econt_offices (id, city_id, data, last_fetched_at)
      VALUES (${cacheKey}, ${cityIdStr}, ${JSON.stringify(offices)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        city_id = EXCLUDED.city_id,
        data = EXCLUDED.data,
        last_fetched_at = NOW();
    `
    console.log("[v0] Offices data cached for city ID:", cityIdStr, "offices count:", offices.length)

    console.log(`Successfully parsed ${offices.length} offices`)
    return NextResponse.json(offices)
  } catch (error: any) {
    console.error("Error in /api/econt/offices route:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch offices from Econt API",
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
