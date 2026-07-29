import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateSearchVariants } from "@/lib/transliteration"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ cars: [], equipment: [], gold: [] })
    }

    const searchVariants = generateSearchVariants(query)
    const searchTerms = searchVariants.map((variant) => `%${variant}%`)

    const buildOrConditions = (fields: string[]) => {
      const conditions: string[] = []
      for (const field of fields) {
        for (const term of searchTerms) {
          conditions.push(`LOWER(${field}) LIKE '${term.replace(/'/g, "''")}'`)
        }
      }
      return conditions.join(" OR ")
    }

    // Search in cars table
    const carsCondition = buildOrConditions(["brand", "model", "CAST(year AS TEXT)"])
    const cars = await sql`
      SELECT 
        id, 
        brand, 
        model, 
        year, 
        price, 
        image_url,
        fuel_type,
        transmission,
        mileage
      FROM cars
      WHERE ${sql.unsafe(carsCondition)}
      ORDER BY created_at DESC
      LIMIT 5
    `

    // Search in equipment table
    const equipmentCondition = buildOrConditions(["name", "brand", "model", "category"])
    const equipment = await sql`
      SELECT 
        id, 
        name, 
        brand, 
        model,
        category,
        price, 
        image_url,
        condition
      FROM equipment
      WHERE ${sql.unsafe(equipmentCondition)}
      ORDER BY created_at DESC
      LIMIT 5
    `

    // Search in gold_sales table
    const goldCondition = buildOrConditions(["gold_type", "description"])
    const gold = await sql`
      SELECT 
        id, 
        gold_type, 
        weight_grams,
        purity_percentage,
        price_per_gram,
        total_amount,
        images,
        description
      FROM gold_sales
      WHERE ${sql.unsafe(goldCondition)}
      ORDER BY created_at DESC
      LIMIT 5
    `

    return NextResponse.json({
      cars: cars || [],
      equipment: equipment || [],
      gold: gold || [],
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search", cars: [], equipment: [], gold: [] }, { status: 500 })
  }
}
