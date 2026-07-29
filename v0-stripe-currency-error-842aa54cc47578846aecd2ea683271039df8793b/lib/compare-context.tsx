"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface CompareItem {
  id: string | number
  name: string
  price: string | number
  image: string
  type: "gold" | "equipment" | "cars" | "product"
  description?: string
  specs?: Record<string, string>
}

interface CompareContextType {
  compareItems: CompareItem[]
  addToCompare: (item: CompareItem) => void
  removeFromCompare: (id: string | number) => void
  isInCompare: (id: string | number) => boolean
  clearCompare: () => void
  getCompareCount: () => number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedItems = localStorage.getItem("compareItems")
    if (savedItems) {
      try {
        setCompareItems(JSON.parse(savedItems))
      } catch {
        console.error("Failed to load compare items from localStorage")
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("compareItems", JSON.stringify(compareItems))
    }
  }, [compareItems, isLoaded])

  const addToCompare = (item: CompareItem) => {
    setCompareItems((prev) => {
      const exists = prev.some((compareItem) => compareItem.id === item.id)
      if (!exists && prev.length < 4) {
        return [...prev, item]
      }
      return prev
    })
  }

  const removeFromCompare = (id: string | number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInCompare = (id: string | number) => {
    return compareItems.some((item) => item.id === id)
  }

  const clearCompare = () => {
    setCompareItems([])
  }

  const getCompareCount = () => {
    return compareItems.length
  }

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare, getCompareCount }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
