"use client"

import { ShoppingCart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StickyPriceFooterProps {
  productName: string
  price: number
  currency: string
  onAddToCart?: () => void
  showPhone?: boolean
  phoneNumber?: string
}

export function StickyPriceFooter({
  productName,
  price,
  currency,
  onAddToCart,
  showPhone = false,
  phoneNumber = "+359882738155",
}: StickyPriceFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 truncate">{productName}</p>
            <div className="text-2xl font-bold" style={{ color: "#e60200" }}>
              {price.toLocaleString("bg-BG")} {currency}
            </div>
          </div>

          {/* CTA Button */}
          {onAddToCart ? (
            <Button onClick={onAddToCart} className="px-8" style={{ backgroundColor: "#e60200" }}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              КУПИ
            </Button>
          ) : showPhone ? (
            <Button className="px-8" asChild>
              <a href={`tel:${phoneNumber}`}>
                <Phone className="h-5 w-5 mr-2" />
                {phoneNumber}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
