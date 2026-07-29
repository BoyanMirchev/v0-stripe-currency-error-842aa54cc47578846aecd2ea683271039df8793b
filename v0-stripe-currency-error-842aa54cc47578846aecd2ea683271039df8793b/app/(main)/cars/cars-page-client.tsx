"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SlidersHorizontal, Grid3x3, List, Car, ShoppingCart, Heart, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown, Phone } from "lucide-react"
import { Header } from "@/components/header"
import { PriceRangeFilter } from "@/components/price-range-filter"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CarDetails {
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
  engine_size: string | null
  horsepower: number | null
  doors: number | null
  seats: number | null
  location: string | null
  status: string
  features: string | null
  created_at: string
  promotions: number | null // Changed from string to number for discount amount
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

interface CarsPageClientProps {
  initialCars: CarDetails[]
  initialBanner: CategoryBanner | null
}

export default function CarsPageClient({ initialCars, initialBanner }: CarsPageClientProps) {
  const [cars, setCars] = useState<CarDetails[]>(initialCars)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedMakes, setSelectedMakes] = useState<string[]>([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [mileageRange, setMileageRange] = useState([0, 500000])
  const [sortDialogOpen, setSortDialogOpen] = useState(false)
  const [tempSortBy, setTempSortBy] = useState(sortBy)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Category banner state
  const [categoryBanner, setCategoryBanner] = useState<CategoryBanner | null>(initialBanner)

  // Dual currency price inputs
  const [minPriceBGN, setMinPriceBGN] = useState("")
  const [maxPriceBGN, setMaxPriceBGN] = useState("")
  const [minPriceEUR, setMinPriceEUR] = useState("")
  const [maxPriceEUR, setMaxPriceEUR] = useState("")

  // Dual currency mileage inputs
  const [minMileageInput, setMinMileageInput] = useState("")
  const [maxMileageInput, setMaxMileageInput] = useState("")

  // EUR to BGN exchange rate (approximate)
  const EUR_TO_BGN = 1.9558

  // Filter section collapse states
  const [priceFilterOpen, setPriceFilterOpen] = useState(true)
  const [mileageFilterOpen, setMileageFilterOpen] = useState(true)
  const [brandFilterOpen, setBrandFilterOpen] = useState(true)
  const [fuelFilterOpen, setFuelFilterOpen] = useState(false)
  const [transmissionFilterOpen, setTransmissionFilterOpen] = useState(false)
  const [yearFilterOpen, setYearFilterOpen] = useState(false)

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  // Calculate price histogram data
  const priceHistogram = useMemo(() => {
    if (cars.length === 0) return { buckets: [], minPrice: 0, maxPrice: 100000 }
    
    const prices = cars.map((car) => car.price)
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
  }, [cars])

  // Calculate mileage histogram data
  const mileageHistogram = useMemo(() => {
    if (cars.length === 0) return { buckets: [], minMileage: 0, maxMileage: 500000 }
    
    const mileages = cars.map((car) => car.mileage)
    const minMileage = Math.min(...mileages)
    const maxMileage = Math.max(...mileages)
    const bucketCount = 8
    const bucketSize = (maxMileage - minMileage) / bucketCount
    
    const buckets = Array(bucketCount).fill(0)
    mileages.forEach((mileage) => {
      const bucketIndex = Math.min(
        Math.floor((mileage - minMileage) / bucketSize),
        bucketCount - 1
      )
      buckets[bucketIndex]++
    })
    
    const maxBucketCount = Math.max(...buckets)
    const normalizedBuckets = buckets.map((count) => 
      maxBucketCount > 0 ? (count / maxBucketCount) * 100 : 0
    )
    
      return { buckets: normalizedBuckets, minMileage, maxMileage }
  }, [cars])

  // Debounce refs for price and mileage
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const mileageDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Update price range when inputs change (with debounce)
  const handlePriceInputChange = (type: 'min' | 'max', currency: 'BGN' | 'EUR', value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Update input values immediately (no debounce for visual feedback)
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
    
    // Debounce the priceRange update to avoid re-rendering while typing
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current)
    }
    priceDebounceRef.current = setTimeout(() => {
      if (currency === 'BGN') {
        if (type === 'min') {
          setPriceRange(prev => [numValue / EUR_TO_BGN, prev[1]])
        } else {
          setPriceRange(prev => [prev[0], numValue / EUR_TO_BGN])
        }
      } else {
        if (type === 'min') {
          setPriceRange(prev => [numValue, prev[1]])
        } else {
          setPriceRange(prev => [prev[0], numValue])
        }
      }
    }, 500)
  }

  // Update mileage range when inputs change (with debounce)
  const handleMileageInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Update input values immediately
    if (type === 'min') {
      setMinMileageInput(value)
    } else {
      setMaxMileageInput(value)
    }
    
    // Debounce the mileageRange update
    if (mileageDebounceRef.current) {
      clearTimeout(mileageDebounceRef.current)
    }
    mileageDebounceRef.current = setTimeout(() => {
      if (type === 'min') {
        setMileageRange(prev => [numValue, prev[1]])
      } else {
        setMileageRange(prev => [prev[0], numValue])
      }
    }, 500)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [
    searchTerm,
    priceRange,
    selectedMakes,
    selectedFuelTypes,
    selectedTransmissions,
    selectedYears,
    mileageRange,
    sortBy,
  ])

  const makes = Array.from(new Set(cars.map((car) => car.make).filter(Boolean)))
  const fuelTypes = Array.from(new Set(cars.map((car) => car.fuel_type).filter(Boolean)))
  const transmissions = Array.from(new Set(cars.map((car) => car.transmission).filter(Boolean)))
  const years = Array.from(new Set(cars.map((car) => car.year.toString()).filter(Boolean))).sort(
    (a, b) => Number.parseInt(b) - Number.parseInt(a),
  )

  const filteredCars = cars
    .filter((car) => {
      const searchStr = searchTerm.toLowerCase()
      const matchesSearch =
        car.make?.toLowerCase().includes(searchStr) ||
        car.model?.toLowerCase().includes(searchStr) ||
        car.color?.toLowerCase().includes(searchStr)

      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1]
      const matchesMileage = car.mileage >= mileageRange[0] && car.mileage <= mileageRange[1]
      const matchesMake = selectedMakes.length === 0 || selectedMakes.includes(car.make)
      const matchesFuelType = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(car.fuel_type)
      const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(car.transmission)
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(car.year.toString())
      const matchesStatus = car.status === "available"

      return (
        matchesSearch &&
        matchesPrice &&
        matchesMileage &&
        matchesMake &&
        matchesFuelType &&
        matchesTransmission &&
        matchesYear &&
        matchesStatus
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "year-desc":
          return b.year - a.year
        case "year-asc":
          return a.year - b.year
        case "mileage-asc":
          return a.mileage - b.mileage
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCars = filteredCars.slice(startIndex, endIndex)

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((pageNum) => {
      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
        return pageNum
      }
      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
        return "..."
      }
      return null
    })
    .filter((num) => num !== null)

  const handleAddToCart = (car: CarDetails) => {
    const originalPrice = car.price
    const discountAmount = car.promotions || 0
    const finalPrice = Math.max(0, originalPrice - discountAmount)
    addToCart({
      id: car.id,
      name: `${car.make} ${car.model}`,
      price: finalPrice,
      image: car.image_url || null,
      category: car.make,
      type: "cars",
    })
    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${car.make} ${car.model} беше добавено в количката.`,
    })
  }

  const handleToggleFavorite = (car: CarDetails) => {
    const isFav = isFavorited("cars", car.id)
    if (isFav) {
      removeFavorite("cars", car.id)
      toast({
        variant: "favorite",
        title: "Премахнато от харесани",
        description: `${car.make} ${car.model} беше премахнато от харесани.`,
      })
    } else {
      addFavorite({
        id: car.id,
        name: `${car.make} ${car.model}`,
        price: car.price,
        image: car.image_url || null,
        category: car.make,
        type: "cars",
      })
      toast({
        variant: "favorite",
        title: "Добавено в харесани!",
        description: `${car.make} ${car.model} беше добавено в харесани.`,
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

      {/* Mileage Filter */}
      <PriceRangeFilter
        label="Пробег (км)"
        color="blue"
        min={mileageHistogram.minMileage}
        max={mileageHistogram.maxMileage}
        value={mileageRange}
        onChange={(val) => setMileageRange(val)}
        formatValue={(val) => `${Math.round(val).toLocaleString("bg-BG")} км`}
      />

      {/* Make Filter */}
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
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
            {makes.map((make) => (
              <label key={make} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMakes.includes(make)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMakes([...selectedMakes, make])
                    } else {
                      setSelectedMakes(selectedMakes.filter((m) => m !== make))
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm">{make}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="py-4">
        <button
          onClick={() => setFuelFilterOpen(!fuelFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Тип гориво</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${fuelFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {fuelFilterOpen && (
          <div className="mt-4 space-y-3">
            {fuelTypes.map((fuel) => (
              <label key={fuel} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFuelTypes.includes(fuel)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFuelTypes([...selectedFuelTypes, fuel])
                    } else {
                      setSelectedFuelTypes(selectedFuelTypes.filter((f) => f !== fuel))
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm">{fuel}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Transmission Filter */}
      <div className="py-4">
        <button
          onClick={() => setTransmissionFilterOpen(!transmissionFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Скоростна кутия</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${transmissionFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {transmissionFilterOpen && (
          <div className="mt-4 space-y-3">
            {transmissions.map((trans) => (
              <label key={trans} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTransmissions.includes(trans)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTransmissions([...selectedTransmissions, trans])
                    } else {
                      setSelectedTransmissions(selectedTransmissions.filter((t) => t !== trans))
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm">{trans}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Year Filter */}
      <div className="py-4">
        <button
          onClick={() => setYearFilterOpen(!yearFilterOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-bold text-base">Година</h3>
          <ChevronDown
            className={`h-5 w-5 text-red-500 transition-transform ${yearFilterOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {yearFilterOpen && (
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
            {years.map((year) => (
              <label key={year} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedYears([...selectedYears, year])
                    } else {
                      setSelectedYears(selectedYears.filter((y) => y !== year))
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm">{year}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear All Button */}
      <div className="py-4">
        <button
          onClick={() => {
            setSearchTerm("")
            setPriceRange([0, 100000])
            setMileageRange([0, 500000])
            setSelectedMakes([])
            setSelectedFuelTypes([])
            setSelectedTransmissions([])
            setSelectedYears([])
            setMinPriceBGN("")
            setMaxPriceBGN("")
            setMinPriceEUR("")
            setMaxPriceEUR("")
            setMinMileageInput("")
            setMaxMileageInput("")
          }}
          className="w-full py-2.5 border-2 border-blue-500 rounded-full text-gray-700 text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Изчисти всички филтри
        </button>
      </div>
    </div>
  )

  const getSortLabel = (value: string) => {
    const labels: Record<string, string> = {
      newest: "Най-нови",
      "price-asc": "Цена възходящо",
      "price-desc": "Цена низходящо",
      "year-desc": "Година низходящо",
      "year-asc": "Година възходящо",
      "mileage-asc": "Пробег възходящо",
    }
    return labels[value] || "Най-нови"
  }

  const handleSortCancel = () => {
    setSortDialogOpen(false)
  }

  const handleSortApply = () => {
    setSortBy(tempSortBy)
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
            <span className="text-foreground">Автомобили</span>
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Начало
            </Link>
            <span>›</span>
            <span className="text-foreground">Автомобили</span>
          </div>
        </div>

        {/* Category Banner - visible on all screens */}
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

        {/* Mobile Header - Title, Filters, Sort (after banner) */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-4 mb-4">
          {/* First row - Category name and count */}
          <div className="pt-2 pb-2">
            <h1 className="text-lg font-bold">Автомобили ({filteredCars.length})</h1>
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
                Автомобили <span className="text-muted-foreground">({filteredCars.length})</span>
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
                {filteredCars.length === 0 ? (
                  <div className="text-center py-16">
                    <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Няма намерени автомобили</h3>
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
                    {paginatedCars.map((car) => {
                      const originalPrice = Number(car.price)
                      const discountAmount = Number(car.promotions || 0)
                      const finalPrice = Math.max(0, originalPrice - discountAmount)
                      const hasPromotion = discountAmount > 0

                      return (
                        <div key={car.id} className="flex-none">
                          <div
                            className="bg-white rounded-lg p-3 relative group hover:border transition-all cursor-pointer flex flex-col border"
                            style={{ height: "380px", borderColor: "#f1f2f3" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#1b6ea5"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#f1f2f3"
                            }}
                            onTouchStart={(e) => {
                              e.currentTarget.style.borderColor = "#1b6ea5"
                            }}
                            onTouchEnd={(e) => {
                              e.currentTarget.style.borderColor = "#f1f2f3"
                            }}
                          >
                            {/* Promotion Badge */}
                            {hasPromotion && (
                              <div
                                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border z-10"
                                style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                              >
                                ПРОМОЦИЯ
                              </div>
                            )}

                            <Link href={`/cars/${car.id}`} className="relative mb-3 flex-shrink-0 block h-[160px]">
                              {car.image_url ? (
                                <img
                                  src={car.image_url || "/placeholder.svg"}
                                  alt={`${car.make} ${car.model}`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Car className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </Link>

                            <Link href={`/cars/${car.id}`} className="block">
                              <h3
                                className="text-xs md:text-base font-medium mb-1 line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem] hover:text-red-600 transition-colors leading-tight"
                                style={{ color: "#282828" }}
                              >
                                {car.make} {car.model} {car.year}
                              </h3>
                            </Link>

                            {/* Price - with promotion styling */}
                            {hasPromotion ? (
                              <div className="mb-2 mt-auto flex items-baseline gap-1 flex-wrap">
                                <span className="text-sm text-red-500 line-through font-semibold">
                                  {originalPrice.toFixed(2)} €
                                </span>
                                <span className="text-sm text-gray-400">/</span>
                                <span className="text-lg font-bold" style={{ color: "#1a4b8c" }}>
                                  {finalPrice.toFixed(2)} €
                                </span>
                              </div>
                            ) : (
                              <div className="text-lg font-bold mb-2 text-red-600 mt-auto" style={{ fontFamily: "var(--font-open-sans)" }}>
                                {finalPrice.toFixed(2)} €
                              </div>
                            )}

                            <a
                              href="tel:+359882738155"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                              className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg mt-auto"
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
                )}
              </div>

              {/* Pagination Component */}
              {filteredCars.length > 0 && (
                <div className="flex items-center justify-center gap-2 py-4 px-6">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: currentPage === 1 ? "#d1d5db" : "#1b6fa4",
                      color: currentPage === 1 ? "#9ca3af" : "#1b6fa4",
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Предишна</span>
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
                          className="min-w-[40px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all"
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
                    {totalPages > 2 && currentPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                  </div>

                  {/* Desktop pagination - show full pageNumbers */}
                  <div className="hidden md:flex gap-2">
                    {pageNumbers.map((pageNum, index) => {
                      if (pageNum === "...") {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum as number)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                          className="min-w-[40px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all"
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
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: currentPage === totalPages ? "#d1d5db" : "#1b6fa4",
                      color: currentPage === totalPages ? "#9ca3af" : "#1b6fa4",
                    }}
                  >
                    <span className="text-sm font-medium">Следваща</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Sort Dialog */}
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
              { value: "newest", label: "Най-нови" },
              { value: "price-asc", label: "Цена възходящо" },
              { value: "price-desc", label: "Цена низходящо" },
              { value: "year-desc", label: "Година низходящо" },
              { value: "year-asc", label: "Година възходящо" },
              { value: "mileage-asc", label: "Пробег възходящо" },
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
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          
          {/* Apply button */}
          <div className="px-4 pb-4 bg-white">
            <button
              onClick={handleSortApply}
              className="w-full py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Приложи
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
