import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const storeId = parseInt(id)

    if (isNaN(storeId)) {
      return NextResponse.json({ error: "Invalid store ID" }, { status: 400 })
    }

    // Fetch store info
    const storeResult = await sql`
      SELECT * FROM stores WHERE id = ${storeId}
    `

    if (storeResult.length === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const store = storeResult[0]

    // Fetch gold products for this store
    const goldProducts = await sql`
      SELECT 
        gs.*,
        gc.name as category_name,
        gc.slug as category_slug,
        'gold' as product_type
      FROM gold_sales gs
      LEFT JOIN gold_categories gc ON gs.category_id = gc.id
      WHERE gs.store_id = ${storeId}
      ORDER BY gs.created_at DESC
    `

    // Fetch equipment products for this store
    const equipmentProducts = await sql`
      SELECT 
        e.*,
        ec.name as category_name,
        'equipment' as product_type
      FROM equipment e
      LEFT JOIN equipment_categories ec ON e.category_id = ec.id
      WHERE e.store_id = ${storeId}
      ORDER BY e.created_at DESC
    `

    // Fetch cars for this store
    const carProducts = await sql`
      SELECT 
        c.*,
        'car' as product_type
      FROM cars c
      WHERE c.store_id = ${storeId}
      ORDER BY c.created_at DESC
    `

    // Fetch silver products for this store
    const silverProducts = await sql`
      SELECT 
        ss.*,
        sc.name as category_name,
        sc.slug as category_slug,
        'silver' as product_type
      FROM silver_sales ss
      LEFT JOIN silver_categories sc ON ss.category_id = sc.id
      WHERE ss.store_id = ${storeId}
      ORDER BY ss.created_at DESC
    `

    return NextResponse.json({
      store,
      products: {
        gold: goldProducts,
        silver: silverProducts,
        equipment: equipmentProducts,
        cars: carProducts,
        total: goldProducts.length + silverProducts.length + equipmentProducts.length + carProducts.length
      }
    })
  } catch (error) {
    console.error("[v0] Error fetching store products:", error)
    return NextResponse.json(
      { error: "Failed to fetch store products" },
      { status: 500 }
    )
  }
}
