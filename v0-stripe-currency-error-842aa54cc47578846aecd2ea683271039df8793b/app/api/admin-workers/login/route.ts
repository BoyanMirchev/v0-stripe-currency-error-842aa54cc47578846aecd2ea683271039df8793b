import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// POST login
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    const result = await sql`
      SELECT 
        aw.id,
        aw.username,
        aw.password_hash,
        aw.first_name,
        aw.last_name,
        aw.email,
        aw.phone,
        aw.role,
        aw.store_id,
        aw.is_active,
        aw.allowed_tabs,
        aw.hide_global_price,
        s.name as store_name
      FROM admin_workers aw
      LEFT JOIN stores s ON aw.store_id = s.id
      WHERE aw.username = ${username} AND aw.is_active = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Грешно потребителско име или парола" }, { status: 401 })
    }

    const worker = result[0]

    // Simple password check (in production, use bcrypt)
    if (worker.password_hash !== password) {
      return NextResponse.json({ error: "Грешно потребителско име или парола" }, { status: 401 })
    }

    // Don't return the password hash
    const { password_hash, ...workerData } = worker

    return NextResponse.json(workerData)
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Грешка при влизане" }, { status: 500 })
  }
}
