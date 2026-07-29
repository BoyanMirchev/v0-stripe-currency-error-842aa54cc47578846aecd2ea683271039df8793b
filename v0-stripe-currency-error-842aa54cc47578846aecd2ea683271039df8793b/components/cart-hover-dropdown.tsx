"use client"

import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useDeliverySettings } from "@/contexts/delivery-settings-context"

interface CartHoverDropdownProps {
  headerHeight: number
}

export function CartHoverDropdown({ headerHeight }: CartHoverDropdownProps) {
  const { cartItems, removeFromCart, getTotalPrice } = useCart()
  const { settings: deliverySettings } = useDeliverySettings()

  const totalPriceEUR = getTotalPrice()

  if (cartItems.length === 0) {
    return (
      <>
        {/* Dark overlay - starts exactly at header bottom */}
        <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none" style={{ top: `${headerHeight}px` }} />
        <div className="absolute top-full right-0 w-80 bg-red-600 shadow-2xl p-6 z-[9999]">
          <div className="text-center py-4">
            <p className="text-white font-medium">Количката е празна</p>
            <Link href="/gold">
              <Button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-5 px-6 text-base rounded-md shadow-lg transition-all hover:scale-[1.02]">
                Разгледай продукти
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Dark overlay - starts exactly at header bottom */}
      <div className="fixed inset-0 bg-black/50 z-[9998] pointer-events-none" style={{ top: `${headerHeight}px` }} />
      <div className="absolute top-full right-0 w-[420px] bg-white shadow-2xl z-[9999] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-lg font-bold text-gray-900">Количка</h3>
      </div>

      {/* Cart Items */}
      <div className="max-h-72 overflow-y-auto">
        {cartItems.map((item) => {
          const itemPriceEUR = Number(item.price) || 0
          const totalItemPriceEUR = itemPriceEUR * item.quantity

          return (
            <div key={`${item.type}-${item.id}`} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <span className="text-xs">Няма снимка</span>
                  </div>
                )}
              </div>

              {/* Product Info - now on one line */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
                  К-во: <span className="text-blue-600 font-semibold">{item.quantity}</span> / {itemPriceEUR.toFixed(2)} €
                </p>
              </div>

              {/* Price and Remove */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">{totalItemPriceEUR.toFixed(2)} €</p>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFromCart(item.id, item.type)
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="px-5 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">Общо:</span>
          <span className="font-bold text-gray-900">{totalPriceEUR.toFixed(2)} €</span>
        </div>
      </div>

      {/* Delivery Info and Checkout - on one line */}
      <div className="flex items-center gap-4 px-4 py-3 bg-red-600">
        <div className="flex items-center gap-3 flex-1">
          <Image 
            src="/images/econt-logo.webp" 
            alt="Еконт" 
            width={48} 
            height={20} 
            className="w-12 h-auto object-contain"
          />
            <div className="text-sm text-white whitespace-nowrap">
              <p>до офис на Еконт - <span className="font-semibold">{deliverySettings.econt_office_price.toFixed(2).replace('.', ',')} €</span></p>
              <p>до адрес - <span className="font-semibold">{deliverySettings.econt_address_price.toFixed(2).replace('.', ',')} €</span></p>
            </div>
        </div>
        <Link href="/cart" className="flex-shrink-0">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-5 px-6 text-base rounded-md shadow-lg transition-all hover:scale-[1.02]">
            Завършване
          </Button>
        </Link>
      </div>
    </div>
    </>
  )
}
