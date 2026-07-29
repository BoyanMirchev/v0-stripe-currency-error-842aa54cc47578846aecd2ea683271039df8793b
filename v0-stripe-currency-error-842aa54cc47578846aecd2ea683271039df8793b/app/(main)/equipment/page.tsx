import { Suspense } from "react"
import { sql } from "@/lib/db"
import EquipmentPageClient from "./equipment-page-client"

interface Equipment {
  id: number
  name: string
  description: string | null
  price: number
  category_id: number
  image_url: string | null
  brand: string | null
  condition: string | null
  location: string | null
  store: string | null
  has_warranty: boolean | null
  created_at: string
  promotions: number | null
  specifications: any
}

interface DynamicFilters {
  conditions: string[]
  locations: string[]
  stores: string[]
  conditionCounts: Record<string, number>
  locationCounts: Record<string, number>
  storeCounts: Record<string, number>
  specFilters: Record<string, { values: string[]; counts: Record<string, number> }>
}

interface CategoryBanner {
  id: number
  image_url: string
  mobile_image_url?: string
  link_url?: string
  link_text?: string
  title?: string
  subtitle?: string
}

interface CategoryInfo {
  name: string
  parentName?: string
  parentId?: number
}

const EMPTY_FILTERS: DynamicFilters = {
  conditions: [],
  locations: [],
  stores: [],
  conditionCounts: {},
  locationCounts: {},
  storeCounts: {},
  specFilters: {},
}

// Resolve the set of category ids (main category + its subcategories, or a single subcategory)
async function resolveCategoryValues(categoryParam: string | null): Promise<number[]> {
  if (!categoryParam) return []
  const category = await sql`
    SELECT id, parent_id FROM equipment_categories 
    WHERE id = ${Number(categoryParam)} AND is_active = true
    LIMIT 1
  `
  if (category.length === 0) return []
  if (category[0].parent_id === null) {
    const subcategories = await sql`
      SELECT id FROM equipment_categories 
      WHERE parent_id = ${Number(categoryParam)} AND is_active = true
    `
    return [Number(categoryParam), ...subcategories.map((s: { id: number }) => s.id)]
  }
  return [Number(categoryParam)]
}

async function getEquipment(categoryParam: string | null): Promise<Equipment[]> {
  try {
    const categoryValues = await resolveCategoryValues(categoryParam)
    let equipment
    if (categoryValues.length > 0) {
      equipment = await sql`
        SELECT * FROM equipment 
        WHERE status = 'available' 
          AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
        ORDER BY created_at DESC
      `
    } else {
      equipment = await sql`
        SELECT * FROM equipment 
        WHERE status = 'available'
        ORDER BY created_at DESC
      `
    }
    return equipment as Equipment[]
  } catch (error) {
    console.error("[v0] Error fetching equipment:", error)
    return []
  }
}

async function getDynamicFilters(categoryParam: string | null): Promise<DynamicFilters> {
  try {
    const categoryValues = await resolveCategoryValues(categoryParam)
    const hasCat = categoryValues.length > 0

    const conditions = hasCat
      ? await sql`
          SELECT DISTINCT condition FROM equipment 
          WHERE status = 'available' AND condition IS NOT NULL AND condition != ''
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          ORDER BY condition`
      : await sql`
          SELECT DISTINCT condition FROM equipment 
          WHERE status = 'available' AND condition IS NOT NULL AND condition != ''
          ORDER BY condition`

    const locations = hasCat
      ? await sql`
          SELECT DISTINCT location FROM equipment 
          WHERE status = 'available' AND location IS NOT NULL AND location != ''
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          ORDER BY location`
      : await sql`
          SELECT DISTINCT location FROM equipment 
          WHERE status = 'available' AND location IS NOT NULL AND location != ''
          ORDER BY location`

    const conditionCounts = hasCat
      ? await sql`
          SELECT condition, COUNT(*) as count FROM equipment 
          WHERE status = 'available' AND condition IS NOT NULL
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          GROUP BY condition`
      : await sql`
          SELECT condition, COUNT(*) as count FROM equipment 
          WHERE status = 'available' AND condition IS NOT NULL
          GROUP BY condition`

    const locationCounts = hasCat
      ? await sql`
          SELECT location, COUNT(*) as count FROM equipment 
          WHERE status = 'available' AND location IS NOT NULL
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          GROUP BY location`
      : await sql`
          SELECT location, COUNT(*) as count FROM equipment 
          WHERE status = 'available' AND location IS NOT NULL
          GROUP BY location`

    const conditionCountsObj: Record<string, number> = {}
    conditionCounts.forEach((row: { condition: string; count: string }) => {
      conditionCountsObj[row.condition] = parseInt(row.count)
    })

    const locationCountsObj: Record<string, number> = {}
    locationCounts.forEach((row: { location: string; count: string }) => {
      locationCountsObj[row.location] = parseInt(row.count)
    })

    const equipmentWithSpecs = hasCat
      ? await sql`
          SELECT specifications FROM equipment 
          WHERE status = 'available' AND specifications IS NOT NULL
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))`
      : await sql`
          SELECT specifications FROM equipment 
          WHERE status = 'available' AND specifications IS NOT NULL`

    const specFilters: Record<string, { values: string[]; counts: Record<string, number> }> = {}
    equipmentWithSpecs.forEach((item: { specifications: any }) => {
      if (!item.specifications) return
      let specs: Array<{ name?: string; key?: string; value?: string }> = []
      if (Array.isArray(item.specifications)) {
        specs = item.specifications
      } else if (typeof item.specifications === "object") {
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
    Object.keys(specFilters).forEach((specName) => {
      specFilters[specName].values.sort()
    })

    return {
      conditions: conditions.map((c: { condition: string }) => c.condition),
      locations: locations.map((l: { location: string }) => l.location),
      stores: [],
      conditionCounts: conditionCountsObj,
      locationCounts: locationCountsObj,
      storeCounts: {},
      specFilters,
    }
  } catch (error) {
    console.error("[v0] Error fetching equipment filters:", error)
    return EMPTY_FILTERS
  }
}

async function getCategoryBanner(): Promise<CategoryBanner | null> {
  try {
    const banners = await sql`
      SELECT * FROM category_banners 
      WHERE is_active = true
      AND category_type = 'equipment'
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY display_order ASC, created_at DESC 
      LIMIT 1
    `
    return (banners[0] as CategoryBanner) || null
  } catch (error) {
    console.error("[v0] Error fetching category banner:", error)
    return null
  }
}

async function getCategoryInfo(categoryParam: string | null): Promise<CategoryInfo | null> {
  if (!categoryParam) return null
  try {
    const result = await sql`
      SELECT * FROM equipment_categories WHERE id = ${Number(categoryParam)}
    `
    if (result.length === 0) return null
    const category = result[0]
    let parent: { id: number; name: string } | null = null
    if (category.parent_id) {
      const parents = await sql`
        SELECT id, name FROM equipment_categories 
        WHERE id = ${category.parent_id} AND is_active = true
        LIMIT 1
      `
      if (parents.length > 0) parent = parents[0] as { id: number; name: string }
    }
    return {
      name: category.name,
      parentName: parent?.name,
      parentId: parent?.id,
    }
  } catch (error) {
    console.error("[v0] Error fetching category info:", error)
    return null
  }
}

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = null } = await searchParams

  const [equipment, filters, banner, categoryInfo] = await Promise.all([
    getEquipment(category),
    getDynamicFilters(category),
    getCategoryBanner(),
    getCategoryInfo(category),
  ])

  return (
    <Suspense fallback={null}>
      <EquipmentPageClient
        key={category ?? "all"}
        initialEquipment={equipment}
        initialFilters={filters}
        initialBanner={banner}
        initialCategoryInfo={categoryInfo}
      />
    </Suspense>
  )
}
