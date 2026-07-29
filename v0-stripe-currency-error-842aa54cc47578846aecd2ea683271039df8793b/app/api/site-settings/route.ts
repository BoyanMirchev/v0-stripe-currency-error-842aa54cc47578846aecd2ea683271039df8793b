import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT 
        logo_url,
        logo_alt,
        logo_width,
        logo_height,
        favicon_url,
        apple_touch_icon,
        site_name
      FROM homepage_seo 
      LIMIT 1
    `
    
    if (result.length === 0) {
      // Return defaults if no settings exist
      return NextResponse.json({
        logo_url: "/kesh-logo.png",
        logo_alt: "КЕШ Logo",
        logo_width: 110,
        logo_height: 40,
        favicon_url: "/icon.svg",
        apple_touch_icon: "/apple-icon.png",
        site_name: "КЕШ"
      })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching site settings:", error)
    // Return defaults on error
    return NextResponse.json({
      logo_url: "/kesh-logo.png",
      logo_alt: "КЕШ Logo",
      logo_width: 110,
      logo_height: 40,
      favicon_url: "/icon.svg",
      apple_touch_icon: "/apple-icon.png",
      site_name: "КЕШ"
    })
  }
}
