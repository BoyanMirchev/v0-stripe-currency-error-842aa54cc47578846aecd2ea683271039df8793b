"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"

export function FeaturedProducts({ products = [] }: { products?: Product[] }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  const toggleFavorite = (product: Product) => {
    if (isFavorited(product.id)) {
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
        type: "gold",
      })
      toast({
        variant: "favorite",
        title: "Добавено в любими!",
        description: `${product.name} беше добавен в любими.`,
      })
    }
  }

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("gold-items-container")
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
      category: "gold",
      type: "gold",
    })
    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${product.name} беше добавен в количката.`,
    })
  }

  const getFinalPrice = (product: Product) => {
    const originalPrice = Number(product.price) || 0
    const discountAmount = Number(product.promotion) || 0
    return Math.max(0, originalPrice - discountAmount)
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-[#eaebee]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg">
              <Image src="/images/pgmks1168.png" alt="Crown" width={48} height={48} className="object-contain" />
            </div>
            <h2 className="text-3xl font-light">Злато</h2>
          </div>
          <p className="text-center text-gray-500">Няма налични продукти в момента.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <Image src="/images/pgmks1168.png" alt="Crown" width={48} height={48} className="object-contain" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-black">Злато</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/gold"
            className="text-black hover:text-gray-700 font-medium flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            Виж всички
            <span>→</span>
          </Link>
          {isExpanded ? (
            <ChevronUp size={24} className="text-black" />
          ) : (
            <ChevronDown size={24} className="text-black" />
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
            id="gold-items-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => {
              const finalPrice = getFinalPrice(product)
              const originalPrice = Number(product.price) || 0
              const hasPromotion = Number(product.promotion) > 0
              const isFavorite = isFavorited(product.id)

              return (
                <div key={product.id} className="flex-none w-[200px]">
                  <div
                    className="bg-black rounded-lg p-3 relative group hover:border transition-all flex flex-col border"
                    style={{ height: "380px", borderColor: "#333333" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c9a227"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#333333"
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.borderColor = "#c9a227"
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.borderColor = "#333333"
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

                    <Link href={`/gold/${product.id}`} className="relative aspect-square mb-3 flex-shrink-0 block">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </Link>

                    <Link href={`/gold/${product.id}`}>
                      <h3
                        className="text-xs md:text-base font-medium mb-1 line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem] hover:text-[#f9d254] transition-colors leading-tight"
                        style={{ color: "#ffffff" }}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    {hasPromotion ? (
                      <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                        <span className="text-sm text-gray-400 line-through font-semibold">{originalPrice.toFixed(2)} €</span>
                        <span className="text-sm text-gray-500">/</span>
                        <span className="text-lg font-bold text-[#f9d254]">{finalPrice.toFixed(2)} €</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold mb-2 text-[#f9d254] mt-auto">{finalPrice.toFixed(2)} €</div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                      className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                      style={{ height: "36px" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-l-lg"
                        style={{ backgroundColor: "#222222", width: "40px", height: "36px" }}
                      >
                        <ShoppingCart className="w-4 h-4" style={{ color: "#f9d254" }} />
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                        style={{
                          background: "linear-gradient(135deg, #f9d254 0%, #e6b93d 100%)",
                          height: "36px",
                        }}
                      >
                        <span className="text-[#1d1d1f] text-sm font-semibold">Добави</span>
                      </div>
                    </button>

                    {/* Compare and Favorites row */}
                    <div className="flex items-center justify-center gap-6 mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Compare functionality placeholder
                        }}
                        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "#9e9e9e" }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <polygon fill="#9e9e9e" points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                          <polygon fill="#9e9e9e" points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
                        </svg>
                        <span>Сравни</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleFavorite(product)
                        }}
                        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "#9e9e9e" }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill={isFavorite ? "#e60200" : "#9e9e9e"}
                            d="M16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3"
                          />
                        </svg>
                        <span>Любими</span>
                      </button>
                    </div>
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
