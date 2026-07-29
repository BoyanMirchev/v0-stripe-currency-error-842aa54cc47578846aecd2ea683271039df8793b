import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Track order by order ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Номерът на поръчката е задължителен" }, { status: 400 })
    }

    const orders = await sql`
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.shipping_address,
        o.shipping_city,
        o.shipping_postal_code,
        o.delivery_method,
        o.payment_method,
        o.delivery_cost,
        o.econt_city,
        o.econt_office_name,
        o.econt_office_address,
        o.store_name,
        o.store_address,
        o.country,
        o.created_at,
        o.guest_first_name,
        o.guest_last_name,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_type', oi.product_type,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'quantity', oi.quantity,
            'price', oi.price,
            'weight_grams', oi.weight_grams
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ${orderId}
      GROUP BY o.id
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Поръчката не е намерена" }, { status: 404 })
    }

    return NextResponse.json(orders[0])
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json({ error: "Грешка при проследяване на поръчката" }, { status: 500 })
  }
}
