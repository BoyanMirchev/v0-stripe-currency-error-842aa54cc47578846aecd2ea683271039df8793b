import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        sc.*,
        parent.name as parent_name
      FROM silver_categories sc
      LEFT JOIN silver_categories parent ON sc.parent_id = parent.id
      WHERE sc.is_active = true
      ORDER BY sc.parent_id NULLS FIRST, sc.display_order ASC
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching silver categories:", error)
    return NextResponse.json({ error: "Failed to fetch silver categories" }, { status: 500 })
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
      INSERT INTO silver_categories (name, slug, display_order, is_active, parent_id, show_on_homepage, homepage_image, homepage_order)
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
    console.error("[v0] Error creating silver category:", error)
    return NextResponse.json({ error: "Failed to create silver category" }, { status: 500 })
  }
}
