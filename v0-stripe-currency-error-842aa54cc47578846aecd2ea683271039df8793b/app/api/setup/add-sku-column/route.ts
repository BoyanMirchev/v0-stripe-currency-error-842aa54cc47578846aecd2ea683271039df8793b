import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Add sku column to equipment table if it doesn't exist
    await sql`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS sku VARCHAR(255) DEFAULT NULL
    `

    return NextResponse.json({ 
      success: true, 
      message: "SKU column added successfully" 
    })
  } catch (error) {
    console.error("Error adding SKU column:", error)
    return NextResponse.json({ 
      error: "Failed to add SKU column",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
