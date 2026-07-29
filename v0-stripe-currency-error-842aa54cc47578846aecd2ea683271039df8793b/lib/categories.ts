import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface NavGoldCategory {
  id: number
  name: string
  slug: string
  display_order: number
  parent_id: number | null
}

export interface NavSilverCategory {
  id: number
  name: string
  slug: string
  display_order: number
  parent_id: number | null
}

export interface NavEquipmentCategory {
  id: number
  name: string
  description: string | null
  icon: string | null
  images: string[] | null
  display_order: number
  is_active: boolean
  parent_id: number | null
  subcategories?: NavEquipmentCategory[]
}

export interface NavigationCategoryData {
  goldCategories: NavGoldCategory[]
  silverCategories: NavSilverCategory[]
  equipmentCategories: NavEquipmentCategory[]
}

/**
 * Fetches all category data used by the main navigation menu (both desktop and
 * mobile) directly from the database on the server. This replaces the previous
 * client-side `useEffect` fetches in the CategoryNavigation component.
 */
export async function getNavigationCategoryData(): Promise<NavigationCategoryData> {
  try {
    const [goldRows, silverRows, equipmentRows] = await Promise.all([
      sql`
        SELECT gc.*, parent.name as parent_name
        FROM gold_categories gc
        LEFT JOIN gold_categories parent ON gc.parent_id = parent.id
        WHERE gc.is_active = true
        ORDER BY gc.parent_id NULLS FIRST, gc.display_order ASC
      `,
      sql`
        SELECT sc.*, parent.name as parent_name
        FROM silver_categories sc
        LEFT JOIN silver_categories parent ON sc.parent_id = parent.id
        WHERE sc.is_active = true
        ORDER BY sc.parent_id NULLS FIRST, sc.display_order ASC
      `,
      sql`
        SELECT c.*, p.name as parent_name
        FROM equipment_categories c
        LEFT JOIN equipment_categories p ON c.parent_id = p.id
        WHERE c.is_active = true
        ORDER BY c.display_order ASC, c.name ASC
      `,
    ])

    // Structure equipment categories with their subcategories (same shape the
    // old `/api/equipment/categories?withSubcategories=true` endpoint returned).
    const mainEquipment = (equipmentRows as any[]).filter((c) => !c.parent_id)
    const equipmentCategories = mainEquipment.map((main) => ({
      ...main,
      subcategories: (equipmentRows as any[]).filter((c) => c.parent_id === main.id),
    })) as NavEquipmentCategory[]

    return {
      goldCategories: goldRows as NavGoldCategory[],
      silverCategories: silverRows as NavSilverCategory[],
      equipmentCategories,
    }
  } catch (error) {
    console.error("[v0] Error fetching navigation category data:", error)
    return {
      goldCategories: [],
      silverCategories: [],
      equipmentCategories: [],
    }
  }
}
