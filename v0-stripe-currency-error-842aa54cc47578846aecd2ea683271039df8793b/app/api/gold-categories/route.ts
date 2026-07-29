import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        gc.*,
        parent.name as parent_name
      FROM gold_categories gc
      LEFT JOIN gold_categories parent ON gc.parent_id = parent.id
      WHERE gc.is_active = true
      ORDER BY gc.parent_id NULLS FIRST, gc.display_order ASC
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching gold categories:", error)
    return NextResponse.json({ error: "Failed to fetch gold categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-а-яё]/gi, "")

    const result = await sql`
      INSERT INTO gold_categories (name, slug, display_order, is_active, parent_id, show_on_homepage, homepage_image, homepage_order)
      VALUES (
        ${data.name}, 
        ${slug}, 
        ${data.display_order || 0}, 
        ${data.is_active !== false}, 
        ${data.parent_id || null},
        ${data.show_on_homepage || false},
        ${data.homepage_image || null},
        ${data.homepage_order || 0}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating gold category:", error)
    return NextResponse.json({ error: "Failed to create gold category" }, { status: 500 })
  }
}
