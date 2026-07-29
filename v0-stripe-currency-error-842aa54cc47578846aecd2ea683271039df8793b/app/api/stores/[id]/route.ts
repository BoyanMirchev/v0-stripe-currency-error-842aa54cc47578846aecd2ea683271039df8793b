import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const result = await sql`SELECT * FROM stores WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching store:", error)
    return NextResponse.json({ error: "Failed to fetch store" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await sql`DELETE FROM stores WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting store:", error)
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, address, city, neighborhood, working_hours, weekly_hours, image_url, rating, is_24_7, latitude, longitude, google_maps_url, phone } = body

    const result = await sql`
      UPDATE stores 
      SET name = ${name}, 
          address = ${address}, 
          city = ${city}, 
          neighborhood = ${neighborhood}, 
          working_hours = ${working_hours}, 
          weekly_hours = ${weekly_hours ? JSON.stringify(weekly_hours) : null},
          image_url = ${image_url}, 
          rating = ${rating}, 
          is_24_7 = ${is_24_7}, 
          latitude = ${latitude}, 
          longitude = ${longitude}, 
          google_maps_url = ${google_maps_url},
          phone = ${phone},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating store:", error)
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 })
  }
}
