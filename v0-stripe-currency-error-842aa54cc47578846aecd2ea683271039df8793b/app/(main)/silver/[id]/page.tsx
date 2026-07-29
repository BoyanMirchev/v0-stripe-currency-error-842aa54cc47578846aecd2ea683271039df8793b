import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import SilverDetailClient from "./silver-detail-client"

interface SilverSaleDetail {
  id: number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  silver_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  image_url: string | null
  images: string[] | null
  location: string | null
  status: string
  created_at: string
  promotions: number | null
  store_id: number | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  category?: string | null
}

interface Store {
  id: number
  name: string
  address: string
  city: string
  neighborhood: string | null
  working_hours: string
  image_url: string | null
  rating: number
  is_24_7: boolean
  latitude: number | null
  longitude: number | null
  phone: string | null
}

async function getSilver(id: string): Promise<SilverSaleDetail | null> {
  try {
    const result = await sql`
      SELECT ss.*, sc.name as category 
      FROM silver_sales ss
      LEFT JOIN silver_categories sc ON ss.category_id = sc.id
      WHERE ss.id = ${Number.parseInt(id)}
    `
    return (result[0] as SilverSaleDetail) || null
  } catch (error) {
    console.error("[v0] Error fetching silver sale:", error)
    return null
  }
}

async function getStore(storeId: number | null): Promise<Store | null> {
  if (!storeId) return null
  try {
    const result = await sql`SELECT * FROM stores WHERE id = ${storeId}`
    return (result[0] as Store) || null
  } catch (error) {
    console.error("[v0] Error fetching store:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const silver = await getSilver(id)
  if (!silver) {
    return { title: "КЕШ - Сребро" }
  }

  const title = silver.seo_title || `${silver.category ?? ""} ${silver.silver_type} - Сребро | КЕШ`.trim()
  const description =
    silver.seo_description ||
    silver.description ||
    `Купете ${silver.category ?? ""} ${silver.silver_type} на изгодна цена от КЕШ. Сребро с гарантирано качество.`
  const keywords =
    silver.seo_keywords ||
    `${silver.silver_type}, сребро, ${silver.category ?? ""}, инвестиционно сребро, КЕШ, бижута`
  const images =
    silver.images && silver.images.length > 0 ? silver.images : silver.image_url ? [silver.image_url] : []

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: images.length > 0 ? [images[0]] : undefined,
    },
  }
}

export default async function SilverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const silver = await getSilver(id)

  if (!silver) {
    notFound()
  }

  const store = await getStore(silver.store_id)

  return <SilverDetailClient silver={silver} initialStore={store} />
}
