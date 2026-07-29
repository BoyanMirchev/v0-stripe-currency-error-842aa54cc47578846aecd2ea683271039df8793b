import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT * FROM equipment_categories WHERE id = ${id}
    `

    if (result.length === 0) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    const category = result[0]

    // If it has a parent, get the parent info
    let parent = null
    if (category.parent_id) {
      const parents = await sql`
        SELECT id, name FROM equipment_categories 
        WHERE id = ${category.parent_id} AND is_active = true
        LIMIT 1
      `
      if (parents.length > 0) {
        parent = parents[0]
      }
    }

    return Response.json({ ...category, parent })
  } catch (error) {
    console.error("Error fetching equipment category:", error)
    return Response.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, icon, display_order, is_active, images, parent_id } = body

    const imagesArray = Array.isArray(images) ? images : []

    const result = await sql`
      UPDATE equipment_categories 
      SET 
        name = ${name},
        description = ${description || null},
        icon = ${icon || null},
        display_order = ${display_order || 0},
        is_active = ${is_active !== false},
        images = ${imagesArray},
        parent_id = ${parent_id || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return Response.json({ error: "Category not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating equipment category:", error)
    return Response.json(
      {
        error: "Failed to update category",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if category is in use
    const inUse = await sql`
      SELECT COUNT(*) as count FROM equipment WHERE category_id = ${id}
    `

    if (inUse[0].count > 0) {
      return Response.json({ error: "Cannot delete category that is in use by equipment items" }, { status: 400 })
    }

    await sql`DELETE FROM equipment_categories WHERE id = ${id}`

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting equipment category:", error)
    return Response.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
