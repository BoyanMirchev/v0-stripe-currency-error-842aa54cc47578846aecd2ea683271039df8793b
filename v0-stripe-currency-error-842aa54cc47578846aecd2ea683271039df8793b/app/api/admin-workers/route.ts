import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET all admin workers
export async function GET() {
  try {
    const workers = await sql`
      SELECT 
        aw.id,
        aw.username,
        aw.first_name,
        aw.last_name,
        aw.email,
        aw.phone,
        aw.role,
        aw.store_id,
        aw.is_active,
        aw.allowed_tabs,
        aw.hide_global_price,
        aw.created_at,
        aw.updated_at,
        s.name as store_name
      FROM admin_workers aw
      LEFT JOIN stores s ON aw.store_id = s.id
      ORDER BY aw.created_at DESC
    `
    return NextResponse.json(workers)
  } catch (error) {
    console.error("Error fetching admin workers:", error)
    return NextResponse.json({ error: "Failed to fetch admin workers" }, { status: 500 })
  }
}

// POST create new admin worker
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      username, 
      password, 
      first_name, 
      last_name, 
      email, 
      phone, 
      role, 
      store_id, 
      is_active,
      allowed_tabs,
      hide_global_price 
    } = body

    // Check if username already exists
    const existing = await sql`
      SELECT id FROM admin_workers WHERE username = ${username}
    `
    
    if (existing.length > 0) {
      return NextResponse.json({ error: "Потребителското име вече съществува" }, { status: 400 })
    }

    // For simplicity, storing password as-is (in production, use bcrypt)
    const result = await sql`
      INSERT INTO admin_workers (
        username, 
        password_hash, 
        first_name, 
        last_name, 
        email, 
        phone, 
        role, 
        store_id, 
        is_active,
        allowed_tabs,
        hide_global_price
      )
      VALUES (
        ${username},
        ${password},
        ${first_name || null},
        ${last_name || null},
        ${email || null},
        ${phone || null},
        ${role || 'worker'},
        ${store_id || null},
        ${is_active !== false},
        ${allowed_tabs || ['equipment', 'gold', 'cars']},
        ${hide_global_price || false}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating admin worker:", error)
    return NextResponse.json({ error: "Failed to create admin worker" }, { status: 500 })
  }
}
