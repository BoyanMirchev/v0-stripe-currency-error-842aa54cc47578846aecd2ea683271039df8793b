"use client"

import type React from "react"

import { CartProvider } from "@/lib/cart-context"
import { CartProvider as CheckoutCartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { CompareProvider } from "@/lib/compare-context"
import { SiteSettingsProvider } from "@/contexts/site-settings-context"
import { DeliverySettingsProvider } from "@/contexts/delivery-settings-context"
import {
  NavigationCategoriesProvider,
  type NavigationCategoryData,
} from "@/contexts/navigation-categories-context"
import { Toaster } from "@/components/ui/toaster"

interface InitialSiteSettings {
  logo_url?: string
  logo_alt?: string
  logo_width?: number
  logo_height?: number
  favicon_url?: string
  apple_touch_icon?: string
  site_name?: string
}

export function Providers({
  children,
  navigationCategories,
  initialSiteSettings,
}: {
  children: React.ReactNode
  navigationCategories: NavigationCategoryData
  initialSiteSettings?: InitialSiteSettings | null
}) {
  return (
    <NavigationCategoriesProvider value={navigationCategories}>
    <SiteSettingsProvider initialSettings={initialSiteSettings}>
      <DeliverySettingsProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CompareProvider>
              <CartProvider>
                <CheckoutCartProvider>
                  {children}
                  <Toaster />
                </CheckoutCartProvider>
              </CartProvider>
            </CompareProvider>
          </FavoritesProvider>
        </AuthProvider>
      </DeliverySettingsProvider>
    </SiteSettingsProvider>
    </NavigationCategoriesProvider>
  )
}
