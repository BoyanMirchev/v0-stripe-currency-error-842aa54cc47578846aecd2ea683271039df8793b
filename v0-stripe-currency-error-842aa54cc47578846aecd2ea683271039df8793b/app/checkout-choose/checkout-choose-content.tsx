"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Home,
  Store,
  Leaf,
  Info,
  Check,
  Loader2,
  Send,
  MapPin,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  MapIcon,
  List,
  RefreshCw,
  ChevronsUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import type { EcontCity, EcontOffice } from "@/lib/econt-api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { AuthNavbar } from "@/components/auth-navbar"
import { AuthFooter } from "@/components/auth-footer"

declare global {
  interface Window {
    google: any
    initGoogleMap: () => void
  }
}

// Custom icon combining Home and MapPin
const HomeDeliveryIcon = () => (
  <div className="relative w-8 h-8">
    <Home className="absolute top-1 left-1 w-6 h-6 text-gray-500" />
    <MapPin className="absolute -top-0.5 right-0 w-4 h-4 text-gray-500 fill-current" />
  </div>
)

// Econt Logo Component
const EcontLogo = () => (
  <span className="inline-flex items-center justify-center bg-[#005696] text-white text-[8px] font-bold px-1 py-0.5 rounded-[2px] ml-1">
    ЕКОНТ
  </span>
)

// Haversine formula to calculate distance between two lat/lon points in kilometers
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const RADIUS_OPTIONS = [2, 5, 10, 20, 50] // Define available radii for expanding search

// Helper function to format office working hours
const getOfficeWorkingTime = (office: EcontOffice): string => {
  const weekdays = `${office.workBegin} - ${office.workEnd}`
  const saturday =
    office.workBeginSaturday && office.workEndSaturday
      ? `Събота: ${office.workBeginSaturday} - ${office.workEndSaturday}`
      : "Събота: Почивен ден"
  return `Делнични дни: ${weekdays}. ${saturday}.`
}

function getDeliveryDateRange() {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 2) // Start from 2 days from now

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 4) // End date is 4 days after start (total 6 day range)

  const dayAbbreviations: { [key: number]: string } = {
    0: "нд", // неделя (Sunday)
    1: "пн", // понеделник (Monday)
    2: "вт", // вторник (Tuesday)
    3: "ср", // сряда (Wednesday)
    4: "чт", // четвъртък (Thursday)
    5: "пт", // петък (Friday)
    6: "сб", // събота (Saturday)
  }

  const formatDate = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const dayAbbr = dayAbbreviations[date.getDay()]
    return `${dayAbbr}, ${day}.${month.toString().padStart(2, "0")}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export default function CheckoutChoosePage() {
  const router = useRouter()
  const searchParams = useSearchParams() // Get search params to read type
  const { state: cartState, dispatch, updateQuantity, removeItem } = useCart()

  const checkoutType = searchParams.get("type")
  const isPhysicalOnly = checkoutType === "physical"

  const [fetchedProducts, setFetchedProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  // </CHANGE>

  // Filter cart items based on type
  const displayedCartItems = useMemo(() => {
    if (loadingProducts) {
      return []
    }

    if (isPhysicalOnly) {
      // Only show physical products (numeric IDs)
      return fetchedProducts.filter((item) => typeof item.id === "number")
    }
    // Show all items if no type filter
    return fetchedProducts
    // </CHANGE>
  }, [fetchedProducts, isPhysicalOnly, loadingProducts])

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)
  const [deliveryOption, setDeliveryOption] = useState<"office" | "home">("home")
  const { toast } = useToast()

  // Add a new state for the order summary drawer
  const [showOrderSummaryDrawer, setShowOrderSummaryDrawer] = useState(false)

  const [showOnlyLastUsedAddress, setShowOnlyLastUsedAddress] = useState(false)
  const showLastUsedOnly = showOnlyLastUsedAddress // Alias for clarity in the update

  // Econt Office specific states
  const [openCitySelect, setOpenCitySelect] = useState(false)
  const [selectedCity, setSelectedCity] = useState<EcontCity | null>(null) // For Econt city selection
  const [cities, setCities] = useState<EcontCity[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [citySearchInput, setCitySearchInput] = useState("")
  const [cityError, setCityError] = useState<string | null>(null)
  const [cityErrorDetails, setCityErrorDetails] = useState<string | null>(null)

  const [offices, setOffices] = useState<EcontOffice[]>([])
  const [loadingOffices, setLoadingOffices] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<EcontOffice | null>(null)
  const [officeError, setOfficeError] = useState<string | null>(null)
  const [officeErrorDetails, setOfficeErrorDetails] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null) // For map centering
  const [selectedRadius, setSelectedRadius] = useState<number>(RADIUS_OPTIONS[0]) // Default to smallest radius option for Econt
  const [officeStreetAddress, setOfficeStreetAddress] = useState("") // For Econt office search by address
  const [officePostalCode, setOfficePostalCode] = useState("") // For Econt office search by address
  const [myLocationInput, setMyLocationInput] = useState("") // For Econt "My Location" display
  const [lastUsedAddress, setLastUsedAddress] = useState<string>("") // New state for last used address
  const [currentAddressDisplay, setCurrentAddressDisplay] = useState<string | null>(null) // New state for the top address display
  const [officeTypeFilter, setOfficeTypeFilter] = useState<"OFFICE" | "AUTOMAT" | null>(null) // New state for office type filter

  const [showOfficeDetails, setShowOfficeDetails] = useState(false) // New state to control office details view
  const [distanceToSelectedOffice, setDistanceToSelectedOffice] = useState<number | null>(null)
  const [showMap, setShowMap] = useState(true) // New state for map/list toggle
  const [showSearchForm, setShowSearchForm] = useState(true) // New state to control visibility of search form vs address display
  const [justZoomedToCity, setJustZoomedToCity] = useState(false)
  const [justZoomedToOffice, setJustZoomedToOffice] = useState(false)
  const [officeClickedFromMyLocation, setOfficeClickedFromMyLocation] = useState(false)
  // </CHANGE>

  // Form fields for selected Econt office
  const [officeFirstName, setOfficeFirstName] = useState<string>("")
  const [officeLastName, setOfficeLastName] = useState<string>("")
  const [officePhoneNumber, setOfficePhoneNumber] = useState<string>("")

  // Home Delivery specific states
  const [homeSalutation, setHomeSalutation] = useState<string>("Г-жа")
  const [homeFirstName, setHomeFirstName] = useState<string>("")
  const [homeLastName, setHomeLastName] = useState<string>("")
  const [homeCountry, setHomeCountry] = useState<string>("BG") // Default to Bulgaria
  const [homeCity, setHomeCity] = useState<string>("")
  const [homePostalCode, setHomePostalCode] = useState<string>("")
  const [homeStreet, setHomeStreet] = useState<string>("")
  const [homeStreetNumber, setHomeStreetNumber] = useState<string>("")
  const [homeAdditionalInfo, setHomeAdditionalInfo] = useState<string>("")
  const [homeDateOfBirth, setHomeDateOfBirth] = useState<string>("")
  const [homePhoneNumber, setHomePhoneNumber] = useState<string>("")

  // State for manual sync button
  const [isSyncing, setIsSyncing] = useState(false)
  const [showSyncButton, setShowSyncButton] = useState(false)

  const promotionAmount = 32.0
  const deliveryCost = 0
  const totalAfterPromotion = cartState.totalPrice - promotionAmount

  const orderSummaryAmount = `${cartState.totalPrice.toFixed(2)} лв.`

  const mapRef = useRef<HTMLDivElement>(null)
  const officeMapRef = useRef<HTMLDivElement>(null) // New ref for the office-specific map
  const googleMap = useRef<any>(null)
  const markers = useRef<any[]>([])
  const userLocationMarker = useRef<any>(null)

  // Function to fetch offices for a given city and filter by radius

  // Function to fetch offices for a given city and filter by radius
  const getOffices = async (
    cityId: string,
    userLat?: number,
    userLon?: number,
    radius?: number,
    typeFilter?: "OFFICE" | "AUTOMAT", // New parameter for filtering by type
  ): Promise<EcontOffice[]> => {
    console.log(
      "getOffices called for cityId:",
      cityId,
      "userLat:",
      userLat,
      "userLon:",
      userLon,
      "radius:",
      radius,
      "typeFilter:",
    )
    setOfficeError(null)
    try {
      const response = await fetch("/api/econt/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId: cityId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setOfficeError(errorData.error || "Failed to fetch offices")
        setOfficeErrorDetails(errorData.details || null)
        return []
      }
      const data: EcontOffice[] = await response.json()

      let filteredOffices = data
      // Apply filtering based on the 'isMachine' field
      if (typeFilter === "OFFICE") {
        filteredOffices = filteredOffices.filter((office) => office.isMachine === false)
      } else if (typeFilter === "AUTOMAT") {
        filteredOffices = filteredOffices.filter((office) => office.isMachine === true)
      }

      if (userLat && userLon && radius !== undefined) {
        filteredOffices = filteredOffices.filter((office) => {
          if (office.location && office.location.latitude && office.location.longitude) {
            const distance = haversineDistance(userLat, userLon, office.location.latitude, office.location.longitude)
            return distance <= radius
          }
          return false
        })
      }
      return filteredOffices
    } catch (error: any) {
      setOfficeError(`Грешка при зареждане на офиси: ${error.message}`)
      return []
    }
  }

  // Helper function to find offices with expanding radius
  const findOfficesWithExpandingRadius = async (
    cityId: string,
    userLat: number,
    userLon: number,
    typeFilter?: "OFFICE" | "AUTOMAT", // Add typeFilter here
  ) => {
    setLoadingOffices(true)
    setOfficeError(null)
    setSelectedOffice(null) // Clear any previously selected office

    let foundOffices = false
    for (const radius of RADIUS_OPTIONS) {
      toast({
        title: "Търсене на офиси",
        description: `Търсене на офиси в радиус от ${radius} км...`,
        duration: 1500, // Shorter duration for intermediate toasts
      })

      const fetchedOffices = await getOffices(cityId, userLat, userLon, radius, typeFilter) // Pass typeFilter

      if (fetchedOffices.length > 0) {
        setOffices(fetchedOffices)
        setSelectedRadius(radius) // Update the selected radius in UI
        toast({
          title: "Офиси намерени",
          description: `Намерени са ${fetchedOffices.length} офиса в радиус от ${radius} км.`,
          duration: 3000,
        })
        foundOffices = true
        break // Offices found, stop searching
      }
    }

    if (!foundOffices) {
      setOffices([])
      setOfficeError(`Няма налични офиси в радиус до ${RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1]} км.`)
      toast({
        title: "Няма намерени офиси",
        description: `Не бяха намерени офиси в радиус до ${RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1]} км.`,
        variant: "destructive",
        duration: 5000,
      })
    }
    setLoadingOffices(false)
  }

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        return Promise.resolve()
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDjuMW-6OeII4jEw0UWh5-W4E8NfKMFwng&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load Google Maps script"))
        document.head.appendChild(script)
      })
    }

    loadGoogleMapsScript().catch(console.error)
  }, [])

  useEffect(() => {
    const fetchProductsFromDatabase = async () => {
      try {
        setLoadingProducts(true)

        // Get cart items with their IDs and types
        const cartItems = cartState.items.map((item) => ({
          id: item.id,
          type: item.type || "equipment",
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || {},
        }))

        if (cartItems.length === 0) {
          setFetchedProducts([])
          setLoadingProducts(false)
          return
        }

        // Fetch products from database
        const response = await fetch("/api/cart/fetch-products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: cartItems }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setFetchedProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products from database:", error)
        toast({
          title: "Грешка",
          description: "Не успяхме да заредим продуктите. Моля, опитайте отново.",
          variant: "destructive",
        })
        setFetchedProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProductsFromDatabase()
  }, [cartState.items, toast])

  useEffect(() => {
    if (!mapRef.current || deliveryOption === "home" || !showMap || !window.google) return

    // Initialize Google Map
    googleMap.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 42.7, lng: 25.0 },
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    return () => {
      // Cleanup
      if (googleMap.current) {
        googleMap.current = null
      }
    }
  }, [deliveryOption, showMap, window.google])

  // Effect for the office-specific map initialization
  useEffect(() => {
    if (!officeMapRef.current || deliveryOption === "home" || !showOfficeDetails || !window.google) return

    // Initialize Google Map for office details
    const officeMap = new window.google.maps.Map(officeMapRef.current, {
      center: { lat: 42.7, lng: 25.0 }, // Default center
      zoom: 12, // Default zoom
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Add marker for the selected office
    if (selectedOffice?.location) {
      const marker = new window.google.maps.Marker({
        position: { lat: selectedOffice.location.latitude, lng: selectedOffice.location.longitude },
        map: officeMap,
        title: selectedOffice.name,
        icon: {
          url: "https://checkout-cdn.aboutyou.cloud/app/production/v2.1.71-rc.8/v2.1.71-rc.8-2156522803/assets/collectionPoints/mapPins/econtbgParcelshop.svg",
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        },
      })
      officeMap.setCenter({ lat: selectedOffice.location.latitude, lng: selectedOffice.location.longitude })
      officeMap.setZoom(16)
    }

    return () => {
      // Cleanup
      if (officeMap) {
        // You might want to remove the marker here if it's managed within this effect scope
      }
    }
  }, [selectedOffice, deliveryOption, showOfficeDetails, window.google])

  useEffect(() => {
    console.log(
      "[v0] City zoom useEffect triggered. selectedCity:",
      selectedCity?.name,
      "deliveryOption:",
      deliveryOption,
      "showMap:",
      showMap,
    )

    if (typeof window === "undefined" || !googleMap.current || deliveryOption === "home" || !showMap || !selectedCity) {
      console.log("[v0] City zoom useEffect - Early return. Conditions not met.")
      return
    }

    const geocodeAndZoom = async () => {
      try {
        const address = `${selectedCity.name}, ${selectedCity.regionName}, Bulgaria`
        console.log("[v0] Starting geocoding for:", address)

        // Use Google Maps Geocoding REST API instead of the Geocoder class
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        )

        const data = await response.json()
        console.log("[v0] Geocode status:", data.status)

        if (data.status === "OK" && data.results[0]) {
          const location = data.results[0].geometry.location
          const lat = location.lat
          const lng = location.lng

          console.log("[v0] Geocoded coordinates:", lat, lng)
          console.log("[v0] Map instance exists:", !!googleMap.current)

          if (googleMap.current) {
            // Set the flag to prevent offices useEffect from overriding
            console.log("[v0] Setting justZoomedToCity flag to TRUE")
            setJustZoomedToCity(true)

            // Zoom to city
            googleMap.current.setCenter({ lat, lng })
            googleMap.current.setZoom(12)

            console.log("[v0] Map center set to:", lat, lng)
            console.log("[v0] Map zoom set to: 12")

            // Reset the flag after a longer delay to ensure offices don't override
            setTimeout(() => {
              console.log("[v0] Resetting justZoomedToCity flag to FALSE")
              setJustZoomedToCity(false)
            }, 3000) // Increased from 1000ms to 3000ms
          } else {
            console.log("[v0] Map instance not available")
          }
        } else {
          console.log("[v0] Geocoding failed with status:", data.status)
        }
      } catch (error) {
        console.error("[v0] Geocoding error:", error)
      }
    }

    geocodeAndZoom()
  }, [selectedCity, deliveryOption, showMap])

  useEffect(() => {
    console.log(
      "[v0] Offices useEffect triggered. offices.length:",
      offices.length,
      "justZoomedToCity:",
      justZoomedToCity,
      "justZoomedToOffice:",
      justZoomedToOffice,
    )

    if (!googleMap.current || deliveryOption === "home" || !showMap) {
      console.log("[v0] Offices useEffect - Early return due to conditions")
      return
    }

    // Clear existing markers
    markers.current.forEach((marker) => marker.setMap(null))
    markers.current = []
    if (userLocationMarker.current) {
      userLocationMarker.current.setMap(null)
      userLocationMarker.current = null
    }

    // Add user location marker
    if (userLocation) {
      userLocationMarker.current = new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: googleMap.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#007AFF",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
        title: "Вашето местоположение",
      })
    }

    // Add office markers
    if (offices.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()

      offices.forEach((office) => {
        if (office.location && office.location.latitude && office.location.longitude) {
          const marker = new window.google.maps.Marker({
            position: { lat: office.location.latitude, lng: office.location.longitude },
            map: googleMap.current,
            title: office.name,
            icon: {
              url: "https://checkout-cdn.aboutyou.cloud/app/production/v2.1.71-rc.8/v2.1.71-rc.8-2156522803/assets/collectionPoints/mapPins/econtbgParcelshop.svg",
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32),
            },
          })

          // Add click listener
          marker.addListener("click", () => {
            console.log("[v0] Marker clicked for office:", office.name, office.id)
            // </CHANGE> Hide search form when office is selected
            setShowSearchForm(false)
            setSelectedOffice(office)
            setShowOfficeDetails(true)
            setOfficeClickedFromMyLocation(showOnlyLastUsedAddress) // Use correct state name here
            // </CHANGE>
            console.log("[v0] Set showSearchForm to FALSE, showOfficeDetails to TRUE, selectedOffice to:", office.name)
            if (userLocation && office.location) {
              const distance = haversineDistance(
                userLocation.latitude,
                userLocation.longitude,
                office.location.latitude,
                office.location.longitude,
              )
              setDistanceToSelectedOffice(distance)
              console.log("[v0] Distance calculated:", distance)
            } else {
              setDistanceToSelectedOffice(null)
              console.log("[v0] No distance calculated - missing user location or office location")
            }
            setCurrentAddressDisplay(office.address)
            console.log("[v0] Current address display set to:", office.address)

            // Set the flag to prevent offices useEffect from overriding
            setJustZoomedToOffice(true) // Pan to selected office
            googleMap.current.panTo({ lat: office.location.latitude, lng: office.location.longitude })
            googleMap.current.setZoom(16) // Increased zoom level from 14 to 16 for closer view
            console.log("[v0] Map panned and zoomed to office location")

            // Reset the flag after 3 seconds
            setTimeout(() => {
              console.log("[v0] Resetting justZoomedToOffice flag to FALSE after marker click")
              setJustZoomedToOffice(false)
            }, 3000)
            // </CHANGE>
          })

          markers.current.push(marker)
          bounds.extend({ lat: office.location.latitude, lng: office.location.longitude })
        }
      })

      // Include user location in bounds if available
      if (userLocation) {
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude })
      }

      if (!bounds.isEmpty() && !justZoomedToCity && !justZoomedToOffice) {
        console.log("[v0] Calling fitBounds for offices")
        googleMap.current.fitBounds(bounds, { padding: 50 })
      } else if (justZoomedToCity) {
        console.log("[v0] Skipping fitBounds because justZoomedToCity is TRUE")
      } else if (justZoomedToOffice) {
        console.log("[v0] Skipping fitBounds because justZoomedToOffice is TRUE")
      }
    } else if (userLocation && !justZoomedToCity && !justZoomedToOffice) {
      console.log("[v0] Centering on user location")
      // If no offices but user location exists, center on user location (only if not just zoomed to city or office)
      googleMap.current.setCenter({ lat: userLocation.latitude, lng: userLocation.longitude })
      googleMap.current.setZoom(12)
    } else if (!justZoomedToCity && !justZoomedToOffice) {
      console.log("[v0] Setting default view")
      // Default view (only if not just zoomed to city or office)
      googleMap.current.setCenter({ lat: 42.7, lng: 25.0 })
      googleMap.current.setZoom(7)
    }
    // </CHANGE> Removed justZoomedToCity from dependency array to prevent re-run when flag changes
  }, [offices, deliveryOption, userLocation, selectedOffice, showOfficeDetails, showMap])

  useEffect(() => {
    fetchCities()
  }, [])

  // Fetch offices when city changes, delivery option is 'office', or officeTypeFilter/selectedRadius changes
  useEffect(() => {
    if (deliveryOption === "office" && selectedCity && !showOfficeDetails) {
      console.log("Selected city changed or delivery option is office. Fetching offices for:", selectedCity.name)
      if (showMap && userLocation) {
        // If map is shown and user location is available, filter by radius
        getOffices(selectedCity.id, userLocation.latitude, userLocation.longitude, selectedRadius, officeTypeFilter) // Pass officeTypeFilter and selectedRadius
          .then((data) => {
            setOffices(data)
            if (data.length === 0) {
              setOfficeError(`Няма налични офиси в радиус от ${selectedRadius} км за този град.`)
            }
          })
          .catch((error) => {
            setOfficeError(`Грешка при зареждане на офиси: ${error.message}`)
          })
      } else {
        // If list is shown or no user location, fetch all offices for the selected city
        getOffices(selectedCity.id, undefined, undefined, undefined, officeTypeFilter) // Pass officeTypeFilter
          .then((data) => {
            setOffices(data)
            if (data.length === 0) {
              setOfficeError("Няма налични офиси за този град.")
            }
          })
          .catch((error) => {
            setOfficeError(`Грешка при зареждане на офиси: ${error.message}`)
          })
      }
    } else if (deliveryOption === "office" && !selectedCity && !showOfficeDetails) {
      // Clear offices if no city selected and not in office details view
      setOffices([])
      setSelectedOffice(null)
      setOfficeError(null)
    }
  }, [selectedCity, deliveryOption, userLocation, selectedRadius, showOfficeDetails, showMap, officeTypeFilter]) // Add officeTypeFilter and selectedRadius dependency

  const handleContinue = () => {
    // Validation logic for home delivery
    if (deliveryOption === "home") {
      if (
        !homeSalutation ||
        !homeFirstName ||
        !homeLastName ||
        !homeCity ||
        !homePostalCode ||
        !homeStreet ||
        !homeStreetNumber ||
        !homePhoneNumber
      ) {
        toast({
          title: "Непълна информация за доставка",
          description: "Моля, попълнете всички задължителни полета за доставка до дома.",
          variant: "warning",
          duration: 3000,
        })
        return
      }
      localStorage.setItem("deliveryOption", "home")
      localStorage.setItem(
        "homeDeliveryData",
        JSON.stringify({
          salutation: homeSalutation,
          firstName: homeFirstName,
          lastName: homeLastName,
          city: homeCity,
          postalCode: homePostalCode,
          street: homeStreet,
          streetNumber: homeStreetNumber,
          phoneNumber: homePhoneNumber,
        }),
      )
      // If all required fields are filled, proceed
      router.push("/checkout/details")
    } else if (deliveryOption === "office") {
      // Validation logic for office delivery
      if (!selectedOffice) {
        toast({
          title: "Изберете офис",
          description: "Моля, изберете офис на Еконт от картата.",
          variant: "warning",
          duration: 3000,
        })
        return
      }
      if (!officeFirstName || !officeLastName || !officePhoneNumber) {
        toast({
          title: "Непълна информация за получател",
          description: "Моля, попълнете име, фамилия и телефон за получателя на пратката.",
          variant: "warning",
          duration: 3000,
        })
        return // Prevent navigation if recipient info is incomplete
      }
      localStorage.setItem("deliveryOption", "office")
      localStorage.setItem(
        "officeDeliveryData",
        JSON.stringify({
          office: selectedOffice,
          firstName: officeFirstName,
          lastName: officeLastName,
          phoneNumber: officePhoneNumber,
        }),
      )
      router.push("/checkout/details")
    }
  }

  const retryFetchCities = () => {
    fetchCities() // Use the consolidated fetchCities function
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      setLoadingItemId(itemId)
      updateQuantity(itemId, newQuantity)
      // Clear loading state after animation
      setTimeout(() => setLoadingItemId(null), 500)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleMyLocationClick = async () => {
    setShowOnlyLastUsedAddress(true)

    setMyLocationInput("Търсене...")
    console.log("[v0] handleMyLocationClick called")

    try {
      if (!navigator.geolocation) {
        console.log("[v0] Geolocation not supported")
        toast({
          title: "Геолокацията не е поддържана",
          description: "Вашият браузър не поддържа геолокация.",
          variant: "destructive",
          duration: 5000,
        })
        setMyLocationInput("")
        return
      }

      if (loadingCities) {
        console.log("[v0] Cities still loading")
        toast({
          title: "Зареждане на градове",
          description: "Моля, изчакайте, докато заредим списъка с градове.",
          duration: 3000,
        })
        setMyLocationInput("")
        return
      }

      if (cities.length === 0) {
        console.log("[v0] No cities available")
        toast({
          title: "Няма налични градове",
          description: "Не можахме да заредим списъка с градове. Моля, опитайте отново по-късно.",
          variant: "destructive",
          duration: 5000,
        })
        setMyLocationInput("")
        return
      }

      console.log("[v0] Starting geolocation request...")
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("[v0] Geolocation success - received position:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setMyLocationInput(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)

          const [geoResponse, closestCity] = await Promise.all([
            fetch("/api/geocode", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            }).catch(() => null),
            // Calculate closest city in parallel
            Promise.resolve(
              cities.reduce<EcontCity | null>((closest, city) => {
                if (
                  city.location &&
                  typeof city.location.latitude === "number" &&
                  typeof city.location.longitude === "number"
                ) {
                  const distance = haversineDistance(
                    latitude,
                    longitude,
                    city.location.latitude,
                    city.location.longitude,
                  )
                  if (
                    !closest ||
                    distance <
                      haversineDistance(latitude, longitude, closest.location!.latitude, closest.location!.longitude)
                  ) {
                    return city
                  }
                }
                return closest
              }, null),
            ),
          ])

          let cityToUse: EcontCity | null = null
          let addressDisplay = ""

          // Try to use reverse geocoded city first
          if (geoResponse?.ok) {
            const geoData = await geoResponse.json()
            if (geoData.city) {
              const foundCity = cities.find(
                (city) =>
                  city.name.toLowerCase() === geoData.city.toLowerCase() ||
                  (city.nameEn && city.nameEn.toLowerCase() === geoData.city.toLowerCase()),
              )
              if (foundCity) {
                cityToUse = foundCity
                addressDisplay = geoData.fullAddress || `${geoData.city}, България`
              }
            }
          }

          // Fallback to closest city
          if (!cityToUse && closestCity) {
            cityToUse = closestCity
            addressDisplay = `${closestCity.name}, България`
          }

          if (cityToUse) {
            setSelectedCity(cityToUse)
            findOfficesWithExpandingRadius(cityToUse.id, latitude, longitude, officeTypeFilter)
            setLastUsedAddress(addressDisplay)
            setCurrentAddressDisplay(addressDisplay)
            toast({
              title: "Местоположение намерено",
              description: `Град: ${cityToUse.name}`,
              duration: 3000,
            })
          } else {
            console.log("[v0] No suitable city found")
            toast({
              title: "Местоположение намерено",
              description: "Моля, изберете населено място от падащото меню.",
              duration: 5000,
            })
            setMyLocationInput("")
          }
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
          setMyLocationInput("")
          let errorMessage = "Неуспешно получаване на местоположението."
          let errorTitle = "Грешка при геолокация"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Достъпът до местоположението е отказан. Моля, разрешете достъпа до местоположението в настройките на браузъра."
              errorTitle = "Разрешение отказано"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Информацията за местоположението е недостъпна. Включете GPS и опитайте отново."
              errorTitle = "Позиция недостъпна"
              break
            case error.TIMEOUT:
              errorMessage = "Изтече времето за получаване на местоположението. Опитайте отново."
              errorTitle = "Времето изтече"
              break
          }
          toast({
            title: errorTitle,
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } catch (error) {
      console.error("[v0] Unexpected error in handleMyLocationClick:", error)
      setMyLocationInput("")
      toast({
        title: "Грешка",
        description: "Възникна неочаквана грешка при получаването на местоположението.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleZoomIn = () => {
    if (googleMap.current) {
      const currentZoom = googleMap.current.getZoom()
      googleMap.current.setZoom(currentZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (googleMap.current) {
      const currentZoom = googleMap.current.getZoom()
      googleMap.current.setZoom(currentZoom - 1)
    }
  }

  const handleEditAddress = () => {
    setCurrentAddressDisplay(null)
    setSelectedOffice(null)
    setUserLocation(null)
    setMyLocationInput("")
    setOfficeStreetAddress("")
    setOfficePostalCode("")
    setSelectedCity(null)
    setShowOfficeDetails(false)
    setOffices([]) // Clear offices when editing
    setOfficeTypeFilter(null) // Reset filter when editing
    setShowSearchForm(true)
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    toast({
      title: "Синхронизиране на данни",
      description: "Изтегляне на актуални данни за градове и офиси от Еконт...",
      duration: 5000,
    })
    try {
      // Trigger cities fetch (which will update cache)
      await fetchCities()

      // Trigger offices fetch for a default city (e.g., Sofia, ID 1)
      // This assumes Sofia (ID 1) is always present or a reasonable default.
      // In a real app, you might want to sync offices for all major cities or based on user's region.
      const sofiaCity = cities.find((city) => city.name === "София") || { id: "1", name: "София" } // Fallback to ID 1 if Sofia not found
      if (sofiaCity) {
        await getOffices(sofiaCity.id)
      }

      toast({
        title: "Синхронизация завършена",
        description: "Данните за градове и офиси са актуализирани.",
        duration: 3000,
      })
      setShowSyncButton(false) // Hide button after successful sync
    } catch (error) {
      console.error("Manual sync failed:", error)
      toast({
        title: "Грешка при синхронизация",
        description: "Неуспешно синхронизиране на данни. Моля, опитайте отново.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Function to fetch cities
  const fetchCities = async () => {
    setLoadingCities(true)
    setCityError(null)
    setCityErrorDetails(null)
    try {
      const response = await fetch("/api/econt/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: "BGR" }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setCityError(errorData.error || "Failed to fetch cities")
        setCityErrorDetails(errorData.details || null)
        return
      }
      const data: EcontCity[] = await response.json()
      setCities(data)
      if (data.length === 0) setCityError("Няма налични градове.")
      else setShowSyncButton(false) // Hide sync button if cities are loaded
    } catch (error: any) {
      setCityError(`Грешка при зареждане на градове: ${error.message}`)
      setShowSyncButton(true) // Show sync button on error
    } finally {
      setLoadingCities(false)
    }
  }

  const physicalTotalPrice = useMemo(
    () =>
      displayedCartItems.reduce((sum, item) => {
        const price = Number.parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""))
        return sum + price * item.quantity
      }, 0),
    [displayedCartItems],
  )

  return (
    <>
      <AuthNavbar />

      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="flex flex-col lg:flex-row">
          {/* Left Section: Main Content */}
          <div className="flex-1 lg:flex-[0.6]">
            <main className="lg:max-w-[980px] lg:mx-auto lg:px-8">
              <div className="px-4 sm:px-6 py-2 md:py-3 flex justify-start mb-2 gap-3 sm:gap-8">
                <div className="flex items-center text-xs sm:text-sm font-semibold text-[#1d1d1f]">
                  <div className="bg-[#1d1d1f] text-white rounded size-4 sm:size-5 flex items-center justify-center mr-1.5 sm:mr-2 text-xs">
                    <Check className="size-3 sm:size-4" />
                  </div>
                  Контакт
                </div>
                <Link
                  href="/checkout/choose"
                  className="flex items-center text-xs sm:text-sm font-semibold text-[#1d1d1f]"
                >
                  <div className="bg-[#1d1d1f] text-white rounded size-4 sm:size-5 flex items-center justify-center mr-1.5 sm:mr-2 text-xs">
                    2
                  </div>
                  Доставка
                </Link>
                <Link
                  href="/checkout/details"
                  className="flex items-center text-xs sm:text-sm font-semibold text-[#86868b]"
                >
                  <div className="bg-[#86868b] text-white rounded size-4 sm:size-5 flex items-center justify-center mr-1.5 sm:mr-2 text-xs">
                    3
                  </div>
                  Плащане
                </Link>
              </div>

              <div className="flex flex-col px-4 sm:px-6 py-2 md:py-3">
                <h1 className="text-2xl lg:text-3xl font-semibold text-center lg:text-left mb-6">
                  До къде да доставим?
                </h1>

                {showSyncButton && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-center justify-between text-sm">
                    <p>Данните за Еконт може да не са актуални. Моля, синхронизирайте ги.</p>
                    <Button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-1 px-2"
                    >
                      {isSyncing ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" />
                      )}
                      {isSyncing ? "Синхронизиране..." : "Синхронизирай"}
                    </Button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 mb-6">
                  <button
                    onClick={() => {
                      setDeliveryOption("home")
                      setSelectedOffice(null)
                      setOffices([])
                      setUserLocation(null)
                      setMyLocationInput("")
                      setOfficeStreetAddress("")
                      setOfficePostalCode("")
                      setSelectedCity(null)
                      setShowOfficeDetails(false)
                      setCurrentAddressDisplay(null)
                      setOfficeTypeFilter(null)
                      setShowSearchForm(true)
                    }}
                    className={cn(
                      "w-full sm:w-56 p-3 sm:p-4 rounded-xl transition-all duration-300 flex flex-col items-start text-left text-sm",
                      "active:scale-[0.98] transform",
                      deliveryOption === "home"
                        ? "bg-white border-2 border-[#0071e3] shadow-[0_4px_12px_rgba(0,113,227,0.15)]"
                        : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <h2
                        className={cn(
                          "text-base font-semibold transition-colors",
                          deliveryOption === "home" ? "text-[#0071e3]" : "text-gray-900",
                        )}
                      >
                        Доставка до дома
                      </h2>
                      <HomeDeliveryIcon />
                    </div>
                    <div
                      className={cn(
                        "mt-2 w-full text-xs font-medium py-0.5 sm:py-1 px-2 rounded-lg transition-colors",
                        deliveryOption === "home" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-600",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        <span>Еко доставка</span>
                      </div>
                      <Info className="w-3 h-3" />
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDeliveryOption("office")
                      setHomeSalutation("Г-жа")
                      setHomeFirstName("")
                      setHomeLastName("")
                      setHomeCountry("BG")
                      setHomeCity("")
                      setHomePostalCode("")
                      setHomeStreet("")
                      setHomeStreetNumber("")
                      setHomeAdditionalInfo("")
                      setHomeDateOfBirth("")
                      setHomePhoneNumber("")
                      setShowSearchForm(true)
                    }}
                    className={cn(
                      "w-full sm:w-56 p-3 sm:p-4 rounded-xl transition-all duration-300 flex flex-col items-start text-left text-sm",
                      "active:scale-[0.98] transform",
                      deliveryOption === "office"
                        ? "bg-white border-2 border-[#0071e3] shadow-[0_4px_12px_rgba(0,113,227,0.15)]"
                        : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <h2
                        className={cn(
                          "text-base font-semibold transition-colors",
                          deliveryOption === "office" ? "text-[#0071e3]" : "text-gray-900",
                        )}
                      >
                        Офис на Еконт
                      </h2>
                      <Store
                        className={cn(
                          "w-6 h-6 transition-colors",
                          deliveryOption === "office" ? "text-[#0071e3]" : "text-gray-500",
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "mt-2 w-full text-xs font-medium py-0.5 sm:py-1 px-2 rounded-lg flex items-center justify-between transition-colors",
                        deliveryOption === "office" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        <span>По-малко CO₂</span>
                      </div>
                      <Info className="w-3 h-3" />
                    </div>
                  </button>
                </div>

                {deliveryOption === "office" && (
                  <>
                    {showSearchForm ? (
                      <div className="relative h-[700px] bg-gray-200 overflow-hidden lg:rounded-xl -mx-4 sm:-mx-6 lg:mx-0">
                        {/* Map/List Toggle */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full shadow-lg flex p-1">
                          <Button
                            variant="ghost"
                            className={cn(
                              "rounded-full px-4 py-2 flex items-center gap-2",
                              showMap
                                ? "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                                : "text-gray-700 hover:bg-gray-100",
                            )}
                            onClick={() => setShowMap(true)}
                          >
                            <MapIcon className="w-5 h-5" />
                            Карта
                          </Button>
                          <Button
                            variant="ghost"
                            className={cn(
                              "rounded-full px-4 py-2 flex items-center gap-2",
                              !showMap ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100",
                            )}
                            onClick={() => setShowMap(false)}
                          >
                            <List className="w-5 h-5" />
                            Списък
                          </Button>
                        </div>

                        {/* Zoom Controls */}
                        {showMap && (
                          <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-white rounded-md shadow-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-none rounded-t-md"
                              onClick={handleZoomIn}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                            <div className="h-px w-full bg-gray-200" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-none rounded-b-md"
                              onClick={handleZoomOut}
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                          </div>
                        )}

                        {/* Map */}
                        <div id="map" ref={mapRef} className="w-full h-full lg:rounded-xl"></div>

                        {/* Search Form Overlay - positioned absolutely on top of map */}
                        <div className="absolute top-4 left-4 right-4 z-20 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                          {/* City selector and address dropdown */}
                          <div className="grid grid-cols-1 gap-3">
                            {!showOnlyLastUsedAddress && (
                              <div>
                                <Popover open={openCitySelect} onOpenChange={setOpenCitySelect}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openCitySelect}
                                      className="w-full justify-between bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors mt-1"
                                    >
                                      {selectedCity
                                        ? `${selectedCity.name} (${selectedCity.postCode})`
                                        : "Избери населено място"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0">
                                    <Command>
                                      <CommandInput
                                        placeholder="Търси населено място..."
                                        value={citySearchInput}
                                        onValueChange={setCitySearchInput}
                                      />
                                      <CommandList>
                                        {loadingCities ? (
                                          <CommandEmpty className="py-6 text-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" /> Зареждане...
                                          </CommandEmpty>
                                        ) : cityError ? (
                                          <CommandEmpty className="py-6 text-center text-red-500">
                                            <div>{cityError}</div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="mt-2 bg-transparent"
                                              onClick={retryFetchCities}
                                            >
                                              Опитай отново
                                            </Button>
                                          </CommandEmpty>
                                        ) : cities.length === 0 ? (
                                          <CommandEmpty className="py-6 text-center">
                                            Няма налични градове. Моля, опитайте отново по-късно.
                                          </CommandEmpty>
                                        ) : (
                                          <>
                                            <CommandEmpty>Няма намерени градове.</CommandEmpty>
                                            <CommandGroup>
                                              {cities
                                                .filter(
                                                  (city) =>
                                                    city.name.toLowerCase().includes(citySearchInput.toLowerCase()) ||
                                                    (city.nameEn &&
                                                      city.nameEn
                                                        .toLowerCase()
                                                        .includes(citySearchInput.toLowerCase())),
                                                )
                                                .map((city) => (
                                                  <CommandItem
                                                    key={city.id}
                                                    value={city.name}
                                                    onSelect={() => {
                                                      setSelectedCity(city)
                                                      setOpenCitySelect(false)
                                                      setCitySearchInput("")
                                                      setShowOnlyLastUsedAddress(false)
                                                    }}
                                                  >
                                                    <Check
                                                      className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedCity?.id === city.id ? "opacity-100" : "opacity-0",
                                                      )}
                                                    />
                                                    {city.name} ({city.postCode})
                                                  </CommandItem>
                                                ))}
                                            </CommandGroup>
                                          </>
                                        )}
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>
                          {!showOnlyLastUsedAddress && (
                            <div className="grid grid-cols-1 gap-3 mt-3">
                              <Select
                                value={selectedOffice?.id || ""}
                                onValueChange={(officeId) => {
                                  console.log("[v0] Office selected from dropdown. officeId:", officeId)
                                  const office = offices.find((o) => o.id === officeId)

                                  if (office) {
                                    setSelectedOffice(office)
                                    setShowOfficeDetails(true)
                                    setOfficeClickedFromMyLocation(showOnlyLastUsedAddress)
                                    // </CHANGE>

                                    if (userLocation && office.location) {
                                      const distance = haversineDistance(
                                        userLocation.latitude,
                                        userLocation.longitude,
                                        office.location.latitude,
                                        office.location.longitude,
                                      )
                                      setDistanceToSelectedOffice(distance)
                                    } else {
                                      setDistanceToSelectedOffice(null)
                                    }

                                    setCurrentAddressDisplay(office.address)

                                    console.log("[v0] Attempting to zoom to office location")
                                    console.log("[v0] googleMap.current exists:", !!googleMap.current)
                                    console.log("[v0] office.location:", office.location)

                                    // Pan to selected office on map
                                    if (googleMap.current && office.location) {
                                      console.log(
                                        "[v0] Zooming to office at:",
                                        office.location.latitude,
                                        office.location.longitude,
                                      )

                                      // Set the flag to prevent offices useEffect from overriding
                                      setJustZoomedToOffice(true)

                                      googleMap.current.panTo({
                                        lat: office.location.latitude,
                                        lng: office.location.longitude,
                                      })
                                      googleMap.current.setZoom(16) // Increased zoom level from 14 to 16 for closer view
                                      console.log("[v0] Map zoomed to office successfully")

                                      // Reset the flag after 3 seconds
                                      setTimeout(() => {
                                        console.log("[v0] Resetting justZoomedToOffice flag to FALSE")
                                        setJustZoomedToOffice(false)
                                      }, 3000)
                                    } else {
                                      console.log("[v0] Cannot zoom - googleMap or office.location is null")
                                    }
                                  }
                                }}
                                disabled={!selectedCity || loadingOffices || offices.length === 0}
                              >
                                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg">
                                  <SelectValue placeholder="Улица адрес" />
                                </SelectTrigger>
                                <SelectContent>
                                  {offices.length > 0 ? (
                                    offices
                                      .filter((office) => {
                                        // Filter offices to only show those from the selected city
                                        if (!selectedCity) return false
                                        // Check if office city matches selected city by ID or name
                                        return (
                                          office.city?.id === selectedCity.id ||
                                          office.city?.name === selectedCity.name ||
                                          office.address?.includes(selectedCity.name)
                                        )
                                      })
                                      .map((office) => (
                                        <SelectItem key={office.id} value={office.id}>
                                          {office.address}
                                        </SelectItem>
                                      ))
                                  ) : (
                                    <SelectItem value="no-offices" disabled>
                                      {selectedCity ? "Няма налични офиси" : "Изберете град първо"}
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="mt-3 space-y-3">
                            {!showOnlyLastUsedAddress && (
                              <Button
                                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold px-8 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] transform"
                                onClick={async () => {
                                  console.log("Search button clicked.")
                                  console.log("Current deliveryOption:", deliveryOption)
                                  console.log("Current selectedCity:", selectedCity)
                                  console.log("Current officeStreetAddress:", officeStreetAddress)
                                  console.log("Current officePostalCode:", officePostalCode)

                                  if (!selectedCity) {
                                    toast({
                                      title: "Изберете град",
                                      description: "Моля, изберете населено място от падащото меню.",
                                      variant: "warning",
                                      duration: 3000,
                                    })
                                    return
                                  }

                                  if (!officeStreetAddress) {
                                    toast({
                                      title: "Въведете улица",
                                      description: "Моля, въведете улица за търсене по адрес.",
                                      variant: "warning",
                                      duration: 3000,
                                    })
                                    return
                                  }

                                  setLoadingOffices(true) // Indicate loading while geocoding and fetching offices
                                  console.log("Attempting to geocode address:", {
                                    street: officeStreetAddress,
                                    postalCode: officePostalCode,
                                    cityName: selectedCity.name,
                                  })
                                  try {
                                    const response = await fetch("/api/geocode", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        street: officeStreetAddress,
                                        postalCode: officePostalCode,
                                        cityName: selectedCity.name,
                                      }),
                                    })

                                    if (!response.ok) {
                                      const errorData = await response.json()
                                      toast({
                                        title: "Грешка при търсене на адрес",
                                        description:
                                          errorData.error || "Неуспешно преобразуване на адреса в координати.",
                                        variant: "destructive",
                                        duration: 5000,
                                      })
                                      setLoadingOffices(false)
                                      return
                                    }

                                    const geocodedLocation = await response.json()
                                    console.log("Geocoding API response:", geocodedLocation)

                                    if (geocodedLocation && geocodedLocation.latitude && geocodedLocation.longitude) {
                                      if (geocodedLocation.latitude === 0 && geocodedLocation.longitude === 0) {
                                        toast({
                                          title: "Адрес не е намерен точно",
                                          description:
                                            "Не можахме да намерим точни координати за въведения адрес. Моля, опитайте с по-точен адрес.",
                                          variant: "warning",
                                          duration: 5000,
                                        })
                                        setLoadingOffices(false) // Stop loading
                                        return
                                      }

                                      setUserLocation(geocodedLocation) // This will trigger the consolidated useEffect for map update
                                      setMyLocationInput(
                                        `Lat: ${geocodedLocation.latitude.toFixed(4)}, Lon: ${geocodedLocation.longitude.toFixed(4)}`,
                                      )

                                      // Now fetch offices based on the geocoded location and selected city/radius
                                      findOfficesWithExpandingRadius(
                                        selectedCity.id,
                                        geocodedLocation.latitude,
                                        geocodedLocation.longitude,
                                        officeTypeFilter, // Pass officeTypeFilter
                                      )
                                      toast({
                                        title: "Адрес намерен",
                                        description: `Картата е центрирана около въведения адрес.`,
                                        duration: 5000,
                                      })
                                      // Set last used address and current address display
                                      const fullAddress = `${officeStreetAddress}${homeStreetNumber ? ` ${homeStreetNumber}` : ""}, ${selectedCity.name}${officePostalCode ? ` ${officePostalCode}` : ""}`
                                      setLastUsedAddress(fullAddress)
                                      setCurrentAddressDisplay(fullAddress)
                                      setShowSearchForm(false) // Hide search form
                                    } else {
                                      toast({
                                        title: "Адрес не е намерен",
                                        description:
                                          "Не можахме да намерим координати за въведения адрес. Моля, проверете адреса.",
                                        variant: "destructive",
                                        duration: 5000,
                                      })
                                      setLoadingOffices(false) // Stop loading if geocoding fails
                                    }
                                  } catch (error) {
                                    console.error("Error during geocoding:", error)
                                    toast({
                                      title: "Грешка при търсене",
                                      description: "Възникна грешка при търсенето на адреса. Моля, опитайте отново.",
                                      variant: "destructive",
                                      duration: 5000,
                                    })
                                    setLoadingOffices(false) // Stop loading on error
                                  }
                                }}
                              >
                                Търси
                              </Button>
                            )}
                            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-500 hover:border-gray-400 transition-all duration-200 focus-within:border-[#0071e3] focus-within:ring-2 focus-within:ring-[#0071e3]/20">
                              <Input
                                placeholder="Моето местоположение"
                                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-400 text-sm"
                                value={myLocationInput}
                                onChange={(e) => setMyLocationInput(e.target.value)}
                                readOnly
                              />
                              <Send
                                className="w-5 h-5 cursor-pointer text-[#0071e3] hover:text-[#0077ed] transition-colors active:scale-95 transform"
                                onClick={handleMyLocationClick}
                              />
                            </div>
                          </div>
                          {lastUsedAddress && (
                            <div className="mt-4">
                              <Label className="text-gray-700">Последно използван адрес</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  value={lastUsedAddress}
                                  readOnly
                                  className="bg-white border border-gray-300 rounded-lg text-gray-600"
                                />
                                {showOnlyLastUsedAddress && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm bg-transparent"
                                    onClick={() => {
                                      setShowOnlyLastUsedAddress(false)
                                      setMyLocationInput("")
                                      setSelectedCity(null)
                                      setOffices([])
                                      setUserLocation(null)
                                      setOfficeStreetAddress("")
                                      setOfficePostalCode("")
                                      setCurrentAddressDisplay(null)
                                      setSelectedOffice(null)
                                      setShowOfficeDetails(false)
                                      setOfficeTypeFilter(null)
                                      // </CHANGE> Navigate back to appropriate view based on where office was clicked
                                      if (officeClickedFromMyLocation) {
                                        setShowOnlyLastUsedAddress(true)
                                      } else {
                                        setShowOnlyLastUsedAddress(false)
                                      }
                                      setOfficeClickedFromMyLocation(false)
                                      // </CHANGE>
                                    }}
                                  >
                                    Назад
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 sm:px-6 lg:px-0">
                        <div className="relative h-[700px] bg-gray-200 overflow-hidden lg:rounded-xl -mx-4 sm:-mx-6 lg:mx-0">
                          {/* Map/List Toggle */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full shadow-lg flex p-1">
                            <Button
                              variant="ghost"
                              className={cn(
                                "rounded-full px-4 py-2 flex items-center gap-2",
                                showMap
                                  ? "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                                  : "text-gray-700 hover:bg-gray-100",
                              )}
                              onClick={() => setShowMap(true)}
                            >
                              <MapIcon className="w-5 h-5" />
                              Карта
                            </Button>
                            <Button
                              variant="ghost"
                              className={cn(
                                "rounded-full px-4 py-2 flex items-center gap-2",
                                !showMap ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100",
                              )}
                              onClick={() => setShowMap(false)}
                            >
                              <List className="w-5 h-5" />
                              Списък
                            </Button>
                          </div>

                          {/* Zoom Controls */}
                          {showMap && (
                            <div className="absolute bottom-4 right-4 z-10 flex flex-col bg-white rounded-md shadow-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none rounded-t-md"
                                onClick={handleZoomIn}
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                              <div className="h-px w-full bg-gray-200" />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none rounded-b-md"
                                onClick={handleZoomOut}
                              >
                                <Minus className="h-5 w-5" />
                              </Button>
                            </div>
                          )}

                          <div id="map" ref={mapRef} className="w-full h-full lg:rounded-xl"></div>

                          {showMap ? (
                            !showSearchForm &&
                            showOfficeDetails &&
                            selectedOffice && (
                              // Redesigned header with back button and ECONT logo
                              <div className="absolute inset-0 bg-white flex flex-col">
                                <div className="flex items-center justify-between p-4 border-b">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-700 hover:bg-gray-100 -ml-2"
                                    onClick={() => {
                                      console.log("[v0] Назад button clicked from office details")
                                      setSelectedOffice(null)
                                      setShowOfficeDetails(false)
                                      setDistanceToSelectedOffice(null)
                                      setShowSearchForm(true) // Show search form when going back from details
                                      if (officeClickedFromMyLocation) {
                                        setShowOnlyLastUsedAddress(true)
                                      } else {
                                        setShowOnlyLastUsedAddress(false)
                                      }
                                      setOfficeClickedFromMyLocation(false)

                                      // Force map to re-render by toggling showMap
                                      setShowMap(false)
                                      setTimeout(() => {
                                        setShowMap(true)
                                      }, 10)
                                      // </CHANGE>
                                    }}
                                  >
                                    <ChevronLeft className="h-5 w-5 mr-1" /> Назад
                                  </Button>
                                  <div className="bg-[#003D7A] text-white px-4 py-1 rounded font-bold text-xl">
                                    ЕКОHT
                                  </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                  {/* Office Details Section */}
                                  <div className="p-4 space-y-3">
                                    <h2 className="text-xl font-medium text-gray-800">{selectedOffice.name}</h2>
                                    {distanceToSelectedOffice !== null && (
                                      <div className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                                        {distanceToSelectedOffice.toFixed(2)} km
                                      </div>
                                    )}

                                    <div className="space-y-2 text-sm">
                                      <p className="text-gray-700">
                                        <span className="font-medium">Адрес:</span> {selectedOffice.address}
                                      </p>
                                      <p className="text-gray-700">
                                        <span className="font-medium">Работно време:</span>{" "}
                                        {getOfficeWorkingTime(selectedOffice)}
                                      </p>
                                    </div>

                                    {/* User Info Form */}
                                    <div className="pt-2">
                                      <p className="text-sm text-gray-600 mb-3">Моля, попълни данните си</p>
                                      <div className="space-y-3">
                                        <Input
                                          placeholder="Име"
                                          className="bg-gray-50 border-gray-200"
                                          value={officeFirstName}
                                          onChange={(e) => setOfficeFirstName(e.target.value)}
                                        />
                                        <Input
                                          placeholder="Фамилия"
                                          className="bg-gray-50 border-gray-200"
                                          value={officeLastName}
                                          onChange={(e) => setOfficeLastName(e.target.value)}
                                        />
                                        <Input
                                          placeholder="Телефон:"
                                          className="bg-gray-50 border-gray-200"
                                          value={officePhoneNumber}
                                          onChange={(e) => setOfficePhoneNumber(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="h-[300px] w-full relative">
                                    <div
                                      ref={officeMapRef}
                                      className="h-full w-full"
                                      style={{
                                        position: "relative",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="absolute inset-0 bg-white p-4 rounded-xl overflow-y-auto">
                              {/* Placeholder for list view */}
                              <h2 className="text-xl font-semibold mb-4">Офиси на Еконт (Списък)</h2>
                              {loadingOffices ? (
                                <div className="flex items-center justify-center h-48">
                                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                                </div>
                              ) : officeError ? (
                                <div className="text-red-500 text-center py-4">{officeError}</div>
                              ) : offices.length > 0 ? (
                                <ul className="space-y-3">
                                  {offices.map((office) => (
                                    <li
                                      key={office.id}
                                      className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                                      onClick={() => {
                                        setSelectedOffice(office)
                                        setShowOfficeDetails(true)
                                        setShowMap(true) // Switch back to map view when an office is selected from the list
                                        setOfficeClickedFromMyLocation(showLastUsedOnly)
                                        // </CHANGE>
                                        if (userLocation && office.location) {
                                          const distance = haversineDistance(
                                            userLocation.latitude,
                                            userLocation.longitude,
                                            office.location.latitude,
                                            office.location.longitude,
                                          )
                                          setDistanceToSelectedOffice(distance)
                                        } else {
                                          setDistanceToSelectedOffice(null)
                                        }
                                        setCurrentAddressDisplay(office.address) // Update current address display
                                      }}
                                    >
                                      <p className="font-semibold">{office.name}</p>
                                      <p className="text-sm text-gray-600">{office.address}</p>
                                      <p className="text-xs text-gray-500">{getOfficeWorkingTime(office)}</p>
                                      {userLocation && office.location && (
                                        <p className="text-xs text-gray-500">
                                          {haversineDistance(
                                            userLocation.latitude,
                                            userLocation.longitude,
                                            office.location.latitude,
                                            office.location.longitude,
                                          ).toFixed(2)}{" "}
                                          km
                                        </p>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-gray-500 text-center py-4">Няма намерени офиси.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {deliveryOption === "home" && (
                  // Home delivery form gets padding on mobile
                  <div className="px-4 sm:px-6 lg:px-0">
                    <h2 className="text-xl font-semibold mb-4">Адрес на доставка</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Select value={homeSalutation} onValueChange={setHomeSalutation}>
                          <SelectTrigger id="salutation" className="w-full bg-white border border-gray-300 rounded-lg">
                            <SelectValue placeholder="Изберете обръщение" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Г-жа">Г-жа</SelectItem>
                            <SelectItem value="Г-н">Г-н</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          id="firstName"
                          placeholder="Име"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeFirstName}
                          onChange={(e) => setHomeFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="lastName"
                          placeholder="Фамилия"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeLastName}
                          onChange={(e) => setHomeLastName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Select value={homeCountry} onValueChange={setHomeCountry}>
                          <SelectTrigger id="country" className="w-full bg-white border border-gray-300 rounded-lg">
                            <SelectValue placeholder="Изберете държава" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BG">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="5.33" fill="#FFFFFF" />
                                  <rect y="5.33" width="24" height="5.33" fill="#00966E" />
                                  <rect y="10.67" width="24" height="5.33" fill="#D62612" />
                                </svg>
                                България
                              </div>
                            </SelectItem>
                            <SelectItem value="RO">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="8" height="16" fill="#002B7F" />
                                  <rect x="8" width="8" height="16" fill="#FCD116" />
                                  <rect x="16" width="8" height="16" fill="#CE1126" />
                                </svg>
                                Румъния
                              </div>
                            </SelectItem>
                            <SelectItem value="GR">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="1.78" fill="#0D5EAF" />
                                  <rect y="1.78" width="24" height="1.78" fill="#FFFFFF" />
                                  <rect y="3.56" width="24" height="1.78" fill="#0D5EAF" />
                                  <rect y="5.33" width="24" height="1.78" fill="#FFFFFF" />
                                  <rect y="7.11" width="24" height="1.78" fill="#0D5EAF" />
                                  <rect y="8.89" width="24" height="1.78" fill="#FFFFFF" />
                                  <rect y="10.67" width="24" height="1.78" fill="#0D5EAF" />
                                  <rect y="12.44" width="24" height="1.78" fill="#FFFFFF" />
                                  <rect y="14.22" width="24" height="1.78" fill="#0D5EAF" />
                                  <rect width="9.6" height="8.89" fill="#0D5EAF" />
                                  <path d="M4.8 2.67v1.78h1.6V2.67H6.4v1.78H4.8V4.44h-1.6V2.67h1.6z" fill="#FFFFFF" />
                                </svg>
                                Гърция
                              </div>
                            </SelectItem>
                            <SelectItem value="TR">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="16" fill="#E41E20" />
                                  <circle cx="7.2" cy="8" r="2.4" fill="#FFFFFF" />
                                  <circle cx="8.4" cy="8" r="1.92" fill="#E41E20" />
                                  <path
                                    d="M12 6.4l0.74 2.28h2.4l-1.94 1.41 0.74 2.28L12 11.06l-1.94 1.31 0.74-2.28L8.86 8.68h2.4L12 6.4z"
                                    fill="#FFFFFF"
                                  />
                                </svg>
                                Турция
                              </div>
                            </SelectItem>
                            <SelectItem value="RS">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="5.33" fill="#C6363C" />
                                  <rect y="5.33" width="24" height="5.33" fill="#0C4076" />
                                  <rect y="10.67" width="24" height="5.33" fill="#FFFFFF" />
                                </svg>
                                Сърбия
                              </div>
                            </SelectItem>
                            <SelectItem value="MK">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="16" fill="#D20000" />
                                  <circle cx="12" cy="8" r="3.2" fill="#FFE600" />
                                  <circle cx="12" cy="8" r="2.4" fill="#D20000" />
                                  <path
                                    d="M12 0v16M0 8h24M3.43 3.43l17.14 9.14M20.57 3.43L3.43 12.57"
                                    stroke="#FFE600"
                                    strokeWidth="1.6"
                                  />
                                </svg>
                                Северна Македония
                              </div>
                            </SelectItem>
                            <SelectItem value="AL">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="16" fill="#E41E20" />
                                  <path
                                    d="M12 4c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h2c.55 0 1-.45 1-1V6c0-1.1-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-1c0-1.1-.9-2-2-2z"
                                    fill="#000000"
                                  />
                                </svg>
                                Албания
                              </div>
                            </SelectItem>
                            <SelectItem value="DE">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="5.33" fill="#000000" />
                                  <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
                                  <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
                                </svg>
                                Германия
                              </div>
                            </SelectItem>
                            <SelectItem value="IT">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="8" height="16" fill="#009246" />
                                  <rect x="8" width="8" height="16" fill="#FFFFFF" />
                                  <rect x="16" width="8" height="16" fill="#CE2B37" />
                                </svg>
                                Италия
                              </div>
                            </SelectItem>
                            <SelectItem value="FR">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="8" height="16" fill="#002395" />
                                  <rect x="8" width="8" height="16" fill="#FFFFFF" />
                                  <rect x="16" width="8" height="16" fill="#ED2939" />
                                </svg>
                                Франция
                              </div>
                            </SelectItem>
                            <SelectItem value="ES">
                              <div className="flex items-center">
                                <svg width="24" height="16" viewBox="0 0 24 16" className="mr-2">
                                  <rect width="24" height="4" fill="#AA151B" />
                                  <rect y="4" width="24" height="8" fill="#F1BF00" />
                                  <rect y="12" width="24" height="4" fill="#AA151B" />
                                </svg>
                                Испания
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          id="city"
                          placeholder="Населено място"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeCity}
                          onChange={(e) => setHomeCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="postalCode"
                          placeholder="Пощенски код"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homePostalCode}
                          onChange={(e) => setHomePostalCode(e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="street"
                          placeholder="Улица или квартал"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeStreet}
                          onChange={(e) => setHomeStreet(e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="streetNumber"
                          placeholder="Номер"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeStreetNumber}
                          onChange={(e) => setHomeStreetNumber(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          id="additionalInfo"
                          placeholder="Допълнителна информация (Опционално)"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeAdditionalInfo}
                          onChange={(e) => setHomeAdditionalInfo(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          id="dateOfBirth"
                          placeholder="ДД.ММ.ГГГГ"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homeDateOfBirth}
                          onChange={(e) => setHomeDateOfBirth(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          id="phoneNumber"
                          placeholder="Телефон"
                          className="bg-white border border-gray-300 rounded-lg"
                          value={homePhoneNumber}
                          onChange={(e) => setHomePhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue Button - Desktop only under delivery section */}
              {/* <div className="hidden lg:block py-4">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-lg text-lg font-medium"
                  disabled={
                    (deliveryOption === "home" &&
                      (!homeSalutation ||!homeFirstName ||
                        !homeLastName ||
                        !homeCity ||
                        !homePostalCode ||
                        !homeStreet ||
                        !homeStreetNumber ||
                        !homePhoneNumber)) ||
                    (deliveryOption === "office" &&
                      (!selectedOffice || !officeFirstName || !officeLastName || !officePhoneNumber)) ||
                    loadingCities ||
                    loadingOffices ||
                    cityError !== null ||
                    officeError !== null ||
                    isSyncing
                  }
                >
                  {deliveryOption === "office" && showOfficeDetails ? "Избери и продължи" : "Продължи към Плащане"}
                </Button>
              </div> */}
              <div className="lg:hidden px-4 sm:px-6 bg-gray-50 py-6 mb-20">
                <h2 className="text-xl font-semibold mb-4">Информация за поръчката</h2>

                <div className="bg-white rounded-t-lg px-3 py-2 border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Доставка на {getDeliveryDateRange()}</span>
                    <div className="bg-black text-white px-2 py-0.5 text-xs font-semibold rounded">EКОНТ</div>
                  </div>
                </div>

                <div className="mb-6 bg-gray-200 rounded-b-lg px-3 py-2">
                  <p className="text-sm text-gray-700">Изпраща се от Be Inc</p>
                </div>

                {/* Cart Items */}
                <div className="space-y-6 mb-6">
                  {displayedCartItems.map(
                    (
                      item, // Use displayedCartItems instead of cartState.items
                    ) => (
                      <div key={item.id} className="rounded-lg p-4 border border-gray-200">
                        <div className="flex gap-3 mb-3">
                          <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0">
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold mb-2">{item.name}</h3>

                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="space-y-1 text-xs text-gray-600">
                                {Object.entries(item.selectedOptions)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <p key={key} className="capitalize">
                                      {key}: <span className="font-medium text-gray-900">{value}</span>
                                    </p>
                                  ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <Trash2
                              className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                              onClick={() => handleRemoveItem(item.id)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              className={`w-6 h-6 flex items-center justify-center border rounded ${
                                item.quantity <= 1
                                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                              onClick={() => item.quantity > 1 && handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            {loadingItemId === item.id ? (
                              <div className="flex items-center gap-1">
                                <span
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                />
                                <span
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                />
                                <span
                                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                />
                              </div>
                            ) : (
                              <span className="text-sm font-semibold">
                                {(Number(String(item.price).replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(2)}{" "}
                                {item.currency}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 px-3 py-2 bg-gray-200 rounded-lg">
                          <p className="text-xs text-gray-600">Продава се от Be Inc</p>
                          <button className="flex-shrink-0">
                            <Info className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-300 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Междинна сума</span>
                    <span className="font-semibold">{physicalTotalPrice.toFixed(2)} лв.</span>{" "}
                    {/* Use physicalTotalPrice */}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка и обслужване</span>
                    <span className="font-semibold">Безплатно</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-pink-100 border border-pink-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-800">i</span>
                  </div>
                  <p className="text-sm text-gray-800">
                    Безплатни доставка и обслужване за поръчки, започващи от 34,90 лв.
                  </p>
                </div>

                {/* Total */}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Общо</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{physicalTotalPrice.toFixed(2)} лв.</span>{" "}
                      {/* Use physicalTotalPrice */}
                      <span className="text-sm text-gray-600 ml-2">({(physicalTotalPrice / 1.96).toFixed(2)} €)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">вкл. ДДС</p>
                </div>
              </div>
            </main>
          </div>

          <div className="hidden lg:block lg:flex-[0.4] bg-gray-100 lg:min-h-screen lg:-mt-16 lg:pt-16">
            <div className="sticky top-0 px-6 py-8">
              <h2 className="text-xl font-semibold mb-4">Информация за поръчката</h2>

              <div className="bg-white rounded-t-lg px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Доставка на {getDeliveryDateRange()}</span>
                  <div className="bg-black text-white px-2 py-0.5 text-xs font-semibold rounded">EКОНТ</div>
                </div>
              </div>

              <div className="mb-6 bg-gray-200 rounded-b-lg px-3 py-2">
                <p className="text-sm text-gray-700">Изпраща се от Be Inc</p>
              </div>

              {/* Cart Items */}
              <div className="space-y-6 mb-6">
                {displayedCartItems.map(
                  (
                    item, // Use displayedCartItems instead of cartState.items
                  ) => (
                    <div key={item.id} className="rounded-lg p-4">
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0">
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold mb-2">{item.name}</h3>

                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <div className="space-y-1 text-xs text-gray-600">
                              {Object.entries(item.selectedOptions)
                                .slice(0, 3)
                                .map(([key, value]) => (
                                  <p key={key} className="capitalize">
                                    {key}: <span className="font-medium text-gray-900">{value}</span>
                                  </p>
                                ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <Trash2
                            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className={`w-6 h-6 flex items-center justify-center border rounded ${
                              item.quantity <= 1
                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => item.quantity > 1 && handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {loadingItemId === item.id ? (
                            <div className="flex items-center gap-1">
                              <span
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              />
                              <span
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              />
                              <span
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              />
                            </div>
                          ) : (
                            <span className="text-sm font-semibold">
                              {(Number(String(item.price).replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(2)}{" "}
                              {item.currency}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 px-3 py-2 bg-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600">Продава се от Be Inc</p>
                        <button className="flex-shrink-0">
                          <Info className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-300 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Междинна сума</span>
                  <span className="font-semibold">{physicalTotalPrice.toFixed(2)} лв.</span>{" "}
                  {/* Use physicalTotalPrice */}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Доставка и обслужване</span>
                  <span className="font-semibold">Безплатно</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-pink-100 border border-pink-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-800">i</span>
                </div>
                <p className="text-sm text-gray-800">
                  Безплатни доставка и обслужване за поръчки, започващи от 34,90 лв.
                </p>
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">Общо</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{physicalTotalPrice.toFixed(2)} лв.</span>{" "}
                    {/* Use physicalTotalPrice */}
                    <span className="text-sm text-gray-600 ml-2">({(physicalTotalPrice / 1.96).toFixed(2)} €)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">вкл. ДДС</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Continue Button */}
      {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-1.5 z-40">
        <Button
          onClick={handleContinue}
          className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-1.5 rounded-lg text-lg font-medium"
          disabled={
            (deliveryOption === "home" &&
              (!homeSalutation ||
                !homeFirstName ||
                !homeLastName ||
                !homeCity ||
                !homePostalCode ||
                !homeStreet ||
                !homeStreetNumber ||
                !homePhoneNumber)) ||
            (deliveryOption === "office" &&
              (!selectedOffice || !officeFirstName || !officeLastName || !officePhoneNumber)) ||
            loadingCities ||
            loadingOffices ||
            cityError !== null ||
            officeError !== null ||
            isSyncing
          }
        >
          {deliveryOption === "office" && showOfficeDetails ? "Избери и продължи" : "Продължи към Плащане"}
        </Button>
      </div> */}
      <div className="fixed bottom-0 left-0 lg:right-[40%] right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-1.5 z-40">
        <div className="lg:max-w-[980px] lg:mx-auto">
          <Button
            onClick={handleContinue}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-1.5 rounded-lg text-lg font-medium"
            disabled={
              (deliveryOption === "home" &&
                (!homeSalutation ||
                  !homeFirstName ||
                  !homeLastName ||
                  !homeCity ||
                  !homePostalCode ||
                  !homeStreet ||
                  !homeStreetNumber ||
                  !homePhoneNumber)) ||
              (deliveryOption === "office" &&
                (!selectedOffice || !officeFirstName || !officeLastName || !officePhoneNumber)) ||
              loadingCities ||
              loadingOffices ||
              cityError !== null ||
              officeError !== null ||
              isSyncing
            }
          >
            {deliveryOption === "office" && showOfficeDetails ? "Избери и продължи" : "Продължи към Плащане"}
          </Button>
        </div>
      </div>

      <AuthFooter />
    </>
  )
}
