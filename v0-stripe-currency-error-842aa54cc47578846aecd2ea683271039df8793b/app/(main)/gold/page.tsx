import { Suspense } from "react"
import { sql } from "@/lib/db"
import GoldPageClient from "./gold-page-client"

interface GoldSale {
  id: number
  gold_type: string
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
}

interface GoldCategory {
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
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2899%29-l6ymgIf8VrwozO8ldsszndnVrjtV9k.jpeg",
  link_url: "#",
  title: "Злато - специални оферти",
}

async function getGold(): Promise<GoldSale[]> {
  try {
    const gold = await sql`
      SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
      FROM gold_sales gs
      LEFT JOIN gold_categories gc ON gs.category_id = gc.id
      ORDER BY gs.created_at DESC
    `
    return gold as GoldSale[]
  } catch (error) {
    console.error("[v0] Error fetching gold sales:", error)
    return []
  }
}

async function getGoldCategories(): Promise<GoldCategory[]> {
  try {
    const categories = await sql`
      SELECT 
        gc.*,
        parent.name as parent_name
      FROM gold_categories gc
      LEFT JOIN gold_categories parent ON gc.parent_id = parent.id
      WHERE gc.is_active = true
      ORDER BY gc.parent_id NULLS FIRST, gc.display_order ASC
    `
    return categories as GoldCategory[]
  } catch (error) {
    console.error("[v0] Error fetching gold categories:", error)
    return []
  }
}

async function getCategoryBanner(): Promise<CategoryBanner | null> {
  try {
    const banners = await sql`
      SELECT * FROM category_banners 
      WHERE is_active = true
      AND category_type = 'gold'
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

export default async function GoldPage() {
  const [gold, categories, banner] = await Promise.all([
    getGold(),
    getGoldCategories(),
    getCategoryBanner(),
  ])

  return (
    <Suspense fallback={null}>
      <GoldPageClient initialGold={gold} initialCategories={categories} initialBanner={banner} />
    </Suspense>
  )
}
