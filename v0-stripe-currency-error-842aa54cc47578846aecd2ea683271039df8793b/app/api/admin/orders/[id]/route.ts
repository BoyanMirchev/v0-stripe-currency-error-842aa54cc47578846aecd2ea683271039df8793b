import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()
    const orderId = Number.parseInt(id)

    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
    `

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return Response.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const orderId = Number.parseInt(id)

    // First delete order items
    await sql`
      DELETE FROM order_items
      WHERE order_id = ${orderId}
    `

    // Then delete the order
    await sql`
      DELETE FROM orders
      WHERE id = ${orderId}
    `

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return Response.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
