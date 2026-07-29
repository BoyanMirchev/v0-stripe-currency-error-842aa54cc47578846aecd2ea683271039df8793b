"use client"

import type React from "react"

import { Header } from "@/components/header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown, Check, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ProductImageZoom } from "@/components/product-image-zoom"
import { ProductDetailsSections } from "@/components/product-details-sections"
import { RelatedProducts } from "@/components/related-products"
import { useDeliverySettings } from "@/contexts/delivery-settings-context"
import { SellButton } from "@/components/header"

interface GoldSaleDetail {
  id: number
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  gold_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  image_url: string | null
  images: string[] | null
  location: string | null
  status: string
  created_at: string
  promotions: number | null
  store_id: number | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
}

interface Store {
  id: number
  name: string
  address: string
  city: string
  neighborhood: string | null
  working_hours: string
  image_url: string | null
  rating: number
  is_24_7: boolean
  latitude: number | null
  longitude: number | null
  phone: string | null
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-6 text-left bg-[#f5f5f5] hover:bg-[#ececec] transition-colors"
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        <ChevronDown className={`h-6 w-6 text-gray-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pb-6 px-6 pt-4 text-gray-700 bg-white">{children}</div>}
    </div>
  )
}

export default function GoldDetailClient({
  gold,
  initialStore,
}: {
  gold: GoldSaleDetail
  initialStore: Store | null
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [store] = useState<Store | null>(initialStore)
  const [quantity, setQuantity] = useState(1)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const { addToCart } = useCart()
  const { toast } = useToast()
  const { settings: deliverySettings } = useDeliverySettings()

  const getAllImages = (): string[] => {
    const images: string[] = []

    if (gold.images && Array.isArray(gold.images) && gold.images.length > 0) {
      images.push(...gold.images.filter((img) => img && img.trim() !== ""))
    }

    if (images.length === 0 && gold.image_url) {
      images.push(gold.image_url)
    }

    return images
  }

  const displayImages = getAllImages()

  const originalPrice = Number(gold.total_amount) || 0
  const discountAmount = Number(gold.promotions) || 0
  const finalPrice = Math.max(0, originalPrice - discountAmount)
  const hasPromotion = discountAmount > 0
  const bgnPrice = finalPrice * 1.96
  const buyPrice = finalPrice * 0.9
  const bgnBuyPrice = buyPrice * 1.96
  const spread = (((finalPrice - buyPrice) / finalPrice) * 100).toFixed(2)
  const pricePerGram = Number(gold.price_per_gram) || 0
  const weightGrams = Number(gold.weight_grams) || 0

  const promotionEndDate = new Date(gold.created_at)
  promotionEndDate.setDate(promotionEndDate.getDate() + 30)

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />

      <div className="bg-[#f0f2f5] py-3 hidden lg:block">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-2 text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-500 hover:text-[#c9a227] transition-colors">
                  Начало
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/gold" className="text-gray-500 hover:text-[#c9a227] transition-colors">
                  Злато
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/gold" className="text-gray-500 hover:text-[#c9a227] transition-colors">
                  {gold.gold_type}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-700">
                  {gold.gold_type}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="bg-black relative">
          <div className="relative aspect-square">
            {displayImages.length > 0 ? (
              <ProductImageZoom
                src={displayImages[currentImageIndex] || "/placeholder.svg"}
                alt={gold.gold_type}
                fallbackIcon={<Sparkles className="h-24 w-24 text-[#c9a227]" />}
                images={displayImages}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Sparkles className="h-24 w-24 text-[#c9a227]" />
              </div>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex justify-center gap-2 pb-4">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white w-4" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-black px-4 py-6">
          {/* Product Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            {gold.gold_type}
          </h1>

          {/* Product Code and Stock Status */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-gray-400">Код: {gold.id}</span>
            <span className="text-gray-600">|</span>
            <span className="text-green-400 font-medium">В наличност</span>
          </div>

          {/* Promotion Badge */}
          {hasPromotion && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8212a] text-white text-sm font-semibold rounded-full">
                ПРОМОЦИЯ -{discountAmount.toFixed(2)} €
              </span>
            </div>
          )}

          {/* Color Selector */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-2">Цвят: {gold.gold_type.toUpperCase()}</div>
            <button className="px-4 py-2 border-2 border-[#c9a227] rounded-lg bg-transparent text-white text-sm">
              {gold.gold_type}
            </button>
          </div>

          {/* Price Section */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-1">Цена:</div>
            <div className="flex items-baseline gap-3">
              <span className="text-[#c9a227] font-bold text-3xl">{(finalPrice * quantity).toFixed(2)} €</span>
              {hasPromotion && (
                <span className="text-gray-500 line-through text-xl">
                  {(originalPrice * quantity).toFixed(2)} €
                </span>
              )}
            </div>
          </div>

          {/* Buy Button */}
          <Button
            onClick={() => {
              if (gold) {
                addToCart({
                  id: gold.id,
                  name: gold.gold_type,
                  price: finalPrice * quantity,
                  image: displayImages[0] || null,
                  category: gold.gold_type,
                  type: "gold",
                  originalPrice: originalPrice * quantity,
                  hasPromotion: hasPromotion,
                  weight_grams: gold.weight_grams,
                  gold_type: gold.gold_type,
                })
                toast({
                  title: "Успешно добавено!",
                  description: `${quantity}x ${gold.gold_type} беше добавено в количката.`,
                  variant: "cart",
                })
              }
            }}
            className="w-full text-black font-bold py-4 rounded-full text-lg mb-4 transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #f9d355 0%, #e6b93d 100%)",
            }}
          >
            КУПИ
          </Button>

        </div>
      </div>

      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-black overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 lg:p-10 flex gap-4">
                {displayImages.length > 1 && (
                  <div className="flex flex-col gap-3">
                    {displayImages.slice(0, 5).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-16 h-16 bg-black rounded-lg border-2 shrink-0 transition-all border-[#c9a227] ${
                          currentImageIndex === index
                            ? "shadow-[0_0_10px_rgba(201,162,39,0.5)]"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${gold.gold_type} ${index + 1}`}
                          fill
                          sizes="64px"
                          loading="lazy"
                          className="object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex-1 relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  {displayImages.length > 0 ? (
                    <ProductImageZoom
                      src={displayImages[currentImageIndex] || "/placeholder.svg"}
                      alt={gold.gold_type}
                      fallbackIcon={<Sparkles className="h-24 w-24 text-[#c9a227]" />}
                      images={displayImages}
                      currentIndex={currentImageIndex}
                      onIndexChange={setCurrentImageIndex}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Sparkles className="h-24 w-24 text-[#c9a227]" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 lg:p-10 bg-[#1a1a1a] lg:bg-gradient-to-r lg:from-black lg:to-[#1a1a1a]">
                <h1 className="text-2xl lg:text-3xl font-light text-white mb-3">
                  {gold.gold_type}
                </h1>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-gray-400">Код: {gold.id}</span>
                  <span className="text-gray-600">|</span>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">В наличност</span>
                  </div>
                </div>

                {hasPromotion && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8212a] text-white text-sm font-semibold rounded-full">
                      ПРОМОЦИЯ -{discountAmount.toFixed(2)} €
                    </span>
                  </div>
                )}

                <div className="mb-6">
                                  <div className="text-gray-400 text-sm mb-2">
                                    Цвят: <span className="text-white font-medium">{gold.gold_type.toUpperCase()}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-full border-2 border-[#c9a227] bg-[#c9a227]/10 text-[#c9a227] text-sm font-medium">
                                      {gold.gold_type}
                                    </button>
                                  </div>
                                </div>

                <div className="mb-6">
                  <div className="text-gray-400 text-sm mb-1">Цена:</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#c9a227] font-bold text-4xl">{(finalPrice * quantity).toFixed(2)} €</span>
                    {hasPromotion && (
                      <span className="text-gray-500 line-through text-xl">
                        {(originalPrice * quantity).toFixed(2)} €
                      </span>
)}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-400">Количество:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-white font-medium w-10 text-center text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (gold) {
                      addToCart({
                        id: gold.id,
                        name: gold.gold_type,
                        price: finalPrice * quantity,
                        image: displayImages[0] || null,
                        category: gold.gold_type,
                        type: "gold",
                        originalPrice: originalPrice * quantity,
                        hasPromotion: hasPromotion,
                        weight_grams: gold.weight_grams,
                        gold_type: gold.gold_type,
                      })
                      toast({
                        title: "Успешно добавено!",
                        description: `${quantity}x ${gold.gold_type} беше добавено в количката.`,
                        variant: "cart",
                      })
                    }
                  }}
                  className="w-full text-black font-bold py-4 rounded-full text-lg mb-4 transition-all hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #f9d355 0%, #e6b93d 100%)",
                  }}
                >
                  КУПИ
                </Button>

                <SellButton className="w-full border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 rounded-full text-lg mb-6 transition-all bg-transparent" />

                {/* Delivery Method Section */}
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-[#c9a227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 3h15v13H1z" />
                      <path d="M16 8h4l3 4v4h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" />
                      <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" />
                    </svg>
                    <span className="text-base font-medium text-[#c9a227]">Начин на доставка:</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Доставка до адрес или<br />офис на куриер:</span>
                    <span className={`text-base font-bold ${finalPrice >= deliverySettings.free_delivery_threshold ? "text-green-500" : "text-white"}`}>
                      {finalPrice >= deliverySettings.free_delivery_threshold ? "Безплатна доставка" : `от ${deliverySettings.econt_office_price.toFixed(2)} €`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <ProductDetailsSections
          specifications={[
            { key: "Тегло", value: `${weightGrams} грама` },
            { key: "Чистота", value: `${gold.purity_percentage}%` },
            { key: "Цена на грам", value: `${pricePerGram.toFixed(2) || "0.00"} €` },
            { key: "Вид злато", value: gold.gold_type },
            { key: "Валута", value: gold.currency || "EUR" },
          ]}
          store={store}
          location={gold.location || undefined}
          description={gold.description || undefined}
          category="Злато"
          brand={gold.gold_type}
          model={`${gold.weight_grams}g`}
          condition={gold.status}
        />
        <RelatedProducts currentProductId={gold.id} category={gold.gold_type} productType="gold" />
      </div>
    </div>
  )
}
