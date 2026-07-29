import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const prices = await sql`
      SELECT id, metal_type, purity, purity_label, price_per_gram, display_order, is_active, created_at, updated_at
      FROM metal_prices
      WHERE is_active = true
      ORDER BY metal_type, display_order
    `
    return NextResponse.json(prices)
  } catch (error) {
    console.error("Error fetching metal prices:", error)
    return NextResponse.json({ error: "Failed to fetch metal prices" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, price_per_gram } = await request.json()

    if (!id || price_per_gram === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      UPDATE metal_prices
      SET price_per_gram = ${price_per_gram}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating metal price:", error)
    return NextResponse.json({ error: "Failed to update metal price" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { metal_type, purity, purity_label, price_per_gram, display_order } = await request.json()

    if (!metal_type || !purity || !purity_label || price_per_gram === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO metal_prices (metal_type, purity, purity_label, price_per_gram, display_order)
      VALUES (${metal_type}, ${purity}, ${purity_label}, ${price_per_gram}, ${display_order || 0})
      ON CONFLICT (metal_type, purity) DO UPDATE SET
        purity_label = EXCLUDED.purity_label,
        price_per_gram = EXCLUDED.price_per_gram,
        display_order = EXCLUDED.display_order,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating metal price:", error)
    return NextResponse.json({ error: "Failed to create metal price" }, { status: 500 })
  }
}
