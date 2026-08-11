"use client"

import { useState, useEffect, useMemo, useRef, useDeferredValue } from "react"
import { useSearchParams } from "next/navigation"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Grid3x3, List, Package, Heart, ShoppingCart, ChevronDown, ArrowUpDown } from "lucide-react"
import { Header } from "@/components/header"
import { PriceRangeFilter } from "@/components/price-range-filter"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Equipment {
  id: number
  name: string
  description: string | null
  price: number
  category_id: number
  image_url: string | null
  images: string[] | null
  brand: string | null
  condition: string | null
  location: string | null
  store: string | null
  has_warranty: boolean | null
  created_at: string
  promotions: number | null
  specifications: any
}

interface DynamicFilters {
  conditions: string[]
  locations: string[]
  stores: string[]
  conditionCounts: Record<string, number>
  locationCounts: Record<string, number>
  storeCounts: Record<string, number>
  specFilters: Record<string, { values: string[]; counts: Record<string, number> }>
}

interface CategoryBanner {
  id: number
  image_url: string
  mobile_image_url?: string
  link_url?: string
  link_text?: string
  title?: string
  subtitle?: string
}

interface CategoryInfo {
  name: string
  parentName?: string
  parentId?: number
}

interface EquipmentPageClientProps {
  initialEquipment: Equipment[]
  initialFilters: DynamicFilters
  initialBanner: CategoryBanner | null
  initialCategoryInfo: CategoryInfo | null
}

export default function EquipmentPageClient({
  initialEquipment,
  initialFilters,
  initialBanner,
  initialCategoryInfo,
}: EquipmentPageClientProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [sortDialogOpen, setSortDialogOpen] = useState(false)
  const [tempSortBy, setTempSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [hasWarranty, setHasWarranty] = useState(false)
  const [inSale, setInSale] = useState(false)
  
  // Dynamic filter data from API
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilters>(initialFilters)
  
  // Selected spec filter values (specName -> selected values)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({})
  // Spec filter open states
  const [specFilterOpenStates, setSpecFilterOpenStates] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Key used to remember the current page per category so returning from a
  // product detail page restores the page the user was on.
  const pageStorageKey = `equipment-page-${categoryParam || "all"}`
  const scrollStorageKey = `equipment-scroll-${categoryParam || "all"}`
  // Tracks whether the filter-reset effect has run its initial mount pass, so a
  // restored page isn't immediately reset to 1.
  const filtersInitialized = useRef(false)
  // Tracks whether we've already restored on mount, to restore scroll only once.
  const didRestore = useRef(false)

  // Restore the saved page and scroll position when the component mounts.
  useEffect(() => {
    if (typeof window === "undefined" || didRestore.current) return
    didRestore.current = true

    const savedPage = sessionStorage.getItem(pageStorageKey)
    if (savedPage) {
      const parsed = Number.parseInt(savedPage, 10)
      if (!Number.isNaN(parsed) && parsed > 1) {
        setCurrentPage(parsed)
      }
    }

    const savedScroll = sessionStorage.getItem(scrollStorageKey)
    if (savedScroll) {
      const y = Number.parseInt(savedScroll, 10)
      if (!Number.isNaN(y) && y > 0) {
        // Wait for the restored page to render before scrolling back.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => window.scrollTo(0, y))
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageStorageKey, scrollStorageKey])

  // Persist the current page whenever it changes.
  useEffect(() => {
    if (typeof window === "undefined") return
    sessionStorage.setItem(pageStorageKey, String(currentPage))
  }, [currentPage, pageStorageKey])

  // Continuously persist the scroll position so it can be restored on return.
  useEffect(() => {
    if (typeof window === "undefined") return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sessionStorage.setItem(scrollStorageKey, String(window.scrollY))
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [scrollStorageKey])
  
  // Category info for breadcrumbs and title
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(initialCategoryInfo)

  // Filter section collapse states
  const [priceFilterOpen, setPriceFilterOpen] = useState(true)
  const [brandFilterOpen, setBrandFilterOpen] = useState(true)
  const [conditionFilterOpen, setConditionFilterOpen] = useState(false)
  const [locationFilterOpen, setLocationFilterOpen] = useState(false)
  const [storeFilterOpen, setStoreFilterOpen] = useState(false)

  // Dual currency price inputs
  const [minPriceBGN, setMinPriceBGN] = useState("")
  const [maxPriceBGN, setMaxPriceBGN] = useState("")
  const [minPriceEUR, setMinPriceEUR] = useState("")
  const [maxPriceEUR, setMaxPriceEUR] = useState("")
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // EUR to BGN exchange rate (approximate)
  const EUR_TO_BGN = 1.9558

  // Category banner state
  const [categoryBanner, setCategoryBanner] = useState<CategoryBanner | null>(initialBanner)

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  // Resolve the thumbnail: prefer image_url, otherwise fall back to the first
  // entry in the images array (same logic as the product detail page).
  const getThumbnail = (item: Equipment): string | null => {
    if (item.image_url && item.image_url.trim() !== "") return item.image_url
    if (Array.isArray(item.images)) {
      const firstValid = item.images.find((img) => img && img.trim() !== "")
      if (firstValid) return firstValid
    }
    return null
  }

  // Normalize a brand value so variants that differ only by casing or
  // surrounding whitespace (e.g. "Huawei", " HUAWEI ") collapse into one.
  const normalizeBrand = (brand: string | null | undefined) => (brand || "").trim().toUpperCase()

  // Build a deduplicated brand list and per-brand counts keyed by the
  // normalized value, so each brand appears exactly once with a merged count.
  const { brands, brandCounts } = useMemo(() => {
    const counts: Record<string, number> = {}
    equipment.forEach((item) => {
      const key = normalizeBrand(item.brand)
      if (key) {
        counts[key] = (counts[key] || 0) + 1
      }
    })
    return { brands: Object.keys(counts).sort(), brandCounts: counts }
  }, [equipment])

  // Calculate price histogram data
  const priceHistogram = useMemo(() => {
    if (equipment.length === 0) return { buckets: [], minPrice: 0, maxPrice: 10000 }
    
    const prices = equipment.map((item) => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const bucketCount = 8
    const bucketSize = (maxPrice - minPrice) / bucketCount
    
    const buckets = Array(bucketCount).fill(0)
    prices.forEach((price) => {
      const bucketIndex = Math.min(
        Math.floor((price - minPrice) / bucketSize),
        bucketCount - 1
      )
      buckets[bucketIndex]++
    })
    
    const maxBucketCount = Math.max(...buckets)
    const normalizedBuckets = buckets.map((count) => 
      maxBucketCount > 0 ? (count / maxBucketCount) * 100 : 0
    )
    
    return { buckets: normalizedBuckets, minPrice, maxPrice }
  }, [equipment])

  // Update price range when inputs change
  const handlePriceInputChange = (type: 'min' | 'max', currency: 'BGN' | 'EUR', value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Update display values immediately
    if (currency === 'BGN') {
      if (type === 'min') {
        setMinPriceBGN(value)
        setMinPriceEUR((numValue / EUR_TO_BGN).toFixed(0))
      } else {
        setMaxPriceBGN(value)
        setMaxPriceEUR((numValue / EUR_TO_BGN).toFixed(0))
      }
    } else {
      if (type === 'min') {
        setMinPriceEUR(value)
        setMinPriceBGN((numValue * EUR_TO_BGN).toFixed(0))
      } else {
        setMaxPriceEUR(value)
        setMaxPriceBGN((numValue * EUR_TO_BGN).toFixed(0))
      }
    }
    
    // Debounce the price range update for filtering
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current)
    }
    priceDebounceRef.current = setTimeout(() => {
      if (currency === 'BGN') {
        if (type === 'min') {
          setPriceRange([numValue / EUR_TO_BGN, priceRange[1]])
        } else {
          setPriceRange([priceRange[0], numValue / EUR_TO_BGN])
        }
      } else {
        if (type === 'min') {
          setPriceRange([numValue, priceRange[1]])
        } else {
          setPriceRange([priceRange[0], numValue])
        }
      }
    }, 500)
  }

  // Use deferred values for filtering to prevent input focus loss
  const deferredPriceRange = useDeferredValue(priceRange)
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const deferredSelectedBrands = useDeferredValue(selectedBrands)
  const deferredSelectedConditions = useDeferredValue(selectedConditions)
  const deferredSelectedLocations = useDeferredValue(selectedLocations)
  const deferredSelectedStores = useDeferredValue(selectedStores)
  const deferredSelectedSpecs = useDeferredValue(selectedSpecs)
  const deferredHasWarranty = useDeferredValue(hasWarranty)
  const deferredInSale = useDeferredValue(inSale)
  const deferredSortBy = useDeferredValue(sortBy)

  const filteredEquipment = useMemo(() => equipment
    .filter((item) => {
      const searchStr = deferredSearchTerm.toLowerCase()
      const matchesSearch =
        item.name?.toLowerCase().includes(searchStr) ||
        item.description?.toLowerCase().includes(searchStr) ||
        item.brand?.toLowerCase().includes(searchStr)

      const matchesPrice = item.price >= deferredPriceRange[0] && item.price <= deferredPriceRange[1]
      const matchesBrand = deferredSelectedBrands.length === 0 || deferredSelectedBrands.includes(normalizeBrand(item.brand))
      const matchesCondition = deferredSelectedConditions.length === 0 || deferredSelectedConditions.includes(item.condition || "")
      const matchesLocation = deferredSelectedLocations.length === 0 || deferredSelectedLocations.includes(item.location || "")
      const matchesStore = deferredSelectedStores.length === 0 || deferredSelectedStores.includes(item.store || "")
      const matchesWarranty = !deferredHasWarranty || item.has_warranty
      const matchesSale = !deferredInSale || (item.promotions !== null && item.promotions > 0)

      // Check specifications filters
      const matchesSpecs = Object.entries(deferredSelectedSpecs).every(([specName, selectedValues]) => {
        if (selectedValues.length === 0) return true
        
        if (!item.specifications) return false
        
        // Parse specifications - can be array or object
        let specs: Array<{ name?: string; key?: string; value?: string }> = []
        if (Array.isArray(item.specifications)) {
          specs = item.specifications
        } else if (typeof item.specifications === 'object') {
          specs = Object.entries(item.specifications).map(([key, value]) => ({ name: key, value: String(value) }))
        }
        
        // Check if any of the selected values match this item's spec
        return specs.some((spec) => {
          const name = spec.name || spec.key
          const value = spec.value
          return name === specName && selectedValues.includes(value || '')
        })
      })

      return (
        matchesSearch &&
        matchesPrice &&
        matchesBrand &&
        matchesCondition &&
        matchesLocation &&
        matchesStore &&
        matchesWarranty &&
        matchesSale &&
        matchesSpecs
      )
    })
    .sort((a, b) => {
      switch (deferredSortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    }), [equipment, deferredSearchTerm, deferredPriceRange, deferredSelectedBrands, deferredSelectedConditions, deferredSelectedLocations, deferredSelectedStores, deferredSelectedSpecs, deferredHasWarranty, deferredInSale, deferredSortBy])

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEquipment = filteredEquipment.slice(startIndex, endIndex)

  useEffect(() => {
    // Skip the initial mount so a page restored from sessionStorage isn't
    // immediately reset to 1. Only reset when filters actually change afterwards.
    if (!filtersInitialized.current) {
      filtersInitialized.current = true
      return
    }
    setCurrentPage(1)
  }, [
    priceRange,
    selectedBrands,
    selectedConditions,
    selectedLocations,
    selectedStores,
    selectedSpecs,
    hasWarranty,
    inSale,
    sortBy,
  ])

  const handleAddToCart = (item: Equipment) => {
    const originalPrice = Number(item.price)
    const promotionDiscount = item.promotions ? Number(item.promotions) : 0
    const finalPrice = Math.max(0, originalPrice - promotionDiscount)
    const hasPromotion = promotionDiscount > 0

    addToCart({
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: getThumbnail(item),
      category: item.brand || "Equipment",
      type: "equipment",
      originalPrice: originalPrice,
      hasPromotion: hasPromotion,
    })
    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${item.name} беше добавено в количката.`,
    })
  }

  const handleToggleFavorite = (item: Equipment) => {
    const isFav = isFavorited("equipment", item.id)
    if (isFav) {
      removeFavorite("equipment", item.id)
      toast({
        variant: "favorite",
        title: "Премахнато от харесани",
        description: `${item.name} беше премахнато от харесани.`,
      })
    } else {
      addFavorite({
        id: item.id,
        name: item.name,
        price: item.price,
        image: getThumbnail(item),
        category: item.brand || "Equipment",
        type: "equipment",
      })
      toast({
        variant: "favorite",
        title: "Добавено в харесани!",
        description: `${item.name} беше добавено в харесани.`,
      })
    }
  }

  const FiltersContent = () => (
    <div className="divide-y divide-gray-200">
      {/* Price Filter */}
      <PriceRangeFilter
        min={priceHistogram.minPrice}
        max={priceHistogram.maxPrice}
        value={priceRange}
        onChange={(val) => setPriceRange(val)}
      />

      {/* Brand Filter */}
      <div className="py-4">
        <button
          onClick={() => setBrandFilterOpen(!brandFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Марка</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${brandFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {brandFilterOpen && (
          <div className="mt-4 space-y-3">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBrands([...selectedBrands, brand])
                    } else {
                      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm">
                  {brand}{" "}
                  <span className="text-gray-400">({brandCounts[brand] || 0})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Condition Filter - Dynamic */}
      {dynamicFilters.conditions.length > 0 && (
        <div className="py-4">
          <button
            onClick={() => setConditionFilterOpen(!conditionFilterOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-bold text-base">Състояние</h3>
            <ChevronDown
              className={`h-5 w-5 text-red-500 transition-transform ${conditionFilterOpen ? "rotate-180" : ""}`}
            />
          </button>
          
          {conditionFilterOpen && (
            <div className="mt-4 space-y-3">
              {dynamicFilters.conditions.map((condition) => (
                <label key={condition} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedConditions([...selectedConditions, condition])
                      } else {
                        setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {condition}{" "}
                    <span className="text-gray-400">({dynamicFilters.conditionCounts[condition] || 0})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Location Filter - Dynamic */}
      {dynamicFilters.locations.length > 0 && (
        <div className="py-4">
          <button
            onClick={() => setLocationFilterOpen(!locationFilterOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-bold text-base">Локация</h3>
            <ChevronDown
              className={`h-5 w-5 text-red-500 transition-transform ${locationFilterOpen ? "rotate-180" : ""}`}
            />
          </button>
          
          {locationFilterOpen && (
            <div className="mt-4 space-y-3">
              {dynamicFilters.locations.map((location) => (
                <label key={location} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLocations([...selectedLocations, location])
                      } else {
                        setSelectedLocations(selectedLocations.filter((l) => l !== location))
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {location}{" "}
                    <span className="text-gray-400">({dynamicFilters.locationCounts[location] || 0})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Store Filter - Dynamic */}
      {dynamicFilters.stores.length > 0 && (
        <div className="py-4">
          <button
            onClick={() => setStoreFilterOpen(!storeFilterOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-bold text-base">Магазин</h3>
            <ChevronDown
              className={`h-5 w-5 text-red-500 transition-transform ${storeFilterOpen ? "rotate-180" : ""}`}
            />
          </button>
          
          {storeFilterOpen && (
            <div className="mt-4 space-y-3">
              {dynamicFilters.stores.map((store) => (
                <label key={store} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStores.includes(store)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStores([...selectedStores, store])
                      } else {
                        setSelectedStores(selectedStores.filter((s) => s !== store))
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {store}{" "}
                    <span className="text-gray-400">({dynamicFilters.storeCounts[store] || 0})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Specification Filters - Dynamic from product specs */}
      {Object.keys(dynamicFilters.specFilters).length > 0 && 
        Object.entries(dynamicFilters.specFilters).map(([specName, specData]) => (
          <div key={specName} className="py-4">
            <button
              onClick={() => setSpecFilterOpenStates(prev => ({ ...prev, [specName]: !prev[specName] }))}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="font-bold text-base">{specName}</h3>
              <ChevronDown
                className={`h-5 w-5 text-red-500 transition-transform ${specFilterOpenStates[specName] ? "rotate-180" : ""}`}
              />
            </button>
            
            {specFilterOpenStates[specName] && (
              <div className="mt-4 space-y-3">
                {specData.values.map((value) => (
                  <label key={value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(selectedSpecs[specName] || []).includes(value)}
                      onChange={(e) => {
                        setSelectedSpecs(prev => {
                          const current = prev[specName] || []
                          if (e.target.checked) {
                            return { ...prev, [specName]: [...current, value] }
                          } else {
                            return { ...prev, [specName]: current.filter(v => v !== value) }
                          }
                        })
                      }}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {value}{" "}
                      <span className="text-gray-400">({specData.counts[value] || 0})</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))
      }

      {/* Warranty & Sale Filters */}
      <div className="py-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasWarranty}
            onChange={(e) => setHasWarranty(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className="text-sm font-medium">С гаранция</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inSale}
            onChange={(e) => setInSale(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className="text-sm font-medium">Само в промоция</span>
        </label>
      </div>

      {/* Clear All Button */}
      <div className="py-4">
        <button
          onClick={() => {
            setSearchTerm("")
            setPriceRange([0, 10000])
            setMinPriceBGN("")
            setMaxPriceBGN("")
            setMinPriceEUR("")
            setMaxPriceEUR("")
            setSelectedBrands([])
            setSelectedConditions([])
            setSelectedLocations([])
            setSelectedStores([])
            setSelectedSpecs({})
            setHasWarranty(false)
            setInSale(false)
          }}
          className="w-full py-2.5 border-2 border-blue-500 rounded-full text-gray-700 text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Изчисти всички филтри
        </button>
      </div>
    </div>
  )

  const getSortLabel = (value: string) => {
    switch (value) {
      case "popular":
        return "Най-продавани"
      case "price-asc":
        return "Цена възходящо"
      case "price-desc":
        return "Цена низходящо"
      case "name-asc":
        return "Нови"
      default:
        return "Най-продавани"
    }
  }

  const handleSortApply = () => {
    setSortBy(tempSortBy)
    setSortDialogOpen(false)
  }

  const handleSortCancel = () => {
    setTempSortBy(sortBy)
    setSortDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-[#eaebee] pb-8">
        {/* Breadcrumbs - visible on all screens */}
        <div className="hidden lg:block max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Начало
            </Link>
            <span>›</span>
            <Link href="/equipment" className="hover:text-foreground">
              Техника
            </Link>
            {categoryInfo?.parentName && (
              <>
                <span>›</span>
                <Link href={`/equipment?category=${categoryInfo.parentId}`} className="hover:text-foreground">
                  {categoryInfo.parentName}
                </Link>
              </>
            )}
            {categoryInfo && (
              <>
                <span>›</span>
                <span className="text-foreground">{categoryInfo.name}</span>
              </>
            )}
            {!categoryInfo && (
              <span className="text-foreground"></span>
            )}
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Начало
            </Link>
            <span>›</span>
            <Link href="/equipment" className="hover:text-foreground">
              Техника
            </Link>
            {categoryInfo?.parentName && (
              <>
                <span>›</span>
                <Link href={`/equipment?category=${categoryInfo.parentId}`} className="hover:text-foreground">
                  {categoryInfo.parentName}
                </Link>
              </>
            )}
            {categoryInfo && (
              <>
                <span>›</span>
                <span className="text-foreground">{categoryInfo.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Category Banner - visible on all screens */}
        {categoryBanner && (
          <div className="max-w-[1400px] mx-auto px-4 mb-4">
            <Link href={categoryBanner.link_url || "#"} className="block">
              <div className="relative w-full overflow-hidden rounded-lg shadow-sm">
                <img
                  src={categoryBanner.image_url}
                  alt={categoryBanner.title || "Promotional banner"}
                  className="w-full h-auto object-cover"
                />
              </div>
            </Link>
          </div>
        )}

        {/* Mobile Header - Title, Filters, Sort (after banner) */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 mb-4">
          {/* First row - Category name and count */}
          <div className="pt-2 pb-2">
            <h1 className="text-lg font-bold">
              {categoryInfo ? categoryInfo.name : "Техника"} ({filteredEquipment.length})
            </h1>
          </div>

          {/* Second row - Filter buttons */}
          <div className="flex items-center gap-2 pb-2">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button className="bg-[#2b7a9c] hover:bg-[#246a88] text-white rounded-none px-3 py-2 h-auto">
                  <SlidersHorizontal className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-[24px] overflow-hidden p-0 border-t-0">
                <div className="flex justify-center pt-3 pb-2 bg-gradient-to-b from-background to-background/95">
                  <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                </div>
                <div className="px-6 pb-2">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Филтри</SheetTitle>
                  </SheetHeader>
                </div>
                <div className="overflow-y-auto px-6 pb-6 h-[calc(85vh-120px)]">
                  {FiltersContent()}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/0 pt-8">
                  <Button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full h-12 text-base font-semibold rounded-none bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                  >
                    Покажи резултати
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Sort */}
            <button
              onClick={() => {
                setTempSortBy(sortBy)
                setSortDialogOpen(true)
              }}
              className="flex items-center gap-2 pl-2 pr-4 py-2 border border-gray-400 rounded-none hover:bg-gray-50 transition-colors flex-1"
            >
              <span className="text-sm">{getSortLabel(sortBy)}</span>
              <ArrowUpDown className="h-5 w-5 ml-auto" />
            </button>

            {/* Mobile View Toggle - Single list button */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 border border-gray-400 rounded-none hover:bg-gray-50"
              title={viewMode === "grid" ? "Списък" : "Решетка"}
            >
              <List className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="max-w-[1400px] mx-auto px-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {categoryInfo ? categoryInfo.name : "Техника"} <span className="text-muted-foreground">({filteredEquipment.length})</span>
              </h1>

              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <button
                  onClick={() => {
                    setTempSortBy(sortBy)
                    setSortDialogOpen(true)
                  }}
                  className="flex items-center gap-2 pl-3 pr-4 py-2 border border-gray-400 rounded-none hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">{getSortLabel(sortBy)}</span>
                  <ArrowUpDown className="h-5 w-5" />
                </button>

                {/* View Toggle Buttons */}
                <button
                  onClick={() => setViewMode("list")}
                  className="p-2 border border-gray-400 rounded-none hover:bg-gray-50"
                  title="Списък"
                >
                  <List className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto lg:px-4">
          <div className="flex gap-4 items-start">
            {/* Left Sidebar - Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white shadow-sm sticky top-4 self-start">
              <div className="px-4 py-2">
                {FiltersContent()}
              </div>
            </aside>

            {/* Right Content - Products Grid */}
            <main className="flex-1 min-w-0">
              <div className="bg-white shadow-sm p-2 lg:p-3">
                {paginatedEquipment.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Няма намерена техника</h3>
                    <p className="text-muted-foreground">Опитайте да промените филтрите</p>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 auto-rows-fr"
                        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr"
                    }
                  >
                    {paginatedEquipment.map((item) => {
                      const originalPrice = Number(item.price)
                      const discountAmount = Number(item.promotions || 0)
                      const finalPrice = Math.max(0, originalPrice - discountAmount)
                      const isFav = isFavorited("equipment", item.id)
                      const hasPromotion = discountAmount > 0

                      if (viewMode === "list") {
                        // Parse specifications for display
                        const specs = item.specifications
                          ? Array.isArray(item.specifications)
                            ? item.specifications.map((spec: any) => ({
                                key: spec.name || spec.key || "",
                                value: spec.value || ""
                              }))
                            : typeof item.specifications === "object" && item.specifications !== null
                              ? Object.entries(item.specifications).map(([key, value]) => ({ key, value: String(value) }))
                              : []
                          : []
                        const displaySpecs = specs.slice(0, 3)

                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-4 relative group hover:border transition-all flex flex-col border h-full"
                            style={{ minHeight: "520px", borderColor: "#f1f2f3" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#e60200"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#f1f2f3"
                            }}
                          >
                            {hasPromotion && (
                              <div
                                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border z-10"
                                style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                              >
                                ПРОМОЦИЯ
                              </div>
                            )}

                            <Link href={`/equipment/${item.id}`} className="relative mb-4 flex-shrink-0 flex items-center justify-center" style={{ height: "280px" }}>
                              {getThumbnail(item) ? (
                                <Image
                                  src={getThumbnail(item) || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 768px) 90vw, 280px"
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </Link>

                            <Link href={`/equipment/${item.id}`} className="block">
                              <h3
                                className="text-lg font-semibold mb-2 line-clamp-2 hover:text-red-600 transition-colors"
                                style={{ color: "#282828" }}
                              >
                                {item.name}
                              </h3>
                            </Link>

                            {/* Specifications */}
                            {displaySpecs.length > 0 && (
                              <div className="mb-3 space-y-1">
                                {displaySpecs.map((spec: { key: string; value: string }, index: number) => (
                                  <div key={index} className="flex items-center text-sm">
                                    <span className="text-gray-500">{spec.key}:</span>
                                    <span className="ml-1 text-gray-700 font-medium">{spec.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {hasPromotion ? (
                              <div className="mb-3 mt-auto flex items-baseline gap-2 flex-wrap">
                                <span className="text-lg text-red-500 line-through font-semibold">
                                  {originalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span>
                                </span>
                                <span className="text-lg text-gray-400">/</span>
                                <span className="text-xl font-bold" style={{ color: "#1a4b8c" }}>{finalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span></span>
                              </div>
                            ) : (
                              <div className="text-xl font-bold mb-3 text-red-600 mt-auto" style={{ fontFamily: "var(--font-open-sans)" }}>
                                {finalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span>
                              </div>
                            )}

                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(item)
                              }}
                              className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg mt-auto"
                              style={{ height: "44px" }}
                            >
                              <div
                                className="flex items-center justify-center rounded-l-lg"
                                style={{ backgroundColor: "#eaebee", width: "48px", height: "44px" }}
                              >
                                <ShoppingCart className="w-5 h-5" style={{ color: "#3d3d3d" }} />
                              </div>
                              <div
                                className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                                style={{ backgroundColor: "#f8212a", height: "44px" }}
                              >
                                <span className="text-white text-base font-semibold">Добави</span>
                              </div>
                            </button>

                            {/* Compare and Favorites row */}
                            <div className="flex items-center justify-between mt-4">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  // Compare functionality placeholder
                                }}
                                className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
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
                                  handleToggleFavorite(item)
                                }}
                                className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                                style={{ color: "#9e9e9e" }}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <path
                                    fill={isFav ? "#e60200" : "#9e9e9e"}
                                    d="M16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3"
                                  />
                                </svg>
                                <span>Любими</span>
                              </button>
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg p-3 relative group hover:border transition-all flex flex-col border h-full"
                          style={{ minHeight: "380px", borderColor: "#f1f2f3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#e60200"
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

                          <Link href={`/equipment/${item.id}`} className="relative mb-3 flex-shrink-0 flex items-center justify-center" style={{ height: "160px" }}>
                            {getThumbnail(item) ? (
                              <Image
                                src={getThumbnail(item) || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </Link>

                          <Link href={`/equipment/${item.id}`} className="block">
                            <h3
                              className="text-base font-medium mb-1 line-clamp-2 hover:text-red-600 transition-colors"
                              style={{ color: "#282828" }}
                            >
                              {item.name}
                            </h3>
                          </Link>

                          {hasPromotion ? (
                            <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                              <span className="text-base text-red-500 line-through font-semibold">
                                {originalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span>
                              </span>
                              <span className="text-base text-gray-400">/</span>
                              <span className="text-lg font-bold" style={{ color: "#1a4b8c" }}>{finalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span></span>
                            </div>
                          ) : (
                            <div className="text-lg font-bold mb-2 text-red-600 mt-auto" style={{ fontFamily: "var(--font-open-sans)" }}>
                              {finalPrice.toFixed(2)} <span style={{ fontFamily: "Open Sans, sans-serif" }}>€</span>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(item)
                            }}
                            className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg mt-auto"
                            style={{ height: "36px" }}
                          >
                            <div
                              className="flex items-center justify-center rounded-l-lg"
                              style={{ backgroundColor: "#eaebee", width: "40px", height: "36px" }}
                            >
                              <ShoppingCart className="w-4 h-4" style={{ color: "#3d3d3d" }} />
                            </div>
                            <div
                              className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                              style={{ backgroundColor: "#f8212a", height: "36px" }}
                            >
                              <span className="text-white text-sm font-semibold">Добави</span>
                            </div>
                          </button>

                          {/* Compare and Favorites row */}
                          <div className="flex items-center justify-between mt-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Compare functionality placeholder
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
                                handleToggleFavorite(item)
                              }}
                              className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
                              style={{ color: "#9e9e9e" }}
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                  fill={isFav ? "#e60200" : "#9e9e9e"}
                                  d="M16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3"
                                />
                              </svg>
                              <span>Любими</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {filteredEquipment.length > 0 && (
                <div className="flex justify-center items-center gap-2 py-4 px-6">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border transition-all"
                    style={{
                      borderColor: "#1b6fa4",
                      color: currentPage === 1 ? "#ccc" : "#1b6fa4",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Предишна
                  </button>

                  {/* Mobile pagination - show only 2 pages */}
                  <div className="flex gap-2 md:hidden">
                    {Array.from({ length: Math.min(2, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 2) {
                        pageNum = i + 1
                      } else if (currentPage === 1) {
                        pageNum = i + 1
                      } else if (currentPage === totalPages) {
                        pageNum = totalPages - 1 + i
                      } else {
                        pageNum = currentPage + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className="w-10 h-10 border transition-all"
                          style={{
                            borderColor: "#1b6fa4",
                            backgroundColor: currentPage === pageNum ? "#1b6fa4" : "transparent",
                            color: currentPage === pageNum ? "white" : "#1b6fa4",
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    {totalPages > 2 && currentPage < totalPages - 1 && <span style={{ color: "#1b6fa4" }}>...</span>}
                  </div>

                  {/* Desktop pagination - show up to 5 pages */}
                  <div className="hidden md:flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className="w-10 h-10 border transition-all"
                          style={{
                            borderColor: "#1b6fa4",
                            backgroundColor: currentPage === pageNum ? "#1b6fa4" : "transparent",
                            color: currentPage === pageNum ? "white" : "#1b6fa4",
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && <span style={{ color: "#1b6fa4" }}>...</span>}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border transition-all"
                    style={{
                      borderColor: "#1b6fa4",
                      color: currentPage === totalPages ? "#ccc" : "#1b6fa4",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Следваща
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
        <DialogContent 
          className="max-w-[240px] p-0 gap-0 rounded-none border-0 shadow-lg"
          overlayClassName="bg-black/30"
          hideCloseButton
        >
          {/* Red top line */}
          <div className="h-1 bg-red-500 w-full" />
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white">
            <DialogTitle className="text-base font-semibold">Подреди по</DialogTitle>
            <button
              onClick={handleSortCancel}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Options */}
          <div className="px-4 py-4 space-y-5 bg-white">
            {[
              { value: "price-asc", label: "Цена възходящо" },
              { value: "price-desc", label: "Цена низходящо" },
              { value: "popular", label: "Най-продавани" },
              { value: "name-asc", label: "Нови" },
              { value: "featured", label: "На фокус" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setTempSortBy(option.value)}
              >
                <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                  tempSortBy === option.value ? 'border-gray-300 bg-white' : 'border-gray-300 bg-white'
                }`}>
                  {tempSortBy === option.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          
          {/* Footer buttons */}
          <div className="flex gap-2 px-4 py-3 bg-white">
            <Button 
              onClick={handleSortApply}
              className="flex-1 bg-[#1a4b8c] hover:bg-[#153d73] text-white rounded h-9 text-sm"
            >
              Запази
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSortCancel}
              className="flex-1 border-[#1a4b8c] text-[#1a4b8c] hover:bg-[#1a4b8c]/10 rounded h-9 text-sm"
            >
              Отказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
