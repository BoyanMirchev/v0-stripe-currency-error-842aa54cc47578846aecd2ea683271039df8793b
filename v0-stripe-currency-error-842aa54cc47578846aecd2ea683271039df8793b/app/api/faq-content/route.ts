import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

// GET - Fetch FAQ content
export async function GET() {
  try {
    const result = await sql`
      SELECT 
        hero_title,
        hero_description,
        search_placeholder,
        contact_title,
        contact_subtitle,
        contact_button_text,
        contact_button_link,
        contact_phone,
        faq_categories
      FROM faq_content 
      WHERE id = 1
    `
    
    if (result.length === 0) {
      // Return default content if no record exists
      return NextResponse.json({
        hero_title: "Често задавани въпроси",
        hero_description: "Намерете отговори на най-често задаваните въпроси от нашите клиенти",
        search_placeholder: "Търсене в въпросите...",
        contact_title: "Не намерихте отговор?",
        contact_subtitle: "Свържете се с нашия екип за поддръжка",
        contact_button_text: "Свържете се с нас",
        contact_button_link: "/contact",
        contact_phone: "0700 123 456",
        faq_categories: [],
      })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching FAQ content:", error)
    return NextResponse.json(
      { error: "Failed to fetch FAQ content" },
      { status: 500 }
    )
  }
}

// PUT - Update FAQ content
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      hero_title,
      hero_description,
      search_placeholder,
      contact_title,
      contact_subtitle,
      contact_button_text,
      contact_button_link,
      contact_phone,
      faq_categories,
    } = body

    await sql`
      UPDATE faq_content 
      SET 
        hero_title = ${hero_title},
        hero_description = ${hero_description},
        search_placeholder = ${search_placeholder},
        contact_title = ${contact_title},
        contact_subtitle = ${contact_subtitle},
        contact_button_text = ${contact_button_text},
        contact_button_link = ${contact_button_link},
        contact_phone = ${contact_phone},
        faq_categories = ${JSON.stringify(faq_categories)}::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating FAQ content:", error)
    return NextResponse.json(
      { error: "Failed to update FAQ content" },
      { status: 500 }
    )
  }
}
