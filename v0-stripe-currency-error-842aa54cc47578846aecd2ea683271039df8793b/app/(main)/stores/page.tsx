"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import Link from "next/link"
import Image from "next/image"

interface StoreData {
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

// City coordinates for Bulgarian cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Шумен": { lat: 43.2712, lng: 26.9361 },
  "София": { lat: 42.6977, lng: 23.3219 },
  "Пловдив": { lat: 42.1354, lng: 24.7453 },
  "Варна": { lat: 43.2141, lng: 27.9147 },
  "Бургас": { lat: 42.5048, lng: 27.4626 },
  "Русе": { lat: 43.8356, lng: 25.9657 },
  "Стара Загора": { lat: 42.4258, lng: 25.6345 },
  "Плевен": { lat: 43.4170, lng: 24.6067 },
  "Благоевград": { lat: 42.0116, lng: 23.0979 },
  "Велико Търново": { lat: 43.0757, lng: 25.6172 },
  "Добрич": { lat: 43.5726, lng: 27.8273 },
  "Сливен": { lat: 42.6816, lng: 26.3292 },
  "Габрово": { lat: 42.8742, lng: 25.3187 },
  "Хасково": { lat: 41.9344, lng: 25.5555 },
  "Ямбол": { lat: 42.4841, lng: 26.5034 },
  "Перник": { lat: 42.6050, lng: 23.0378 },
  "Кюстендил": { lat: 42.2870, lng: 22.6940 },
  "Враца": { lat: 43.2100, lng: 23.5633 },
  "Пазарджик": { lat: 42.1928, lng: 24.3336 },
  "Монтана": { lat: 43.4085, lng: 23.2257 },
  "Смолян": { lat: 41.5774, lng: 24.7011 },
  "Търговище": { lat: 43.2510, lng: 26.5723 },
  "Силистра": { lat: 44.1178, lng: 27.2600 },
  "Кърджали": { lat: 41.6333, lng: 25.3667 },
  "Разград": { lat: 43.5267, lng: 26.5167 },
  "Видин": { lat: 43.9910, lng: 22.8820 },
  "Ловеч": { lat: 43.1367, lng: 24.7140 },
}

// Function to extract coordinates from Google Maps URL
function extractCoordsFromUrl(url: string | null): { lat: number; lng: number } | null {
  if (!url) return null
  
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
    }
  }
  
  return null
}

// Get store coordinates
function getStoreCoordinates(store: StoreData, index: number): { lat: number; lng: number } {
  const urlCoords = extractCoordsFromUrl(store.google_maps_url)
  if (urlCoords) return urlCoords
  
  if (store.latitude && store.longitude) {
    return { lat: store.latitude, lng: store.longitude }
  }
  
  const cityCoords = cityCoordinates[store.city]
  if (cityCoords) {
    const offset = index * 0.002
    return { lat: cityCoords.lat + offset, lng: cityCoords.lng + offset }
  }
  
  return { lat: 42.7339, lng: 25.4858 }
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

// Center on Shumen (main office location)
const defaultCenter = { lat: 43.2712, lng: 26.9361 }
const defaultZoom = 8

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [activeMarker, setActiveMarker] = useState<number | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores")
      const data = await response.json()
      setStores(data)
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const handleStoreClick = (store: StoreData, index: number) => {
    setSelectedStore(store)
    setActiveMarker(store.id)
    if (map) {
      const coords = getStoreCoordinates(store, index)
      map.setCenter(coords)
      map.setZoom(15)
    }
  }

  const handleMarkerClick = (store: StoreData, index: number) => {
    setSelectedStore(store)
    setActiveMarker(store.id)
    if (map) {
      const coords = getStoreCoordinates(store, index)
      map.panTo(coords)
    }
  }



  const parseWorkingHours = (store: StoreData) => {
    if (store.is_24_7) {
      return {
        "Понеделник": "Денонощно",
        "Вторник": "Денонощно",
        "Сряда": "Денонощно",
        "Четвъртък": "Денонощно",
        "Петък": "Денонощно",
        "Събота": "Денонощно",
        "Неделя": "Денонощно",
      }
    }
    
    if (store.weekly_hours) {
      const dayMap: Record<string, keyof typeof store.weekly_hours> = {
        "Понеделник": "monday",
        "Вторник": "tuesday",
        "Сряда": "wednesday",
        "Четвъртък": "thursday",
        "Петък": "friday",
        "Събота": "saturday",
        "Неделя": "sunday",
      }
      
      const result: Record<string, string> = {}
      for (const [bgDay, enDay] of Object.entries(dayMap)) {
        const dayHours = store.weekly_hours[enDay]
        if (dayHours.closed) {
          result[bgDay] = "Почивен ден"
        } else {
          result[bgDay] = `от ${dayHours.open}-${dayHours.close}`
        }
      }
      return result
    }
    
    // Fallback to old working_hours text
    return {
      "Понеделник": `от ${store.working_hours}`,
      "Вторник": `от ${store.working_hours}`,
      "Сряда": `от ${store.working_hours}`,
      "Четвъртък": `от ${store.working_hours}`,
      "Петък": `от ${store.working_hours}`,
      "Събота": `от ${store.working_hours}`,
      "Неделя": "Почивен ден",
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      {/* Dark header section */}
      <div className="bg-black pt-24 pb-6">
        <div className="container mx-auto px-4">
<div className="flex items-center gap-4">
                <Image src="/store-icon.webp" alt="Store" width={40} height={40} className="w-10 h-10" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Заложни къщи КЕШ
                </h1>
            <div className="flex-1 h-px bg-gray-600" />
          </div>
          <p className="text-gray-400 mt-2">
            Виж актуална информация за магазините и работно време.
          </p>
        </div>
      </div>

      {/* Map section - white rounded container */}
      <main className="flex-1 bg-black pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            
            {/* Mobile Layout: Vertical stack */}
            <div className="lg:hidden">
              {/* Mobile: Map */}
              <div className="relative h-[350px]">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={defaultZoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {stores.map((store, index) => {
                      const coords = getStoreCoordinates(store, index)
                      const isSelected = selectedStore?.id === store.id
                      
                      return (
                                        <Marker
                                          key={store.id}
                                          position={coords}
                                          onClick={() => handleMarkerClick(store, index)}
                                          icon={{
                                            url: "/kesh-logo.png",
                                            scaledSize: new google.maps.Size(isSelected ? 50 : 40, isSelected ? 50 : 40),
                                            anchor: new google.maps.Point(isSelected ? 25 : 20, isSelected ? 25 : 20),
                                          }}
                                        >
                          {activeMarker === store.id && (
                            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                              <div className="p-2 max-w-[200px]">
                                <h3 className="font-bold text-sm text-gray-900">{store.name}</h3>
                                <p className="text-xs text-gray-600 mt-1">{store.city}, {store.address}</p>
                              </div>
                            </InfoWindow>
                          )}
                        </Marker>
                      )
                    })}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-gray-500">Зареждане на картата...</div>
                  </div>
                )}


                
                {selectedStore && (
                  <button className="absolute top-16 right-4 flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-md">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                    <span className="text-sm text-gray-700">Информация</span>
                  </button>
                )}
              </div>

              {/* Mobile: Store details below map */}
              {selectedStore && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <Image src="/store-icon.webp" alt="Store" width={28} height={28} className="w-7 h-7 flex-shrink-0" />
                    <h2 className="text-lg font-bold text-gray-900 uppercase">
                      {selectedStore.name}
                    </h2>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-gray-700">
                      {selectedStore.city}, {selectedStore.address}
                    </p>
                  </div>

                  {selectedStore.email && (
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gray-100 rounded">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </div>
                      <a href={`mailto:${selectedStore.email}`} className="text-gray-700 hover:text-orange-500">
                        {selectedStore.email}
                      </a>
                    </div>
                  )}

                  {selectedStore.phone && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </div>
                      <a href={`tel:${selectedStore.phone}`} className="text-gray-700 hover:text-orange-500">
                        {selectedStore.phone}
                      </a>
                    </div>
                  )}

                  {/* Action buttons - moved under phone */}
                  <div className="space-y-3 mb-4">
                    {/* View Products button - Blue gradient like nav */}
                    <Link
                      href={`/stores/${selectedStore.id}/products`}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#1b6ea5] to-[#1557a0] hover:from-[#1557a0] hover:to-[#0f4680] text-white font-bold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      <span>Виж продуктите в този магазин</span>
                    </Link>

                    {/* Google Maps button - Red gradient like nav */}
                    {selectedStore.google_maps_url && (
                      <a
                        href={selectedStore.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Виж в Google maps</span>
                      </a>
                    )}

                    {/* Back to all stores button */}
                    <button
                      onClick={() => {
                        setSelectedStore(null)
                        setActiveMarker(null)
                        if (map) {
                          map.setCenter(defaultCenter)
                          map.setZoom(defaultZoom)
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      <span>Към всички магазини</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 text-center mb-4">Работно време:</h3>
                    <div className="space-y-2">
                      {Object.entries(parseWorkingHours(selectedStore)).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium text-gray-700">{day}:</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile: Store list when no store selected */}
              {!selectedStore && (
                <div className="p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Всички магазини ({stores.length})
                  </h3>
                  <div className="space-y-3">
                    {stores.map((store, index) => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreClick(store, index)}
                        className="w-full text-left p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
                      >
                        <p className="font-medium text-gray-900">{store.name}</p>
                        <p className="text-gray-500 text-sm mt-1">{store.city}, {store.address}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Layout: Map with floating sidebar */}
            <div className="hidden lg:block relative h-[calc(100vh-250px)] min-h-[500px]">
              {/* Google Maps */}
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={defaultZoom}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {/* Store markers */}
                  {stores.map((store, index) => {
                    const coords = getStoreCoordinates(store, index)
                    const isSelected = selectedStore?.id === store.id
                    
                    return (
                                      <Marker
                                        key={store.id}
                                        position={coords}
                                        onClick={() => handleMarkerClick(store, index)}
                                        icon={{
                                          url: "/kesh-logo.png",
                                          scaledSize: new google.maps.Size(isSelected ? 50 : 40, isSelected ? 50 : 40),
                                          anchor: new google.maps.Point(isSelected ? 25 : 20, isSelected ? 25 : 20),
                                        }}
                                      >
                        {activeMarker === store.id && (
                          <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                            <div className="p-2 max-w-[200px]">
                              <h3 className="font-bold text-sm text-gray-900">{store.name}</h3>
                              <p className="text-xs text-gray-600 mt-1">{store.city}, {store.address}</p>
                              {store.phone && (
                                <p className="text-xs text-gray-600 mt-1">{store.phone}</p>
                              )}
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    )
                  })}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">Зареждане на картата...</div>
                </div>
              )}

              {/* Floating sidebar panel - Clean white design */}
              <div className="absolute top-4 right-4 z-10 w-[320px] bg-white shadow-xl overflow-hidden max-h-[calc(100%-32px)]">
                {/* Store details */}
                <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                  {selectedStore ? (
                    <div className="px-4 py-4">
                      {/* Store name with store icon */}
                      <div className="flex items-start gap-3 mb-5">
                        <Image src="/store-icon.webp" alt="Store" width={28} height={28} className="w-7 h-7 flex-shrink-0" />
                        <h3 className="text-gray-900 font-bold text-base uppercase leading-tight">
                          {selectedStore.name}
                        </h3>
                      </div>

                      {/* Address with location pin */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Location pin icon */}
                        <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <p className="text-gray-700">
                          {selectedStore.city}, {selectedStore.address}
                        </p>
                      </div>

                      {/* Email with @ icon */}
                      {selectedStore.email && (
                        <div className="flex items-start gap-3 mb-3">
                          {/* @ symbol icon */}
                          <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M16 12v1a3 3 0 006 0v-1a10 10 0 10-4 8" />
                          </svg>
                          <a href={`mailto:${selectedStore.email}`} className="text-gray-700 hover:text-gray-900">
                            {selectedStore.email}
                          </a>
                        </div>
                      )}

                      {/* Phone with handset icon */}
                      {selectedStore.phone && (
                        <div className="flex items-start gap-3 mb-5">
                          {/* Phone handset icon */}
                          <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                          </svg>
                          <a href={`tel:${selectedStore.phone}`} className="text-gray-700 hover:text-gray-900">
                            {selectedStore.phone}
                          </a>
                        </div>
                      )}

                      {/* Action buttons - moved under phone */}
                      <div className="space-y-3 mb-5">
                        {/* View Products button - Blue gradient like nav */}
                        <Link
                          href={`/stores/${selectedStore.id}/products`}
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#1b6ea5] to-[#1557a0] hover:from-[#1557a0] hover:to-[#0f4680] text-white font-bold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                          </svg>
                          <span>Виж продуктите в този магазин</span>
                        </Link>

                        {/* Google Maps button - Red gradient like nav */}
                        {selectedStore.google_maps_url && (
                          <a
                            href={selectedStore.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <MapPin className="w-5 h-5" />
                            <span>Виж в Google maps</span>
                          </a>
                        )}

                        {/* Back to all stores button */}
                        <button
                          onClick={() => {
                            setSelectedStore(null)
                            setActiveMarker(null)
                            if (map) {
                              map.setCenter(defaultCenter)
                              map.setZoom(defaultZoom)
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                          <span>Към всички магазини</span>
                        </button>
                      </div>

                      {/* Working hours */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 text-center mb-4">Работно време:</h4>
                        <div className="space-y-2">
                          {Object.entries(parseWorkingHours(selectedStore)).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-sm">
                              <span className="font-medium text-gray-900">{day}:</span>
                              <span className="text-gray-600">{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Store list */}
                  {!selectedStore && (
                    <div className="px-4 pb-4 pt-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">
                        Всички магазини ({stores.length})
                      </h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {stores.map((store, index) => (
                          <button
                            key={store.id}
                            onClick={() => handleStoreClick(store, index)}
                            className="w-full text-left p-3 bg-white shadow-md hover:shadow-lg transition-shadow"
                          >
                            <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{store.city}, {store.address}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
