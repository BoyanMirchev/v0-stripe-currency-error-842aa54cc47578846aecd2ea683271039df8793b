"use client"

import { Header } from "@/components/header"
import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Phone,
  Fuel,
  Gauge,
  Settings2,
  Car,
  Check,
  ZoomIn
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { RelatedCars } from "@/components/related-cars"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Car {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color: string
  description: string | null
  image_url: string | null
  images: string[] | null
  engine_size: string | null
  horsepower: number | null
  doors: number | null
  seats: number | null
  location: string | null
  status: string
  features: string[] | null
  created_at: string
  promotions: number | null
  store_id: number | null
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

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [similarProducts, setSimilarProducts] = useState<Car[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${resolvedParams.id}`)
        if (!response.ok) throw new Error("Failed to fetch car")
        const data = await response.json()
        setCar(data)
      } catch (error) {
        console.error("Error fetching car:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [resolvedParams.id])

  useEffect(() => {
    const fetchStore = async () => {
      if (car?.store_id) {
        try {
          const response = await fetch(`/api/stores/${car.store_id}`)
          if (response.ok) {
            const storeData = await response.json()
            setStore(storeData)
          }
        } catch (error) {
          console.error("Error fetching store:", error)
        }
      }
    }

    fetchStore()
  }, [car?.store_id])

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!car) return

      try {
        const response = await fetch("/api/cars")
        if (response.ok) {
          const allProducts = await response.json()
          const similar = allProducts.filter((p: Car) => p.make === car.make && p.id !== car.id).slice(0, 4)
          setSimilarProducts(similar)
        }
      } catch (error) {
        console.error("Error fetching similar products:", error)
      }
    }

    fetchSimilarProducts()
  }, [car])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]"></div>
      </div>
    )
  }

  if (!car || error) {
    notFound()
  }

  const getAllImages = (): string[] => {
    const images: string[] = []
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      images.push(...car.images.filter((img) => img && img.trim() !== ""))
    }
    if (images.length === 0 && car.image_url) {
      images.push(car.image_url)
    }
    return images
  }

  const displayImages = getAllImages()

  const originalPrice = Number(car.price) || 0
  const discountAmount = Number(car.promotions) || 0
  const finalPrice = Math.max(0, originalPrice - discountAmount)
  const hasPromotion = discountAmount > 0
  const priceBGN = (finalPrice * 1.9558).toFixed(2)

  // Categorize features
  const categorizeFeatures = (features: string[] | null) => {
    if (!features) return { safety: [], exterior: [], interior: [], comfort: [], other: [] }
    
    const safetyKeywords = ['airbag', 'въздушн', 'abs', 'esp', 'isofix', 'безопасност', 'сензор', 'паркинг', 'камера', 'gps', 'проследяване', 'антиблокираща', 'стабилизиране', 'контрол', 'дистанция', 'спускане', 'пробуксуване', 'светлин']
    const exteriorKeywords = ['led', 'фар', 'джант', 'спойлер', 'покрив', 'врати', 'огледал', 'прозор', 'панорам', 'люк']
    const interiorKeywords = ['кожа', 'седалк', 'волан', 'екран', 'дисплей', 'навигаци', 'аудио', 'bluetooth', 'usb']
    const comfortKeywords = ['климати', 'климатроник', 'отопление', 'електрически', 'автоматич', 'памет', 'масаж', 'вентилаци']
    
    const safety: string[] = []
    const exterior: string[] = []
    const interior: string[] = []
    const comfort: string[] = []
    const other: string[] = []
    
    features.forEach(feature => {
      const lowerFeature = feature.toLowerCase()
      if (safetyKeywords.some(kw => lowerFeature.includes(kw))) {
        safety.push(feature)
      } else if (exteriorKeywords.some(kw => lowerFeature.includes(kw))) {
        exterior.push(feature)
      } else if (interiorKeywords.some(kw => lowerFeature.includes(kw))) {
        interior.push(feature)
      } else if (comfortKeywords.some(kw => lowerFeature.includes(kw))) {
        comfort.push(feature)
      } else {
        other.push(feature)
      }
    })
    
    return { safety, exterior, interior, comfort, other }
  }

  const categorizedFeatures = categorizeFeatures(car.features)

  const getProductionDate = () => {
    const months = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']
    const randomMonth = months[Math.floor(Math.random() * 12)]
    return `${randomMonth} ${car.year}`
  }

  const getCategory = () => {
    const make = car.make.toLowerCase()
    if (['bmw', 'mercedes', 'audi', 'lexus', 'porsche', 'jaguar'].includes(make)) return 'Седан'
    if (['jeep', 'land rover', 'toyota', 'nissan'].includes(make)) return 'Джип'
    return 'Автомобил'
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-[#f0f2f5] py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-[#D32F2F] transition-colors">
              Начало
            </a>
            <span className="text-gray-400">/</span>
            <a href="/cars" className="text-gray-500 hover:text-[#D32F2F] transition-colors">
              Автомобили
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{car.make} {car.model}</span>
          </nav>
        </div>
      </div>

      <div className="md:container mx-auto md:px-4 py-6">
        {/* Main Grid Layout */}
        <div className="bg-white overflow-hidden shadow-lg p-0 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-8">
          
          {/* Left Column - Image Gallery */}
          <div className="flex gap-4 bg-white">
            {/* Thumbnails on left - hidden on mobile */}
            {displayImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2">
                {displayImages.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 shrink-0 transition-all overflow-hidden ${
                      currentImageIndex === index
                        ? "ring-2 ring-[#D32F2F] opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${car.make} ${car.model} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative bg-white overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {displayImages.length > 0 ? (
                <>
                  <Image
                    src={displayImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-contain cursor-pointer"
                    priority
                    onClick={() => setLightboxOpen(true)}
                  />
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentImageIndex + 1}/{displayImages.length}</span>
                  </div>
                  
                  {/* Zoom Button */}
                  <button 
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-black/80 transition-colors"
                  >
                    <ZoomIn className="h-4 w-4" />
                    Увеличи
                  </button>

                  {/* Navigation Arrows */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] flex items-center justify-center hover:bg-black/5 transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-[#1B6EA5]" strokeWidth={3} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <Car className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-4 px-4 md:px-0">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {car.make} {car.model} <span className="font-normal text-gray-600">{car.year}</span>
            </h1>

            {/* Price Section */}
            <div className="bg-gray-50 p-4">
              {hasPromotion && (
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f8212a] text-white text-sm font-semibold rounded-full">
                    ПРОМОЦИЯ -{discountAmount.toLocaleString()} €
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#f8212a]">
                  {finalPrice.toLocaleString()} €
                </span>
                {hasPromotion && (
                  <span className="text-lg text-gray-400 line-through">{originalPrice.toLocaleString()} €</span>
                )}
              </div>
            </div>

            {/* Call Button */}
            <a
              href={store?.phone ? `tel:${store.phone}` : "tel:+359882738155"}
              className="w-full h-14 bg-[#1b6ea5] hover:bg-[#155a8a] text-white font-bold text-lg uppercase flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Обади се
            </a>

            {/* Quick Specs Bar */}
            <div className="bg-white p-4">
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="flex flex-col items-center text-center">
                  <Fuel className="h-6 w-6 text-[#1b6ea5] mb-2" />
                  <span className="text-xs text-gray-500">Двигател</span>
                  <span className="text-sm font-bold text-gray-900">{car.fuel_type}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Gauge className="h-6 w-6 text-[#1b6ea5] mb-2" />
                  <span className="text-xs text-gray-500">Мощност</span>
                  <span className="text-sm font-bold text-gray-900">{car.horsepower || '-'} к.с.</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Settings2 className="h-6 w-6 text-[#1b6ea5] mb-2" />
                  <span className="text-xs text-gray-500">Скоростна кутия</span>
                  <span className="text-sm font-bold text-gray-900">{car.transmission}</span>
                </div>
                <div className="flex flex-col items-center text-center hidden lg:flex">
                  <Car className="h-6 w-6 text-[#1b6ea5] mb-2" />
                  <span className="text-xs text-gray-500">Пробег</span>
                  <span className="text-sm font-bold text-gray-900">{car.mileage.toLocaleString()} км</span>
                </div>
                <div className="flex flex-col items-center text-center hidden lg:flex">
                  <Calendar className="h-6 w-6 text-[#1b6ea5] mb-2" />
                  <span className="text-xs text-gray-500">Година</span>
                  <span className="text-sm font-bold text-gray-900">{car.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Data Section */}
        <div className="bg-white shadow-lg mb-8 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 p-6">
            Технически данни
          </h2>
          <div>
            {[
              { label: "Дата на производство", value: getProductionDate() },
              { label: "Двигател", value: car.fuel_type },
              { label: "Мощност", value: car.horsepower ? `${car.horsepower} к.с.` : "-" },
              { label: "Скоростна кутия", value: car.transmission },
              { label: "Категория", value: getCategory() },
              { label: "Цвят", value: car.color },
              { label: "Пробег", value: `${car.mileage.toLocaleString()} км` },
              ...(car.engine_size ? [{ label: "Обем на двигателя", value: car.engine_size }] : []),
              ...(car.doors ? [{ label: "Врати", value: `${car.doors}` }] : []),
              ...(car.seats ? [{ label: "Места", value: `${car.seats}` }] : []),
            ].map((item, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-2 py-3 px-6 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <span className="text-gray-600">{item.label}</span>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Sections */}
        {car.features && car.features.length > 0 && (
          <div className="bg-white shadow-lg mb-8 overflow-hidden">
            {/* Safety Features */}
            {categorizedFeatures.safety.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide p-6 pb-4">
                  Безопасност
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {categorizedFeatures.safety.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between py-3 px-6 ${
                        index % 4 < 2 ? (index % 2 === 0 ? "bg-gray-50" : "bg-white") : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                      }`}
                    >
                      <span className="text-gray-700">{feature}</span>
                      <Check className="h-5 w-5 text-[#1b6ea5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Features */}
            {categorizedFeatures.other.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide p-6 pb-4">
                  Други
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {categorizedFeatures.other.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between py-3 px-6 ${
                        index % 4 < 2 ? (index % 2 === 0 ? "bg-gray-50" : "bg-white") : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                      }`}
                    >
                      <span className="text-gray-700">{feature}</span>
                      <Check className="h-5 w-5 text-[#1b6ea5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exterior Features */}
            {categorizedFeatures.exterior.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide p-6 pb-4">
                  Екстериор
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {categorizedFeatures.exterior.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between py-3 px-6 ${
                        index % 4 < 2 ? (index % 2 === 0 ? "bg-gray-50" : "bg-white") : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                      }`}
                    >
                      <span className="text-gray-700">{feature}</span>
                      <Check className="h-5 w-5 text-[#1b6ea5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interior Features */}
            {categorizedFeatures.interior.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide p-6 pb-4">
                  Интериор
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {categorizedFeatures.interior.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between py-3 px-6 ${
                        index % 4 < 2 ? (index % 2 === 0 ? "bg-gray-50" : "bg-white") : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                      }`}
                    >
                      <span className="text-gray-700">{feature}</span>
                      <Check className="h-5 w-5 text-[#1b6ea5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comfort Features */}
            {categorizedFeatures.comfort.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide p-6 pb-4">
                  Комфорт
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {categorizedFeatures.comfort.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between py-3 px-6 ${
                        index % 4 < 2 ? (index % 2 === 0 ? "bg-gray-50" : "bg-white") : (index % 2 === 0 ? "bg-white" : "bg-gray-50")
                      }`}
                    >
                      <span className="text-gray-700">{feature}</span>
                      <Check className="h-5 w-5 text-[#1b6ea5]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description Section */}
        {car.description && (
          <div className="bg-white shadow-lg mb-8 overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 p-6">
              Допълнителна информация
            </h2>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {car.description}
              </p>
            </div>
          </div>
        )}

        {/* Related Cars */}
        <div className="mt-12">
          <RelatedCars currentCarId={car.id} make={car.make} />
        </div>
      </div>

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          <div className="relative h-[80vh]">
            {displayImages.length > 0 && (
              <>
                <Image
                  src={displayImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-contain"
                />
                
                {displayImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                      <ChevronLeft className="h-8 w-8 text-white" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                      <ChevronRight className="h-8 w-8 text-white" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
