import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  try {
    const categoryId = Number.parseInt(params.categoryId)

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    // Get category details
    const categoryResult = await sql`
      SELECT id, name, icon, image
      FROM equipment_categories
      WHERE id = ${categoryId} AND is_active = true
    `

    if (categoryResult.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const category = categoryResult[0]

    // Get products in this category grouped by brand
    const productsResult = await sql`
      SELECT 
        brand,
        model,
        id,
        name
      FROM equipment
      WHERE category_id = ${categoryId} AND status = 'available'
      ORDER BY brand ASC, model ASC
      LIMIT 50
    `

    // Group products by brand
    const brandGroups: Record<string, Array<{ id: number; name: string; model: string }>> = {}

    productsResult.forEach((product) => {
      const brand = product.brand || "Други"
      if (!brandGroups[brand]) {
        brandGroups[brand] = []
      }
      brandGroups[brand].push({
        id: product.id,
        name: product.name,
        model: product.model,
      })
    })

    return NextResponse.json({
      category,
      brandGroups,
    })
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json({ error: "Failed to fetch category products" }, { status: 500 })
  }
}
