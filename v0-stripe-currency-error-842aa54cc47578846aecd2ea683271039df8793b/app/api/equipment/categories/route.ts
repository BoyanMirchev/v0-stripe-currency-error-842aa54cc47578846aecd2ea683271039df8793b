import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"
    const withSubcategories = searchParams.get("withSubcategories") === "true"

    // Get all categories with parent info
    const categories = await sql`
      SELECT 
        c.*,
        p.name as parent_name
      FROM equipment_categories c
      LEFT JOIN equipment_categories p ON c.parent_id = p.id
      ${includeInactive ? sql`` : sql`WHERE c.is_active = true`}
      ORDER BY c.display_order ASC, c.name ASC
    `

    if (withSubcategories) {
      // Structure categories with their subcategories
      const mainCategories = categories.filter((c: any) => !c.parent_id)
      const structured = mainCategories.map((main: any) => ({
        ...main,
        subcategories: categories.filter((c: any) => c.parent_id === main.id)
      }))
      return Response.json(structured)
    }

    return Response.json(categories)
  } catch (error) {
    console.error("Error fetching equipment categories:", error)
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, icon, display_order, is_active, images, parent_id } = body

    const imagesArray = Array.isArray(images) ? images : []

    const result = await sql`
      INSERT INTO equipment_categories (name, description, icon, display_order, is_active, images, parent_id)
      VALUES (
        ${name}, 
        ${description || null}, 
        ${icon || null}, 
        ${display_order || 0}, 
        ${is_active !== false}, 
        ${imagesArray},
        ${parent_id || null}
      )
      RETURNING *
    `

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating equipment category:", error)
    return Response.json({ error: "Failed to create category" }, { status: 500 })
  }
}
