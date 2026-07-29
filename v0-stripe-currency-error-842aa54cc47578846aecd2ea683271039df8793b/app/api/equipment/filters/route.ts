import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")

    // Build where clause for category filtering
    let categoryValues: number[] = []

    if (categoryId) {
      // Check if it's a main category or subcategory
      const category = await sql`
        SELECT id, parent_id FROM equipment_categories 
        WHERE id = ${Number(categoryId)} AND is_active = true
        LIMIT 1
      `

      if (category.length > 0 && category[0].parent_id === null) {
        // Main category - get subcategory IDs
        const subcategories = await sql`
          SELECT id FROM equipment_categories 
          WHERE parent_id = ${Number(categoryId)} AND is_active = true
        `
        const subcategoryIds = subcategories.map(s => s.id)
        categoryValues = [Number(categoryId), ...subcategoryIds]
      } else if (category.length > 0) {
        // Subcategory
        categoryValues = [Number(categoryId)]
      }
    }

    // Get unique conditions from available equipment
    let conditions
    if (categoryValues.length > 0) {
      conditions = await sql`
        SELECT DISTINCT condition 
        FROM equipment 
        WHERE status = 'available' 
          AND condition IS NOT NULL 
          AND condition != ''
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
        ORDER BY condition
      `
    } else {
      conditions = await sql`
        SELECT DISTINCT condition 
        FROM equipment 
        WHERE status = 'available' 
          AND condition IS NOT NULL 
          AND condition != ''
        ORDER BY condition
      `
    }

    // Get unique locations from available equipment
    let locations
    if (categoryValues.length > 0) {
      locations = await sql`
        SELECT DISTINCT location 
        FROM equipment 
        WHERE status = 'available' 
          AND location IS NOT NULL 
          AND location != ''
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
        ORDER BY location
      `
    } else {
      locations = await sql`
        SELECT DISTINCT location 
        FROM equipment 
        WHERE status = 'available' 
          AND location IS NOT NULL 
          AND location != ''
        ORDER BY location
      `
    }

    // Get count for each condition
    let conditionCounts
    if (categoryValues.length > 0) {
      conditionCounts = await sql`
        SELECT condition, COUNT(*) as count 
        FROM equipment 
        WHERE status = 'available' 
          AND condition IS NOT NULL
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
        GROUP BY condition
      `
    } else {
      conditionCounts = await sql`
        SELECT condition, COUNT(*) as count 
        FROM equipment 
        WHERE status = 'available' 
          AND condition IS NOT NULL
        GROUP BY condition
      `
    }

    // Get count for each location
    let locationCounts
    if (categoryValues.length > 0) {
      locationCounts = await sql`
        SELECT location, COUNT(*) as count 
        FROM equipment 
        WHERE status = 'available' 
          AND location IS NOT NULL
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
        GROUP BY location
      `
    } else {
      locationCounts = await sql`
        SELECT location, COUNT(*) as count 
        FROM equipment 
        WHERE status = 'available' 
          AND location IS NOT NULL
        GROUP BY location
      `
    }

    // Convert counts to objects
    const conditionCountsObj: Record<string, number> = {}
    conditionCounts.forEach((row: { condition: string; count: string }) => {
      conditionCountsObj[row.condition] = parseInt(row.count)
    })

    const locationCountsObj: Record<string, number> = {}
    locationCounts.forEach((row: { location: string; count: string }) => {
      locationCountsObj[row.location] = parseInt(row.count)
    })

    // Get specifications from equipment in category
    let equipmentWithSpecs
    if (categoryValues.length > 0) {
      equipmentWithSpecs = await sql`
        SELECT specifications 
        FROM equipment 
        WHERE status = 'available' 
          AND specifications IS NOT NULL
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
      `
    } else {
      equipmentWithSpecs = await sql`
        SELECT specifications 
        FROM equipment 
        WHERE status = 'available' 
          AND specifications IS NOT NULL
      `
    }

    // Extract unique spec names and their values
    const specFilters: Record<string, { values: string[]; counts: Record<string, number> }> = {}
    
    equipmentWithSpecs.forEach((item: { specifications: any }) => {
      if (!item.specifications) return
      
      let specs: Array<{ name?: string; key?: string; value?: string }> = []
      
      if (Array.isArray(item.specifications)) {
        specs = item.specifications
      } else if (typeof item.specifications === 'object') {
        specs = Object.entries(item.specifications).map(([key, value]) => ({ name: key, value: String(value) }))
      }
      
      specs.forEach((spec) => {
        const specName = spec.name || spec.key
        const specValue = spec.value
        
        if (specName && specValue) {
          if (!specFilters[specName]) {
            specFilters[specName] = { values: [], counts: {} }
          }
          
          if (!specFilters[specName].values.includes(specValue)) {
            specFilters[specName].values.push(specValue)
          }
          
          specFilters[specName].counts[specValue] = (specFilters[specName].counts[specValue] || 0) + 1
        }
      })
    })

    // Sort values within each spec filter
    Object.keys(specFilters).forEach(specName => {
      specFilters[specName].values.sort()
    })

    return NextResponse.json({
      conditions: conditions.map((c: { condition: string }) => c.condition),
      locations: locations.map((l: { location: string }) => l.location),
      stores: [],
      conditionCounts: conditionCountsObj,
      locationCounts: locationCountsObj,
      storeCounts: {},
      specFilters
    })
  } catch (error) {
    console.error("Error fetching equipment filters:", error)
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 })
  }
}
