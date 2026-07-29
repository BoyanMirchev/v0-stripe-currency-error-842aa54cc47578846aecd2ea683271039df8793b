"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface SiteSettings {
  logo_url: string
  logo_alt: string
  logo_width: number
  logo_height: number
  favicon_url: string
  apple_touch_icon: string
  site_name: string
}

const defaultSettings: SiteSettings = {
  logo_url: "/kesh-logo.png",
  logo_alt: "КЕШ Logo",
  logo_width: 110,
  logo_height: 40,
  favicon_url: "/icon.svg",
  apple_touch_icon: "/apple-icon.png",
  site_name: "КЕШ"
}

interface SiteSettingsContextType {
  settings: SiteSettings
  isLoading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: true
})

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode
  initialSettings?: Partial<SiteSettings> | null
}) {
  const mergedInitial: SiteSettings = {
    ...defaultSettings,
    ...(initialSettings
      ? {
          logo_url: initialSettings.logo_url || defaultSettings.logo_url,
          logo_alt: initialSettings.logo_alt || defaultSettings.logo_alt,
          logo_width: initialSettings.logo_width || defaultSettings.logo_width,
          logo_height: initialSettings.logo_height || defaultSettings.logo_height,
          favicon_url: initialSettings.favicon_url || defaultSettings.favicon_url,
          apple_touch_icon: initialSettings.apple_touch_icon || defaultSettings.apple_touch_icon,
          site_name: initialSettings.site_name || defaultSettings.site_name,
        }
      : {}),
  }

  // When initial settings are provided from the server, the logo is already
  // correct in the server-rendered HTML, so there is no client loading state.
  const [settings, setSettings] = useState<SiteSettings>(mergedInitial)
  const [isLoading, setIsLoading] = useState(!initialSettings)

  useEffect(() => {
    // Skip the client fetch when the server already provided settings.
    if (initialSettings) return

    async function fetchSettings() {
      try {
        const response = await fetch("/api/site-settings")
        if (response.ok) {
          const data = await response.json()
          setSettings({
            logo_url: data.logo_url || defaultSettings.logo_url,
            logo_alt: data.logo_alt || defaultSettings.logo_alt,
            logo_width: data.logo_width || defaultSettings.logo_width,
            logo_height: data.logo_height || defaultSettings.logo_height,
            favicon_url: data.favicon_url || defaultSettings.favicon_url,
            apple_touch_icon: data.apple_touch_icon || defaultSettings.apple_touch_icon,
            site_name: data.site_name || defaultSettings.site_name
          })
        }
      } catch (error) {
        console.error("[v0] Failed to fetch site settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [initialSettings])

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
