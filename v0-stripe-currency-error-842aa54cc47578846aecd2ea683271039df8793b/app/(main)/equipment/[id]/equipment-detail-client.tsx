"use client"

import type React from "react"

import { Header } from "@/components/header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, Check, ChevronDown, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useCompare } from "@/lib/compare-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ProductImageZoom } from "@/components/product-image-zoom"
import { RelatedProducts } from "@/components/related-products"
import { ProductDetailsSections } from "@/components/product-details-sections"
import { useDeliverySettings } from "@/contexts/delivery-settings-context"

interface Equipment {
  id: number
  name: string
  category: string
  brand: string
  model: string
  price: number | null
  condition: string
  stock_quantity: number
  description: string | null
  image_url: string | null
  images: string[] | null
  specifications: any
  location: string
  status: string
  created_at: string
  features: string[] | null
  promotions: number | null
  store_id: number | null
  sku: string | null
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
        className="w-full flex items-center justify-between py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-normal text-gray-900">{title}</span>
        <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pb-6 text-gray-700">{children}</div>}
    </div>
  )
}

export default function EquipmentDetailClient({
  equipment,
  initialStore,
}: {
  equipment: Equipment
  initialStore: Store | null
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [store] = useState<Store | null>(initialStore)

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { toast } = useToast()
  const { settings: deliverySettings } = useDeliverySettings()
  const [quantity, setQuantity] = useState(1)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const getAllImages = (): string[] => {
    const images: string[] = []

    if (equipment.images && Array.isArray(equipment.images) && equipment.images.length > 0) {
      images.push(...equipment.images.filter((img) => img && img.trim() !== ""))
    }

    if (images.length === 0 && equipment.image_url) {
      images.push(equipment.image_url)
    }

    return images
  }

  const displayImages = getAllImages()

  const originalPrice = Number(equipment.price) || 0
  const discountAmount = Number(equipment.promotions) || 0
  const finalPrice = Math.max(0, originalPrice - discountAmount)
  const hasPromotion = discountAmount > 0

  const specifications = equipment.specifications
    ? Array.isArray(equipment.specifications)
      ? equipment.specifications.map((spec: any) => ({
          key: spec.name || spec.key || "",
          value: spec.value || ""
        }))
      : typeof equipment.specifications === "object" && equipment.specifications !== null
        ? Object.entries(equipment.specifications).map(([key, value]) => ({ key, value: String(value) }))
        : []
    : []

  const bgnPrice = finalPrice * 1.96

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />

      <div className="bg-[#f0f2f5] py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-[#D32F2F] transition-colors">
              Начало
            </a>
            <span className="text-gray-400">/</span>
            <a href="/equipment" className="text-gray-500 hover:text-[#D32F2F] transition-colors">
              Техника
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{equipment.name}</span>
          </nav>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white relative">
          <div className="relative aspect-square">
            {displayImages.length > 0 ? (
              <ProductImageZoom
                src={displayImages[currentImageIndex] || "/placeholder.svg"}
                alt={equipment.name}
                fallbackIcon={<Package className="h-24 w-24 text-gray-400" />}
                images={displayImages}
                currentIndex={currentImageIndex}
                onIndexChange={setCurrentImageIndex}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-400" />
              </div>
            )}
            
            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[50px] h-[50px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                </button>
              </>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex justify-center gap-2 pb-4">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-[#D32F2F] w-4" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {equipment.name} - {equipment.brand} {equipment.model}
          </h1>

          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-gray-500">Артикулен номер: {equipment.sku || equipment.id}</span>
            <span className="text-gray-400">|</span>
            {equipment.stock_quantity > 0 ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Check className="h-4 w-4" />
                В наличност
              </span>
            ) : (
              <span className="text-red-600 font-medium">Изчерпана наличност</span>
            )}
          </div>

          {hasPromotion && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8212a] text-white text-sm font-semibold rounded-full">
                ПРОМОЦИЯ -{discountAmount.toFixed(2)} €
              </span>
            </div>
          )}

          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Цена:</div>
            <div className="flex items-baseline gap-3">
              <span className="text-[#f8212a] font-bold text-3xl">{finalPrice.toFixed(2)} €</span>
              {hasPromotion && (
                <span className="text-gray-400 line-through text-lg">{originalPrice.toFixed(2)} €</span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (equipment) {
                addToCart({
                  id: equipment.id,
                  name: equipment.name,
                  price: finalPrice,
                  image: displayImages[0] || null,
                  category: equipment.category || "Техника",
                  type: "equipment",
                  originalPrice: originalPrice,
                  hasPromotion: hasPromotion,
                })
                toast({
                  title: "Успешно добавено!",
                  description: `${equipment.name} беше добавен в количката.`,
                  variant: "cart",
                })
              }
            }}
            className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg mb-4"
            style={{ height: "56px" }}
          >
            <div
              className="flex items-center justify-center rounded-l-lg"
              style={{ backgroundColor: "#eaebee", width: "60px", height: "56px" }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: "#3d3d3d" }} />
            </div>
<div
                              className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                              style={{ backgroundColor: "#f8212a", height: "56px" }}
                            >
                              <span className="text-white text-lg font-bold">КУПИ</span>
                            </div>
                          </button>

                          {/* Compare and Favorites row */}
                          <div className="flex items-center justify-center gap-10">
                            <button
                              onClick={() => {
                                if (!equipment) return
                                const inCompare = isInCompare(equipment.id)
                                if (inCompare) {
                                  removeFromCompare(equipment.id)
                                  toast({
                                    title: "Премахнато от сравнение",
                                    description: `${equipment.name} беше премахнат от сравнение.`,
                                  })
                                } else {
                                  addToCompare({
                                    id: equipment.id,
                                    name: equipment.name,
                                    price: equipment.price || 0,
                                    image: displayImages[0] || "/placeholder.svg",
                                    type: "equipment",
                                    description: equipment.description || "",
                                  })
                                  toast({
                                    title: "Добавено за сравнение",
                                    description: `${equipment.name} беше добавен за сравнение.`,
                                  })
                                }
                              }}
                              className="flex items-center gap-2.5 text-base font-medium hover:opacity-70 transition-opacity"
                              style={{ color: equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e" }}
                            >
                              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                                <polygon fill={equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e"} points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                                <polygon fill={equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e"} points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
                              </svg>
                              <span>Сравни</span>
                            </button>
                            <button
                              onClick={() => {
                                if (!equipment) return
                                const favorited = isFavorited(equipment.id)
                                if (favorited) {
                                  removeFavorite(equipment.id)
                                  toast({
                                    variant: "favorite",
                                    title: "Премахнато от любими",
                                    description: `${equipment.name} беше премахнат от любими.`,
                                  })
                                } else {
                                  addFavorite({
                                    id: equipment.id,
                                    name: equipment.name,
                                    price: String(equipment.price || 0),
                                    image: displayImages[0] || "/placeholder.svg",
                                    type: "equipment",
                                  })
                                  toast({
                                    variant: "favorite",
                                    title: "Добавено в любими",
                                    description: `${equipment.name} беше добавен в любими.`,
                                  })
                                }
                              }}
                              className="flex items-center gap-2.5 text-base font-medium hover:opacity-70 transition-opacity"
                              style={{ color: "#9e9e9e" }}
                            >
                              <svg className="w-7 h-7" viewBox="0 0 24 24">
                                <path
                                  fill={equipment && isFavorited(equipment.id) ? "#e60200" : "#9e9e9e"}
                                  d="M16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3"
                                />
                              </svg>
                              <span>Любими</span>
                            </button>
                          </div>

                          {/* Delivery Method Section */}
                          <div className="mt-6 -mx-4">
                            <div className="flex items-center gap-2 px-4 py-2 mb-4" style={{ background: "linear-gradient(to right, #e8e8e8, #f5f5f5)" }}>
                              <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 3h15v13H1z" />
                                <path d="M16 8h4l3 4v4h-7V8z" />
                                <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" />
                                <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" />
                              </svg>
                              <span className="text-base font-medium text-gray-700">Начин на доставка:</span>
                            </div>
                          <div className="flex items-center justify-between px-4">
                            <span className="text-gray-600 text-sm">Доставка до адрес или<br />офис на куриер:</span>
                            <span className="text-base font-bold text-gray-900">
                              {finalPrice >= deliverySettings.free_delivery_threshold ? "Безплатна доставка" : `от ${deliverySettings.econt_office_price.toFixed(2)} €`}
                            </span>
                          </div>
                          </div>
                        </div>
                      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Images */}
              <div className="p-6 lg:p-10 flex gap-4 bg-white">
                {displayImages.length > 1 && (
                  <div className="flex flex-col gap-3">
                    {displayImages.slice(0, 5).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-16 h-16 bg-white rounded-lg border-2 shrink-0 transition-all ${
                          currentImageIndex === index
                            ? "border-[#D32F2F] shadow-md"
                            : "border-gray-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${equipment.name} ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex-1 relative bg-white rounded-lg overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  {displayImages.length > 0 ? (
                    <ProductImageZoom
                      src={displayImages[currentImageIndex] || "/placeholder.svg"}
                      alt={equipment.name}
                      fallbackIcon={<Package className="h-24 w-24 text-gray-400" />}
                      images={displayImages}
                      currentIndex={currentImageIndex}
                      onIndexChange={setCurrentImageIndex}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Package className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="p-6 lg:p-10 bg-white">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-3">
                  {equipment.name}
                </h1>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-gray-500">Артикулен номер: {equipment.sku || equipment.id}</span>
                  <span className="text-gray-400">|</span>
                  {equipment.stock_quantity > 0 ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">В наличност</span>
                    </div>
                  ) : (
                    <span className="text-red-600 font-medium">Изчерпана наличност</span>
                  )}
                </div>

                {hasPromotion && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8212a] text-white text-sm font-semibold rounded-full">
                      ПРОМОЦИЯ -{discountAmount.toFixed(2)} €
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-gray-500 text-sm mb-1">Цена:</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#f8212a] font-bold text-4xl">{finalPrice.toFixed(2)} €</span>
                    {hasPromotion && (
                      <span className="text-gray-400 line-through text-xl">
                        {originalPrice.toFixed(2)} €
                      </span>
)}
            </div>
          </div>

          <button
                  onClick={() => {
                    if (equipment) {
                      addToCart({
                        id: equipment.id,
                        name: equipment.name,
                        price: finalPrice,
                        image: displayImages[0] || null,
                        category: equipment.category || "Техника",
                        type: "equipment",
                        originalPrice: originalPrice,
                        hasPromotion: hasPromotion,
                      })
                      toast({
                        title: "Успешно добавено!",
                        description: `${equipment.name} беше добавен в количката.`,
                        variant: "cart",
                      })
                    }
                  }}
                  className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg mb-4"
                  style={{ height: "56px" }}
                >
                  <div
                    className="flex items-center justify-center rounded-l-lg"
                    style={{ backgroundColor: "#eaebee", width: "60px", height: "56px" }}
                  >
                    <ShoppingCart className="w-6 h-6" style={{ color: "#3d3d3d" }} />
                  </div>
                  <div
                    className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                    style={{ backgroundColor: "#f8212a", height: "56px" }}
                  >
                    <span className="text-white text-lg font-bold">КУПИ</span>
                  </div>
                </button>

                {/* Compare and Favorites row */}
                <div className="flex items-center justify-center gap-10">
                  <button
                    onClick={() => {
                      if (!equipment) return
                      const inCompare = isInCompare(equipment.id)
                      if (inCompare) {
                        removeFromCompare(equipment.id)
                        toast({
                          title: "Премахнато от сравнение",
                          description: `${equipment.name} беше премахнат от сравнение.`,
                        })
                      } else {
                        addToCompare({
                          id: equipment.id,
                          name: equipment.name,
                          price: equipment.price || 0,
                          image: displayImages[0] || "/placeholder.svg",
                          type: "equipment",
                          description: equipment.description || "",
                        })
                        toast({
                          title: "Добавено за сравнение",
                          description: `${equipment.name} беше добавен за сравнение.`,
                        })
                      }
                    }}
                    className="flex items-center gap-2.5 text-base font-medium hover:opacity-70 transition-opacity"
                    style={{ color: equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e" }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                      <polygon fill={equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e"} points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                      <polygon fill={equipment && isInCompare(equipment.id) ? "#1b6ea5" : "#9e9e9e"} points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
                    </svg>
                    <span>Сравни</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!equipment) return
                      const favorited = isFavorited(equipment.id)
                      if (favorited) {
                        removeFavorite(equipment.id)
                        toast({
                          variant: "favorite",
                          title: "Премахнато от любими",
                          description: `${equipment.name} беше премахнат от любими.`,
                        })
                      } else {
                        addFavorite({
                          id: equipment.id,
                          name: equipment.name,
                          price: String(equipment.price || 0),
                          image: displayImages[0] || "/placeholder.svg",
                          type: "equipment",
                        })
                        toast({
                          variant: "favorite",
                          title: "Добавено в любими",
                          description: `${equipment.name} беше добавен в любими.`,
                        })
                      }
                    }}
                    className="flex items-center gap-2.5 text-base font-medium hover:opacity-70 transition-opacity"
                    style={{ color: "#9e9e9e" }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path
                        fill={equipment && isFavorited(equipment.id) ? "#e60200" : "#9e9e9e"}
                        d="M16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3"
                      />
                    </svg>
                    <span>Любими</span>
                  </button>
                </div>

                {/* Delivery Method Section */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 px-3 py-2 mb-4" style={{ background: "linear-gradient(to right, #e8e8e8, #f5f5f5)" }}>
                    <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 3h15v13H1z" />
                      <path d="M16 8h4l3 4v4h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" />
                      <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" />
                    </svg>
                    <span className="text-base font-medium text-gray-700">Начин на доставка:</span>
                  </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Доставка до адрес или<br />офис на куриер:</span>
                        <span className="text-base font-bold text-gray-900">
                          {finalPrice >= deliverySettings.free_delivery_threshold ? "Безплатна доставка" : `от ${deliverySettings.econt_office_price.toFixed(2)} €`}
                        </span>
                      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        <ProductDetailsSections
          specifications={specifications}
          store={store}
          location={equipment.location}
          description={equipment.description}
          features={equipment.features}
          category={equipment.category}
          brand={equipment.brand}
          model={equipment.model}
          condition={equipment.condition}
          manufacturerName={equipment.brand}
        />

        {/* Related Products Carousel Section */}
        <div className="mt-12">
          <RelatedProducts currentProductId={equipment.id} category={equipment.category} productType="equipment" />
        </div>


      </div>
    </div>
  )
}
