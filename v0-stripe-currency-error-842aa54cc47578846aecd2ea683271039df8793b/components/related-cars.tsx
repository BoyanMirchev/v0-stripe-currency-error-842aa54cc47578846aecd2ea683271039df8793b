"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronUp, ChevronDown, Phone } from "lucide-react"
import Image from "next/image"

interface RelatedCar {
  id: number
  make: string
  model: string
  image_url: string | null
  images: string[] | null
  price: number | null
  promotions: number | null
  year: number
}

export function RelatedCars({
  currentCarId,
  make,
}: {
  currentCarId: number
  make: string
}) {
  const [cars, setCars] = useState<RelatedCar[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const fetchRelatedCars = async () => {
      try {
        const response = await fetch("/api/cars")
        if (!response.ok) return

        const allCars = await response.json()

        // Filter cars from same make, excluding current car
        let related = allCars
          .filter((c: any) => c.make === make && c.id !== currentCarId && c.status === "available")
          .slice(0, 12)

        // If no cars from same make, get random cars
        if (related.length === 0) {
          related = allCars
            .filter((c: any) => c.id !== currentCarId && c.status === "available")
            .sort(() => Math.random() - 0.5)
            .slice(0, 12)
        }

        setCars(related)
      } catch (error) {
        console.error("[v0] Error fetching related cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedCars()
  }, [currentCarId, make])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-cars-container")
    if (container) {
      const scrollAmount = direction === "left" ? -800 : 800
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const getCarImage = (car: RelatedCar) => {
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      return car.images[0]
    }
    return car.image_url || "/placeholder.svg"
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-4"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">
            Подобни автомобили
          </h2>
          {isExpanded ? (
            <ChevronUp size={24} className="text-[#1d1d1f]" />
          ) : (
            <ChevronDown size={24} className="text-[#1d1d1f]" />
          )}
        </button>
        <div className="text-center text-gray-500">Зареждане...</div>
      </div>
    )
  }

  if (cars.length === 0) {
    return null
  }

  return (
    <div className="bg-white shadow-lg pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 md:py-6 px-6 text-left hover:opacity-70 transition-opacity bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-4"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">
          Подобни автомобили
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
            id="related-cars-container"
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {cars.map((car) => {
              const originalPrice = Number(car.price) || 0
              const discountAmount = Number(car.promotions) || 0
              const finalPrice = Math.max(0, originalPrice - discountAmount)
              const hasPromotion = discountAmount > 0

              return (
                <div key={car.id} className="flex-none w-[200px]">
                  <div
                    className="bg-white rounded-lg p-3 relative group hover:border transition-all cursor-pointer flex flex-col border"
                    style={{ height: "380px", borderColor: "#f1f2f3" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#1b6ea5"
                    }}
                    onMouseLeave={(e) => {
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

                    <Link href={`/cars/${car.id}`} className="relative aspect-square mb-3 flex-shrink-0 block">
                      <Image
                        src={getCarImage(car) || "/placeholder.svg"}
                        alt={`${car.make} ${car.model}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 250px"
                        loading="lazy"
                        className="object-contain"
                      />
                    </Link>

                    <Link href={`/cars/${car.id}`} className="block">
                      <h3
                        className="text-xs md:text-base font-medium mb-1 line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem] hover:text-red-600 transition-colors leading-tight"
                        style={{ color: "#282828" }}
                      >
                        {car.make} {car.model}
                      </h3>
                    </Link>

                    <div className="flex-1" />

                    {/* Price - with promotion styling */}
                    {hasPromotion ? (
                      <div className="mb-2 flex items-baseline gap-1 flex-wrap">
                        <span className="text-sm text-red-500 line-through font-semibold">
                          {originalPrice.toFixed(2)} €
                        </span>
                        <span className="text-sm text-gray-400">/</span>
                        <span className="text-lg font-bold" style={{ color: "#1a4b8c" }}>
                          {finalPrice.toFixed(2)} €
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold mb-2 text-red-600">
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
    </div>
  )
}
