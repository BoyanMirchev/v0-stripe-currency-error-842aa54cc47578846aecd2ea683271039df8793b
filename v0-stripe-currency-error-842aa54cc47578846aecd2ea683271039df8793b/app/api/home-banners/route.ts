import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const banners = await sql`
      SELECT * FROM home_banners 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error fetching home banners:", error)
    return NextResponse.json({ error: "Failed to fetch home banners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { image_url, alt_text, link_url, display_order, is_active, is_mobile } = body

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      INSERT INTO home_banners (image_url, alt_text, link_url, display_order, is_active, is_mobile)
      VALUES (${image_url}, ${alt_text || ""}, ${link_url || ""}, ${display_order || 0}, ${is_active !== false}, ${is_mobile || false})
      RETURNING *
    `

    revalidatePath("/")

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating home banner:", error)
    return NextResponse.json({ error: "Failed to create home banner" }, { status: 500 })
  }
}
