import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const equipment = await sql`
      SELECT * FROM equipment WHERE id = ${id}
    `

    if (equipment.length === 0) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }

    return NextResponse.json(equipment[0])
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    console.log("[v0] Updating equipment with data:", data)

    const promotionValue = data.promotions && Number(data.promotions) > 0 ? Number(data.promotions) : null

    let categoryId = data.category_id
    if (!categoryId && data.category) {
      const categoryResult = await sql`
        SELECT id FROM equipment_categories 
        WHERE name = ${data.category} AND is_active = true
        LIMIT 1
      `
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id
      }
    }

    const specificationsValue =
      typeof data.specifications === "object" ? JSON.stringify(data.specifications) : data.specifications || "{}"

    const result = await sql`
      UPDATE equipment
      SET 
        name = ${data.name},
        category = ${data.category},
        category_id = ${categoryId || null},
        subcategory_id = ${data.subcategory_id || null},
        brand = ${data.brand || null},
        model = ${data.model || null},
        sku = ${data.sku || null},
        price = ${Number(data.price)},
        condition = ${data.condition || "Ново"},
        image_url = ${data.image_url || null},
        images = ${data.images || []},
        description = ${data.description || null},
        specifications = ${specificationsValue},
        features = ${data.features || []},
        stock_quantity = ${Number(data.stock_quantity) || 1},
        location = ${data.location || "КЕШ Шумен"},
        status = ${data.status || "available"},
        promotions = ${promotionValue},
        store_id = ${data.store_id ? Number(data.store_id) : null},
        seo_title = ${data.seo_title || null},
        seo_description = ${data.seo_description || null},
        seo_keywords = ${data.seo_keywords || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }

    console.log("[v0] Equipment updated successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating equipment:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to update equipment",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await sql`
      DELETE FROM equipment WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Equipment deleted successfully" })
  } catch (error) {
    console.error("Error deleting equipment:", error)
    return NextResponse.json({ error: "Failed to delete equipment" }, { status: 500 })
  }
}
