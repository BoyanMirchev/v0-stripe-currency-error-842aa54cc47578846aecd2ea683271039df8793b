"use client"

import { createContext, useContext, type ReactNode } from "react"
import type {
  NavigationCategoryData,
  NavGoldCategory,
  NavSilverCategory,
  NavEquipmentCategory,
} from "@/lib/categories"

export type {
  NavigationCategoryData,
  NavGoldCategory,
  NavSilverCategory,
  NavEquipmentCategory,
}

const emptyData: NavigationCategoryData = {
  goldCategories: [],
  silverCategories: [],
  equipmentCategories: [],
}

const NavigationCategoriesContext = createContext<NavigationCategoryData>(emptyData)

export function NavigationCategoriesProvider({
  value,
  children,
}: {
  value: NavigationCategoryData
  children: ReactNode
}) {
  return (
    <NavigationCategoriesContext.Provider value={value}>
      {children}
    </NavigationCategoriesContext.Provider>
  )
}

export function useNavigationCategories() {
  return useContext(NavigationCategoriesContext)
}
