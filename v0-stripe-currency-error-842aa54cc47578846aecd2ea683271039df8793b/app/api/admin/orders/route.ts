import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        o.id,
        o.user_id,
        o.guest_email,
        o.guest_first_name,
        o.guest_last_name,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.shipping_city,
        o.shipping_postal_code,
        o.phone,
        o.notes,
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
        o.updated_at,
        COALESCE(u.email, o.guest_email) as user_email,
        COALESCE(u.first_name, o.guest_first_name) as user_first_name,
        COALESCE(u.last_name, o.guest_last_name) as user_last_name,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_type', oi.product_type,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'quantity', oi.quantity,
            'price', oi.price,
            'weight_grams', oi.weight_grams,
            'original_price', oi.original_price,
            'has_promotion', oi.has_promotion
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.email, u.first_name, u.last_name
      ORDER BY o.created_at DESC
    `

    return Response.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
