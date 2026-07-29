"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { Phone, Heart, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useCompare } from "@/lib/compare-context"
import { usePathname } from "next/navigation"

export function MobileBottomNav() {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { getTotalItems } = useCart()
  const { favorites } = useFavorites()
  const { getCompareCount } = useCompare()
  const pathname = usePathname()

  const cartCount = getTotalItems()
  const favoritesCount = favorites.length
  const compareCount = getCompareCount()

  // Return null on initial render to avoid hydration mismatch
  if (isMobile === undefined) {
    return null
  }

  if (!isMobile) {
    return null
  }

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Single unified bar */}
      <nav className="shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        {/* SVG background for triangular sections */}
        <div className="relative h-14">
          {/* Triangular colored backgrounds */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            preserveAspectRatio="none"
            viewBox="0 0 500 56"
          >
            {/* Red section - Любими (same as Продай button) */}
            <polygon 
              points="0,0 110,0 95,56 0,56" 
              fill="#dc2626"
            />
            {/* Yellow section - Количка */}
            <polygon 
              points="110,0 210,0 195,56 95,56" 
              fill="#eab308"
            />
            {/* Blue section - Акаунт (same as Купи button #1b6ea5) */}
            <polygon 
              points="210,0 310,0 295,56 195,56" 
              fill="#1b6ea5"
            />
            {/* Black section - Обади се */}
            <polygon 
              points="310,0 410,0 395,56 295,56" 
              fill="#111827"
            />
            {/* Yellow section - Сравни */}
            <polygon 
              points="410,0 500,0 500,56 395,56" 
              fill="#eab308"
            />
          </svg>

          {/* Navigation items */}
          <div className="relative z-10 flex items-center h-full">
            {/* Любими (Favorites) */}
            <Link
              href="/favorites"
              className="flex-1 flex flex-col items-center justify-center h-full"
              aria-label="Любими"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-white" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 shadow">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium text-white mt-0.5">Любими</span>
            </Link>

            {/* Количка (Cart) */}
            <Link
              href="/cart"
              className="flex-1 flex flex-col items-center justify-center h-full pl-1"
              aria-label="Количка"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium text-gray-900 mt-0.5">Количка</span>
            </Link>

            {/* Акаунт (Account) */}
            <Link
              href={user ? "/profile" : "/register"}
              className="flex-1 flex flex-col items-center justify-center h-full pl-1"
              aria-label={user ? user.firstName : "Акаунт"}
            >
              <User className="w-5 h-5 text-white" />
              <span className="text-[9px] font-medium text-white mt-0.5 truncate max-w-[60px]">
                {user ? user.firstName : "Акаунт"}
              </span>
            </Link>

            {/* Обади се (Call) */}
            <a
              href="tel:+359882738155"
              className="flex-1 flex flex-col items-center justify-center h-full pl-1"
              aria-label="Обади се"
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-[9px] font-medium text-white mt-0.5">Обади се</span>
            </a>

            {/* Сравни (Compare) */}
            <Link
              href="/compare"
              className="flex-1 flex flex-col items-center justify-center h-full pl-1"
              aria-label="Сравни"
            >
              <div className="relative">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <polygon fill="#111827" points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                  <polygon fill="#111827" points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
                </svg>
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#1b6ea5] text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 shadow">
                    {compareCount > 99 ? "99+" : compareCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium text-gray-900 mt-0.5">Сравни</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
