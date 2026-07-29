import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = neon(process.env.DATABASE_URL!)
    const banner = await sql`SELECT * FROM home_banners WHERE id = ${id}`

    if (banner.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json(banner[0])
  } catch (error) {
    console.error("Error fetching home banner:", error)
    return NextResponse.json({ error: "Failed to fetch home banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { image_url, alt_text, link_url, display_order, is_active, is_mobile } = body

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      UPDATE home_banners
      SET 
        image_url = ${image_url},
        alt_text = ${alt_text || ""},
        link_url = ${link_url || ""},
        display_order = ${display_order || 0},
        is_active = ${is_active !== false},
        is_mobile = ${is_mobile || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    revalidatePath("/")

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating home banner:", error)
    return NextResponse.json({ error: "Failed to update home banner" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`DELETE FROM home_banners WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    revalidatePath("/")

    return NextResponse.json({ message: "Banner deleted successfully" })
  } catch (error) {
    console.error("Error deleting home banner:", error)
    return NextResponse.json({ error: "Failed to delete home banner" }, { status: 500 })
  }
}
