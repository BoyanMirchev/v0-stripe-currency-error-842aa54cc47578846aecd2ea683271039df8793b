"use client"

import { useState, useEffect, useMemo, useRef, useDeferredValue } from "react"
import { useSearchParams } from "next/navigation"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  SlidersHorizontal,
  Grid3x3,
  List,
  Sparkles,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { PriceRangeFilter } from "@/components/price-range-filter"
import Link from "next/link"
import Image from "next/image"

interface SilverSale {
  id: number
  silver_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  status: string
  notes: string | null
  image_url: string | null
  images: string[] | null
  created_at: string
  updated_at: string
  promotions: number | null
  subcategory: string
  category_id: number | null
  subcategory_id: number | null
  category_name: string | null
}

interface SilverCategory {
  id: number
  name: string
  slug: string
  sort_order: number
  parent_id: number | null
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

interface SilverPageClientProps {
  initialSilver: SilverSale[]
  initialCategories: SilverCategory[]
  initialBanner: CategoryBanner | null
}

export default function SilverPageClient({ initialSilver, initialCategories, initialBanner }: SilverPageClientProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [silverItems, setSilverItems] = useState<SilverSale[]>(initialSilver)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [silverTypeFilter, setSilverTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 35000000])
  const [weightRange, setWeightRange] = useState([0, 250000])
  const [purityFilter, setPurityFilter] = useState("all")
  const [sortDialogOpen, setSortDialogOpen] = useState(false)
  const [tempSortBy, setTempSortBy] = useState(sortBy)
  const [isSticky, setIsSticky] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const topRef = useRef<HTMLDivElement>(null)
  
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const [silverCategories, setSilverCategories] = useState<SilverCategory[]>(initialCategories)
  const [silverSubcategories, setSilverSubcategories] = useState<{ id: string; label: string }[]>([])

  // Filter section collapse states
  const [silverTypeFilterOpen, setSilverTypeFilterOpen] = useState(true)
  const [priceFilterOpen, setPriceFilterOpen] = useState(true)
  const [weightFilterOpen, setWeightFilterOpen] = useState(true)
  const [purityFilterOpen, setPurityFilterOpen] = useState(true)

  // Dual currency price inputs
  const [minPriceBGN, setMinPriceBGN] = useState("")
  const [maxPriceBGN, setMaxPriceBGN] = useState("")
  const [minPriceEUR, setMinPriceEUR] = useState("")
  const [maxPriceEUR, setMaxPriceEUR] = useState("")
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Weight inputs
  const [minWeight, setMinWeight] = useState("")
  const [maxWeight, setMaxWeight] = useState("")

  // EUR to BGN exchange rate
  const EUR_TO_BGN = 1.9558

  // Category banner state
  const [categoryBanner, setCategoryBanner] = useState<CategoryBanner | null>(initialBanner)

  // Category info for breadcrumbs
  const [categoryInfo, setCategoryInfo] = useState<{
    name: string
    parentName?: string
    parentId?: number
  } | null>(null)

  useEffect(() => {
    if (silverCategories.length > 0) {
      updateSubcategoriesList(silverCategories, null, categoryParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const updateSubcategoriesList = (categories: SilverCategory[], parentId: number | null, urlParam: string | null) => {
    let matchedParent: SilverCategory | undefined
    let matchedCategory: SilverCategory | undefined

    if (urlParam) {
      matchedCategory = categories.find((cat) => cat.slug === urlParam)

      if (matchedCategory) {
        const hasChildren = categories.some((cat) => cat.parent_id === matchedCategory!.id)

        if (hasChildren || matchedCategory.parent_id === null) {
          matchedParent = matchedCategory
        } else if (matchedCategory.parent_id) {
          matchedParent = categories.find((cat) => cat.id === matchedCategory!.parent_id)
        }
      }
    }

    const effectiveParentId = matchedParent?.id || parentId

    if (effectiveParentId) {
      const childCategories = categories.filter((cat) => cat.parent_id === effectiveParentId)

      const subcatList = [
        { id: "all", label: "ВСИЧКИ" },
        ...childCategories.map((cat) => ({ id: String(cat.id), label: cat.name.toUpperCase() })),
      ]
      setSilverSubcategories(subcatList)
      setSelectedParentCategory(effectiveParentId)

      if (matchedCategory && matchedCategory.parent_id === effectiveParentId) {
        setSelectedSubcategory(String(matchedCategory.id))
      } else {
        setSelectedSubcategory("all")
      }
    } else {
      const parentCategories = categories.filter((cat) => cat.parent_id === null)

      const subcatList = [
        { id: "all", label: "ВСИЧКИ" },
        ...parentCategories.map((cat) => ({ id: String(cat.id), label: cat.name.toUpperCase() })),
      ]
      setSilverSubcategories(subcatList)
      setSelectedParentCategory(null)

      if (matchedCategory && !matchedCategory.parent_id) {
        setSelectedSubcategory(String(matchedCategory.id))
      }
    }
  }

  useEffect(() => {
    if (silverCategories.length > 0) {
      updateSubcategoriesList(silverCategories, null, categoryParam)
    }
  }, [categoryParam, silverCategories])

  // Name of the parent we are currently drilled into (for the "back" bar / breadcrumb)
  const currentParentName = selectedParentCategory
    ? silverCategories.find((cat) => cat.id === selectedParentCategory)?.name ?? null
    : null

  // Handle a tab click: drill into a parent category (show its subcategories)
  // instead of just filtering, matching the homepage "Категории" behaviour.
  const handleTabClick = (catId: string) => {
    if (catId === "all") {
      setSelectedSubcategory("all")
      return
    }

    const id = Number.parseInt(catId)
    const clickedCat = silverCategories.find((cat) => cat.id === id)
    const hasChildren = silverCategories.some((cat) => cat.parent_id === id)
    const isTopLevel = selectedParentCategory === null

    // A top-level parent with children -> drill into it and reveal its subcategories
    if (isTopLevel && clickedCat?.parent_id === null && hasChildren) {
      updateSubcategoriesList(silverCategories, id, null)
      setSelectedSubcategory("all")
      return
    }

    // Otherwise it's a leaf -> just filter by it
    setSelectedSubcategory(catId)
  }

  // Go back up to the top-level category list
  const handleCategoryBack = () => {
    updateSubcategoriesList(silverCategories, null, null)
    setSelectedParentCategory(null)
    setSelectedSubcategory("all")
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [
    silverTypeFilter,
    sortBy,
    priceRange,
    weightRange,
    purityFilter,
    searchTerm,
    selectedSubcategory,
    selectedParentCategory,
  ])

  const silverTypes = Array.from(new Set(silverItems.map((item) => item.silver_type))).filter(Boolean)

  const priceHistogram = useMemo(() => {
    if (silverItems.length === 0) return { buckets: [], minPrice: 0, maxPrice: 35000000 }
    
    const prices = silverItems.map((item) => Number(item.price_per_gram) * Number(item.weight_grams))
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
  }, [silverItems])

  const weightHistogram = useMemo(() => {
    if (silverItems.length === 0) return { buckets: [], minWeight: 0, maxWeight: 250000 }
    
    const weights = silverItems.map((item) => Number(item.weight_grams))
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)
    const bucketCount = 8
    const bucketSize = (maxWeight - minWeight) / bucketCount
    
    const buckets = Array(bucketCount).fill(0)
    weights.forEach((weight) => {
      const bucketIndex = Math.min(
        Math.floor((weight - minWeight) / bucketSize),
        bucketCount - 1
      )
      buckets[bucketIndex]++
    })
    
    const maxBucketCount = Math.max(...buckets)
    const normalizedBuckets = buckets.map((count) => 
      maxBucketCount > 0 ? (count / maxBucketCount) * 100 : 0
    )
    
    return { buckets: normalizedBuckets, minWeight, maxWeight }
  }, [silverItems])

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

  const handleWeightInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    if (type === 'min') {
      setMinWeight(value)
      setWeightRange([numValue, weightRange[1]])
    } else {
      setMaxWeight(value)
      setWeightRange([weightRange[0], numValue])
    }
  }

  // Use deferred values for filtering to prevent input focus loss
  const deferredPriceRange = useDeferredValue(priceRange)
  const deferredWeightRange = useDeferredValue(weightRange)
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const deferredSilverTypeFilter = useDeferredValue(silverTypeFilter)
  const deferredPurityFilter = useDeferredValue(purityFilter)
  const deferredSelectedSubcategory = useDeferredValue(selectedSubcategory)
  const deferredSelectedParentCategory = useDeferredValue(selectedParentCategory)
  const deferredSortBy = useDeferredValue(sortBy)

  const filteredSilver = useMemo(() => silverItems
    .filter((item) => {
      const matchesSearch =
        deferredSearchTerm === "" ||
        item.silver_type.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(deferredSearchTerm.toLowerCase())

      const matchesType = deferredSilverTypeFilter === "all" || item.silver_type === deferredSilverTypeFilter

      const itemPrice = Number(item.price_per_gram) * Number(item.weight_grams)
      const matchesPrice = itemPrice >= deferredPriceRange[0] && itemPrice <= deferredPriceRange[1]

      const matchesWeight = Number(item.weight_grams) >= deferredWeightRange[0] && Number(item.weight_grams) <= deferredWeightRange[1]

      let matchesPurity = true
      const purity = Number(item.purity_percentage)
      if (deferredPurityFilter === "high") matchesPurity = purity >= 90
      else if (deferredPurityFilter === "medium") matchesPurity = purity >= 75 && purity < 90
      else if (deferredPurityFilter === "low") matchesPurity = purity < 75

      let matchesCategory = true
      if (deferredSelectedSubcategory !== "all") {
        const selectedId = Number.parseInt(deferredSelectedSubcategory)
        // Check if the selected subcategory is actually a parent category
        const selectedCat = silverCategories.find((cat) => cat.id === selectedId)
        if (selectedCat && selectedCat.parent_id === null) {
          // It's a parent category, so check if item belongs to this parent or any of its children
          const childCategoryIds = silverCategories
            .filter((cat) => cat.parent_id === selectedId)
            .map((cat) => cat.id)
          matchesCategory =
            item.category_id === selectedId ||
            (item.subcategory_id !== null && childCategoryIds.includes(item.subcategory_id))
        } else {
          // It's a child category, check subcategory_id
          matchesCategory = item.subcategory_id === selectedId
        }
      } else if (deferredSelectedParentCategory) {
        const childCategoryIds = silverCategories
          .filter((cat) => cat.parent_id === deferredSelectedParentCategory)
          .map((cat) => cat.id)
        matchesCategory =
          item.category_id === deferredSelectedParentCategory ||
          (item.subcategory_id !== null && childCategoryIds.includes(item.subcategory_id))
      }

      return matchesSearch && matchesType && matchesPrice && matchesWeight && matchesPurity && matchesCategory
    })
    .sort((a, b) => {
      switch (deferredSortBy) {
        case "price_asc":
          return Number(a.price_per_gram) * Number(a.weight_grams) - Number(b.price_per_gram) * Number(b.weight_grams)
        case "price_desc":
          return Number(b.price_per_gram) * Number(b.weight_grams) - Number(a.price_per_gram) * Number(a.weight_grams)
        case "weight_asc":
          return Number(a.weight_grams) - Number(b.weight_grams)
        case "weight_desc":
          return Number(b.weight_grams) - Number(a.weight_grams)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    }), [silverItems, deferredSearchTerm, deferredSilverTypeFilter, deferredPriceRange, deferredWeightRange, deferredPurityFilter, deferredSelectedSubcategory, deferredSelectedParentCategory, silverCategories, deferredSortBy])

  const totalPages = Math.ceil(filteredSilver.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSilver = filteredSilver.slice(startIndex, endIndex)

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  const FiltersContent = () => (
    <div className="divide-y divide-gray-200">
      {/* Silver Type Filter */}
      <div className="py-4">
        <button
          onClick={() => setSilverTypeFilterOpen(!silverTypeFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Тип сребро</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${silverTypeFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {silverTypeFilterOpen && (
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="silverType"
                checked={silverTypeFilter === "all"}
                onChange={() => setSilverTypeFilter("all")}
                className="w-5 h-5 rounded border-gray-300 accent-gray-500"
              />
              <span className="text-sm">Всички типове</span>
            </label>
            {silverTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="silverType"
                  checked={silverTypeFilter === type}
                  onChange={() => setSilverTypeFilter(type)}
                  className="w-5 h-5 rounded border-gray-300 accent-gray-500"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <PriceRangeFilter
        min={priceHistogram.minPrice}
        max={priceHistogram.maxPrice}
        value={priceRange}
        onChange={(val) => setPriceRange(val)}
      />

      {/* Weight Filter */}
      <PriceRangeFilter
        label="Тегло"
        color="blue"
        min={weightHistogram.minWeight}
        max={weightHistogram.maxWeight}
        value={weightRange}
        onChange={(val) => setWeightRange(val)}
        formatValue={(v) => `${v.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}g`}
      />

      {/* Purity Filter */}
      <div className="py-4">
        <button
          onClick={() => setPurityFilterOpen(!purityFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Чистота</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${purityFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {purityFilterOpen && (
          <div className="mt-4 space-y-3">
            {[
              { value: "all", label: "Всички" },
              { value: "high", label: "Висока (90%+)" },
              { value: "medium", label: "Средна (75-90%)" },
              { value: "low", label: "Ниска (<75%)" },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="purity"
                  checked={purityFilter === option.value}
                  onChange={() => setPurityFilter(option.value)}
                  className="w-5 h-5 rounded border-gray-300 accent-gray-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Button */}
      <div className="py-4">
        <Button
          onClick={() => {
            setSearchTerm("")
            setSilverTypeFilter("all")
            setMinPriceBGN("")
            setMaxPriceBGN("")
            setMinPriceEUR("")
            setMaxPriceEUR("")
            setPriceRange([0, 35000000])
            setMinWeight("")
            setMaxWeight("")
            setWeightRange([0, 250000])
            setPurityFilter("all")
            setSelectedSubcategory("all")
            setSelectedParentCategory(null)
          }}
          className="w-full"
          variant="outline"
        >
          Изчисти всички филтри
        </Button>
      </div>
    </div>
  )

  const getSortLabel = (value: string) => {
    const labels: Record<string, string> = {
      newest: "Най-нови",
      price_asc: "Цена възходящо",
      price_desc: "Цена низходящо",
      weight_asc: "Тегло възходящо",
      weight_desc: "Тегло низходящо",
    }
    return labels[value] || "Най-нови"
  }

  const handleAddToCart = (item: SilverSale, primaryImage: string) => {
  addToCart({
  id: item.id,
  name: `${item.category_name || item.silver_type} ${item.silver_type}`,
      price: Number(item.price_per_gram) * Number(item.weight_grams),
      image: primaryImage || null,
      category: item.silver_type,
      type: "silver",
      weight_grams: item.weight_grams,
      silver_type: item.silver_type,
    })
  toast({
  variant: "cart",
  title: "Успешно добавено!",
  description: `${item.category_name || item.silver_type} ${item.silver_type} беше добавено в количката.`,
    })
  }

  const handleToggleFavorite = (item: SilverSale) => {
    const isFav = isFavorited("silver", item.id)
    if (isFav) {
      removeFavorite("silver", item.id)
  toast({
  variant: "favorite",
  title: "Премахнато от харесани",
  description: `${item.category_name || item.silver_type} ${item.silver_type} беше премахнато от харесани.`,
      })
    } else {
  addFavorite({
  id: item.id,
  name: `${item.category_name || item.silver_type} ${item.silver_type}`,
        price: Number(item.price_per_gram) * Number(item.weight_grams),
        image: item.image_url || null,
        category: item.silver_type,
        type: "silver",
      })
  toast({
  variant: "favorite",
  title: "Добавено в харесани!",
  description: `${item.category_name || item.silver_type} ${item.silver_type} беше добавено в харесани.`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-[#eaebee] pb-8">
        {/* Breadcrumbs */}
        <div className="hidden lg:block max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Начало
            </Link>
            <span>›</span>
            <Link href="/silver" className="hover:text-foreground">
              Сребро
            </Link>
            {categoryInfo?.parentName && (
              <>
                <span>›</span>
                <Link href={`/silver?category=${categoryInfo.parentId}`} className="hover:text-foreground">
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

        {/* Mobile Breadcrumbs */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Начало
            </Link>
            <span>›</span>
            <Link href="/silver" className="hover:text-foreground">
              Сребро
            </Link>
          </div>
        </div>

        {/* Category Banner */}
        {categoryBanner && (
          <div className="max-w-[1400px] mx-auto px-4 mb-4">
            <Link href={categoryBanner.link_url || "#"} className="block">
              <div className="relative w-full overflow-hidden shadow-sm">
                <img
                  src={categoryBanner.image_url}
                  alt={categoryBanner.title || "Promotional banner"}
                  className="w-full h-auto object-cover"
                />
              </div>
            </Link>
          </div>
        )}

        {/* Desktop Subcategories Navigation */}
        {silverSubcategories.length > 1 && (
          <div className="hidden lg:block max-w-[1400px] mx-auto px-4 mb-4">
            <div className="bg-white py-4 px-6 shadow-sm border border-gray-100">
              {selectedParentCategory && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <button
                    type="button"
                    onClick={handleCategoryBack}
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Назад
                  </button>
                  {currentParentName && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-700 font-medium">{currentParentName}</span>
                    </>
                  )}
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {silverSubcategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleTabClick(cat.id)}
                    className={`relative pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedSubcategory === cat.id ? "text-gray-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-600 transition-all ${
                        selectedSubcategory === cat.id ? "w-8" : "w-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 mb-4">
          <div className="pt-2 pb-2">
            <h1 className="text-lg font-bold">
              {categoryInfo ? categoryInfo.name : "Сребро"} ({filteredSilver.length})
            </h1>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button className="bg-gray-500 hover:bg-gray-600 text-white rounded-none px-3 py-2 h-auto">
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
                    className="w-full h-12 text-base font-semibold rounded-none bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-lg"
                  >
                    Покажи резултати
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

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

            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2 border border-gray-400 rounded-none hover:bg-gray-50"
              title={viewMode === "grid" ? "Списък" : "Решетка"}
            >
              <List className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Category Tabs */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 py-3">
          {selectedParentCategory && (
            <button
              type="button"
              onClick={handleCategoryBack}
              className="inline-flex items-center gap-1 mb-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Назад
              {currentParentName && <span className="text-gray-700 font-medium">/ {currentParentName}</span>}
            </button>
          )}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {silverSubcategories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleTabClick(cat.id)}
                  className={`relative pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedSubcategory === cat.id ? "text-gray-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gray-600 transition-all ${
                      selectedSubcategory === cat.id ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div ref={topRef} className="max-w-[1400px] mx-auto px-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {categoryInfo ? categoryInfo.name : "Сребро"} <span className="text-muted-foreground">({filteredSilver.length})</span>
              </h1>

              <div className="flex items-center gap-2">
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

        {/* Desktop Filters and Products Grid */}
        <div className="hidden lg:block max-w-[1400px] mx-auto lg:px-4">
          <div className="flex gap-4 items-start">
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white shadow-sm sticky top-4 self-start">
              <div className="px-4 py-2">
                {FiltersContent()}
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="bg-white shadow-sm p-2 lg:p-3">
                {filteredSilver.length === 0 ? (
                  <div className="text-center py-16">
                    <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Няма намерено сребро</h3>
                    <p className="text-muted-foreground">Опитайте да промените филтрите за търсене</p>
                  </div>
                ) : (
                  <>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 auto-rows-fr"
                          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr"
                      }
                    >
                      {paginatedSilver.map((item) => {
                        const primaryImage = (item.images && item.images.length > 0 ? item.images[0] : item.image_url) || null
                        const isFav = isFavorited("silver", item.id)
                        const originalPrice = Number(item.price_per_gram) * Number(item.weight_grams)
                        const discountAmount = Number(item.promotions) || 0
                        const finalPrice = Math.max(0, originalPrice - discountAmount)
                        const eurPrice = finalPrice.toFixed(2)
                        const hasPromotion = discountAmount > 0

                        return (
                          <div
                            key={item.id}
                            className="bg-[#1a1a1a] rounded-lg p-3 relative group hover:border transition-all flex flex-col border h-full"
                            style={{ minHeight: "380px", borderColor: "#333333" }}
                          >
                            {hasPromotion && (
                              <div
                                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border z-10"
                                style={{ color: "#a0a0a0", borderColor: "#a0a0a0", backgroundColor: "#1d1d1f" }}
                              >
                                ПРОМОЦИЯ
                              </div>
                            )}

                            <Link href={`/silver/${item.id}`} className="relative mb-3 flex-shrink-0 flex items-center justify-center" style={{ height: "160px" }}>
                              {primaryImage ? (
  <Image
  src={primaryImage || "/placeholder.svg"}
  alt={`${item.category_name || item.silver_type} ${item.silver_type}`}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 200px"
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#1d1d1f] flex items-center justify-center">
                                  <Sparkles className="h-8 w-8" style={{ color: "#a0a0a0" }} />
                                </div>
                              )}
                            </Link>

                            <Link href={`/silver/${item.id}`}>
                              <h3
  className="text-xs md:text-base font-medium mb-1 line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem] hover:text-gray-300 transition-colors leading-tight"
  style={{ color: "#ffffff" }}
  >
  {item.category_name || item.silver_type} {item.silver_type}
                              </h3>
                            </Link>

                            {hasPromotion ? (
                              <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                                <span className="text-sm text-red-400 line-through font-semibold">{originalPrice.toFixed(2)} €</span>
                                <span className="text-sm text-gray-500">/</span>
                                <span className="text-lg font-bold text-gray-300">{eurPrice} €</span>
                              </div>
                            ) : (
                              <div className="text-lg font-bold mb-2 text-gray-300 mt-auto">{eurPrice} €</div>
                            )}

                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(item, primaryImage || "")
                              }}
                              className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                              style={{ height: "36px" }}
                            >
                              <div
                                className="flex items-center justify-center rounded-l-lg"
                                style={{ backgroundColor: "#222222", width: "40px", height: "36px" }}
                              >
                                <ShoppingCart className="w-4 h-4" style={{ color: "#a0a0a0" }} />
                              </div>
                              <div
                                className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                                style={{
                                  background: "linear-gradient(135deg, #a0a0a0 0%, #808080 100%)",
                                  height: "36px",
                                }}
                              >
                                <span className="text-[#1d1d1f] text-sm font-semibold">Добави</span>
                              </div>
                            </button>

                            <div className="flex items-center justify-center gap-6 mt-3">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
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

                    {/* Pagination */}
                    {filteredSilver.length > 0 && (
                      <div className="flex justify-center items-center gap-2 py-4 px-6">
                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                            scrollToTop()
                          }}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border transition-all"
                          style={{
                            borderColor: "#808080",
                            color: currentPage === 1 ? "#ccc" : "#808080",
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
                                  scrollToTop()
                                }}
                                className="w-10 h-10 border transition-all"
                                style={{
                                  borderColor: "#808080",
                                  backgroundColor: currentPage === pageNum ? "#808080" : "transparent",
                                  color: currentPage === pageNum ? "white" : "#808080",
                                }}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                          {totalPages > 2 && currentPage < totalPages - 1 && <span style={{ color: "#808080" }}>...</span>}
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
                                  scrollToTop()
                                }}
                                className="w-10 h-10 border transition-all"
                                style={{
                                  borderColor: "#808080",
                                  backgroundColor: currentPage === pageNum ? "#808080" : "transparent",
                                  color: currentPage === pageNum ? "white" : "#808080",
                                }}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                          {totalPages > 5 && currentPage < totalPages - 2 && <span style={{ color: "#808080" }}>...</span>}
                        </div>

                        <button
                          onClick={() => {
                            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                            scrollToTop()
                          }}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border transition-all"
                          style={{
                            borderColor: "#808080",
                            color: currentPage === totalPages ? "#ccc" : "#808080",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                          }}
                        >
                          Следваща
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Products Section */}
      <section className="lg:hidden bg-[#eaebee] pb-6 px-4">
        {filteredSilver.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Няма намерено сребро</h3>
            <p className="text-muted-foreground">Опитайте да промените филтрите за търсене</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {paginatedSilver.map((item) => {
                const primaryImage = (item.images && item.images.length > 0 ? item.images[0] : item.image_url) || null
                const isFav = isFavorited("silver", item.id)
                const originalPrice = Number(item.price_per_gram) * Number(item.weight_grams)
                const discountAmount = Number(item.promotions) || 0
                const finalPrice = Math.max(0, originalPrice - discountAmount)
                const eurPrice = finalPrice.toFixed(2)
                const hasPromotion = discountAmount > 0

                return (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] rounded-lg p-3 relative group hover:border transition-all flex flex-col border"
                    style={{ minHeight: "320px", borderColor: "#333333" }}
                  >
                    {hasPromotion && (
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border z-10"
                        style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                      >
                        ПРОМОЦИЯ
                      </div>
                    )}

                    <Link href={`/silver/${item.id}`} className="relative aspect-square mb-3 flex-shrink-0 block">
                      {primaryImage ? (
  <Image
  src={primaryImage || "/placeholder.svg"}
  alt={`${item.category_name || item.silver_type} ${item.silver_type}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 200px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </Link>

                    <Link href={`/silver/${item.id}`}>
                      <h3
  className="text-xs font-medium mb-1 line-clamp-2 min-h-[2.25rem] hover:text-gray-300 transition-colors leading-tight"
  style={{ color: "#ffffff" }}
  >
  {item.category_name || item.silver_type} {item.silver_type}
                      </h3>
                    </Link>

                    {hasPromotion ? (
                      <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                        <span className="text-xs text-red-400 line-through font-semibold">{originalPrice.toFixed(2)} €</span>
                        <span className="text-xs text-gray-500">/</span>
                        <span className="text-base font-bold text-gray-300">{eurPrice} €</span>
                      </div>
                    ) : (
                      <div className="text-base font-bold mb-2 text-gray-300 mt-auto">{eurPrice} €</div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(item, primaryImage || "")
                      }}
                      className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                      style={{ height: "32px" }}
                    >
                      <div
                        className="flex items-center justify-center rounded-l-lg"
                        style={{ backgroundColor: "#222222", width: "36px", height: "32px" }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" style={{ color: "#a0a0a0" }} />
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                        style={{
                          background: "linear-gradient(135deg, #a0a0a0 0%, #808080 100%)",
                          height: "32px",
                        }}
                      >
                        <span className="text-[#1d1d1f] text-xs font-semibold">Добави</span>
                      </div>
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "#9e9e9e" }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
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
                        className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "#9e9e9e" }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            {filteredSilver.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                    scrollToTop()
                  }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    borderColor: currentPage === 1 ? "#d1d5db" : "#808080",
                    color: currentPage === 1 ? "#9ca3af" : "#808080",
                  }}
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span className="text-xs font-medium">Предишна</span>
                </button>

                <span
                  className="px-3 py-2 rounded-lg border-2 text-xs font-medium"
                  style={{
                    borderColor: "#808080",
                    backgroundColor: "#808080",
                    color: "white",
                  }}
                >
                  {currentPage}
                </span>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    scrollToTop()
                  }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    borderColor: currentPage === totalPages ? "#d1d5db" : "#808080",
                    color: currentPage === totalPages ? "#9ca3af" : "#808080",
                  }}
                >
                  <span className="text-xs font-medium">Следваща</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
        <DialogContent 
          className="max-w-[240px] p-0 gap-0 rounded-none border-0 shadow-lg"
          overlayClassName="bg-black/30"
          hideCloseButton
        >
          <div className="h-1 bg-gray-500 w-full" />
          <div className="flex items-center justify-between px-4 py-3 bg-white">
            <DialogTitle className="text-base font-semibold">Подреди по</DialogTitle>
            <button
              onClick={() => setSortDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-4 space-y-5 bg-white">
            {[
              { value: "price_asc", label: "Цена възходящо" },
              { value: "price_desc", label: "Цена низходящо" },
              { value: "newest", label: "Най-нови" },
              { value: "weight_asc", label: "Тегло възходящо" },
              { value: "weight_desc", label: "Тегло низходящо" },
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          
          <div className="flex gap-2 px-4 py-3 bg-white">
            <Button 
              onClick={() => {
                setSortBy(tempSortBy)
                setSortDialogOpen(false)
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded h-9 text-sm"
            >
              Запази
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSortDialogOpen(false)}
              className="flex-1 border-gray-500 text-gray-500 hover:bg-gray-100 rounded h-9 text-sm"
            >
              Откажи
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
