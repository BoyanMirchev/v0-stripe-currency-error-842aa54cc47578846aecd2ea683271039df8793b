import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Fetch all newsletter subscriptions
export async function GET() {
  try {
    const messages = await sql`
      SELECT id, email, subscribed_at, is_active
      FROM messages
      ORDER BY subscribed_at DESC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// POST - Add new newsletter subscription
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Невалиден имейл адрес" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO messages (email)
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE 
      SET is_active = true
      RETURNING id, email, subscribed_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding message:", error)
    return NextResponse.json({ error: "Грешка при абонамента" }, { status: 500 })
  }
}

// DELETE - Remove newsletter subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing message ID" }, { status: 400 })
    }

    await sql`
      DELETE FROM messages
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
