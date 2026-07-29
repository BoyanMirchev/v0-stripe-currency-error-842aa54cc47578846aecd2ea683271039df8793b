import { Suspense } from "react"
import { sql } from "@/lib/db"
import SilverPageClient from "./silver-page-client"

interface SilverSale {
  id: number
  silver_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  status: string
  notes: string | null
  image_url: string | null
  images: string[] | null
  created_at: string
  updated_at: string
  promotions: number | null
  subcategory: string
  category_id: number | null
  subcategory_id: number | null
  category_name: string | null
}

interface SilverCategory {
  id: number
  name: string
  slug: string
  sort_order: number
  parent_id: number | null
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

const DEFAULT_BANNER: CategoryBanner = {
  id: 0,
  image_url:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&h=400&fit=crop&crop=center",
  link_url: "#",
  title: "Сребро - специални оферти",
}

async function getSilver(): Promise<SilverSale[]> {
  try {
    const silver = await sql`
      SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
      FROM silver_sales ss
      LEFT JOIN silver_categories sc ON ss.category_id = sc.id
      ORDER BY ss.created_at DESC
    `
    return silver as SilverSale[]
  } catch (error) {
    console.error("[v0] Error fetching silver sales:", error)
    return []
  }
}

async function getSilverCategories(): Promise<SilverCategory[]> {
  try {
    const categories = await sql`
      SELECT 
        sc.*,
        parent.name as parent_name
      FROM silver_categories sc
      LEFT JOIN silver_categories parent ON sc.parent_id = parent.id
      WHERE sc.is_active = true
      ORDER BY sc.parent_id NULLS FIRST, sc.display_order ASC
    `
    return categories as SilverCategory[]
  } catch (error) {
    console.error("[v0] Error fetching silver categories:", error)
    return []
  }
}

async function getCategoryBanner(): Promise<CategoryBanner | null> {
  try {
    const banners = await sql`
      SELECT * FROM category_banners 
      WHERE is_active = true
      AND category_type = 'silver'
      AND (start_date IS NULL OR start_date <= NOW())
      AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY display_order ASC, created_at DESC 
      LIMIT 1
    `
    const banner = banners[0]
    if (banner && banner.image_url) {
      return banner as CategoryBanner
    }
    return DEFAULT_BANNER
  } catch (error) {
    console.error("[v0] Error fetching category banner:", error)
    return DEFAULT_BANNER
  }
}

export default async function SilverPage() {
  const [silver, categories, banner] = await Promise.all([
    getSilver(),
    getSilverCategories(),
    getCategoryBanner(),
  ])

  return (
    <Suspense fallback={null}>
      <SilverPageClient initialSilver={silver} initialCategories={categories} initialBanner={banner} />
    </Suspense>
  )
}
