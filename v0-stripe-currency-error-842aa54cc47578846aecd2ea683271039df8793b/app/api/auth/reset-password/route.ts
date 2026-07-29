import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Simple hash function (must match the one in login/register)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    // Validate input
    if (!email || !newPassword) {
      return NextResponse.json({ error: "Имейл и нова парола са задължителни" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Паролата трябва да бъде поне 6 символа" }, { status: 400 })
    }

    // Check if user exists
    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Потребител с този имейл не съществува" }, { status: 404 })
    }

    // Hash the new password
    const passwordHash = hashPassword(newPassword)

    // Update the password
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}
      WHERE email = ${email}
    `

    return NextResponse.json({ success: true, message: "Паролата е променена успешно" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Грешка при промяна на паролата" }, { status: 500 })
  }
}
