import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const banners = await sql`
      SELECT * FROM banners 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `

    return NextResponse.json(banners)
  } catch (error) {
    console.error("[v0] Error fetching banners:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
    }
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[v0] Creating banner with data:", body)

    const { title, image_url, alt_text, link_url, display_order, is_active } = body

    const result = await sql`
      INSERT INTO banners (title, image_url, alt_text, link_url, display_order, is_active)
      VALUES (${title}, ${image_url}, ${alt_text || null}, ${link_url || null}, ${display_order || 0}, ${is_active !== false})
      RETURNING *
    `

    console.log("[v0] Banner created successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating banner:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Failed to create banner",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
