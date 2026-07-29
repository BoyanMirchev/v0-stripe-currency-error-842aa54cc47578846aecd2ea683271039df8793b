import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color: string
  engine_size: string
  horsepower: number
  doors: number
  seats: number
  condition: string
  location: string | null
  status: string | null
  features: string[] | null
  description: string | null
  image_url: string | null
  images: string[] | null
  created_at: string
  updated_at: string
}
