import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const carsResult = await sql`
      SELECT COUNT(*) as count
      FROM cars
      WHERE status = 'available'
    `
    const carsCount = Number(carsResult[0]?.count || 0)

    const categoriesResult = await sql`
      SELECT 
        ec.id,
        ec.name,
        ec.icon,
        ec.image,
        COUNT(e.id) as product_count
      FROM equipment_categories ec
      LEFT JOIN equipment e ON e.category_id = ec.id AND e.status = 'available'
      WHERE ec.is_active = true
      GROUP BY ec.id, ec.name, ec.icon, ec.image
      ORDER BY ec.display_order ASC, ec.name ASC
    `

    const categories = categoriesResult.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      image: cat.image,
      productCount: Number(cat.product_count || 0),
    }))

    const goldResult = await sql`
      SELECT COUNT(*) as count
      FROM gold_sales
      WHERE status = 'available'
    `
    const goldCount = Number(goldResult[0]?.count || 0)

    return NextResponse.json({
      carsCount,
      categories,
      goldCount,
    })
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return NextResponse.json({ error: "Failed to fetch menu data" }, { status: 500 })
  }
}
