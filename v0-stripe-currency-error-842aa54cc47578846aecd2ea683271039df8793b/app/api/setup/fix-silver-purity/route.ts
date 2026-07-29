import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Alter purity_percentage column from INTEGER to DECIMAL to support decimal values like 92.5
    // First, check if the column exists and its type
    const columnCheck = await sql`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'silver_sales' 
      AND column_name = 'purity_percentage'
    `
    
    if (columnCheck.length > 0 && columnCheck[0].data_type === 'integer') {
      // Alter the column type from INTEGER to DECIMAL
      // First convert existing values (925 -> 92.5) then change type
      await sql`
        ALTER TABLE silver_sales 
        ALTER COLUMN purity_percentage TYPE DECIMAL(10,2) 
        USING CASE 
          WHEN purity_percentage > 100 THEN purity_percentage / 10.0
          ELSE purity_percentage::DECIMAL(10,2)
        END
      `
      
      // Update default value
      await sql`
        ALTER TABLE silver_sales 
        ALTER COLUMN purity_percentage SET DEFAULT 92.5
      `
      
      return NextResponse.json({ 
        success: true, 
        message: "Silver purity_percentage column converted from INTEGER to DECIMAL successfully" 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Silver purity_percentage column is already DECIMAL or doesn't exist" 
    })
  } catch (error) {
    console.error("Error fixing silver purity_percentage column:", error)
    return NextResponse.json({ 
      error: "Failed to fix silver purity_percentage column",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
