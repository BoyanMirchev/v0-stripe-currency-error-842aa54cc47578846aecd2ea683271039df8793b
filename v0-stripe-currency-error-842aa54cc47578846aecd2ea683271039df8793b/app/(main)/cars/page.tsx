import { Suspense } from "react"
import { sql } from "@/lib/db"
import CarsPageClient from "./cars-page-client"

interface CarDetails {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color: string
  description: string | null
  image_url: string | null
  engine_size: string | null
  horsepower: number | null
  doors: number | null
  seats: number | null
  location: string | null
  status: string
  features: string | null
  created_at: string
  promotions: number | null
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
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=400&fit=crop&crop=center",
  link_url: "#",
  title: "Автомобили - специални оферти",
}

async function getCars(): Promise<CarDetails[]> {
  try {
    const cars = await sql`SELECT *, brand AS make FROM cars ORDER BY created_at DESC`
    return cars as CarDetails[]
  } catch (error) {
    console.error("[v0] Error fetching cars:", error)
    return []
  }
}

async function getCategoryBanner(): Promise<CategoryBanner | null> {
  try {
    const banners = await sql`
      SELECT * FROM category_banners 
      WHERE is_active = true
      AND category_type = 'cars'
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

export default async function CarsPage() {
  const [cars, banner] = await Promise.all([getCars(), getCategoryBanner()])

  return (
    <Suspense fallback={null}>
      <CarsPageClient initialCars={cars} initialBanner={banner} />
    </Suspense>
  )
}
