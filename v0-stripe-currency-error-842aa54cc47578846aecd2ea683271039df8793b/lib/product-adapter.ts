import type { Product } from "./data"

export function carToProduct(car: {
  id: number
  make: string
  model: string
  year: number
  price: number
  promotions?: number | null
  images?: string[]
  image_url?: string
}): Product {
  const images = car.images?.length ? car.images : car.image_url ? [car.image_url] : []

  return {
    id: car.id,
    slug: `${car.id}`,
    type: "equipment",
    image: images[0] || "/placeholder.svg",
    images,
    name: `${car.make} ${car.model}`,
    price: car.price.toString(),
    promotion: car.promotions || undefined,
    description: "",
    features: [],
    specifications: [],
  }
}

export function goldToProduct(gold: {
  id: number
  gold_type: string
  weight_grams: number
  total_amount: number
  promotions?: number | null
  images?: string[]
  image_url?: string
}): Product {
  const images =
    gold.images && Array.isArray(gold.images) && gold.images.length > 0
      ? gold.images
      : gold.image_url
        ? [gold.image_url]
        : []

  return {
    id: gold.id,
    slug: `${gold.id}`,
    type: "gold",
    image: images[0] || "/placeholder.svg",
    images,
    name: gold.gold_type,
    price: gold.total_amount.toString(),
    promotion: gold.promotions || undefined,
    description: "",
    features: [],
    specifications: [],
  }
}

export function equipmentToProduct(equipment: {
  id: number
  name: string
  brand?: string
  price?: number
  promotions?: number | null
  images?: string[]
  image_url?: string
}): Product {
  const images = equipment.images?.length ? equipment.images : equipment.image_url ? [equipment.image_url] : []

  return {
    id: equipment.id,
    slug: `${equipment.id}`,
    type: "equipment",
    image: images[0] || "/placeholder.svg",
    images,
    name: equipment.name,
    price: (equipment.price || 0).toString(),
    promotion: equipment.promotions || undefined,
    description: "",
    features: [],
    specifications: [],
  }
}
