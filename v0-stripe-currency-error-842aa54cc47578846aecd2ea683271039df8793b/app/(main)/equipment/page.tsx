import { Suspense } from "react"
import type { Metadata } from "next"
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

interface CategorySeoStats {
  count: number
  brands: string[]
  minPrice: number | null
  maxPrice: number | null
  image: string | null
}

// Aggregate live data about the products inside a category so the SEO can be
// generated dynamically from real inventory (count, brands, price range).
async function getCategorySeoStats(categoryValues: number[]): Promise<CategorySeoStats> {
  const empty: CategorySeoStats = { count: 0, brands: [], minPrice: null, maxPrice: null, image: null }
  try {
    const hasCat = categoryValues.length > 0

    const totals = hasCat
      ? await sql`
          SELECT COUNT(*)::int AS count,
                 MIN(NULLIF(price, 0)) AS min_price,
                 MAX(price) AS max_price
          FROM equipment
          WHERE status = 'available'
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))`
      : await sql`
          SELECT COUNT(*)::int AS count,
                 MIN(NULLIF(price, 0)) AS min_price,
                 MAX(price) AS max_price
          FROM equipment
          WHERE status = 'available'`

    const brandRows = hasCat
      ? await sql`
          SELECT brand, COUNT(*) AS c FROM equipment
          WHERE status = 'available' AND brand IS NOT NULL AND brand != ''
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          GROUP BY brand ORDER BY c DESC LIMIT 6`
      : await sql`
          SELECT brand, COUNT(*) AS c FROM equipment
          WHERE status = 'available' AND brand IS NOT NULL AND brand != ''
          GROUP BY brand ORDER BY c DESC LIMIT 6`

    const imageRows = hasCat
      ? await sql`
          SELECT image_url FROM equipment
          WHERE status = 'available' AND image_url IS NOT NULL AND image_url != ''
            AND (category_id = ANY(${categoryValues}) OR subcategory_id = ANY(${categoryValues}))
          ORDER BY created_at DESC LIMIT 1`
      : []

    return {
      count: totals[0]?.count ?? 0,
      brands: brandRows.map((b: { brand: string }) => b.brand),
      minPrice: totals[0]?.min_price != null ? Number(totals[0].min_price) : null,
      maxPrice: totals[0]?.max_price != null ? Number(totals[0].max_price) : null,
      image: (imageRows[0] as { image_url: string } | undefined)?.image_url ?? null,
    }
  } catch (error) {
    console.error("[v0] Error fetching category SEO stats:", error)
    return empty
  }
}

function pluralBg(count: number, one: string, many: string): string {
  return count === 1 ? one : many
}

function formatEur(value: number): string {
  return `${Math.round(value).toLocaleString("bg-BG")} €`
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}): Promise<Metadata> {
  const { category = null } = await searchParams

  const [categoryInfo, categoryValues] = await Promise.all([
    getCategoryInfo(category),
    resolveCategoryValues(category),
  ])
  const stats = await getCategorySeoStats(categoryValues)

  const brandList = stats.brands.slice(0, 4)
  const hasPriceRange = stats.minPrice != null && stats.maxPrice != null && stats.maxPrice > 0

  let title: string
  let description: string
  let keywords: string

  if (categoryInfo?.name) {
    const name = categoryInfo.name
    const offers = `${stats.count} ${pluralBg(stats.count, "обява", "обяви")}`

    title = stats.count > 0 ? `${name} – ${offers} на топ цени` : `${name} – техника втора употреба и нова`

    const parts: string[] = []
    parts.push(
      stats.count > 0
        ? `Разгледайте ${stats.count} ${pluralBg(stats.count, "продукт", "продукта")} в категория „${name}“`
        : `Разгледайте категория „${name}“`,
    )
    if (categoryInfo.parentName) parts[0] += ` (${categoryInfo.parentName})`
    if (brandList.length > 0) parts.push(`Марки като ${brandList.join(", ")}`)
    if (hasPriceRange) {
      parts.push(
        stats.minPrice === stats.maxPrice
          ? `Цена ${formatEur(stats.maxPrice as number)}`
          : `Цени от ${formatEur(stats.minPrice as number)} до ${formatEur(stats.maxPrice as number)}`,
      )
    }
    parts.push("Изкупуване и продажба на техника — нова и втора употреба в КЕШ")
    description = parts.join(". ") + "."

    const kw = [
      name,
      `${name} цена`,
      `${name} втора употреба`,
      `${name} нова`,
      categoryInfo.parentName,
      ...brandList,
      "техника",
      "КЕШ",
    ].filter(Boolean)
    keywords = kw.join(", ")
  } else {
    const offers = `${stats.count} ${pluralBg(stats.count, "обява", "обяви")}`
    title = stats.count > 0 ? `Техника – ${offers}` : "Техника втора употреба и нова"
    const parts: string[] = [
      stats.count > 0
        ? `Разгледайте ${stats.count} ${pluralBg(stats.count, "продукт", "продукта")} в раздел Техника`
        : "Разгледайте раздел Техника",
    ]
    if (brandList.length > 0) parts.push(`Марки като ${brandList.join(", ")}`)
    parts.push("Електроника, инструменти, телефони и още — изкупуване и продажба в КЕШ")
    description = parts.join(". ") + "."
    keywords = ["техника", "електроника", "втора употреба", "изкупуване", ...brandList, "КЕШ"].join(", ")
  }

  const canonical = category ? `/equipment?category=${category}` : "/equipment"

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: stats.image ? [stats.image] : undefined,
    },
    twitter: {
      card: stats.image ? "summary_large_image" : "summary",
      title,
      description,
      images: stats.image ? [stats.image] : undefined,
    },
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
