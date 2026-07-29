import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")
    const productType = searchParams.get("productType")

    if (!productId || !productType) {
      return NextResponse.json({ error: "Missing productId or productType" }, { status: 400 })
    }

    const reviews = await sql`
      SELECT id, user_name, rating, comment, created_at
      FROM reviews
      WHERE product_id = ${Number.parseInt(productId)} AND product_type = ${productType}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productType, userName, userEmail, rating, comment } = body

    if (!productId || !productType || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO reviews (product_id, product_type, user_name, user_email, rating, comment)
      VALUES (${Number.parseInt(productId)}, ${productType}, ${userName || "Anonymous"}, ${userEmail}, ${rating}, ${comment})
      RETURNING id, user_name, rating, comment, created_at
    `

    return NextResponse.json({ review: result[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
