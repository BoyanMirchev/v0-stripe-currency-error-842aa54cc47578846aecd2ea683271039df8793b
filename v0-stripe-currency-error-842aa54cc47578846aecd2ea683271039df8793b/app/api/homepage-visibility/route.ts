import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT section_key, section_name, is_visible, display_order
      FROM homepage_section_visibility
      ORDER BY display_order ASC
    `
    
    if (result.length === 0) {
      // Return defaults if no settings exist
      return NextResponse.json({
        gold: true,
        equipment: true,
        cars: true
      })
    }
    
    // Convert to object format
    const settings: Record<string, boolean> = {}
    result.forEach((row: any) => {
      settings[row.section_key] = row.is_visible
    })
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("[v0] Error fetching section visibility:", error)
    // Return defaults on error
    return NextResponse.json({
      gold: true,
      equipment: true,
      cars: true
    })
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    
    // Update each section's visibility
    for (const [key, value] of Object.entries(body)) {
      await sql`
        INSERT INTO homepage_section_visibility (section_key, section_name, is_visible)
        VALUES (${key}, ${key === 'gold' ? 'Злато' : key === 'equipment' ? 'Техника' : 'Авто'}, ${value as boolean})
        ON CONFLICT (section_key) 
        DO UPDATE SET is_visible = ${value as boolean}, updated_at = CURRENT_TIMESTAMP
      `
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating section visibility:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
