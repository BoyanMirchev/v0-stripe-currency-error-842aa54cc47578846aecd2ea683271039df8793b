import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function (must match the one in register)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email и парола са задължителни" }, { status: 400 })
    }

    // Hash password for comparison
    const passwordHash = hashPassword(password)

    // Find user
    const users = await sql`
      SELECT id, email, first_name, last_name, phone, password_hash
      FROM users
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Грешен имейл или парола" }, { status: 401 })
    }

    const dbUser = users[0]

    // Check password
    if (dbUser.password_hash !== passwordHash) {
      return NextResponse.json({ error: "Грешен имейл или парола" }, { status: 401 })
    }

    // Return user without password
    const user = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      phone: dbUser.phone,
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Грешка при вход" }, { status: 500 })
  }
}
