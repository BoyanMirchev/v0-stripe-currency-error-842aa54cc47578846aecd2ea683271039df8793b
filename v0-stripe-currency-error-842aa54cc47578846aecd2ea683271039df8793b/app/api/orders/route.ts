import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID е задължителен" }, { status: 400 })
    }

    const orders = await sql`
      SELECT 
        o.*,
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
      WHERE o.user_id = ${userId}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Грешка при зареждане на поръчките" }, { status: 500 })
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      guestEmail,
      guestFirstName,
      guestLastName,
      items,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      phone,
      notes,
      deliveryMethod,
      paymentMethod,
      deliveryCost,
      econtCity,
      econtOfficeName,
      econtOfficeAddress,
      storeName,
      storeAddress,
      country,
    } = body

    if ((!userId && !guestEmail) || !items || items.length === 0) {
      return NextResponse.json({ error: "Невалидни данни за поръчка" }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const [order] = await sql`
      INSERT INTO orders (
        user_id, 
        guest_email, 
        guest_first_name, 
        guest_last_name,
        total_amount, 
        shipping_address, 
        shipping_city, 
        shipping_postal_code, 
        phone, 
        notes,
        delivery_method,
        payment_method,
        delivery_cost,
        econt_city,
        econt_office_name,
        econt_office_address,
        store_name,
        store_address,
        country
      )
      VALUES (
        ${userId || null}, 
        ${guestEmail || null}, 
        ${guestFirstName || null}, 
        ${guestLastName || null},
        ${totalAmount}, 
        ${shippingAddress}, 
        ${shippingCity}, 
        ${shippingPostalCode}, 
        ${phone}, 
        ${notes},
        ${deliveryMethod || null},
        ${paymentMethod || null},
        ${deliveryCost || 0},
        ${econtCity || null},
        ${econtOfficeName || null},
        ${econtOfficeAddress || null},
        ${storeName || null},
        ${storeAddress || null},
        ${country || 'България'}
      )
      RETURNING *
    `

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id, product_type, product_id, product_name, product_image, quantity, price, weight_grams, original_price, has_promotion
        )
        VALUES (
          ${order.id}, 
          ${item.type}, 
          ${item.id}, 
          ${item.name}, 
          ${item.image}, 
          ${item.quantity}, 
          ${item.price},
          ${item.weight_grams || null},
          ${item.originalPrice || item.price},
          ${item.hasPromotion || false}
        )
      `
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Грешка при създаване на поръчка" }, { status: 500 })
  }
}
