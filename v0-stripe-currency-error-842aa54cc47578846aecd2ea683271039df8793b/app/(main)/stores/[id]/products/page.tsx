"use client"

import { useState, useEffect, use, useRef } from "react"
import { Header } from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Minus,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ChevronDown,
  X,
  Phone,
  Mail,
  ExternalLink,
  Store as StoreIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"

interface Store {
  id: number
  name: string
  address: string
  city: string
  neighborhood: string | null
  working_hours: string
  weekly_hours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  } | null
  image_url: string | null
  rating: number
  is_24_7: boolean
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  phone: string | null
  email?: string | null
}

interface GoldProduct {
  id: number
  gold_type: string
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
  product_type: "gold"
}

interface EquipmentProduct {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  images: string[] | null
  category_name: string | null
  product_type: "equipment"
  promotions?: number | null
  created_at: string
}

interface CarProduct {
  id: number
  brand: string
  model: string
  year: number
  price: number
  image_url: string | null
  images: string[] | null
  product_type: "car"
  created_at: string
}

interface SilverProduct {
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
  product_type: "silver"
}

type Product = GoldProduct | EquipmentProduct | CarProduct | SilverProduct

export default function StoreProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<{
    gold: GoldProduct[]
    silver: SilverProduct[]
    equipment: EquipmentProduct[]
    cars: CarProduct[]
    total: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recommended")
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [weightRange, setWeightRange] = useState<{ min: number; max: number } | null>(null)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)
  const filterSectionRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 12

  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        const response = await fetch(`/api/stores/${resolvedParams.id}/products`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("Store not found")
          } else {
            throw new Error("Failed to fetch store products")
          }
          return
        }
        const data = await response.json()
        setStore(data.store)
        setProducts(data.products)
        setLastUpdated(new Date())
      } catch (err) {
        console.error("Error fetching store products:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStoreProducts()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd35b]"></div>
      </div>
    )
  }

  if (error || !store || !products) {
    notFound()
  }

  // Combine all products for filtering
  const allProducts: Product[] = [
    ...products.gold,
    ...products.silver,
    ...products.equipment,
    ...products.cars,
  ]

  // Filter by category
  let filteredProducts = selectedCategory === "all"
    ? allProducts
    : selectedCategory === "gold"
      ? products.gold
      : selectedCategory === "silver"
        ? products.silver
        : selectedCategory === "equipment"
          ? products.equipment
          : products.cars

  // Apply price filter
  if (priceRange) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = getProductPrice(product)
      return price >= priceRange.min && price <= priceRange.max
    })
  }

  // Apply weight filter
  if (weightRange) {
    filteredProducts = filteredProducts.filter((product) => {
      const weight = getProductWeight(product)
      return weight >= weightRange.min && weight <= weightRange.max
    })
  }

  // Apply availability filter (all products shown are in stock by default in this store view)
  // This filter would be useful if we had out-of-stock items to filter out

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return getProductPrice(a) - getProductPrice(b)
      case "price_desc":
        return getProductPrice(b) - getProductPrice(a)
      case "weight":
        return getProductWeight(b) - getProductWeight(a)
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "recommended":
      default:
        return 0
    }
  })

  const goToPage = (page: number) => {
    setCurrentPage(page)
    filterSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  function getProductPrice(product: Product): number {
    if (product.product_type === "gold") {
      const originalPrice = Number(product.price_per_gram) * Number(product.weight_grams)
      const discount = Number(product.promotions) || 0
      return Math.max(0, originalPrice - discount)
    } else if (product.product_type === "silver") {
      const originalPrice = Number(product.price_per_gram) * Number(product.weight_grams)
      const discount = Number(product.promotions) || 0
      return Math.max(0, originalPrice - discount)
    } else if (product.product_type === "equipment") {
      const discount = Number(product.promotions) || 0
      return Math.max(0, Number(product.price) - discount)
    } else {
      return Number(product.price)
    }
  }

  function getProductBGNPrice(product: Product): number {
    return getProductPrice(product) * 1.96
  }

  function getOriginalPrice(product: Product): number {
    if (product.product_type === "gold") {
      return Number(product.price_per_gram) * Number(product.weight_grams)
    } else if (product.product_type === "silver") {
      return Number(product.price_per_gram) * Number(product.weight_grams)
    } else if (product.product_type === "equipment") {
      return Number(product.price)
    } else {
      return Number(product.price)
    }
  }

  function getOriginalBGNPrice(product: Product): number {
    return getOriginalPrice(product) * 1.96
  }

  function hasPromotion(product: Product): boolean {
    if (product.product_type === "gold" || product.product_type === "silver" || product.product_type === "equipment") {
      return Number(product.promotions) > 0
    }
    return false
  }

  function getProductWeight(product: Product): number {
    if (product.product_type === "gold" || product.product_type === "silver") {
      return Number(product.weight_grams)
    }
    return 0
  }

  function getProductImage(product: Product): string | null {
    if (product.product_type === "gold" || product.product_type === "silver") {
      return product.images && product.images.length > 0 ? product.images[0] : product.image_url
    }
    return product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null)
  }

  function getProductName(product: Product): string {
    if (product.product_type === "gold") {
      return product.gold_type
    } else if (product.product_type === "silver") {
      return `${product.category_name || product.silver_type} ${product.silver_type}`
    } else if (product.product_type === "equipment") {
      return product.name
    } else {
      return `${product.brand} ${product.model} ${product.year}`
    }
  }

  function getProductUrl(product: Product): string {
    if (product.product_type === "gold") {
      return `/gold/${product.id}`
    } else if (product.product_type === "silver") {
      return `/silver/${product.id}`
    } else if (product.product_type === "equipment") {
      return `/equipment/${product.id}`
    } else {
      return `/cars/${product.id}`
    }
  }

  const getQuantity = (product: Product) => {
    const key = `${product.product_type}-${product.id}`
    return quantities[key] || 1
  }

  const updateQuantity = (product: Product, delta: number) => {
    const key = `${product.product_type}-${product.id}`
    setQuantities(prev => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta)
    }))
  }

  const handleAddToCart = (product: Product) => {
    const image = getProductImage(product)
    const qty = getQuantity(product)
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: getProductName(product),
        price: getProductPrice(product),
        image: image,
        category: product.product_type,
        type: product.product_type,
      })
    }
    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${getProductName(product)} беше добавено в количката.`,
    })
  }

  const handleToggleFavorite = (product: Product) => {
    const isFav = isFavorited(product.product_type, product.id)
    if (isFav) {
      removeFavorite(product.product_type, product.id)
      toast({
        variant: "favorite",
        title: "Премахнато от харесани",
        description: `${getProductName(product)} беше премахнато от харесани.`,
      })
    } else {
      addFavorite({
        id: product.id,
        name: getProductName(product),
        price: getProductPrice(product),
        image: getProductImage(product),
        category: product.product_type,
        type: product.product_type,
      })
      toast({
        variant: "favorite",
        title: "Добавено в харесани!",
        description: `${getProductName(product)} беше добавено в харесани.`,
      })
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "току-що"
    if (diffMins < 60) return `преди ${diffMins} минути`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `преди ${diffHours} часа`
    
    return `преди ${Math.floor(diffHours / 24)} дни`
  }

  const sortOptions = [
    { value: "recommended", label: "Препоръчано" },
    { value: "price_asc", label: "Цена (възх.)" },
    { value: "price_desc", label: "Цена (низх.)" },
    { value: "weight", label: "Тегло" },
    { value: "newest", label: "Най-нови" },
  ]

const filterOptions = [
  { id: "price", label: "По цена" },
  { id: "weight", label: "По тегло" },
  { id: "manufacturer", label: "По производител" },
  { id: "availability", label: "Наличност" },
]

  const categories = [
    { id: "all", label: "Всички", count: products.total },
    { id: "gold", label: "Злато", count: products.gold.length },
    { id: "silver", label: "Сребро", count: products.silver.length },
    { id: "equipment", label: "Техника", count: products.equipment.length },
    { id: "cars", label: "Автомобили", count: products.cars.length },
  ].filter(cat => cat.count > 0 || cat.id === "all")

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: "'Avenir Next', 'Avenir', system-ui, -apple-system, sans-serif" }}>
      <Header />

      {/* Breadcrumb and Last Updated */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#ffd35b] transition-colors">
              Начало
            </Link>
            <span>/</span>
            <Link href="/stores" className="hover:text-[#ffd35b] transition-colors">
              Магазини
            </Link>
            <span>/</span>
            <span className="text-gray-900">{store.name}</span>
          </nav>

        </div>
      </div>

      {/* Store Header Section - Side by side layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8 bg-[#dc2626] overflow-hidden">
          {/* Left Column - Content */}
          <div className="flex-1 px-4 md:px-10 py-6 md:py-14">
            {/* Products count */}
            <p className="text-white/70 text-xs md:text-sm mb-1 md:mb-2">
              {products.total} продукта в наличност
            </p>
            
            {/* Store Name */}
            <div className="mb-4 md:mb-8">
              <h1 className="text-xl md:text-4xl font-bold text-white">
                {store.name}
              </h1>
            </div>

            {/* Store Details Grid - Always 2 columns */}
            <div className="grid grid-cols-2 gap-x-4 md:gap-x-16 gap-y-3 md:gap-y-6">
              {/* Left Column */}
              <div className="space-y-3 md:space-y-6">
                {/* Address */}
                <div>
                  <p className="text-white/60 text-xs md:text-sm font-medium mb-0.5 md:mb-1">Адрес на магазина</p>
                  <p className="text-white text-sm md:text-lg">{store.address}</p>
                  <p className="text-white/80 text-xs md:text-base">{store.city}</p>
                  {store.google_maps_url && (
                    <a
                      href={store.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-white/70 hover:text-white mt-1 md:mt-2 transition-colors group text-xs md:text-base"
                    >
                      Виж на картата
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                  )}
                </div>

                {/* Phone */}
                {store.phone && (
                  <div>
                    <p className="text-white/60 text-xs md:text-sm font-medium mb-0.5 md:mb-1">Телефон</p>
                    <a 
                      href={`tel:${store.phone}`}
                      className="text-white text-base md:text-2xl font-light hover:text-[#ffd35b] transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {store.email && (
                  <div>
                    <p className="text-white/60 text-xs md:text-sm font-medium mb-0.5 md:mb-1">Имейл</p>
                    <a 
                      href={`mailto:${store.email}`}
                      className="text-white text-sm md:text-base hover:text-[#ffd35b] transition-colors underline underline-offset-2"
                    >
                      {store.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column - Working Hours */}
              <div className="space-y-2">
                <p className="text-white/60 text-xs md:text-sm font-medium mb-2">Работно време:</p>
                {store.is_24_7 ? (
                  <p className="text-white text-base md:text-lg font-light">Денонощно</p>
                ) : store.weekly_hours ? (
                  <div className="space-y-1">
                    {[
                      { key: 'monday', label: 'Понеделник' },
                      { key: 'tuesday', label: 'Вторник' },
                      { key: 'wednesday', label: 'Сряда' },
                      { key: 'thursday', label: 'Четвъртък' },
                      { key: 'friday', label: 'Петък' },
                      { key: 'saturday', label: 'Събота' },
                      { key: 'sunday', label: 'Неделя' },
                    ].map(({ key, label }) => {
                      const dayKey = key as keyof typeof store.weekly_hours
                      const dayHours = store.weekly_hours![dayKey]
                      return (
                        <div key={key} className="flex justify-between text-sm md:text-base">
                          <span className="text-white/80">{label}:</span>
                          <span className="text-white font-medium">
                            {dayHours.closed ? "Почивен ден" : `от ${dayHours.open}-${dayHours.close}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-white text-base md:text-lg font-light">{store.working_hours || "09:00 - 18:00"}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-4 mt-6 md:mt-10">
              {store.google_maps_url && (
                <a
                  href={store.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-black hover:bg-gray-800 text-white text-sm md:text-base font-medium transition-colors"
                >
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  Виж на картата
                </a>
              )}
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-[#1b6ea5] hover:bg-[#155a8a] text-white text-sm md:text-base font-medium transition-colors"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5" />
                  Обади се
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative w-full lg:w-[45%] min-h-[200px] md:min-h-[300px] lg:min-h-[400px]">
            {store.image_url ? (
              <Image
                src={store.image_url}
                alt={store.name}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626] to-[#991b1b]" />
            )}
          </div>
        </div>
      </div>

      <div ref={filterSectionRef} className="container mx-auto px-4 py-4 scroll-mt-24">
        {/* Filter and Sort Buttons - Tavex Style */}
        <div className="flex gap-4 mb-8">
          {/* Filter Button with Dropdown */}
          <div className="relative flex-1 max-w-[280px]">
            <button
              onClick={() => {
                setFilterOpen(!filterOpen)
                setSortOpen(false)
              }}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-200 transition-all ${
                filterOpen 
                  ? "rounded-t-2xl rounded-b-none bg-white text-[#2563eb] border-b-0" 
                  : "rounded-full bg-white text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={`font-medium ${filterOpen ? "text-[#2563eb]" : ""}`}>Филтър</span>
              <SlidersHorizontal className={`h-5 w-5 ${filterOpen ? "text-[#2563eb]" : ""}`} />
            </button>

            {/* Filter Dropdown - Connected to button */}
            {filterOpen && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-lg border border-gray-200 border-t-0 z-50">
                <div className="divide-y divide-gray-100">
                  {/* Price Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedFilter(expandedFilter === "price" ? null : "price")}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#2563eb] font-medium">По цена</span>
                      <ChevronDown className={`h-4 w-4 text-[#2563eb] transition-transform ${expandedFilter === "price" ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilter === "price" && (
                      <div className="px-6 pb-4 space-y-2">
                        {[
                          { label: "Всички", min: 0, max: Infinity },
                          { label: "До 100 лв.", min: 0, max: 100 },
                          { label: "100 - 500 лв.", min: 100, max: 500 },
                          { label: "500 - 1000 лв.", min: 500, max: 1000 },
                          { label: "Над 1000 лв.", min: 1000, max: Infinity },
                        ].map((range) => (
                          <button
                            key={range.label}
                            onClick={() => {
                              if (range.min === 0 && range.max === Infinity) {
                                setPriceRange(null)
                              } else {
                                setPriceRange({ min: range.min, max: range.max })
                              }
                              setCurrentPage(1)
                            }}
                            className={`w-full text-center py-2 text-sm transition-colors ${
                              (priceRange === null && range.min === 0 && range.max === Infinity) ||
                              (priceRange?.min === range.min && priceRange?.max === range.max)
                                ? "text-[#2563eb] font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weight Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedFilter(expandedFilter === "weight" ? null : "weight")}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#2563eb] font-medium">По тегло</span>
                      <ChevronDown className={`h-4 w-4 text-[#2563eb] transition-transform ${expandedFilter === "weight" ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilter === "weight" && (
                      <div className="px-6 pb-4 space-y-2">
                        {[
                          { label: "Всички", min: 0, max: Infinity },
                          { label: "До 10г", min: 0, max: 10 },
                          { label: "10 - 50г", min: 10, max: 50 },
                          { label: "50 - 100г", min: 50, max: 100 },
                          { label: "Над 100г", min: 100, max: Infinity },
                        ].map((range) => (
                          <button
                            key={range.label}
                            onClick={() => {
                              if (range.min === 0 && range.max === Infinity) {
                                setWeightRange(null)
                              } else {
                                setWeightRange({ min: range.min, max: range.max })
                              }
                              setCurrentPage(1)
                            }}
                            className={`w-full text-center py-2 text-sm transition-colors ${
                              (weightRange === null && range.min === 0 && range.max === Infinity) ||
                              (weightRange?.min === range.min && weightRange?.max === range.max)
                                ? "text-[#2563eb] font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedFilter(expandedFilter === "category" ? null : "category")}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#2563eb] font-medium">По категория</span>
                      <ChevronDown className={`h-4 w-4 text-[#2563eb] transition-transform ${expandedFilter === "category" ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilter === "category" && (
                      <div className="px-6 pb-4 space-y-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id)
                              setCurrentPage(1)
                            }}
                            className={`w-full text-center py-2 text-sm transition-colors ${
                              selectedCategory === cat.id
                                ? "text-[#2563eb] font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {cat.label} ({cat.count})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <button
                      onClick={() => setExpandedFilter(expandedFilter === "availability" ? null : "availability")}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#2563eb] font-medium">Наличност</span>
                      <ChevronDown className={`h-4 w-4 text-[#2563eb] transition-transform ${expandedFilter === "availability" ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilter === "availability" && (
                      <div className="px-6 pb-4 space-y-2">
                        <button
                          onClick={() => {
                            setShowInStockOnly(false)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-center py-2 text-sm transition-colors ${
                            !showInStockOnly ? "text-[#2563eb] font-medium" : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Всички
                        </button>
                        <button
                          onClick={() => {
                            setShowInStockOnly(true)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-center py-2 text-sm transition-colors ${
                            showInStockOnly ? "text-[#2563eb] font-medium" : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Само налични
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {(priceRange || weightRange || selectedCategory !== "all" || showInStockOnly) && (
                    <button
                      onClick={() => {
                        setPriceRange(null)
                        setWeightRange(null)
                        setSelectedCategory("all")
                        setShowInStockOnly(false)
                        setCurrentPage(1)
                      }}
                      className="w-full py-4 px-6 text-center text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      Изчисти филтрите
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort Button with Dropdown */}
          <div className="relative flex-1 max-w-[280px]">
            <button
              onClick={() => {
                setSortOpen(!sortOpen)
                setFilterOpen(false)
              }}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-gray-200 transition-all ${
                sortOpen 
                  ? "rounded-t-2xl rounded-b-none bg-white text-[#2563eb] border-b-0" 
                  : "rounded-full bg-white text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArrowUpDown className={`h-5 w-5 ${sortOpen ? "text-[#2563eb]" : ""}`} />
              <span className={`font-medium ${sortOpen ? "text-[#2563eb]" : ""}`}>Подредба</span>
            </button>

            {/* Sort Dropdown - Connected to button */}
            {sortOpen && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-lg border border-gray-200 border-t-0 z-50">
                <div className="divide-y divide-gray-100">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setSortOpen(false)
                      }}
                      className={`w-full text-center py-4 px-4 transition-colors ${
                        sortBy === option.value
                          ? "text-[#2563eb] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(filterOpen || sortOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setFilterOpen(false)
              setSortOpen(false)
            }}
          />
        )}

        {/* Products Grid - 2 columns on desktop */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Няма налични продукти</h3>
            <p className="text-gray-500">В този магазин все още няма добавени продукти</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {paginatedProducts.map((product) => {
                const image = getProductImage(product)
                const price = getProductPrice(product)
                const bgnPrice = getProductBGNPrice(product)
                const originalPrice = getOriginalPrice(product)
                const originalBgnPrice = getOriginalBGNPrice(product)
                const hasSale = hasPromotion(product)
                const isFav = isFavorited(product.product_type, product.id)
                const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                const quantity = getQuantity(product)

                return (
                  <div
                    key={`${product.product_type}-${product.id}`}
                    className="bg-[#0e0e0e] overflow-hidden shadow-sm hover:shadow-lg transition-all relative group/card"
                  >
                    {/* НОВО Ribbon Badge */}
                    {isNew && (
                      <div className="absolute top-0 right-0 z-10 overflow-hidden w-28 h-28 pointer-events-none">
                        <div
                          className="absolute top-5 -right-8 bg-[#7b5cff] text-white text-xs font-bold py-1.5 px-10 transform rotate-45 shadow-md"
                        >
                          НОВО
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:min-h-[320px] group/card">
                      {/* Product Image Section - Full width on mobile, fixed width on desktop */}
                      <div className="relative w-full md:w-[280px] flex-shrink-0 flex flex-col">
                        <Link
                          href={getProductUrl(product)}
                          className="relative flex items-center justify-center p-4 min-h-[200px] md:min-h-[180px] md:flex-1"
                        >
                          {image ? (
                            <Image
                              src={image}
                              alt={getProductName(product)}
                              fill
                              sizes="(max-width: 768px) 100vw, 280px"
                              className="object-contain p-4"
                            />
                          ) : (
                            <Sparkles className="h-16 w-16 text-[#ffd35b]" />
                          )}
                        </Link>
                        
                        {/* Stock Status - Below image */}
                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm px-4 pb-4">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-white font-medium">В наличност</span>
                        </div>
                      </div>

                      {/* Product Info Section */}
                      <div className="flex-1 p-4 md:p-6 pb-14 md:pb-6 flex flex-col relative overflow-hidden">
                        {/* Product Name */}
                        <Link href={getProductUrl(product)}>
                          <h3 className="font-semibold text-[#ffff] mb-2 md:mb-6 hover:text-[#fffff] transition-colors line-clamp-2 md:line-clamp-3 text-sm md:text-xl leading-tight text-center md:text-left">
                            {getProductName(product)}
                          </h3>
                        </Link>

                        {/* Price with labels */}
                        <div className="mb-2 md:mb-6 space-y-1 md:space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm text-[#e7e7e7]">цена в евро</span>
                            <div className="flex items-center gap-2">
                              {hasSale && (
                                <span className="text-xs md:text-sm text-gray-500 line-through">{originalPrice.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                              )}
                              <span className="text-base md:text-2xl font-bold text-white">{price.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                            </div>
                          </div>
  </div>

                        {/* Quantity Selector - Hidden on mobile */}
                        <div className="hidden md:flex items-center justify-between mb-4">
                          <span className="text-sm text-[#ffff] font-semibold italic">Количество</span>
                          <div className="flex items-center gap-2 md:gap-3">
                            <button
                              onClick={() => updateQuantity(product, -1)}
                              className="w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-lg text-white border-b border-gray-500 pb-1">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product, 1)}
                              className="w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        </div>
                    </div>
                    
                    {/* Action Overlay - Always visible on mobile at bottom right, hover on desktop */}
                    <div className="absolute bottom-0 right-0 z-20 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0 transition-all duration-300 ease-out">
                      <svg width="148" height="44" viewBox="0 0 148 44" className="block md:hidden">
                        {/* Favorites Button - Red to match sticky nav */}
                        <polygon 
                          points="20,0 56,0 48,44 0,44" 
                          fill="#dc2626" 
                          className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            handleToggleFavorite(product)
                          }}
                        />
                        {/* Compare Button - Yellow to match sticky nav */}
                        <polygon 
                          points="56,0 100,0 92,44 48,44" 
                          fill="#eab308" 
                          className="hover:fill-[#ca8a04] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            toast({
                              title: "Добавено за сравнение",
                              description: `${getProductName(product)} беше добавено за сравнение.`,
                            })
                          }}
                        />
                        {/* Cart Button - Red with flat right edge */}
                        <polygon 
                          points="100,0 148,0 148,44 92,44" 
                          fill="#dc2626" 
                          className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                        />
                        {/* Heart/Favorites Icon */}
                        <g transform="translate(26, 12)">
                          <path
                            fill="white"
                            d="M10,18l-1.5-1.4C3.7,12.2,0.5,9.3,0.5,5.8c0-2.9,2.2-5.3,5-5.3c1.6,0,3.1,0.7,4,1.9c0.9-1.2,2.5-1.9,4-1.9c2.8,0,5,2.4,5,5.3c0,3.5-3.2,6.4-8,10.8L10,18z"
                          />
                        </g>
                        {/* Compare Icon */}
                        <g transform="translate(66, 12)">
                          <polygon fill="white" points="1,11.5 6,15 6,13.2 15,13.2 15,9.8 6,9.8 6,8" />
                          <polygon fill="white" points="15,5.5 10,2 10,3.8 1,3.8 1,7.2 10,7.2 10,9" />
                        </g>
                        {/* Cart Icon */}
                        <g transform="translate(112, 12)" stroke="white" strokeWidth="1.5" fill="none">
                          <path d="M4 4h13l-1.2 7.5H5.5z" />
                          <circle cx="7" cy="17" r="1" />
                          <circle cx="14" cy="17" r="1" />
                          <path d="M4 4L3 1H1" />
                        </g>
                      </svg>
                      <svg width="148" height="44" viewBox="0 0 148 44" className="hidden md:block">
                        {/* Favorites Button - Gold with triangle start */}
                        <polygon 
                          points="20,0 56,0 48,44 0,44" 
                          fill={isFav ? "#dc2626" : "#d4a539"} 
                          className="hover:fill-[#b8942f] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            handleToggleFavorite(product)
                          }}
                        />
                        {/* Compare Button - Gold middle */}
                        <polygon 
                          points="56,0 100,0 92,44 48,44" 
                          fill="#d4a539" 
                          className="hover:fill-[#b8942f] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            toast({
                              title: "Добавено за сравнение",
                              description: `${getProductName(product)} беше добавено за сравнение.`,
                            })
                          }}
                        />
                        {/* Cart Button - Red with flat right edge */}
                        <polygon 
                          points="100,0 148,0 148,44 92,44" 
                          fill="#dc2626" 
                          className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product)
                          }}
                        />
                        {/* Heart/Favorites Icon */}
                        <g transform="translate(26, 12)">
                          <path
                            fill="white"
                            d="M10,18l-1.5-1.4C3.7,12.2,0.5,9.3,0.5,5.8c0-2.9,2.2-5.3,5-5.3c1.6,0,3.1,0.7,4,1.9c0.9-1.2,2.5-1.9,4-1.9c2.8,0,5,2.4,5,5.3c0,3.5-3.2,6.4-8,10.8L10,18z"
                          />
                        </g>
                        {/* Compare Icon */}
                        <g transform="translate(66, 12)">
                          <polygon fill="white" points="1,11.5 6,15 6,13.2 15,13.2 15,9.8 6,9.8 6,8" />
                          <polygon fill="white" points="15,5.5 10,2 10,3.8 1,3.8 1,7.2 10,7.2 10,9" />
                        </g>
                        {/* Cart Icon */}
                        <g transform="translate(112, 12)" stroke="white" strokeWidth="1.5" fill="none">
                          <path d="M4 4h13l-1.2 7.5H5.5z" />
                          <circle cx="7" cy="17" r="1" />
                          <circle cx="14" cy="17" r="1" />
                          <path d="M4 4L3 1H1" />
                        </g>
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm">Предишна</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-[#dc2626] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <span className="text-sm">Следваща</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
