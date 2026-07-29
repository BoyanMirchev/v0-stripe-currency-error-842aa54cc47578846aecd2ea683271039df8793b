import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM about_page_content WHERE id = 1
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching about page content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const result = await sql`
      UPDATE about_page_content
      SET
        hero_subtitle = ${data.hero_subtitle},
        hero_title = ${data.hero_title},
        hero_description = ${data.hero_description},
        hero_first_letter = ${data.hero_first_letter},
        
        gold_section_title = ${data.gold_section_title},
        gold_section_description = ${data.gold_section_description},
        gold_section_highlight = ${data.gold_section_highlight},
        gold_section_image = ${data.gold_section_image},
        gold_section_image_caption = ${data.gold_section_image_caption},
        gold_section_button_text = ${data.gold_section_button_text},
        gold_section_button_link = ${data.gold_section_button_link},
        
        electronics_section_title = ${data.electronics_section_title},
        electronics_section_description = ${data.electronics_section_description},
        electronics_section_highlight = ${data.electronics_section_highlight},
        electronics_section_image = ${data.electronics_section_image},
        electronics_section_image_caption = ${data.electronics_section_image_caption},
        electronics_section_button_text = ${data.electronics_section_button_text},
        electronics_section_button_link = ${data.electronics_section_button_link},
        
        cars_section_title = ${data.cars_section_title},
        cars_section_description = ${data.cars_section_description},
        cars_section_highlight = ${data.cars_section_highlight},
        cars_section_image = ${data.cars_section_image},
        cars_section_image_caption = ${data.cars_section_image_caption},
        cars_section_button_text = ${data.cars_section_button_text},
        cars_section_button_link = ${data.cars_section_button_link},
        
        timeline_section_title = ${data.timeline_section_title},
        timeline_events = ${JSON.stringify(data.timeline_events)},
        timeline_image = ${data.timeline_image},
        
        stats_section_title = ${data.stats_section_title},
        stats_section_subtitle = ${data.stats_section_subtitle},
        stats = ${JSON.stringify(data.stats)},
        
        values_section_title = ${data.values_section_title},
        values_section_subtitle = ${data.values_section_subtitle},
        values = ${JSON.stringify(data.values)},
        
        cta_title = ${data.cta_title},
        cta_subtitle = ${data.cta_subtitle},
        cta_primary_button_text = ${data.cta_primary_button_text},
        cta_primary_button_link = ${data.cta_primary_button_link},
        cta_secondary_button_text = ${data.cta_secondary_button_text},
        cta_secondary_button_link = ${data.cta_secondary_button_link},
        
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating about page content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
