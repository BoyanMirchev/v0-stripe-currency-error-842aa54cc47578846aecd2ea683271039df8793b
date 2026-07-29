import { neon } from "@neondatabase/serverless"
import { PromotionalCardsClient } from "./promotional-cards-client"

interface PromotionalCard {
  id: number
  position: number
  image_url: string
  link_url: string
}

async function getPromotionalCards(): Promise<PromotionalCard[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const cards = await sql`
      SELECT * FROM promotional_cards 
      ORDER BY position ASC
    `
    return cards as PromotionalCard[]
  } catch (error) {
    console.error("[v0] Error fetching promotional cards:", error)
    return []
  }
}

export async function PromotionalCardsSection() {
  const cards = await getPromotionalCards()

  return <PromotionalCardsClient cards={cards} />
}
