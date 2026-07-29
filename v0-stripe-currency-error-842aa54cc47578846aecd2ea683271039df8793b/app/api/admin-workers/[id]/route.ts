import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET single admin worker
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await sql`
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
      WHERE aw.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching admin worker:", error)
    return NextResponse.json({ error: "Failed to fetch admin worker" }, { status: 500 })
  }
}

// PUT update admin worker
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if username already exists for another user
    const existing = await sql`
      SELECT id FROM admin_workers WHERE username = ${username} AND id != ${id}
    `
    
    if (existing.length > 0) {
      return NextResponse.json({ error: "Потребителското име вече съществува" }, { status: 400 })
    }

    // If password is provided, update it
    let result
    if (password && password.trim() !== '') {
      result = await sql`
        UPDATE admin_workers SET
          username = ${username},
          password_hash = ${password},
          first_name = ${first_name || null},
          last_name = ${last_name || null},
          email = ${email || null},
          phone = ${phone || null},
          role = ${role || 'worker'},
          store_id = ${store_id || null},
          is_active = ${is_active !== false},
          allowed_tabs = ${allowed_tabs || ['equipment', 'gold', 'cars']},
          hide_global_price = ${hide_global_price || false},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    } else {
      result = await sql`
        UPDATE admin_workers SET
          username = ${username},
          first_name = ${first_name || null},
          last_name = ${last_name || null},
          email = ${email || null},
          phone = ${phone || null},
          role = ${role || 'worker'},
          store_id = ${store_id || null},
          is_active = ${is_active !== false},
          allowed_tabs = ${allowed_tabs || ['equipment', 'gold', 'cars']},
          hide_global_price = ${hide_global_price || false},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    }

    if (result.length === 0) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating admin worker:", error)
    return NextResponse.json({ error: "Failed to update admin worker" }, { status: 500 })
  }
}

// DELETE admin worker
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Don't allow deleting the main admin
    const worker = await sql`
      SELECT role FROM admin_workers WHERE id = ${id}
    `
    
    if (worker.length > 0 && worker[0].role === 'admin') {
      // Check if this is the only admin
      const adminCount = await sql`
        SELECT COUNT(*) as count FROM admin_workers WHERE role = 'admin'
      `
      if (Number(adminCount[0].count) <= 1) {
        return NextResponse.json({ error: "Не може да изтриете единствения администратор" }, { status: 400 })
      }
    }

    const result = await sql`
      DELETE FROM admin_workers WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting admin worker:", error)
    return NextResponse.json({ error: "Failed to delete admin worker" }, { status: 500 })
  }
}
