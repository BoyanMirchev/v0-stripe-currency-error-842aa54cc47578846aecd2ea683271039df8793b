import type { MetadataRoute } from "next"
import { neon } from "@neondatabase/serverless"

const BASE_URL = "https://www.zkkesh.bg"

// Create the DB client lazily so the sitemap can still serve its static
// routes (and never 500 for crawlers) if the database is unreachable or the
// connection string is missing at request time.
function getSql() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null
  try {
    return neon(connectionString)
  } catch {
    return null
  }
}

// Revalidate the sitemap hourly so new products/categories get picked up
// without querying the database on every request.
export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]

function url(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

// Public, indexable static pages. Admin, auth, cart, checkout, compare,
// favorites, track-order, profile and API routes are intentionally excluded.
const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: SitemapEntry["changeFrequency"]
}> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  // Main product listings
  { path: "/equipment", priority: 0.9, changeFrequency: "daily" },
  { path: "/gold", priority: 0.9, changeFrequency: "daily" },
  { path: "/silver", priority: 0.9, changeFrequency: "daily" },
  { path: "/cars", priority: 0.9, changeFrequency: "daily" },
  // SEO landing pages
  { path: "/izkupuvane-zlato-i-srebro", priority: 0.9, changeFrequency: "daily" },
  { path: "/grafika-tseni-zlato-srebro", priority: 0.8, changeFrequency: "daily" },
  // Store locator
  { path: "/stores", priority: 0.7, changeFrequency: "weekly" },
  { path: "/brands", priority: 0.6, changeFrequency: "weekly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/news", priority: 0.6, changeFrequency: "weekly" },
  { path: "/advice", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/how-to-order", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  // Delivery / logistics info
  { path: "/delivery-online", priority: 0.4, changeFrequency: "monthly" },
  { path: "/delivery-store", priority: 0.4, changeFrequency: "monthly" },
  { path: "/pickup", priority: 0.4, changeFrequency: "monthly" },
  { path: "/transport", priority: 0.4, changeFrequency: "monthly" },
  { path: "/recycle", priority: 0.4, changeFrequency: "monthly" },
  { path: "/return-product", priority: 0.4, changeFrequency: "monthly" },
  { path: "/returns", priority: 0.4, changeFrequency: "monthly" },
  // Legal
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
]

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: url(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const dynamicEntries: MetadataRoute.Sitemap = []

  const sql = getSql()

  if (!sql) {
    console.error("[v0] sitemap: DATABASE_URL unavailable, returning static routes only")
    return staticEntries
  }

  // Equipment products — only publicly available ones (matches the storefront)
  try {
    const rows = await sql`
      SELECT id, created_at FROM equipment
      WHERE status = 'available'
      ORDER BY created_at DESC`
    for (const r of rows as Array<{ id: number; created_at: unknown }>) {
      dynamicEntries.push({
        url: url(`/equipment/${r.id}`),
        lastModified: toDate(r.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load equipment:", error)
  }

  // Gold products
  try {
    const rows = await sql`SELECT id, created_at FROM gold_sales ORDER BY created_at DESC`
    for (const r of rows as Array<{ id: number; created_at: unknown }>) {
      dynamicEntries.push({
        url: url(`/gold/${r.id}`),
        lastModified: toDate(r.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load gold:", error)
  }

  // Silver products
  try {
    const rows = await sql`SELECT id, created_at FROM silver_sales ORDER BY created_at DESC`
    for (const r of rows as Array<{ id: number; created_at: unknown }>) {
      dynamicEntries.push({
        url: url(`/silver/${r.id}`),
        lastModified: toDate(r.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load silver:", error)
  }

  // Cars
  try {
    const rows = await sql`SELECT id, created_at FROM cars ORDER BY created_at DESC`
    for (const r of rows as Array<{ id: number; created_at: unknown }>) {
      dynamicEntries.push({
        url: url(`/cars/${r.id}`),
        lastModified: toDate(r.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load cars:", error)
  }

  // Equipment categories — browsed at /equipment?category=<id> (canonical)
  try {
    const rows = await sql`SELECT id FROM equipment_categories WHERE is_active = true`
    for (const r of rows as Array<{ id: number }>) {
      dynamicEntries.push({
        url: url(`/equipment?category=${r.id}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load equipment categories:", error)
  }

  // Gold categories — browsed at /gold?category=<id>
  try {
    const rows = await sql`SELECT id FROM gold_categories WHERE is_active = true`
    for (const r of rows as Array<{ id: number }>) {
      dynamicEntries.push({
        url: url(`/gold?category=${r.id}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load gold categories:", error)
  }

  // Silver categories — browsed at /silver?category=<id>
  try {
    const rows = await sql`SELECT id FROM silver_categories WHERE is_active = true`
    for (const r of rows as Array<{ id: number }>) {
      dynamicEntries.push({
        url: url(`/silver?category=${r.id}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load silver categories:", error)
  }

  // Store detail pages (per-store product listing)
  try {
    const rows = await sql`SELECT id FROM stores ORDER BY id ASC`
    for (const r of rows as Array<{ id: number }>) {
      dynamicEntries.push({
        url: url(`/stores/${r.id}/products`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    }
  } catch (error) {
    console.error("[v0] sitemap: failed to load stores:", error)
  }

  // De-duplicate by URL (defensive)
  const seen = new Set<string>()
  const all: MetadataRoute.Sitemap = []
  for (const entry of [...staticEntries, ...dynamicEntries]) {
    if (seen.has(entry.url)) continue
    seen.add(entry.url)
    all.push(entry)
  }

  return all
}
