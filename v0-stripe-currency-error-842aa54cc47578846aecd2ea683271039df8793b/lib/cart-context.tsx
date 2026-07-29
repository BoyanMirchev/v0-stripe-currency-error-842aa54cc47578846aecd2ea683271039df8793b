"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string | null
  category: string
  type: "equipment" | "gold"
  weight_grams?: number
  gold_type?: string
  originalPrice?: number
  hasPromotion?: boolean
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number, type: "equipment" | "gold") => void
  updateQuantity: (id: number, type: "equipment" | "gold", quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isAddingToCart: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize cart from localStorage synchronously to avoid race conditions
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          if (Array.isArray(parsed)) {
            return parsed
          }
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      }
    }
    return []
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Mark as loaded after first render
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage when items change (only after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setIsAddingToCart(true)
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.type === item.type)
      if (existingItem) {
        return prev.map((i) => (i.id === item.id && i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    // Reset loading after animation
    setTimeout(() => setIsAddingToCart(false), 1500)
  }

  const removeFromCart = (id: number, type: "equipment" | "gold") => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.type === type)))
  }

  const updateQuantity = (id: number, type: "equipment" | "gold", quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === id && item.type === type ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isAddingToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
