import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const neighborhood = searchParams.get("neighborhood")

    let stores

    if (city && city !== "all" && neighborhood && neighborhood !== "all") {
      stores = await sql`
        SELECT * FROM stores 
        WHERE city = ${city} AND neighborhood = ${neighborhood}
        ORDER BY created_at DESC
      `
    } else if (city && city !== "all") {
      stores = await sql`
        SELECT * FROM stores 
        WHERE city = ${city}
        ORDER BY created_at DESC
      `
    } else if (neighborhood && neighborhood !== "all") {
      stores = await sql`
        SELECT * FROM stores 
        WHERE neighborhood = ${neighborhood}
        ORDER BY created_at DESC
      `
    } else {
      stores = await sql`
        SELECT * FROM stores 
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json(stores)
  } catch (error) {
    console.error("Error fetching stores:", error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, address, city, neighborhood, working_hours, weekly_hours, image_url, rating, is_24_7, latitude, longitude, google_maps_url, phone, email } = body

    const result = await sql`
      INSERT INTO stores (name, address, city, neighborhood, working_hours, weekly_hours, image_url, rating, is_24_7, latitude, longitude, google_maps_url, phone, email)
      VALUES (
        ${name},
        ${address},
        ${city},
        ${neighborhood || null},
        ${working_hours},
        ${weekly_hours ? JSON.stringify(weekly_hours) : null},
        ${image_url || null},
        ${rating || 0},
        ${is_24_7 || false},
        ${latitude || null},
        ${longitude || null},
        ${google_maps_url || null},
        ${phone || null},
        ${email || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 })
  }
}
