"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { useNavigationCategories } from "@/contexts/navigation-categories-context"

interface GoldCategory {
  id: number
  name: string
  slug: string
  display_order: number
  parent_id: number | null
}

interface SilverCategory {
  id: number
  name: string
  slug: string
  display_order: number
  parent_id: number | null
}

interface EquipmentCategory {
  id: number
  name: string
  description: string | null
  icon: string | null
  images: string[] | null
  display_order: number
  is_active: boolean
  parent_id: number | null
  subcategories?: EquipmentCategory[]
}

interface Subcategory {
  name: string
  subcategories?: string[]
}

interface Category {
  id: string
  name: string
  icon: string
  href?: string
  subcategories?: Subcategory[]
  equipmentCategoryId?: number
}

// Static categories for Gold, Silver and Auto - others will be fetched from API
const staticCategories: Category[] = [
  {
    id: "gold",
    name: "Злато",
    icon: "/images/pgmks1168.png",
    href: "/gold",
  },
  {
    id: "silver",
    name: "Сребро",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngtree-vector-cartoon-silver-crown-png-image_6096738-F8EHgWhU95y8U3BD9b6pzSzWSLZ1sI-removebg-preview-iU7b9obtznlV2zVPwbPRVn0mTS1yLs.png",
    href: "/silver",
  },
  {
    id: "auto",
    name: "Авто",
    icon: "/images/avto-icon.webp",
    href: "/cars",
  },
]

interface CategoryNavigationProps {
  onClose: () => void
}

export default function CategoryNavigation({ onClose }: CategoryNavigationProps) {
  const { goldCategories, silverCategories, equipmentCategories } = useNavigationCategories()
  const [selectedCategory, setSelectedCategory] = useState<Category | EquipmentCategory | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<(Category | EquipmentCategory)[]>([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Merge static categories (Gold, Silver, Auto) with equipment categories
  useEffect(() => {
    const goldCategory = staticCategories.find(c => c.id === "gold")
    const silverCategory = staticCategories.find(c => c.id === "silver")
    const autoCategory = staticCategories.find(c => c.id === "auto")
    
    // Build merged categories: Gold first, then Silver, then equipment categories, then Auto
    const merged: (Category | EquipmentCategory)[] = []
    
    if (goldCategory) merged.push(goldCategory)
    if (silverCategory) merged.push(silverCategory)
    
    // Add equipment categories (main categories only - subcategories are nested)
    equipmentCategories.forEach(cat => {
      merged.push(cat)
    })
    
    if (autoCategory) merged.push(autoCategory)
    
    setCategories(merged)
  }, [equipmentCategories])

  const isStaticCategory = (cat: Category | EquipmentCategory): cat is Category => {
    return 'href' in cat && typeof cat.id === 'string'
  }

  const isEquipmentCategory = (cat: Category | EquipmentCategory): cat is EquipmentCategory => {
    return typeof cat.id === 'number'
  }

  const handleCategoryClick = (category: Category | EquipmentCategory) => {
    if (isStaticCategory(category)) {
      if (category.id === "gold" || category.id === "silver" || category.subcategories) {
        setSelectedCategory(category)
      } else if (category.href) {
        window.location.href = category.href
      }
    } else if (isEquipmentCategory(category)) {
      // Equipment category - check if it has subcategories
      if (category.subcategories && category.subcategories.length > 0) {
        setSelectedCategory(category)
      } else {
        // Navigate to equipment page with category filter
        window.location.href = `/equipment?category=${category.id}`
      }
    }
  }

  const handleBackClick = () => {
    setSelectedCategory(null)
  }

  const getCategoryIcon = (cat: Category | EquipmentCategory): string => {
    if (isStaticCategory(cat)) {
      return cat.icon
    }
    // For equipment categories, use a default icon or images
    if (cat.images && cat.images.length > 0) {
      return cat.images[0]
    }
    // Fallback to a generic tech icon
    return "/images/laptop-icon.webp"
  }

  const getCategoryName = (cat: Category | EquipmentCategory): string => {
    return cat.name
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative w-[85%] max-w-[350px] h-screen bg-white shadow-2xl overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white shadow-md z-10">
            <div className="border-t-4" style={{ borderTopColor: "#e60200" }}>
              <div className="flex items-center justify-between px-4 py-5">
                {selectedCategory ? (
                  <>
                    {/* Back button */}
                    <button
                      onClick={handleBackClick}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#e60200]" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-800 flex-1 text-center">{selectedCategory.name}</h2>
                  </>
                ) : (
                  <h2 className="text-lg font-bold text-gray-800">Всички продукти</h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Main Categories or Subcategories */}
          {!selectedCategory ? (
            /* Main Categories List */
            <div className="divide-y divide-gray-200">
              {categories.map((category, index) => (
                <button
                  key={`${isStaticCategory(category) ? 'static' : 'equip'}-${category.id}`}
                  onClick={() => handleCategoryClick(category)}
                  className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 mr-4">
                    <Image
                      src={getCategoryIcon(category)}
                      alt={getCategoryName(category)}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span className={`flex-1 text-base ${index === 0 ? "font-bold" : "font-normal"} text-gray-900`}>
                    {getCategoryName(category)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            /* Subcategories List */
            <div className="divide-y divide-gray-200">
              {/* Gold Categories */}
              {selectedCategory.id === "gold" && (
                <>
                  {/* Gold Categories from API */}
                  {goldCategories
                    .filter((cat) => cat.parent_id === null)
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/gold?category=${category.slug}`}
                        onClick={onClose}
                        className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                      >
                        <div className="flex-shrink-0 w-10 h-10 mr-4">
                          <Image
                            src="/images/pgmks1168.png"
                            alt={category.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <span className="flex-1 text-base font-normal text-gray-900">{category.name}</span>
                        <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                      </Link>
                    ))}

                  {/* Fallback if no categories loaded */}
                  {goldCategories.filter((cat) => cat.parent_id === null).length === 0 && (
                    <>
                      {["Дамски", "Мъжки", "Детски", "Монети", "Промоции"].map((name) => (
                        <Link
                          key={name}
                          href={`/gold?category=${name.toLowerCase()}`}
                          onClick={onClose}
                          className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                        >
                          <div className="flex-shrink-0 w-10 h-10 mr-4">
                            <Image
                              src="/images/pgmks1168.png"
                              alt={name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <span className="flex-1 text-base font-normal text-gray-900">{name}</span>
                          <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                        </Link>
                      ))}
                  </>
                )}
              </>
            )}

            {/* Silver Categories */}
            {selectedCategory.id === "silver" && (
              <>
                {/* Silver Categories from API */}
                {silverCategories
                  .filter((cat) => cat.parent_id === null)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/silver?category=${category.slug}`}
                      onClick={onClose}
                      className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 mr-4">
                        <Image
                          src="/images/pgmks1168.png"
                          alt={category.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="flex-1 text-base font-normal text-gray-900">{category.name}</span>
                      <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                    </Link>
                  ))}

                {/* Fallback if no silver categories loaded */}
                {silverCategories.filter((cat) => cat.parent_id === null).length === 0 && (
                  <>
                    {["Дамски", "Мъжки", "Детски", "Монети", "Промоции"].map((name) => (
                      <Link
                        key={name}
                        href={`/silver?category=${name.toLowerCase()}`}
                        onClick={onClose}
                        className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                      >
                        <div className="flex-shrink-0 w-10 h-10 mr-4">
                          <Image
                            src="/images/pgmks1168.png"
                            alt={name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <span className="flex-1 text-base font-normal text-gray-900">{name}</span>
                        <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}

{/* Equipment Categories with Subcategories (from API) */}
              {isEquipmentCategory(selectedCategory) && selectedCategory.subcategories && (
                <>
                  {/* View All Link for this category */}
                  <Link
                    href={`/equipment?category=${selectedCategory.id}`}
                    onClick={onClose}
                    className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                  >
                    <div className="flex-shrink-0 w-10 h-10 mr-4">
                      <Image
                        src={getCategoryIcon(selectedCategory)}
                        alt={`Всички ${selectedCategory.name}`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="flex-1 text-base font-medium text-gray-900">Всички {selectedCategory.name}</span>
                    <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                  </Link>
                  {selectedCategory.subcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/equipment?category=${subcat.id}`}
                      onClick={onClose}
                      className="w-full flex items-center px-4 py-5 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 mr-4">
                        <Image
                          src={getCategoryIcon(subcat)}
                          alt={subcat.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="flex-1 text-base font-normal text-gray-900">{subcat.name}</span>
                      <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Left Sidebar - Main Categories */}
      <div className="relative w-[350px] h-screen bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white shadow-md z-10">
          <div className="border-t-4" style={{ borderTopColor: "#e60200" }}>
            <div className="flex items-center justify-between px-5 py-6">
              <h2 className="text-lg font-bold text-gray-800">Всички продукти</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="divide-y divide-gray-200">
          {categories.map((category, index) => (
            <button
              key={`${isStaticCategory(category) ? 'static' : 'equip'}-${category.id}`}
              onClick={() => handleCategoryClick(category)}
              className={`w-full flex items-center px-4 py-5 hover:bg-gray-50 hover:shadow-md transition-all text-left group ${
                selectedCategory?.id === category.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 mr-4">
                <Image
                  src={getCategoryIcon(category)}
                  alt={getCategoryName(category)}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className={`flex-1 text-base ${index === 0 ? "font-bold" : "font-normal"} text-gray-900`}>
                {getCategoryName(category)}
              </span>
              <ChevronRight className="w-5 h-5 text-[#e60200] flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Subcategories (Desktop only) */}
      {selectedCategory && (
        <div
          className="relative bg-white overflow-y-auto shadow-2xl rounded-xl ml-4"
          style={{ width: "600px", maxHeight: "calc(100vh - 40px)", marginTop: "20px", marginBottom: "20px" }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10 rounded-t-xl">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Image
                  src={getCategoryIcon(selectedCategory)}
                  alt={getCategoryName(selectedCategory)}
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h2 className="text-xl font-bold text-gray-900">{getCategoryName(selectedCategory)}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Subcategories Content */}
          <div className="p-6">
            {/* Gold Categories */}
            {selectedCategory.id === "gold" && (
              <div className="space-y-4">
                {/* Gold Categories Grid */}
                <div className="flex flex-wrap gap-3">
                  {goldCategories
                    .filter((cat) => cat.parent_id === null)
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/gold?category=${category.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>

                {/* If no categories loaded, show default ones */}
                {goldCategories.filter((cat) => cat.parent_id === null).length === 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      "ВСИЧКИ ДАМСКИ",
                      "ПРЪСТЕНИ",
                      "ТВЪРДИ ГРИВНИ",
                      "ОБЕЦИ",
                      "КОЛИЕТА",
                      "КРЪСТОВЕ",
                      "МЕДАЛЬОНИ",
                      "БУКВИ",
                      "СИНДЖИРИ",
                      "ГРИВНИ",
                    ].map((name) => (
                      <Link
                        key={name}
                        href={`/gold?category=${name.toLowerCase().replace(/ /g, "-")}`}
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Silver Categories */}
            {selectedCategory.id === "silver" && (
              <div className="space-y-4">
                {/* Silver Categories Grid */}
                <div className="flex flex-wrap gap-3">
                  {silverCategories
                    .filter((cat) => cat.parent_id === null)
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/silver?category=${category.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-[#a0a0a0] hover:text-[#606060] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>

                {/* If no silver categories loaded, show default ones */}
                {silverCategories.filter((cat) => cat.parent_id === null).length === 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      "ВСИЧКИ ДАМСКИ",
                      "ПРЪСТЕНИ",
                      "ТВЪРДИ ГРИВНИ",
                      "ОБЕЦИ",
                      "КОЛИЕТА",
                      "КРЪСТОВЕ",
                      "МЕДАЛЬОНИ",
                      "БУКВИ",
                      "СИНДЖИРИ",
                      "ГРИВНИ",
                    ].map((name) => (
                      <Link
                        key={name}
                        href={`/silver?category=${name.toLowerCase().replace(/ /g, "-")}`}
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-[#a0a0a0] hover:text-[#606060] transition-colors"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Equipment Categories with Subcategories (from API) */}
            {isEquipmentCategory(selectedCategory) && selectedCategory.subcategories && (
              <div className="space-y-4">
                {/* View All Link */}
                <Link
                  href={`/equipment?category=${selectedCategory.id}`}
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Всички {selectedCategory.name}
                </Link>

                {/* Subcategories Grid */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {selectedCategory.subcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      href={`/equipment?category=${subcat.id}`}
                      onClick={onClose}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-[#e60200] hover:text-[#e60200] transition-colors"
                    >
                      {subcat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
