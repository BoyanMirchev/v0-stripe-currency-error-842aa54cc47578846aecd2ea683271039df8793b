import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const templates = await sql`
      SELECT * FROM specification_templates 
      ORDER BY name ASC
    `
    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching specification templates:", error)
    return NextResponse.json({ error: "Failed to fetch specification templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO specification_templates (name)
      VALUES (${name.trim()})
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `

    // If nothing was inserted (conflict), fetch the existing one
    if (result.length === 0) {
      const existing = await sql`
        SELECT * FROM specification_templates WHERE name = ${name.trim()}
      `
      return NextResponse.json(existing[0], { status: 200 })
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating specification template:", error)
    return NextResponse.json({ error: "Failed to create specification template" }, { status: 500 })
  }
}
