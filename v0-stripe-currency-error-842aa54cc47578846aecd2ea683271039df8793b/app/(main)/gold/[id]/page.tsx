import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import GoldDetailClient from "./gold-detail-client"

interface GoldSaleDetail {
  id: number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  gold_type: string
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

async function getGold(id: string): Promise<GoldSaleDetail | null> {
  try {
    const result = await sql`SELECT * FROM gold_sales WHERE id = ${Number.parseInt(id)}`
    return (result[0] as GoldSaleDetail) || null
  } catch (error) {
    console.error("[v0] Error fetching gold sale:", error)
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
  const gold = await getGold(id)
  if (!gold) {
    return { title: "КЕШ - Злато" }
  }

  const title = gold.seo_title || `${gold.gold_type} - Злато | КЕШ`
  const description =
    gold.seo_description ||
    gold.description ||
    `Купете ${gold.gold_type} на изгодна цена от КЕШ. Инвестиционно злато с гарантирано качество.`
  const keywords = gold.seo_keywords || `${gold.gold_type}, злато, инвестиционно злато, КЕШ, бижута`
  const images =
    gold.images && gold.images.length > 0 ? gold.images : gold.image_url ? [gold.image_url] : []

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

export default async function GoldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gold = await getGold(id)

  if (!gold) {
    notFound()
  }

  const store = await getStore(gold.store_id)

  return <GoldDetailClient gold={gold} initialStore={store} />
}
