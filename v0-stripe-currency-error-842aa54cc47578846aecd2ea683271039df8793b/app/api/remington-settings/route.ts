import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const settings = await sql`
      SELECT * FROM remington_settings
      ORDER BY id DESC
      LIMIT 1
    `

    if (settings.length === 0) {
      return NextResponse.json({
        title: "Стилизирай косата си с Remington AIRvive",
        image_url: "/remington-hair-dryer.jpg",
        button_link: "/products",
      })
    }

    return NextResponse.json(settings[0])
  } catch (error) {
    console.error("Error fetching Remington settings:", error)
    return NextResponse.json({ error: "Failed to fetch Remington settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { title, image_url, button_link } = body

    const result = await sql`
      UPDATE remington_settings
      SET 
        title = ${title},
        image_url = ${image_url},
        button_link = ${button_link},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM remington_settings ORDER BY id DESC LIMIT 1)
      RETURNING *
    `

    if (result.length === 0) {
      // If no row exists, insert one
      const insertResult = await sql`
        INSERT INTO remington_settings (title, image_url, button_link)
        VALUES (${title}, ${image_url}, ${button_link})
        RETURNING *
      `
      return NextResponse.json(insertResult[0])
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating Remington settings:", error)
    return NextResponse.json({ error: "Failed to update Remington settings" }, { status: 500 })
  }
}
