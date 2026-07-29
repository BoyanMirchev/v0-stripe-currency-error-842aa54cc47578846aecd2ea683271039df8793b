import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function (in production, use bcrypt)
function hashPassword(password: string): string {
  // This is a placeholder - in production use bcrypt or similar
  return Buffer.from(password).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email и парола са задължителни" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Този имейл вече е регистриран" }, { status: 400 })
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Insert new user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES (${email}, ${passwordHash}, ${firstName || null}, ${lastName || null}, ${phone || null})
      RETURNING id, email, first_name, last_name, phone
    `

    const user = {
      id: result[0].id,
      email: result[0].email,
      firstName: result[0].first_name,
      lastName: result[0].last_name,
      phone: result[0].phone,
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Грешка при регистрация" }, { status: 500 })
  }
}
