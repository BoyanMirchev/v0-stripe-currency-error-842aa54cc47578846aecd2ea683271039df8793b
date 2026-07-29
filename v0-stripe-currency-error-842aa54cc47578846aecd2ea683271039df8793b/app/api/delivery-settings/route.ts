import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT 
        id,
        free_delivery_threshold,
        econt_office_price,
        econt_address_price,
        created_at,
        updated_at
      FROM delivery_settings 
      LIMIT 1
    `
    
    if (result.length === 0) {
      // Return defaults if no settings exist
      return NextResponse.json({
        free_delivery_threshold: 100,
        econt_office_price: 1.79,
        econt_address_price: 2.68
      })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching delivery settings:", error)
    // Return defaults on error
    return NextResponse.json({
      free_delivery_threshold: 100,
      econt_office_price: 1.79,
      econt_address_price: 2.68
    })
  }
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()
    
    const { free_delivery_threshold, econt_office_price, econt_address_price } = body
    
    // Check if a record exists
    const existing = await sql`SELECT id FROM delivery_settings LIMIT 1`
    
    if (existing.length > 0) {
      // Update existing record
      const result = await sql`
        UPDATE delivery_settings 
        SET 
          free_delivery_threshold = ${free_delivery_threshold},
          econt_office_price = ${econt_office_price},
          econt_address_price = ${econt_address_price},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    } else {
      // Insert new record
      const result = await sql`
        INSERT INTO delivery_settings (free_delivery_threshold, econt_office_price, econt_address_price)
        VALUES (${free_delivery_threshold}, ${econt_office_price}, ${econt_address_price})
        RETURNING *
      `
      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error("[v0] Error updating delivery settings:", error)
    return NextResponse.json({ error: "Failed to update delivery settings" }, { status: 500 })
  }
}
