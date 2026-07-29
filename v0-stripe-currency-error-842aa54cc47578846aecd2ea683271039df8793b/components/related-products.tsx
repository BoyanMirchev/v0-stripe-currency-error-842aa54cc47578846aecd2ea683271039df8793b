"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"

interface RelatedProduct {
  id: number
  name: string
  image_url: string | null
  images: string[] | null
  price: number | null
  promotions: number | null
  category: string
  type: "equipment" | "gold" | "car" | "silver"
}

export function RelatedProducts({
  currentProductId,
  category,
  productType = "equipment",
}: {
  currentProductId: number
  category: string
  productType?: "equipment" | "gold" | "car" | "silver"
}) {
  const [products, setProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        console.log("[v0] Fetching related products for:", { currentProductId, category, productType })

        // Fetch all products from the same category
        const response = await fetch(`/api/${productType}`)
        if (!response.ok) {
          console.error("[v0] Failed to fetch products:", response.status)
          return
        }

        const allProducts = await response.json()
        console.log("[v0] All products received:", allProducts.length)

        // Filter products from same category, excluding current product
        // Gold products have different field names (gold_type, total_amount) vs equipment (name, price, category)
        // Silver products have different field names (silver_type, total_amount) vs equipment
        const isGold = productType === "gold"
        const isSilver = productType === "silver"
        
        let related = allProducts
          .filter((p: any) => {
            const productCategory = isGold ? p.gold_type : isSilver ? p.silver_type : p.category
            return productCategory === category && p.id !== currentProductId && p.status === "available"
          })
          .slice(0, 12)
          .map((p: any) => ({
            id: p.id,
            name: isGold ? p.gold_type : isSilver ? `${p.category_name || p.silver_type} ${p.silver_type}` : p.name,
            image_url: p.image_url,
            images: p.images,
            price: isGold ? p.total_amount : isSilver ? p.total_amount : p.price,
            promotions: p.promotions,
            category: isGold ? p.gold_type : isSilver ? p.silver_type : p.category,
            type: productType,
          }))

        if (related.length === 0) {
          console.log("[v0] No related products found, fetching random products")
          related = allProducts
            .filter((p: any) => p.id !== currentProductId && p.status === "available")
            .sort(() => Math.random() - 0.5)
            .slice(0, 12)
            .map((p: any) => ({
              id: p.id,
              name: isGold ? p.gold_type : isSilver ? `${p.category_name || p.silver_type} ${p.silver_type}` : p.name,
              image_url: p.image_url,
              images: p.images,
              price: isGold ? p.total_amount : isSilver ? p.total_amount : p.price,
              promotions: p.promotions,
              category: isGold ? p.gold_type : isSilver ? p.silver_type : p.category,
              type: productType,
            }))
        }

        console.log("[v0] Related products found:", related.length)
        setProducts(related)
      } catch (error) {
        console.error("[v0] Error fetching related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, category, productType])

  const toggleFavorite = (product: RelatedProduct) => {
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
        price: product.price?.toString() || "0",
        image: getProductImage(product),
        type: product.type,
      })
      toast({
        variant: "favorite",
        title: "Добавено в любими!",
        description: `${product.name} беше добавен в любими.`,
      })
    }
  }

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-items-container")
    if (container) {
      const scrollAmount = direction === "left" ? -800 : 800
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleAddToCart = (product: RelatedProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image_url || null,
      category: product.category,
      type: product.type,
    })
    toast({
      title: "Успешно добавено!",
      description: `${product.name} беше добавен в количката.`,
    })
  }

  const getProductImage = (product: RelatedProduct) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0]
    }
    return product.image_url || "/placeholder.svg"
  }

  const getFinalPrice = (product: RelatedProduct) => {
    const originalPrice = Number(product.price) || 0
    const discountAmount = Number(product.promotions) || 0
    return Math.max(0, originalPrice - discountAmount)
  }

  if (loading) {
    return (
      <div className="bg-white pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-4"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">
            Клиентите, които купиха този продукт също купиха
          </h2>
          {isExpanded ? (
            <ChevronUp size={24} className="text-[#1d1d1f]" />
          ) : (
            <ChevronDown size={24} className="text-[#1d1d1f]" />
          )}
        </button>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-4"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">
            Клиентите, които купиха този продукт също купиха
          </h2>
          {isExpanded ? (
            <ChevronUp size={24} className="text-[#1d1d1f]" />
          ) : (
            <ChevronDown size={24} className="text-[#1d1d1f]" />
          )}
        </button>
        <div className="text-center text-gray-500">No products found.</div>
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-4"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">
          Клиентите, които купиха този продукт също купиха
        </h2>
        {isExpanded ? (
          <ChevronUp size={24} className="text-[#1d1d1f]" />
        ) : (
          <ChevronDown size={24} className="text-[#1d1d1f]" />
        )}
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
            id="related-items-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => {
              const finalPrice = getFinalPrice(product)
              const originalPrice = Number(product.price) || 0
              const hasPromotion = Number(product.promotions) > 0
              const isGold = productType === "gold"
              const isSilver = productType === "silver"
              const isFavorite = isFavorited(product.id)

              return (
                <div key={product.id} className="flex-none w-[200px]">
                  <div
                    className={`rounded-lg p-3 relative group hover:border transition-all flex flex-col border ${isGold ? "bg-black" : isSilver ? "bg-[#1a1a2e]" : "bg-white"}`}
                    style={{ height: "380px", borderColor: isGold ? "#333333" : isSilver ? "#333344" : "#f1f2f3" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = isGold ? "#c9a227" : isSilver ? "#a8a8a8" : "#e60200"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isGold ? "#333333" : isSilver ? "#333344" : "#f1f2f3"
                    }}
                  >
                    <Link href={`/${product.type === "equipment" ? "equipment" : product.type === "gold" ? "gold" : product.type === "silver" ? "silver" : "cars"}/${product.id}`} className="relative aspect-square mb-3 flex-shrink-0 block">
                      <Image
                        src={getProductImage(product) || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </Link>

                    <Link href={`/${product.type === "equipment" ? "equipment" : product.type === "gold" ? "gold" : product.type === "silver" ? "silver" : "cars"}/${product.id}`}>
                      <h3
                        className={`text-base font-medium mb-2 line-clamp-2 transition-colors ${isGold ? "hover:text-[#f9d254]" : isSilver ? "hover:text-[#c0c0c0]" : "hover:text-red-600"}`}
                        style={{ color: isGold ? "#ffffff" : isSilver ? "#ffffff" : "#282828" }}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex-1" />

                    <div className={`text-lg font-bold mb-2 ${isGold ? "text-[#f9d254]" : isSilver ? "text-[#c0c0c0]" : "text-red-600"}`}>
                      {finalPrice.toFixed(2)} €
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                      className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                      style={{ height: "36px" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-l-lg"
                        style={{ backgroundColor: isGold ? "#222222" : isSilver ? "#222233" : "#eaebee", width: "40px", height: "36px" }}
                      >
                        <ShoppingCart className="w-4 h-4" style={{ color: isGold ? "#f9d254" : isSilver ? "#c0c0c0" : "#3d3d3d" }} />
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                        style={{
                          background: isGold ? "linear-gradient(135deg, #f9d254 0%, #e6b93d 100%)" : isSilver ? "linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)" : "#f8212a",
                          height: "36px",
                        }}
                      >
                        <span className={`text-sm font-semibold ${isGold || isSilver ? "text-[#1d1d1f]" : "text-white"}`}>Добави</span>
                      </div>
                    </button>

                    {/* Compare and Favorites row */}
                    <div className="flex items-center justify-center gap-6 mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
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
    </div>
  )
}
