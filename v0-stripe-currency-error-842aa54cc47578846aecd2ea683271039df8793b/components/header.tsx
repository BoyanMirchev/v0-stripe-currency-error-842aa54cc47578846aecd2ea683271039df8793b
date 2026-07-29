"use client"
import * as React from "react"
import { useState } from "react"
import { Heart, ShoppingCart, MessageCircle, Phone, TrendingUp, Coins, ArrowRight, ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-context"
import { useCompare } from "@/lib/compare-context"
import { useSiteSettings } from "@/contexts/site-settings-context"
import CategoryNavigation from "@/components/category-navigation"
import { MobileSearchOverlay } from "@/components/mobile-search-overlay"
import { CartHoverDropdown } from "@/components/cart-hover-dropdown"

interface MenuCategory {
  id: number
  name: string
  icon: string | null
  image: string | null
  productCount: number
}

interface CategoryDetails {
  category: {
    id: number
    name: string
    icon: string | null
    image: string | null
  }
  brandGroups: Record<string, Array<{ id: number; name: string; model: string }>>
}

interface GoldProduct {
  id: number
  gold_type: string
  weight_grams: number
  price_per_gram: number
  total_amount: number
  images: string[]
  description: string | null
  promotions?: number
}

interface CarProduct {
  id: number
  brand: string
  model: string
  year: number
  price: string
  image_url: string
  images: string[]
  promotions?: number
}

interface MenuData {
  carsCount: number
  categories: MenuCategory[]
  goldCount: number
}

const CONTACT_PHONE = "+359 54 800 800"
const WHATSAPP_LINK = "https://wa.me/359548008000"
const VIBER_LINK = "viber://contact?number=%2B359548008000"

const KeshLogo = () => {
  const { settings } = useSiteSettings()

  return (
    <Link href="/" className="flex items-center flex-shrink-0">
      <Image
        src={settings.logo_url || "/kesh-logo.png"}
        alt={settings.logo_alt || "Кеш Logo"}
        width={settings.logo_width || 110}
        height={settings.logo_height || 40}
        className="object-contain"
      />
    </Link>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export const SellButton = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    {
      title: "Изкупуване",
      description: "Злато и сребро",
      href: "/izkupuvane-zlato-i-srebro",
      icon: Coins,
    },
    {
      title: "Графика цени",
      description: "Актуални котировки",
      href: "/grafika-tseni-zlato-srebro",
      icon: TrendingUp,
    },
  ]

  const contactItems = [
    {
      title: "WhatsApp",
      href: WHATSAPP_LINK,
      icon: MessageCircle,
      external: true,
    },
    {
      title: "Viber",
      href: VIBER_LINK,
      icon: MessageCircle,
      external: true,
    },
    {
      title: `Обадете се: ${CONTACT_PHONE}`,
      href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
      icon: Phone,
      external: true,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            className ||
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-none px-6 sm:px-8 py-2 h-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          }
        >
          Продай
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 bg-white gap-0">
        {/* Dark gray header */}
        <div className="bg-[#4a4a4a] px-6 py-4 flex items-center justify-between">
          <DialogHeader className="flex-1">
            <DialogTitle className="text-xl font-bold text-white text-left">
              Продай на КЕШ
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-700 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold text-lg">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </Link>
              )
            })}
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Свържете се с нас</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {contactItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#1b6ea5] hover:bg-blue-50 transition-all"
                  >
                    <IconComponent className="w-5 h-5 text-[#1b6ea5]" />
                    <span className="text-gray-700 text-sm font-medium">{item.title}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 flex items-center justify-end border-t border-gray-100">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="px-8 py-2 border-2 border-[#1b6ea5] text-[#1b6ea5] hover:bg-blue-50 font-semibold rounded-lg"
            >
              Затвори
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const HamburgerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 18H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Header = () => {
  const { getTotalItems, isAddingToCart } = useCart()
  const totalItems = getTotalItems()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const { getCompareCount } = useCompare()
  const compareCount = getCompareCount()
  const router = useRouter()
  const pathname = usePathname()
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [categoryDetails, setCategoryDetails] = useState<Record<number, CategoryDetails>>({})
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoryNavOpen, setIsCategoryNavOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isCartHovered, setIsCartHovered] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = React.useRef<HTMLElement>(null)

  const isHomepage = pathname === "/"
  const shouldBeSticky = isHomepage

  React.useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch("/api/menu")
        if (response.ok) {
          const data = await response.json()
          setMenuData(data)
        }
      } catch (error) {
        console.error("Error fetching menu data:", error)
      }
    }
    fetchMenuData()
  }, [])

  React.useEffect(() => {
    if (hoveredCategory && !categoryDetails[hoveredCategory]) {
      const fetchCategoryDetails = async () => {
        try {
          const response = await fetch(`/api/menu/${hoveredCategory}`)
          if (response.ok) {
            const data = await response.json()
            setCategoryDetails((prev) => ({
              ...prev,
              [hoveredCategory]: data,
            }))
          }
        } catch (error) {
          console.error("Error fetching category details:", error)
        }
      }
      fetchCategoryDetails()
    }
  }, [hoveredCategory, categoryDetails])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Measure header height
  React.useEffect(() => {
    const measureHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    measureHeight()
    window.addEventListener("resize", measureHeight)
    return () => window.removeEventListener("resize", measureHeight)
  }, [isScrolled])

  return (
    <header
      ref={headerRef}
      className={`${shouldBeSticky ? "fixed top-0 left-0 right-0" : "relative"} bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 w-full z-50 ${isScrolled && shouldBeSticky ? "shadow-md" : ""}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl" />
      </div>

      <div className="w-full mx-auto px-3 sm:px-4 relative z-10">
        {/* Mobile store selector - appears only on mobile */}
        {!isScrolled && (
          <Link href="/stores" className="lg:hidden flex items-center justify-between py-3 border-b border-gray-300">
            <span className="text-black text-base">
              Твоят магазин: <span className="font-semibold">Избери магазин</span>
            </span>
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </Link>
        )}

        {/* Desktop layout */}
        <div className="hidden lg:flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3">
            <KeshLogo />
            <button
              onClick={() => setIsCategoryNavOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-black hover:text-red-600 transition-colors"
            >
              <HamburgerIcon />
              <span className="font-semibold">Категории</span>
            </button>
          </div>

          {/* Search bar - hidden on tablet (lg), visible on xl and above */}
          <SearchBar className="hidden xl:block w-full max-w-md" inputClassName="h-12" />
          
          {/* Search icon for tablet - visible on lg, hidden on xl and above */}
          <Button
            onClick={() => setIsMobileSearchOpen(true)}
            variant="ghost"
            size="icon"
            className="lg:flex xl:hidden items-center justify-center text-black hover:bg-transparent w-10 h-10 p-0"
          >
            <Image src="/search-icon.png" alt="Search" width={24} height={24} className="w-6 h-6" />
            <span className="sr-only">Search</span>
          </Button>

          <div className="flex items-center gap-4 text-black">
            <Button
              onClick={() => router.push("/gold")}
              className="bg-gradient-to-r from-[#1b6ea5] to-[#1557a0] hover:from-[#1557a0] hover:to-[#0f4680] text-white font-bold rounded-none px-6 sm:px-8 py-2 h-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">Купи</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Button>
            <SellButton />
            <Link href="/stores" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/store-icon.webp" alt="Store" width={28} height={28} className="w-7 h-7" />
              <div>
                <p className="text-xs">Моят магазин:</p>
                <p className="font-semibold text-sm whitespace-nowrap">КЕШ Шумен</p>
              </div>
            </Link>
            <Link href="/compare" className="relative hover:opacity-80 transition-opacity" title="Сравнение">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <polygon fill="currentColor" points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                <polygon fill="currentColor" points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
              </svg>
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1b6ea5] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link href="/favorites" className="relative hover:opacity-80 transition-opacity">
              <Heart className="w-8 h-8" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <div
              className="relative z-[100]"
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <Link href="/cart" className="relative hover:opacity-80 transition-opacity block">
                <div className="relative">
                  {/* Spinning arcs - only visible when adding to cart */}
                  {isAddingToCart && (
                    <>
                      <svg className="absolute -inset-2 w-12 h-12 animate-spin" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="31 94"
                        />
                      </svg>
                      <svg className="absolute -inset-2 w-12 h-12 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="15"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="24 70"
                        />
                      </svg>
                    </>
                  )}
                  <ShoppingCart className="w-8 h-8" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {isCartHovered && <CartHoverDropdown headerHeight={headerHeight} />}
            </div>
            <Link
              href={user ? "/profile" : "/login"}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(to bottom, #e0e2e4, #fbfbfb)",
                boxShadow: "0 2px 8px 0 #d9dbdf",
              }}
            >
              <Image src="/person-icon.svg" alt="Account" width={24} height={24} className="w-6 h-6" />
              <span className="font-semibold text-black text-sm">
                {user ? (user.firstName || user.email.split("@")[0]) : "Вход"}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile layout with 2 rows */}
        <div className="lg:hidden flex flex-col gap-3 py-3 w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-shrink-0">
              <KeshLogo />
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                onClick={() => router.push("/gold")}
                className="bg-gradient-to-r from-[#1b6ea5] to-[#1557a0] hover:from-[#1557a0] hover:to-[#0f4680] text-white font-bold rounded-none px-4 sm:px-6 py-2 h-10 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Купи
              </Button>
              <SellButton className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-none px-4 sm:px-6 py-2 h-10 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" />
              <Button
                onClick={() => setIsMobileSearchOpen(true)}
                variant="ghost"
                size="icon"
                className="text-black hover:bg-white/50 flex-shrink-0 w-10 h-10 p-0"
              >
                <Image src="/search-icon.png" alt="Search" width={20} height={20} className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                onClick={() => setIsCategoryNavOpen(true)}
                variant="ghost"
                size="icon"
                className="text-black hover:bg-white/50 flex-shrink-0 w-10 h-10 p-0"
              >
                <HamburgerIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isCategoryNavOpen && <CategoryNavigation onClose={() => setIsCategoryNavOpen(false)} />}
      {isMobileSearchOpen && (
        <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
      )}
    </header>
  )
}

export default Header
