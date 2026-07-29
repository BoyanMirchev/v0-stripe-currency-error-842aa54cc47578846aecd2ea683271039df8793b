import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET all cars
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("store_id")

    let cars
    if (storeId) {
      cars = await sql`SELECT *, brand AS make FROM cars WHERE store_id = ${Number(storeId)} ORDER BY created_at DESC`
    } else {
      cars = await sql`SELECT *, brand AS make FROM cars ORDER BY created_at DESC`
    }
    return NextResponse.json(cars)
  } catch (error) {
    console.error("[v0] Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

// POST - Create new car
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
      store_id,
    } = body

    const result = await sql`
      INSERT INTO cars (
        brand, model, year, price, mileage, fuel_type, transmission, 
        color, engine_size, horsepower, doors, seats, condition, 
        description, image_url, images, location, status, store_id
      ) VALUES (
        ${brand}, ${model}, ${year}, ${price}, ${mileage}, ${fuel_type}, 
        ${transmission}, ${color}, ${engine_size}, ${horsepower}, ${doors}, 
        ${seats}, ${condition}, ${description}, ${image_url}, 
        ${images || []}, ${location || "КЕШ Шумен"}, ${status || "available"},
        ${store_id ? Number(store_id) : null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating car:", error)
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}
