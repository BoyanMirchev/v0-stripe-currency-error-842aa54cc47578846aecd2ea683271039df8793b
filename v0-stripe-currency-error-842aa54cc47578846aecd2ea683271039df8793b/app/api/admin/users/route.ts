import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        created_at,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id) as total_spent
      FROM users
      ORDER BY created_at DESC
    `

    return Response.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return Response.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
