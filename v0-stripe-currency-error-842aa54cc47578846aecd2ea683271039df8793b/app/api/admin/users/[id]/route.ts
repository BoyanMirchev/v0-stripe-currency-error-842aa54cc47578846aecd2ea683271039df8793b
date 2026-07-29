import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // First, delete all orders associated with this user
    await sql`DELETE FROM orders WHERE user_id = ${userId}`

    // Then delete the user
    const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING id`

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    return Response.json({ success: true, deletedId: userId })
  } catch (error) {
    console.error("Error deleting user:", error)
    return Response.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
