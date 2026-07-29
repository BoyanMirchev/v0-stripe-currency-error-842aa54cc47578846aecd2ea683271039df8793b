import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const banners = await sql`
      SELECT * FROM category_banners 
      ORDER BY category_type, display_order ASC, created_at DESC
    `
    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error fetching all category banners:", error)
    return NextResponse.json([])
  }
}
