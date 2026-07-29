import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const DEFAULTS: Record<string, string> = {
  gold: "/gold-jewelry.jpg",
  silver: "/shimmering-silver.png",
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT metal_key, image_url
      FROM homepage_category_images
    `

    const settings: Record<string, string> = { ...DEFAULTS }
    result.forEach((row: any) => {
      if (row.image_url) {
        settings[row.metal_key] = row.image_url
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[v0] Error fetching homepage category images:", error)
    return NextResponse.json(DEFAULTS)
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    for (const key of ["gold", "silver"]) {
      if (typeof body[key] === "string") {
        await sql`
          INSERT INTO homepage_category_images (metal_key, image_url)
          VALUES (${key}, ${body[key]})
          ON CONFLICT (metal_key)
          DO UPDATE SET image_url = ${body[key]}, updated_at = CURRENT_TIMESTAMP
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating homepage category images:", error)
    return NextResponse.json({ error: "Failed to update images" }, { status: 500 })
  }
}
