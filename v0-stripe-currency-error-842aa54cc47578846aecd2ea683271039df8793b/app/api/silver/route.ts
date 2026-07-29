import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category_id")
    const storeId = searchParams.get("store_id")

    let silver
    if (categoryId && storeId) {
      silver = await sql`
        SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
        FROM silver_sales ss
        LEFT JOIN silver_categories sc ON ss.category_id = sc.id
        WHERE ss.category_id = ${categoryId} AND ss.store_id = ${Number(storeId)}
        ORDER BY ss.created_at DESC
      `
    } else if (categoryId) {
      silver = await sql`
        SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
        FROM silver_sales ss
        LEFT JOIN silver_categories sc ON ss.category_id = sc.id
        WHERE ss.category_id = ${categoryId}
        ORDER BY ss.created_at DESC
      `
    } else if (storeId) {
      silver = await sql`
        SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
        FROM silver_sales ss
        LEFT JOIN silver_categories sc ON ss.category_id = sc.id
        WHERE ss.store_id = ${Number(storeId)}
        ORDER BY ss.created_at DESC
      `
    } else {
      silver = await sql`
        SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
        FROM silver_sales ss
        LEFT JOIN silver_categories sc ON ss.category_id = sc.id
        ORDER BY ss.created_at DESC
      `
    }
    return NextResponse.json(silver)
  } catch (error) {
    console.error("[v0] Error fetching silver sales:", error)
    return NextResponse.json({ error: "Failed to fetch silver sales" }, { status: 500 })
  }
}

// PATCH - Update all silver products with new global price
export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { price_per_gram } = data

    if (!price_per_gram || price_per_gram <= 0) {
      return NextResponse.json(
        { error: "Invalid price_per_gram value" },
        { status: 400 }
      )
    }

    console.log("[v0] Updating all silver products with new price_per_gram:", price_per_gram)

    // Update all silver products: set price_per_gram and recalculate total_amount
    const result = await sql`
      UPDATE silver_sales 
      SET 
        price_per_gram = ${price_per_gram},
        total_amount = weight_grams * ${price_per_gram},
        updated_at = NOW()
      RETURNING *
    `

    console.log("[v0] Updated", result.length, "silver products")

    return NextResponse.json({
      success: true,
      updated_count: result.length,
      price_per_gram: price_per_gram,
      products: result
    })
  } catch (error) {
    console.error("[v0] Error updating silver prices:", error)
    return NextResponse.json(
      { error: "Failed to update silver prices" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("[v0] Creating silver with data:", JSON.stringify(data, null, 2))
    console.log("[v0] category_id:", data.category_id)
    console.log("[v0] subcategory_id:", data.subcategory_id)
    console.log("[v0] purity_percentage:", data.purity_percentage, "type:", typeof data.purity_percentage)

    const result = await sql`
      INSERT INTO silver_sales (
        silver_type, weight_grams, purity_percentage, price_per_gram, 
        total_amount, currency, description, status, notes, images, category_id, subcategory_id,
        seo_title, seo_description, seo_keywords
      )
      VALUES (
        ${data.silver_type || "Сребро 925"},
        ${data.weight_grams}, 
        ${data.purity_percentage || 92.5},
        ${data.price_per_gram}, 
        ${data.total_amount}, 
        ${data.currency || "лв"}, 
        ${data.description || null},
        ${data.status || "available"},
        ${data.notes || null},
        ${data.images || []},
        ${data.category_id || null},
        ${data.subcategory_id || null},
        ${data.seo_title || null},
        ${data.seo_description || null},
        ${data.seo_keywords || null}
      )
      RETURNING *
    `

    console.log("[v0] Silver created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating silver sale:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to create silver sale",
      details: errorMessage 
    }, { status: 500 })
  }
}
