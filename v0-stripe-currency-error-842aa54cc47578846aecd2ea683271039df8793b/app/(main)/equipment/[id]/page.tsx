import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { sql } from "@/lib/db"
import EquipmentDetailClient from "./equipment-detail-client"

interface Equipment {
  id: number
  name: string
  category: string
  brand: string
  model: string
  price: number | null
  condition: string
  stock_quantity: number
  description: string | null
  image_url: string | null
  images: string[] | null
  specifications: any
  location: string
  status: string
  created_at: string
  features: string[] | null
  promotions: number | null
  store_id: number | null
  sku: string | null
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

async function getEquipment(id: string): Promise<Equipment | null> {
  try {
    const result = await sql`SELECT * FROM equipment WHERE id = ${id}`
    return (result[0] as Equipment) || null
  } catch (error) {
    console.error("[v0] Error fetching equipment:", error)
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
  const equipment = await getEquipment(id)
  if (!equipment) {
    return { title: "КЕШ - Техника" }
  }

  const title = equipment.seo_title || `${equipment.name} - ${equipment.brand} ${equipment.model} | КЕШ`
  const description =
    equipment.seo_description ||
    equipment.description ||
    `Купете ${equipment.name} на изгодна цена от КЕШ. ${equipment.brand} ${equipment.model} - качество на достъпна цена.`
  const keywords =
    equipment.seo_keywords ||
    `${equipment.name}, ${equipment.brand}, ${equipment.model}, ${equipment.category}, техника, КЕШ`
  const images =
    equipment.images && equipment.images.length > 0
      ? equipment.images
      : equipment.image_url
        ? [equipment.image_url]
        : []

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

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const equipment = await getEquipment(id)

  if (!equipment) {
    notFound()
  }

  const store = await getStore(equipment.store_id)

  return <EquipmentDetailClient equipment={equipment} initialStore={store} />
}
