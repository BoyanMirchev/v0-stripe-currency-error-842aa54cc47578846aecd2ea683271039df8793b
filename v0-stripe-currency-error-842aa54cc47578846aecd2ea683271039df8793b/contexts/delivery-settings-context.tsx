"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface DeliverySettings {
  free_delivery_threshold: number
  econt_office_price: number
  econt_address_price: number
}

const defaultSettings: DeliverySettings = {
  free_delivery_threshold: 100,
  econt_office_price: 1.79,
  econt_address_price: 2.68
}

interface DeliverySettingsContextType {
  settings: DeliverySettings
  isLoading: boolean
}

const DeliverySettingsContext = createContext<DeliverySettingsContextType>({
  settings: defaultSettings,
  isLoading: true
})

export function DeliverySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DeliverySettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/delivery-settings")
        if (response.ok) {
          const data = await response.json()
          setSettings({
            free_delivery_threshold: Number(data.free_delivery_threshold) || defaultSettings.free_delivery_threshold,
            econt_office_price: Number(data.econt_office_price) || defaultSettings.econt_office_price,
            econt_address_price: Number(data.econt_address_price) || defaultSettings.econt_address_price
          })
        }
      } catch (error) {
        console.error("[v0] Failed to fetch delivery settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <DeliverySettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </DeliverySettingsContext.Provider>
  )
}

export function useDeliverySettings() {
  const context = useContext(DeliverySettingsContext)
  if (!context) {
    throw new Error("useDeliverySettings must be used within a DeliverySettingsProvider")
  }
  return context
}
