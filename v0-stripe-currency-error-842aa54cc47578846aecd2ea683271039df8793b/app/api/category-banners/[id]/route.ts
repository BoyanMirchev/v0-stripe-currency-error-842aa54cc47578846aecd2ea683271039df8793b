import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await sql`SELECT * FROM category_banners WHERE id = ${parseInt(id)}`
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching category banner:", error)
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      category_type,
      category_id,
      title,
      subtitle,
      image_url,
      mobile_image_url,
      link_url,
      link_text,
      is_active,
      display_order,
      start_date,
      end_date,
    } = body

    const result = await sql`
      UPDATE category_banners SET
        category_type = ${category_type},
        category_id = ${category_id || null},
        title = ${title || null},
        subtitle = ${subtitle || null},
        image_url = ${image_url},
        mobile_image_url = ${mobile_image_url || null},
        link_url = ${link_url || null},
        link_text = ${link_text || 'Научи повече'},
        is_active = ${is_active !== false},
        display_order = ${display_order || 0},
        start_date = ${start_date || null},
        end_date = ${end_date || null},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating category banner:", error)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM category_banners WHERE id = ${parseInt(id)}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category banner:", error)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
