import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT ss.*, sc.name as category 
      FROM silver_sales ss
      LEFT JOIN silver_categories sc ON ss.category_id = sc.id
      WHERE ss.id = ${Number.parseInt(id)}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Silver sale not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching silver sale:", error)
    return NextResponse.json({ error: "Failed to fetch silver sale" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log("[v0] Updating silver ID:", id)
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const promotions = body.promotions && Number(body.promotions) > 0 ? Number(body.promotions) : null

    const imagesArray = body.images && Array.isArray(body.images) ? body.images : []

    console.log("[v0] Promotions value:", promotions)
    console.log("[v0] Images array:", imagesArray)
    console.log("[v0] Category ID:", body.category_id)
    console.log("[v0] Subcategory ID:", body.subcategory_id)

    if (
      body.weight_grams === undefined ||
      body.weight_grams === null ||
      body.price_per_gram === undefined ||
      body.price_per_gram === null ||
      body.total_amount === undefined ||
      body.total_amount === null
    ) {
      return NextResponse.json(
        { error: "Missing required fields", details: "weight_grams, price_per_gram, and total_amount are required" },
        { status: 400 },
      )
    }

    const result = await sql`
      UPDATE silver_sales SET
        silver_type = ${body.silver_type || "Сребро 925"},
        weight_grams = ${Number(body.weight_grams)},
        purity_percentage = ${Number(body.purity_percentage) || 92.5},
        price_per_gram = ${Number(body.price_per_gram)},
        total_amount = ${Number(body.total_amount)},
        currency = ${body.currency || "лв"},
        description = ${body.description || null},
        status = ${body.status || "available"},
        notes = ${body.notes || null},
        images = ${imagesArray},
        promotions = ${promotions},
        store_id = ${body.store_id ? Number(body.store_id) : null},
        category_id = ${body.category_id ? Number(body.category_id) : null},
        subcategory_id = ${body.subcategory_id ? Number(body.subcategory_id) : null},
        seo_title = ${body.seo_title || null},
        seo_description = ${body.seo_description || null},
        seo_keywords = ${body.seo_keywords || null},
        updated_at = NOW()
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Silver sale not found" }, { status: 404 })
    }

    console.log("[v0] Silver updated successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating silver sale:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Failed to update silver sale",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const silverId = Number.parseInt(id)

    if (!Number.isInteger(silverId)) {
      return NextResponse.json({ error: "Invalid silver id" }, { status: 400 })
    }

    // Remove loose product references first so a foreign-key constraint can't
    // block the delete. Best-effort; won't fail if the table doesn't exist.
    try {
      await sql`DELETE FROM reviews WHERE product_id = ${silverId} AND product_type = 'silver'`
    } catch (e) {
      console.log("[v0] Skipping reviews cleanup:", e instanceof Error ? e.message : e)
    }
    try {
      await sql`DELETE FROM order_items WHERE product_id = ${silverId} AND product_type = 'silver'`
    } catch (e) {
      console.log("[v0] Skipping order_items cleanup:", e instanceof Error ? e.message : e)
    }

    const result = await sql`DELETE FROM silver_sales WHERE id = ${silverId} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Silver sale not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error deleting silver sale:", error)
    const details = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to delete silver sale", details }, { status: 500 })
  }
}
