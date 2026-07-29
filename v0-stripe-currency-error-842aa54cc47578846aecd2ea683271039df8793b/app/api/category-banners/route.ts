import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryType = searchParams.get("category_type")
    const categoryId = searchParams.get("category_id")

    let banners

    if (categoryType && categoryId) {
      const catIdNum = parseInt(categoryId)
      banners = await sql`
        SELECT * FROM category_banners 
        WHERE is_active = true
        AND category_type = ${categoryType}
        AND (category_id = ${catIdNum} OR category_id IS NULL)
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY display_order ASC, created_at DESC 
        LIMIT 1
      `
    } else if (categoryType) {
      banners = await sql`
        SELECT * FROM category_banners 
        WHERE is_active = true
        AND category_type = ${categoryType}
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY display_order ASC, created_at DESC 
        LIMIT 1
      `
    } else {
      banners = await sql`
        SELECT * FROM category_banners 
        WHERE is_active = true
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
        ORDER BY display_order ASC, created_at DESC 
        LIMIT 1
      `
    }

    return NextResponse.json(banners[0] || null)
  } catch (error) {
    console.error("Error fetching category banner:", error)
    return NextResponse.json(null)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      category_type,
      category_id,
      title,
      subtitle,
      image_url,
      mobile_image_url,
      link_url,
      link_text,
      is_active,
      display_order,
      start_date,
      end_date,
    } = body

    const result = await sql`
      INSERT INTO category_banners (
        category_type, category_id, title, subtitle, image_url, mobile_image_url,
        link_url, link_text, is_active, display_order, start_date, end_date
      ) VALUES (
        ${category_type}, ${category_id || null}, ${title || null}, ${subtitle || null},
        ${image_url}, ${mobile_image_url || null}, ${link_url || null},
        ${link_text || 'Научи повече'}, ${is_active !== false}, ${display_order || 0},
        ${start_date || null}, ${end_date || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating category banner:", error)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
