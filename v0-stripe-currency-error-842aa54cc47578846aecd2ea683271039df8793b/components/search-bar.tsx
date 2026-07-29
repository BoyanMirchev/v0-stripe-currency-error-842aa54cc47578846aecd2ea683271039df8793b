"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Car, Smartphone, Coins } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MobileSearchOverlay } from "@/components/mobile-search-overlay" // Import MobileSearchOverlay component

interface SearchResult {
  cars: Array<{
    id: number
    brand: string
    model: string
    year: number
    price: string
    image_url: string
    fuel_type: string
    transmission: string
    mileage: number
  }>
  equipment: Array<{
    id: number
    name: string
    brand: string
    model: string
    category: string
    price: string
    image_url: string
    condition: string
  }>
  gold: Array<{
    id: number
    gold_type: string
    weight_grams: number
    purity_percentage: number
    price_per_gram: string
    total_amount: string
    images: string[]
    description: string
  }>
}

interface SearchBarProps {
  className?: string
  inputClassName?: string
}

export function SearchBar({ className, inputClassName }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length === 0) {
      setResults(null)
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
        setIsOpen(true)
      } catch (error) {
        console.error("Search failed:", error)
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleClear = () => {
    setQuery("")
    setResults(null)
    setIsOpen(false)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    setIsFocused(false)
    setQuery("")
    setResults(null)
  }

  const totalResults = (results?.cars.length || 0) + (results?.equipment.length || 0) + (results?.gold.length || 0)

  const hasResults = totalResults > 0

  return (
    <>
      <div ref={searchRef} className={cn("relative overflow-visible", className)}>
        {/* Search Input */}
        <div className="relative flex items-center gap-3">
          <Input
            type="text"
            placeholder="Търси в Кеш"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setShowSearchOverlay(true)}
            onFocus={() => setIsFocused(true)}
            className={cn(
              "pl-6 pr-10 h-12 rounded-full border transition-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              inputClassName,
            )}
            style={{ borderColor: "#c5c5c5" }}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => {
              if (query.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
              }
            }}
            className="flex-shrink-0"
          >
            <Image src="/search-icon.png" alt="Search" width={24} height={24} className="w-6 h-6" />
          </button>
        </div>

        {/* Results Dropdown */}
        {isOpen && (
          <div
            className="fixed left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-[10000] w-[600px] max-w-[90vw]"
            style={{
              top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + window.scrollY : "auto",
            }}
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                <p className="mt-3 text-sm text-gray-500">Търсене...</p>
              </div>
            ) : hasResults ? (
              <div className="p-4">
                {/* Cars Results */}
                {results.cars.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Car className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">🚗 Автомобили</h3>
                      <span className="text-xs text-gray-500">({results.cars.length})</span>
                    </div>
                    <div className="space-y-2">
                      {results.cars.map((car) => (
                        <Link
                          key={car.id}
                          href={`/cars/${car.id}`}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                          <div className="relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {car.image_url ? (
                              <Image
                                src={car.image_url || "/placeholder.svg"}
                                alt={`${car.brand} ${car.model}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Car className="absolute inset-0 m-auto h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                              {car.brand} {car.model}
                            </p>
                            <p className="text-sm text-gray-500">
                              {car.year} • {car.fuel_type} • {car.transmission} • {car.mileage.toLocaleString()} км
                            </p>
                            <p className="text-lg font-bold text-red-600 mt-1">
                              {Number(car.price).toLocaleString()} €
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Results */}
                {results.equipment.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">📱 Техника</h3>
                      <span className="text-xs text-gray-500">({results.equipment.length})</span>
                    </div>
                    <div className="space-y-2">
                      {results.equipment.map((item) => (
                        <Link
                          key={item.id}
                          href={`/equipment/${item.id}`}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <div className="relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                            {item.image_url ? (
                              <Image
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Smartphone className="absolute inset-0 m-auto h-8 w-8 text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.brand} {item.model && `• ${item.model}`} • {item.category}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                {item.condition}
                              </span>
                              <p className="text-lg font-bold text-blue-600">{Number(item.price).toLocaleString()} €</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gold Results */}
                {results.gold.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Coins className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold text-gray-900">🪙 Злато</h3>
                      <span className="text-xs text-gray-500">({results.gold.length})</span>
                    </div>
                    <div className="space-y-2">
                      {results.gold.map((gold) => (
                        <Link
                          key={gold.id}
                          href={`/gold/${gold.id}`}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 transition-colors group"
                        >
                          <div className="relative h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200">
                            {gold.images && gold.images.length > 0 ? (
                              <Image
                                src={gold.images[0] || "/placeholder.svg"}
                                alt={gold.gold_type}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Coins className="absolute inset-0 m-auto h-8 w-8 text-yellow-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate group-hover:text-yellow-600 transition-colors">
                              {gold.gold_type}
                            </p>
                            <p className="text-sm text-gray-500">
                              {gold.weight_grams}г • {gold.purity_percentage}% проба
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {Number(gold.price_per_gram).toFixed(2)} €/г •{" "}
                              <span className="text-lg font-bold text-yellow-600">
                                {Number(gold.total_amount).toLocaleString()} € общо
                              </span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Няма резултати</p>
                <p className="text-sm text-gray-500 mt-1">Опитайте с друга дума за търсене</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showSearchOverlay && (
        <MobileSearchOverlay isOpen={showSearchOverlay} onClose={() => setShowSearchOverlay(false)} />
      )}
    </>
  )
}
