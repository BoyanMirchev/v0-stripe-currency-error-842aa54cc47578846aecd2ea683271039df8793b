"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: string | number
  name: string
  price: number | string
  quantity: number
  image_url?: string | null
  currency?: string
  selectedOptions?: Record<string, string>
  category?: string
  type?: string
  originalPrice?: number | string
  hasPromotion?: boolean
  weight_grams?: number | null
  image?: string | null
}

interface CartState {
  items: CartItem[]
  totalPrice: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | { type: "UPDATE_QUANTITY"; payload: { id: string | number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<
  | {
      state: CartState
      dispatch: React.Dispatch<CartAction>
      updateQuantity: (id: string | number, quantity: number) => void
      removeItem: (id: string | number) => void
    }
  | undefined
>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const totalPrice = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price
        return sum + price * item.quantity
      }, 0)

      return { items: newItems, totalPrice }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const totalPrice = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price
        return sum + price * item.quantity
      }, 0)

      return { items: newItems, totalPrice }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )

      const totalPrice = newItems.reduce((sum, item) => {
        const price =
          typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price
        return sum + price * item.quantity
      }, 0)

      return { items: newItems, totalPrice }
    }

    case "CLEAR_CART":
      return { items: [], totalPrice: 0 }

    case "LOAD_CART": {
      const totalPrice = action.payload.reduce((sum, item) => {
        const price =
          typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price
        return sum + price * item.quantity
      }, 0)

      return { items: action.payload, totalPrice }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalPrice: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items])

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const removeItem = (id: string | number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  return <CartContext.Provider value={{ state, dispatch, updateQuantity, removeItem }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
