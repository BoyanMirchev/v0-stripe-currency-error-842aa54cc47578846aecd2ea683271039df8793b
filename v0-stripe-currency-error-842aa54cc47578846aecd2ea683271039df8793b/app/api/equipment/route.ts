import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")
    const subcategoryId = searchParams.get("subcategory")
    const storeId = searchParams.get("store_id")
    const adminView = searchParams.get("admin") === "true"

    let equipment

    // Build base condition - for admin view, show all statuses, otherwise only available
    const statusCondition = adminView ? "" : "status = 'available' AND"

    if (subcategoryId) {
      // Filter by specific subcategory
      if (storeId) {
        equipment = adminView 
          ? await sql`
              SELECT * FROM equipment 
              WHERE subcategory_id = ${Number(subcategoryId)} AND store_id = ${Number(storeId)}
              ORDER BY created_at DESC
            `
          : await sql`
              SELECT * FROM equipment 
              WHERE status = 'available' AND subcategory_id = ${Number(subcategoryId)} AND store_id = ${Number(storeId)}
              ORDER BY created_at DESC
            `
      } else {
        equipment = adminView
          ? await sql`
              SELECT * FROM equipment 
              WHERE subcategory_id = ${Number(subcategoryId)}
              ORDER BY created_at DESC
            `
          : await sql`
              SELECT * FROM equipment 
              WHERE status = 'available' AND subcategory_id = ${Number(subcategoryId)}
              ORDER BY created_at DESC
            `
      }
    } else if (categoryId) {
      // Check if this categoryId is a main category or a subcategory
      const category = await sql`
        SELECT id, parent_id FROM equipment_categories 
        WHERE id = ${Number(categoryId)} AND is_active = true
        LIMIT 1
      `

      if (category.length > 0 && category[0].parent_id === null) {
        // It's a main category - get all products from this category and its subcategories
        const subcategories = await sql`
          SELECT id FROM equipment_categories 
          WHERE parent_id = ${Number(categoryId)} AND is_active = true
        `
        const subcategoryIds = subcategories.map(s => s.id)

        if (subcategoryIds.length > 0) {
          if (storeId) {
            equipment = adminView
              ? await sql`
                  SELECT * FROM equipment 
                  WHERE (category_id = ${Number(categoryId)} OR subcategory_id = ANY(${subcategoryIds}))
                    AND store_id = ${Number(storeId)}
                  ORDER BY created_at DESC
                `
              : await sql`
                  SELECT * FROM equipment 
                  WHERE status = 'available' 
                    AND (category_id = ${Number(categoryId)} OR subcategory_id = ANY(${subcategoryIds}))
                    AND store_id = ${Number(storeId)}
                  ORDER BY created_at DESC
                `
          } else {
            equipment = adminView
              ? await sql`
                  SELECT * FROM equipment 
                  WHERE (category_id = ${Number(categoryId)} OR subcategory_id = ANY(${subcategoryIds}))
                  ORDER BY created_at DESC
                `
              : await sql`
                  SELECT * FROM equipment 
                  WHERE status = 'available' 
                    AND (category_id = ${Number(categoryId)} OR subcategory_id = ANY(${subcategoryIds}))
                  ORDER BY created_at DESC
                `
          }
        } else {
          if (storeId) {
            equipment = adminView
              ? await sql`
                  SELECT * FROM equipment 
                  WHERE category_id = ${Number(categoryId)} AND store_id = ${Number(storeId)}
                  ORDER BY created_at DESC
                `
              : await sql`
                  SELECT * FROM equipment 
                  WHERE status = 'available' AND category_id = ${Number(categoryId)} AND store_id = ${Number(storeId)}
                  ORDER BY created_at DESC
                `
          } else {
            equipment = adminView
              ? await sql`
                  SELECT * FROM equipment 
                  WHERE category_id = ${Number(categoryId)}
                  ORDER BY created_at DESC
                `
              : await sql`
                  SELECT * FROM equipment 
                  WHERE status = 'available' AND category_id = ${Number(categoryId)}
                  ORDER BY created_at DESC
                `
          }
        }
      } else if (category.length > 0 && category[0].parent_id !== null) {
        // It's a subcategory - filter by subcategory_id
        if (storeId) {
          equipment = adminView
            ? await sql`
                SELECT * FROM equipment 
                WHERE subcategory_id = ${Number(categoryId)} AND store_id = ${Number(storeId)}
                ORDER BY created_at DESC
              `
            : await sql`
                SELECT * FROM equipment 
                WHERE status = 'available' AND subcategory_id = ${Number(categoryId)} AND store_id = ${Number(storeId)}
                ORDER BY created_at DESC
              `
        } else {
          equipment = adminView
            ? await sql`
                SELECT * FROM equipment 
                WHERE subcategory_id = ${Number(categoryId)}
                ORDER BY created_at DESC
              `
            : await sql`
                SELECT * FROM equipment 
                WHERE status = 'available' AND subcategory_id = ${Number(categoryId)}
                ORDER BY created_at DESC
              `
        }
      } else {
        // Category not found, return all (with store filter if provided)
        if (storeId) {
          equipment = adminView
            ? await sql`
                SELECT * FROM equipment 
                WHERE store_id = ${Number(storeId)}
                ORDER BY created_at DESC
              `
            : await sql`
                SELECT * FROM equipment 
                WHERE status = 'available' AND store_id = ${Number(storeId)}
                ORDER BY created_at DESC
              `
        } else {
          equipment = adminView
            ? await sql`
                SELECT * FROM equipment 
                ORDER BY created_at DESC
              `
            : await sql`
                SELECT * FROM equipment 
                WHERE status = 'available'
                ORDER BY created_at DESC
              `
        }
      }
    } else {
      // No category filter, return all equipment (with store filter if provided)
      if (storeId) {
        equipment = adminView
          ? await sql`
              SELECT * FROM equipment 
              WHERE store_id = ${Number(storeId)}
              ORDER BY created_at DESC
            `
          : await sql`
              SELECT * FROM equipment 
              WHERE status = 'available' AND store_id = ${Number(storeId)}
              ORDER BY created_at DESC
            `
      } else {
        equipment = adminView
          ? await sql`
              SELECT * FROM equipment 
              ORDER BY created_at DESC
            `
          : await sql`
              SELECT * FROM equipment 
              WHERE status = 'available'
              ORDER BY created_at DESC
            `
      }
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    let categoryId = data.category_id
    if (!categoryId && data.category) {
      const categoryResult = await sql`
        SELECT id FROM equipment_categories 
        WHERE name = ${data.category} AND is_active = true
        LIMIT 1
      `
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id
      }
    }

    const result = await sql`
      INSERT INTO equipment (
        name, category, category_id, subcategory_id, brand, model, sku, price, condition, 
        image_url, images, description, specifications, 
        features, stock_quantity, location, status, store_id,
        seo_title, seo_description, seo_keywords
      )
      VALUES (
        ${data.name}, ${data.category}, ${categoryId || null}, ${data.subcategory_id || null}, 
        ${data.brand || null}, ${data.model || null}, ${data.sku || null},
        ${data.price}, ${data.condition || "Ново"}, ${data.image_url || null},
        ${data.images || []}, ${data.description || null}, 
        ${JSON.stringify(data.specifications || {})}, ${data.features || []},
        ${data.stock_quantity || 1}, ${data.location || "КЕШ Шумен"}, 
        ${data.status || "available"}, ${data.store_id ? Number(data.store_id) : null},
        ${data.seo_title || null}, ${data.seo_description || null}, ${data.seo_keywords || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating equipment:", error)
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 })
  }
}
