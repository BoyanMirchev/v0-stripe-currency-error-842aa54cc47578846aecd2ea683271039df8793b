import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category_id")
    const storeId = searchParams.get("store_id")

    let gold
    if (categoryId && storeId) {
      gold = await sql`
        SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
        FROM gold_sales gs
        LEFT JOIN gold_categories gc ON gs.category_id = gc.id
        WHERE gs.category_id = ${categoryId} AND gs.store_id = ${Number(storeId)}
        ORDER BY gs.created_at DESC
      `
    } else if (categoryId) {
      gold = await sql`
        SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
        FROM gold_sales gs
        LEFT JOIN gold_categories gc ON gs.category_id = gc.id
        WHERE gs.category_id = ${categoryId}
        ORDER BY gs.created_at DESC
      `
    } else if (storeId) {
      gold = await sql`
        SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
        FROM gold_sales gs
        LEFT JOIN gold_categories gc ON gs.category_id = gc.id
        WHERE gs.store_id = ${Number(storeId)}
        ORDER BY gs.created_at DESC
      `
    } else {
      gold = await sql`
        SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
        FROM gold_sales gs
        LEFT JOIN gold_categories gc ON gs.category_id = gc.id
        ORDER BY gs.created_at DESC
      `
    }
    return NextResponse.json(gold)
  } catch (error) {
    console.error("[v0] Error fetching gold sales:", error)
    return NextResponse.json({ error: "Failed to fetch gold sales" }, { status: 500 })
  }
}

// PATCH - Update all gold products with new global price
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

    console.log("[v0] Updating all gold products with new price_per_gram:", price_per_gram)

    // Update all gold products: set price_per_gram and recalculate total_amount
    const result = await sql`
      UPDATE gold_sales 
      SET 
        price_per_gram = ${price_per_gram},
        total_amount = weight_grams * ${price_per_gram},
        updated_at = NOW()
      RETURNING *
    `

    console.log("[v0] Updated", result.length, "gold products")

    return NextResponse.json({
      success: true,
      updated_count: result.length,
      price_per_gram: price_per_gram,
      products: result
    })
  } catch (error) {
    console.error("[v0] Error updating gold prices:", error)
    return NextResponse.json(
      { error: "Failed to update gold prices" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("[v0] Creating gold with data:", JSON.stringify(data, null, 2))
    console.log("[v0] category_id:", data.category_id)
    console.log("[v0] subcategory_id:", data.subcategory_id)

    const result = await sql`
      INSERT INTO gold_sales (
        gold_type, weight_grams, purity_percentage, price_per_gram, 
        total_amount, currency, description, status, notes, images, category_id, subcategory_id,
        seo_title, seo_description, seo_keywords
      )
      VALUES (
        ${data.gold_type || "Жълто злато"},
        ${data.weight_grams}, 
        ${data.purity_percentage || 100},
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

    console.log("[v0] Gold created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating gold sale:", error)
    return NextResponse.json({ error: "Failed to create gold sale" }, { status: 500 })
  }
}
