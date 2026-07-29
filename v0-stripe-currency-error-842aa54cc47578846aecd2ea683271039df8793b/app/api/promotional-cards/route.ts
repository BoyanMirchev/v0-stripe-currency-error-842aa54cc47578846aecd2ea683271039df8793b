import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const cards = await sql`
      SELECT * FROM promotional_cards 
      ORDER BY position ASC
    `
    return NextResponse.json(cards)
  } catch (error) {
    console.error("Error fetching promotional cards:", error)
    return NextResponse.json({ error: "Failed to fetch promotional cards" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { position, image_url, link_url } = body

    const result = await sql`
      UPDATE promotional_cards 
      SET image_url = ${image_url}, 
          link_url = ${link_url},
          updated_at = CURRENT_TIMESTAMP
      WHERE position = ${position}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating promotional card:", error)
    return NextResponse.json({ error: "Failed to update promotional card" }, { status: 500 })
  }
}
