import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const settings = await sql`SELECT * FROM upgrade_banner_settings WHERE is_active = true LIMIT 1`

    if (settings.length === 0) {
      return NextResponse.json({
        background_image_url: "",
        mobile_background_image_url: "",
        link_url: "/mobile-upgrade",
        is_active: true,
      })
    }

    return NextResponse.json(settings[0])
  } catch (error) {
    console.error("Error fetching upgrade banner settings:", error)
    return NextResponse.json({ error: "Failed to fetch upgrade banner settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { background_image_url, mobile_background_image_url, link_url } = body

    const sql = neon(process.env.DATABASE_URL!)

    // Update the first (and only) active settings record
    const result = await sql`
      UPDATE upgrade_banner_settings
      SET 
        background_image_url = ${background_image_url || ""},
        mobile_background_image_url = ${mobile_background_image_url || ""},
        link_url = ${link_url || "/mobile-upgrade"},
        updated_at = CURRENT_TIMESTAMP
      WHERE is_active = true
      RETURNING *
    `

    if (result.length === 0) {
      // If no record exists, create one
      const newResult = await sql`
        INSERT INTO upgrade_banner_settings (background_image_url, mobile_background_image_url, link_url, is_active)
        VALUES (${background_image_url || ""}, ${mobile_background_image_url || ""}, ${link_url || "/mobile-upgrade"}, true)
        RETURNING *
      `
      revalidatePath("/")
      return NextResponse.json(newResult[0])
    }

    revalidatePath("/")
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating upgrade banner settings:", error)
    return NextResponse.json({ error: "Failed to update upgrade banner settings" }, { status: 500 })
  }
}
