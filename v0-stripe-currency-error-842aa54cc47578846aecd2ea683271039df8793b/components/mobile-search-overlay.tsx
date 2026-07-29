"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface EquipmentCategory {
  id: number
  name: string
  description?: string
  is_active: boolean
}

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

interface CategoryGroup {
  name: string
  count: number
}

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [popularCategories, setPopularCategories] = useState<EquipmentCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Fetch categories when overlay opens
      if (popularCategories.length === 0) {
        setCategoriesLoading(true)
        fetch("/api/equipment/categories")
          .then((res) => res.json())
          .then((data) => {
            // Filter to only main categories (no parent_id) and take first 6
            const mainCategories = Array.isArray(data) 
              ? data.filter((c: EquipmentCategory & { parent_id?: number }) => !c.parent_id).slice(0, 6)
              : []
            setPopularCategories(mainCategories)
          })
          .catch((error) => {
            console.error("Failed to fetch categories:", error)
          })
          .finally(() => {
            setCategoriesLoading(false)
          })
      }
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setResults(null)
      setSelectedCategory(null)
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, popularCategories.length])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (query.trim().length > 0) {
      setIsLoading(true)
      timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data)
        } catch (error) {
          console.error("Search failed:", error)
          setResults(null)
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setResults(null)
    }

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      onClose()
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handlePopularSearchClick = (search: string) => {
    setQuery(search)
  }

  const handleClear = () => {
    setQuery("")
    setResults(null)
    setSelectedCategory(null)
  }

  const handleLinkClick = () => {
    onClose()
  }

  const categoryGroups: CategoryGroup[] = results?.equipment
    ? Object.entries(
        results.equipment.reduce(
          (acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      ).map(([name, count]) => ({ name, count }))
    : []

  const filteredEquipment =
    selectedCategory && results?.equipment
      ? results.equipment.filter((item) => item.category === selectedCategory)
      : results?.equipment || []

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-[9999] flex items-start justify-center pointer-events-none">
        <div className="bg-white rounded-3xl overflow-hidden mx-4 mt-4 mb-2 w-full max-w-2xl h-[calc(100vh-1.5rem)] flex flex-col pointer-events-auto">
          <div
            className="bg-[#e8e8e8] px-6 py-3 border-b flex-shrink-0"
            style={{
              boxShadow: "0 4px 12px 0 #d1d5df",
              borderBottomColor: "#c5c5c5",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Какво търсите?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(query)
                    }
                  }}
                  className="w-full h-12 pl-4 pr-10 rounded-xl bg-white border border-[#c5c5c5] focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-gray-400"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => handleSearch(query)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                <Image src="/search-icon.png" alt="Search" width={24} height={24} className="w-6 h-6" />
              </button>

              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 bg-white flex-1 overflow-y-auto">
            {query.trim().length === 0 ? (
              // Show popular categories when no query
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярни категории:</h3>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-red-600 border-r-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {popularCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handlePopularSearchClick(category.name)}
                        className="block w-full text-left text-base text-gray-700 hover:text-gray-900 transition-colors py-2"
                      >
                        {category.name}
                      </button>
                    ))}
                    {popularCategories.length === 0 && !categoriesLoading && (
                      <p className="text-gray-500 text-sm">Няма налични категории</p>
                    )}
                  </div>
                )}
              </>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
              </div>
            ) : results && (results.cars.length > 0 || results.equipment.length > 0 || results.gold.length > 0) ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Резултати за "{query}"</h3>

                {categoryGroups.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categoryGroups.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          selectedCategory === category.name
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {category.name} {category.count}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Equipment results */}
                  {filteredEquipment.map((item) => (
                    <Link
                      key={item.id}
                      href={`/equipment/${item.id}`}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.image_url ? (
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 uppercase mt-1">{item.category}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Cars results */}
                  {!selectedCategory &&
                    results.cars.map((car) => (
                      <Link
                        key={car.id}
                        href={`/cars/${car.id}`}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {car.image_url ? (
                            <Image
                              src={car.image_url || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-xs text-gray-500 uppercase mt-1">АВТОМОБИЛ</p>
                        </div>
                      </Link>
                    ))}

                  {/* Gold results */}
                  {!selectedCategory &&
                    results.gold.map((gold) => (
                      <Link
                        key={gold.id}
                        href={`/gold/${gold.id}`}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {gold.images && gold.images.length > 0 ? (
                            <Image
                              src={gold.images[0] || "/placeholder.svg"}
                              alt={gold.gold_type}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate text-sm">{gold.gold_type}</p>
                          <p className="text-xs text-gray-500 uppercase mt-1">ЗЛАТО</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Няма резултати за "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
