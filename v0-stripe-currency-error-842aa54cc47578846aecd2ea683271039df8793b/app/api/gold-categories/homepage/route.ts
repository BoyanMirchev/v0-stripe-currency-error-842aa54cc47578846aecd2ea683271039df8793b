import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`
      SELECT id, name, slug, homepage_image, homepage_order
      FROM gold_categories
      WHERE show_on_homepage = true AND is_active = true
      ORDER BY homepage_order ASC, display_order ASC
      LIMIT 5
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching homepage categories:", error)
    return NextResponse.json({ error: "Failed to fetch homepage categories" }, { status: 500 })
  }
}
