import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const result = await sql`
      UPDATE silver_categories
      SET 
        name = ${data.name},
        display_order = ${data.display_order || 0},
        is_active = ${data.is_active !== false},
        parent_id = ${data.parent_id || null},
        show_on_homepage = ${data.show_on_homepage || false},
        homepage_image = ${data.homepage_image || null},
        homepage_order = ${data.homepage_order || 0},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating silver category:", error)
    return NextResponse.json({ error: "Failed to update silver category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // First, set category_id to null for any silver items using this category
    await sql`UPDATE silver_sales SET category_id = NULL WHERE category_id = ${id}`

    const result = await sql`
      DELETE FROM silver_categories WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting silver category:", error)
    return NextResponse.json({ error: "Failed to delete silver category" }, { status: 500 })
  }
}
