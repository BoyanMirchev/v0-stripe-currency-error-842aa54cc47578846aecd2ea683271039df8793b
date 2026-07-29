"use client"

import React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/data"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/lib/favorites-context"
import Image from "next/image"

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const [isHearted, setIsHearted] = React.useState(false)

  React.useEffect(() => {
    setIsHearted(isFavorited(product.id || 0))
  }, [product.id, isFavorited])

  const productUrl =
    product.type === "gold"
      ? `/gold/${product.id}`
      : product.type === "car"
        ? `/cars/${product.id}`
        : product.type === "equipment"
          ? `/equipment/${product.id}`
          : `/products/${product.slug}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const priceInEUR = Number.parseFloat(product.price.replace(",", "."))
    const promotion = product.promotion ? Number(product.promotion) : 0
    const finalPrice = Math.max(0, priceInEUR - promotion)

    const cartItem = {
      id: product.id || 0,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image: product.image || "/placeholder.svg",
      type: product.type || "equipment",
    }

    addToCart(cartItem)

    toast({
      title: "Успешно добавено!",
      description: `${product.name} беше добавен в количката.`,
      duration: 3000,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isHearted) {
      removeFavorite(product.id || 0)
      setIsHearted(false)
      toast({
        title: "Премахнато от любими",
        description: `${product.name} беше премахнато от любимите.`,
        duration: 2000,
      })
    } else {
      addFavorite({
        id: product.id || 0,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder.svg",
        type: product.type || "equipment",
      })
      setIsHearted(true)
      toast({
        title: "Добавено в любими",
        description: `${product.name} беше добавено в любимите.`,
        duration: 2000,
      })
    }
  }

  const priceInEUR = Number.parseFloat(product.price.replace(",", "."))
  const promotion = product.promotion ? Number(product.promotion) : 0
  const finalPriceInEUR = Math.max(0, priceInEUR - promotion).toFixed(2)

  const originalPriceInEUR = promotion > 0 ? priceInEUR.toFixed(2) : null

  return (
    <Link href={productUrl} className="group cursor-pointer">
      <div className="flex flex-col justify-between h-full bg-white rounded-lg border border-gray-200 transition-all hover:shadow-lg hover:border-red-600 hover:border-2 relative overflow-hidden">
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          <div className="bg-[#6b8e23] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            0% лихва
          </div>
          {promotion > 0 && (
            <div className="bg-[#d32f2f] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
              разлика {promotion.toFixed(2)}€
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleToggleFavorite}
            className="bg-white/95 rounded p-1.5 shadow-sm hover:shadow transition-all"
            title={isHearted ? "Премахни от любими" : "Добави в любими"}
            aria-label={isHearted ? "Премахни от любими" : "Добави в любими"}
          >
            <Heart
              className={cn("w-4 h-4 transition-colors", isHearted ? "fill-red-500 text-red-500" : "text-gray-400")}
            />
          </button>
        </div>

        <div className="relative w-full h-40 bg-white">
          {product.image ? (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
              Няма изображение
            </div>
          )}
        </div>

        <div className="px-4 pb-4 flex flex-col gap-2.5 border-background">
          {/* Product Name */}
          <h3 className="text-[13px] font-normal text-gray-900 line-clamp-2 min-h-[2rem] leading-5">{product.name}</h3>

          {promotion > 0 && originalPriceInEUR ? (
            <div className="flex flex-col gap-0.5 mt-0.5">
              <div className="text-xs text-gray-500 leading-tight">
                ПЦ: <span className="line-through">{originalPriceInEUR} €</span>
              </div>
              <div className="text-[22px] font-bold text-[#d32f2f] leading-tight">{finalPriceInEUR} €</div>
            </div>
          ) : (
            <div className="text-[22px] font-bold text-[#d32f2f] mt-0.5 leading-tight">{finalPriceInEUR} €</div>
          )}
        </div>
      </div>
    </Link>
  )
}
