import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 })
    }

    const products = []

    // Separate equipment and gold items
    const equipmentIds = items.filter((item) => item.type === "equipment").map((item) => item.id)
    const goldIds = items.filter((item) => item.type === "gold").map((item) => item.id)

    // Fetch equipment products
    if (equipmentIds.length > 0) {
      const equipmentProducts = await sql`
        SELECT 
          id, 
          name, 
          price, 
          image_url, 
          images,
          category,
          condition,
          brand,
          model,
          'equipment' as type
        FROM equipment 
        WHERE id = ANY(${equipmentIds})
      `

      equipmentProducts.forEach((product) => {
        const cartItem = items.find((item) => item.id === product.id && item.type === "equipment")
        products.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null),
          category: product.category,
          condition: product.condition,
          brand: product.brand,
          model: product.model,
          type: "equipment",
          quantity: cartItem?.quantity || 1,
          currency: "лв",
          selectedOptions: cartItem?.selectedOptions || {},
        })
      })
    }

    // Fetch gold products
    if (goldIds.length > 0) {
      const goldProducts = await sql`
        SELECT 
          id, 
          gold_type as name,
          total_amount as price,
          images,
          gold_type,
          weight_grams,
          purity_percentage,
          price_per_gram,
          currency,
          'gold' as type
        FROM gold_sales 
        WHERE id = ANY(${goldIds})
      `

      goldProducts.forEach((product) => {
        const cartItem = items.find((item) => item.id === product.id && item.type === "gold")
        products.push({
          id: product.id,
          name: `${product.gold_type} - ${product.weight_grams}г`,
          price: Number(product.price),
          image_url: product.images && product.images.length > 0 ? product.images[0] : null,
          category: product.gold_type,
          gold_type: product.gold_type,
          weight_grams: product.weight_grams,
          purity_percentage: product.purity_percentage,
          price_per_gram: product.price_per_gram,
          type: "gold",
          quantity: cartItem?.quantity || 1,
          currency: product.currency || "лв",
          selectedOptions: cartItem?.selectedOptions || {},
        })
      })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching cart products:", error)
    return NextResponse.json({ error: "Failed to fetch cart products" }, { status: 500 })
  }
}
