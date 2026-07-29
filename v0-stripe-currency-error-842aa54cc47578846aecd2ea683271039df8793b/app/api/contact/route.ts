import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Моля, попълнете всички задължителни полета" }, { status: 400 })
    }

    // Insert contact message into database
    await sql`
      INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
      VALUES (${firstName}, ${lastName}, ${email}, ${phone || null}, ${subject || null}, ${message})
    `

    return NextResponse.json({ success: true, message: "Съобщението е изпратено успешно" })
  } catch (error) {
    console.error("Error creating contact message:", error)
    return NextResponse.json({ error: "Грешка при изпращане на съобщението" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const messages = await sql`
      SELECT * FROM contact_messages
      ORDER BY created_at DESC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Грешка при зареждане на съобщенията" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID е задължително" }, { status: 400 })
    }

    await sql`
      UPDATE contact_messages
      SET is_read = true
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating contact message:", error)
    return NextResponse.json({ error: "Грешка при актуализиране на съобщението" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID е задължително" }, { status: 400 })
    }

    await sql`
      DELETE FROM contact_messages
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "Грешка при изтриване на съобщението" }, { status: 500 })
  }
}
