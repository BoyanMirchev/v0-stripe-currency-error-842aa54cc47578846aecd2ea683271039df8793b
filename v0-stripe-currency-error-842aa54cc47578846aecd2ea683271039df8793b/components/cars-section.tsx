"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, Phone } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useCompare } from "@/lib/compare-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"

export function CarsSection({ products = [] }: { products?: Product[] }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { toast } = useToast()

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("cars-items-container")
    if (container) {
      const scrollAmount = direction === "left" ? -800 : 800
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: "cars",
      type: "car",
    })
    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${product.name} беше добавен в количката.`,
    })
  }

  const handleToggleCompare = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    const isCurrentlyInCompare = isInCompare(product.id)

    if (isCurrentlyInCompare) {
      removeFromCompare(product.id)
      toast({
        variant: "default",
        title: "Премахнато от сравнение",
        description: `${product.name} беше премахнат от сравнение.`,
      })
    } else {
      addToCompare({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: "cars",
        description: product.description,
      })
      toast({
        variant: "default",
        title: "Добавено за сравнение",
        description: `${product.name} беше добавен за сравнение.`,
      })
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    const isCurrentlyFavorited = isFavorited(product.id)

    if (isCurrentlyFavorited) {
      removeFavorite(product.id)
      toast({
        variant: "favorite",
        title: "Премахнато от любими",
        description: `${product.name} беше премахнат от любими.`,
      })
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        type: "cars",
      })
      toast({
        variant: "favorite",
        title: "Добавено в любими",
        description: `${product.name} беше добавен в любими.`,
      })
    }
  }

  const getFinalPrice = (product: Product) => {
    const originalPrice = Number(product.price) || 0
    const discountAmount = Number(product.promotion) || 0
    return Math.max(0, originalPrice - discountAmount)
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-6"
      >
        <div className="flex items-center gap-3">
          <Image src="/images/car-icon.png" alt="Cars" width={40} height={40} className="w-10 h-10" />
          <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">Автомобили</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/cars"
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            Виж всички
            <span>→</span>
          </Link>
          {isExpanded ? (
            <ChevronUp size={24} className="text-[#1d1d1f]" />
          ) : (
            <ChevronDown size={24} className="text-[#1d1d1f]" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 group"
            aria-label="Previous"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#0066cc] group-hover:text-[#e60200] group-active:text-[#e60200] transition-colors"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            id="cars-items-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => {
              const finalPrice = getFinalPrice(product)
              const originalPrice = Number(product.price) || 0
              const hasPromotion = Number(product.promotion) > 0

              return (
                <div key={product.id} className="flex-none w-[200px]">
                  <div
                    className="bg-white rounded-lg p-3 relative group hover:border transition-all cursor-pointer flex flex-col border"
                    style={{ height: "380px", borderColor: "#f1f2f3" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#1b6ea5"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f1f2f3"
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.borderColor = "#1b6ea5"
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.borderColor = "#f1f2f3"
                    }}
                  >
                    {hasPromotion && (
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border z-10"
                        style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                      >
                        ПРОМОЦИЯ
                      </div>
                    )}

                    <Link href={`/cars/${product.id}`} className="relative aspect-square mb-3 flex-shrink-0 block">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </Link>

                    <Link href={`/cars/${product.id}`} className="block">
                      <h3
                        className="text-xs md:text-base font-medium mb-1 line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem] hover:text-red-600 transition-colors leading-tight"
                        style={{ color: "#282828" }}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price - with promotion styling */}
                    {hasPromotion ? (
                      <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                        <span className="text-sm text-red-500 line-through font-semibold">
                          {originalPrice.toFixed(2)} €
                        </span>
                        <span className="text-sm text-gray-400">/</span>
                        <span className="text-lg font-bold" style={{ color: "#1a4b8c" }}>
                          {finalPrice.toFixed(2)} €
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold mb-2 text-red-600 mt-auto" style={{ fontFamily: "var(--font-open-sans)" }}>
                        {finalPrice.toFixed(2)} €
                      </div>
                    )}

                    <a
                      href="tel:+359882738155"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                      style={{ height: "36px" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-l-lg"
                        style={{ backgroundColor: "#eaebee", width: "40px", height: "36px" }}
                      >
                        <Phone className="w-4 h-4" style={{ color: "#3d3d3d" }} />
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                        style={{ backgroundColor: "#1b6ea5", height: "36px" }}
                      >
                        <span className="text-white text-sm font-semibold">Обади се</span>
                      </div>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 group"
            aria-label="Next"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#0066cc] group-hover:text-[#e60200] group-active:text-[#e60200] transition-colors"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
