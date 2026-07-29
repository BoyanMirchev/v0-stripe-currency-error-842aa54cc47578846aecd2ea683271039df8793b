import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET single car
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)
    const result = await sql`SELECT *, brand AS make FROM cars WHERE id = ${id}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching car:", error)
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 })
  }
}

// PUT - Update car
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)
    const body = await request.json()

    console.log("[v0] Updating car ID:", id)
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      color,
      engine_size,
      horsepower,
      doors,
      seats,
      condition,
      description,
      image_url,
      images,
      location,
      status,
      promotions,
      store_id,
    } = body

    const promotionValue = promotions && Number(promotions) > 0 ? Number(promotions) : null

    console.log("[v0] Promotions value:", promotionValue)
    console.log("[v0] Store ID value:", store_id)

    const result = await sql`
      UPDATE cars SET
        brand = ${brand},
        model = ${model},
        year = ${year},
        price = ${price},
        mileage = ${mileage},
        fuel_type = ${fuel_type},
        transmission = ${transmission},
        color = ${color},
        engine_size = ${engine_size},
        horsepower = ${horsepower},
        doors = ${doors},
        seats = ${seats},
        condition = ${condition},
        description = ${description},
        image_url = ${image_url},
        images = ${images || []},
        location = ${location},
        status = ${status},
        promotions = ${promotionValue},
        store_id = ${store_id ? Number(store_id) : null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    console.log("[v0] Car updated successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating car:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Failed to update car",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE car
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)
    const result = await sql`DELETE FROM cars WHERE id = ${id} RETURNING *`

    if (result.length === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting car:", error)
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
  }
}
