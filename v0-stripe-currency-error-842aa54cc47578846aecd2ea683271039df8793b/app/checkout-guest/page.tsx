"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Lock,
  Phone,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  CreditCard,
  User,
  Truck,
  Home,
  MapPin,
  Crown,
  Loader2,
  Package,
  Landmark,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { EcontCity, EcontOffice } from "@/lib/econt-api"

interface StoreData {
  id: number
  name: string
  address: string
  city: string
  neighborhood: string | null
  working_hours: string
  image_url: string | null
  rating: number
  is_24_7: boolean
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  phone: string | null
  email?: string | null
}
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useDeliverySettings } from "@/contexts/delivery-settings-context"
import { createCheckoutSession } from "@/app/actions/stripe"

export default function GuestCheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { settings: deliverySettings } = useDeliverySettings()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [guestEmail, setGuestEmail] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"econt" | "address" | "pickup" | "inkaso">("econt")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "bank">("card")

  // Personal data
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [egn, setEgn] = useState("")
  const [country, setCountry] = useState("България")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [notes, setNotes] = useState("")
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false)

  // Checkboxes
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(false)

  // Econt selections
  const [selectedEcontCity, setSelectedEcontCity] = useState<EcontCity | null>(null)
  const [selectedEcontOffice, setSelectedEcontOffice] = useState<EcontOffice | null>(null)

  // Econt data
  const [econtCities, setEcontCities] = useState<EcontCity[]>([])
  const [econtOffices, setEcontOffices] = useState<EcontOffice[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingOffices, setLoadingOffices] = useState(false)
  const [citySearchQuery, setCitySearchQuery] = useState("")
  const [officeSearchQuery, setOfficeSearchQuery] = useState("")
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false)
  const [officePopoverOpen, setOfficePopoverOpen] = useState(false)

  // Store pickup data
  const [stores, setStores] = useState<StoreData[]>([])
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [loadingStores, setLoadingStores] = useState(false)
  const [storePopoverOpen, setStorePopoverOpen] = useState(false)

  // Pre-fill user data when logged in
  useEffect(() => {
    if (user) {
      // Pre-fill email
      if (user.email) {
        setGuestEmail(user.email)
      }
      // Pre-fill full name from firstName and lastName
      const fullNameFromUser = [user.firstName, user.lastName].filter(Boolean).join(" ")
      if (fullNameFromUser) {
        setFullName(fullNameFromUser)
      }
      // Pre-fill phone number
      if (user.phone) {
        setPhoneNumber(user.phone)
      }
      
      // Fetch user's most recent order to get saved address
      const fetchUserAddress = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${user.id}`)
          if (response.ok) {
            const orders = await response.json()
            if (orders.length > 0) {
              const latestOrder = orders[0]
              // Pre-fill address and city from the latest order
              if (latestOrder.shipping_address && !address) {
                setAddress(latestOrder.shipping_address)
              }
              if (latestOrder.shipping_city && !city) {
                setCity(latestOrder.shipping_city)
              }
              if (latestOrder.shipping_postal_code && !postalCode) {
                setPostalCode(latestOrder.shipping_postal_code)
              }
              if (latestOrder.country) {
                setCountry(latestOrder.country)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user address:", error)
        }
      }
      fetchUserAddress()
    }
  }, [user])

  // Fetch stores when delivery method is "pickup"
  useEffect(() => {
    if (deliveryMethod === "pickup" && stores.length === 0) {
      const fetchStores = async () => {
        setLoadingStores(true)
        try {
          const response = await fetch("/api/stores")
          if (response.ok) {
            const data: StoreData[] = await response.json()
            setStores(data)
          }
        } catch (error) {
          console.error("Error fetching stores:", error)
        } finally {
          setLoadingStores(false)
        }
      }
      fetchStores()
    }
  }, [deliveryMethod, stores.length])

  // Fetch Econt cities when delivery method is "econt"
  useEffect(() => {
    if (deliveryMethod === "econt" && econtCities.length === 0) {
      const fetchCities = async () => {
        setLoadingCities(true)
        try {
          const response = await fetch("/api/econt/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ countryCode: "BGR" }),
          })
          if (response.ok) {
            const data: EcontCity[] = await response.json()
            // Filter to only cities that have offices (based on the has_offices flag or just accept all)
            setEcontCities(data)
          }
        } catch (error) {
          console.error("Error fetching Econt cities:", error)
        } finally {
          setLoadingCities(false)
        }
      }
      fetchCities()
    }
  }, [deliveryMethod, econtCities.length])

  // Fetch Econt offices when a city is selected
  useEffect(() => {
    if (selectedEcontCity) {
      const fetchOffices = async () => {
        setLoadingOffices(true)
        setEcontOffices([])
        setSelectedEcontOffice(null)
        try {
          const response = await fetch("/api/econt/offices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cityId: selectedEcontCity.id }),
          })
          if (response.ok) {
            const data = await response.json()
            // Validate that data is an array and filter to ensure offices belong to this city
            if (Array.isArray(data)) {
              // Filter offices to only show those belonging to the selected city
              const filteredData = data.filter((office: EcontOffice) =>
                office.cityId === selectedEcontCity.id ||
                office.cityName === selectedEcontCity.name
              )
              setEcontOffices(filteredData)
            } else {
              setEcontOffices([])
            }
          } else {
            setEcontOffices([])
          }
        } catch (error) {
          console.error("Error fetching Econt offices:", error)
          setEcontOffices([])
        } finally {
          setLoadingOffices(false)
        }
      }
      fetchOffices()
    } else {
      setEcontOffices([])
      setSelectedEcontOffice(null)
    }
  }, [selectedEcontCity])

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return econtCities
    const searchLower = citySearchQuery.toLowerCase()
    return econtCities.filter((city) =>
      city.name.toLowerCase().includes(searchLower) ||
      (city.nameEn && city.nameEn.toLowerCase().includes(searchLower)) ||
      (city.postCode && city.postCode.includes(searchLower))
    )
  }, [econtCities, citySearchQuery])

  // Filter offices based on search query
  const filteredOffices = useMemo(() => {
    if (!officeSearchQuery.trim()) return econtOffices
    const searchLower = officeSearchQuery.toLowerCase()
    return econtOffices.filter((office) =>
      office.name.toLowerCase().includes(searchLower) ||
      (office.nameEn && office.nameEn.toLowerCase().includes(searchLower)) ||
      office.address.toLowerCase().includes(searchLower)
    )
  }, [econtOffices, officeSearchQuery])

  const subtotal = getTotalPrice()
  const isFreeDelivery = subtotal >= deliverySettings.free_delivery_threshold
  const deliveryCost = isFreeDelivery ? 0 : (deliveryMethod === "econt" ? deliverySettings.econt_office_price : deliveryMethod === "address" ? deliverySettings.econt_address_price : deliveryMethod === "inkaso" ? 30.68 : 0)
  const total = subtotal + deliveryCost
  const vat = 0

  // Convert to лв (BGN) - approximate rate 1.96
  const bgRate = 1.96
  const subtotalBgn = subtotal * bgRate
  const totalBgn = total * bgRate
  const deliveryCostBgn = deliveryCost * bgRate

  const checkoutSteps = [
    { id: 1, name: "ПРОДУКТИ И ДОСТАВКА", active: false, completed: true },
    { id: 2, name: "ДАННИ И ПРЕГЛЕД", active: true, completed: false },
    { id: 3, name: "УСПЕШНА ЗAЯВКА ЗА ПОРЪЧКА", active: false, completed: false },
  ]

  const handleSubmit = async () => {
    // Validate required fields
    if (!guestEmail || !fullName || !phoneNumber || !address || !city) {
      alert("Моля, попълнете всички задължителни полета")
      return
    }

    if (!agreeTerms) {
      alert("Моля, съгласете се с общите условия")
      return
    }

    if (cartItems.length === 0) {
      alert("Количката ви е празна")
      return
    }

    setIsSubmitting(true)

    try {
      // Parse full name into first and last name
      const nameParts = fullName.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      // Prepare order items
      const items = cartItems.map((item) => ({
        type: item.type || "product",
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        weight_grams: item.weight_grams || null,
        originalPrice: item.originalPrice || item.price,
        hasPromotion: item.hasPromotion || false,
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          guestEmail,
          guestFirstName: firstName,
          guestLastName: lastName,
          items,
          shippingAddress: address,
          shippingCity: city,
          shippingPostalCode: postalCode || "",
          phone: phoneNumber,
          notes: notes || "",
          deliveryMethod,
          paymentMethod,
          deliveryCost,
          econtCity: selectedEcontCity?.name || null,
          econtOfficeName: selectedEcontOffice?.name || null,
          econtOfficeAddress: selectedEcontOffice?.address || null,
          storeName: selectedStore?.name || null,
          storeAddress: selectedStore?.address || null,
          country,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Грешка при създаване на поръчка")
      }

      const result = await response.json()

      // If card payment, redirect to Stripe checkout page
      if (paymentMethod === "card") {
        const { url } = await createCheckoutSession({
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            weight_grams: item.weight_grams,
          })),
          customerEmail: guestEmail,
          orderId: result.orderId,
          deliveryCost: deliveryCost,
        })
        
        if (url) {
          // Don't clear cart here - only clear on success page after payment is confirmed
          // This preserves the cart if user cancels payment and returns
          window.location.href = url
        }
        return
      }

      // For other payment methods, clear cart and redirect to success page
      clearCart()
      router.push(`/checkout-success?orderId=${result.orderId}`)
    } catch (error) {
      console.error("Error submitting order:", error)
      alert(error instanceof Error ? error.message : "Грешка при изпращане на поръчката")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Checkout Steps Banner - matching cart page style */}
        <div className="relative overflow-hidden">
          {/* SVG background for triangular sections */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            {/* Black section */}
            <polygon
              points="0,0 280,0 240,100 0,100"
              fill="#111827"
            />
            {/* Red section */}
            <polygon
              points="280,0 530,0 490,100 240,100"
              fill="#dc2626"
            />
            {/* Yellow section */}
            <polygon
              points="530,0 780,0 740,100 490,100"
              fill="#eab308"
            />
            {/* Blue section */}
            <polygon
              points="780,0 1000,0 1000,100 740,100"
              fill="#1b6ea5"
            />
          </svg>

          <div className="container mx-auto px-4 relative z-10 py-5">
            <div className="relative max-w-5xl mx-auto">
              {/* Steps container with line through middle of dots */}
              <div className="relative flex justify-between items-start">
                {/* Horizontal line - positioned to pass through center of step dots */}
                <div className="absolute top-[22px] left-[44px] right-0 flex items-center">
                  <div className="flex-1 h-[1px] bg-gray-400/60" />
                </div>

                {/* Step 1 - ПРОДУКТИ И ДОСТАВКА (completed) */}
                <div className="flex flex-col items-start relative z-10">
                  {/* Completed checkmark circle */}
                  <div className="w-11 h-11 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500 mb-3">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-green-500 text-xs md:text-sm font-medium tracking-wide">
                    {checkoutSteps[0].name}
                  </span>
                </div>

                {/* Step 2 - ДАННИ И ПРЕГЛЕД (active) */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Rounded circle with cart icon - RED (active) */}
                  <div className="w-11 h-11 rounded-full border-2 border-[#dc2626] flex items-center justify-center bg-[#111827] mb-3">
                    <ShoppingCart className="w-5 h-5 text-[#dc2626]" />
                  </div>
                  <span className="text-gray-900 text-xs md:text-sm font-medium tracking-wide">
                    {checkoutSteps[1].name}
                  </span>
                </div>

                {/* Step 3 - УСПЕШНА ЗАЯВКА ЗА ПОРЪЧКА */}
                <div className="flex flex-col items-end relative z-10">
                  {/* Circle with inner dot - line passes through center */}
                  <div className="w-4 h-4 rounded-full border border-gray-600 bg-[#1b6ea5] flex items-center justify-center mt-[14px] mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  </div>
                  <span className="text-gray-900 text-xs md:text-sm font-medium text-right tracking-wide">
                    {checkoutSteps[2].name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-[#f8f9fb]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">Завършване на поръчка</h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    Имате въпрос? <span className="font-semibold">(02) 9 888 666</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form Sections */}
            <div className="lg:col-span-2 space-y-6">

              {/* Section 1: Guest or Login */}
              <div className="bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-semibold text-lg">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Как желаете да продължите?</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                  {/* Guest Option / Logged In User */}
                  <div className={user ? "" : "border-r border-gray-300 pr-8"}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {user ? "Вход с КЕШ ID" : "Като гост..."}
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                      {user 
                        ? `Поръчката ще бъде записана в профила Ви (${user.email})`
                        : "Можете да регистрирате профил по всяко време"
                      }
                    </p>

                    <div className="space-y-1">
                      <Label htmlFor="guestEmail" className="text-sm text-gray-600">
                        Имeйл <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="guestEmail"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Login Option - Hidden when user is logged in */}
                  {!user && (
                    <div className="pl-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">... или с КЕШ ID</h3>
                      <p className="text-sm text-gray-500 mb-8">
                        Защо да създадете безплaтен профил в КЕШ ID?
                      </p>

<Link href="/login?redirect=/checkout-guest" className="block">
                        <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-6 rounded-full text-base font-medium">
                          Вход или регистрация
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Delivery Method */}
              <div className="bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-semibold text-lg">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Изберете начин на доставка</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8">
                  {/* Econt Office */}
                  <button
                    onClick={() => setDeliveryMethod("econt")}
                    className={`relative p-6 border text-center transition-all flex flex-col ${deliveryMethod === "econt"
                      ? "border-[#dc2626] bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                  >
                    {/* Top accent bar for selected */}
                    {deliveryMethod === "econt" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#dc2626]" />
                        <div className="absolute top-0 right-0 w-6 h-6 bg-[#dc2626]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                      </>
                    )}
                    <svg className={`w-8 h-8 mx-auto mb-4 ${deliveryMethod === "econt" ? "text-[#dc2626]" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <p className={`text-sm font-medium mb-1 ${deliveryMethod === "econt" ? "text-[#dc2626]" : "text-gray-900"}`}>
                      Доставка до офис на Еконт -
                    </p>
                    <p className={`text-sm font-bold ${deliveryMethod === "econt" ? "text-[#dc2626]" : "text-gray-900"}`}>
                      {isFreeDelivery ? "Безплатно" : `${deliverySettings.econt_office_price.toFixed(2)} €`}
                    </p>
                  </button>

                  {/* Pickup from Office */}
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`relative p-6 border text-center transition-all flex flex-col ${deliveryMethod === "pickup"
                      ? "border-[#dc2626] bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                  >
                    {deliveryMethod === "pickup" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#dc2626]" />
                        <div className="absolute top-0 right-0 w-6 h-6 bg-[#dc2626]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                      </>
                    )}
                    <Crown className={`w-8 h-8 mx-auto mb-4 ${deliveryMethod === "pickup" ? "text-[#dc2626]" : "text-gray-400"}`} />
                    <p className={`text-sm font-medium mb-1 ${deliveryMethod === "pickup" ? "text-[#dc2626]" : "text-gray-900"}`}>
                      Вземане от офис -
                    </p>
                    <p className={`text-sm font-bold text-green-600`}>
                      БЕЗПЛАТНО
                    </p>
                  </button>

                  {/* Address Delivery */}
                  <button
                    onClick={() => setDeliveryMethod("address")}
                    className={`relative p-6 border text-center transition-all flex flex-col ${deliveryMethod === "address"
                      ? "border-[#dc2626] bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                  >
                    {deliveryMethod === "address" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#dc2626]" />
                        <div className="absolute top-0 right-0 w-6 h-6 bg-[#dc2626]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                      </>
                    )}
                    <svg className={`w-8 h-8 mx-auto mb-4 ${deliveryMethod === "address" ? "text-[#dc2626]" : "text-gray-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <p className={`text-sm font-medium mb-1 ${deliveryMethod === "address" ? "text-[#dc2626]" : "text-gray-900"}`}>
                      Доставка до адрес -
                    </p>
                    <p className={`text-sm font-bold ${deliveryMethod === "address" ? "text-[#dc2626]" : "text-gray-900"}`}>
                      {isFreeDelivery ? "Безплатно" : `${deliverySettings.econt_address_price.toFixed(2)} €`}
                    </p>
                  </button>
                </div>

                {/* Store Selection for Pickup */}
                {deliveryMethod === "pickup" && (
                  <div className="mt-8">
                    <Popover open={storePopoverOpen} onOpenChange={setStorePopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          role="combobox"
                          aria-expanded={storePopoverOpen}
                          className="w-full justify-between font-normal border-0 border-b border-gray-400 rounded-none px-0 hover:bg-transparent focus:ring-0 h-auto py-2"
                        >
                          {loadingStores ? (
                            <span className="flex items-center gap-2 text-gray-400">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Зареждане...
                            </span>
                          ) : selectedStore ? (
                            <span className="text-gray-900">{selectedStore.city}, {selectedStore.name}</span>
                          ) : (
                            <span className="text-gray-400">Изберете офис</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 shadow-xl border-0 rounded-none"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                      >
                        <div className="max-h-[350px] overflow-auto bg-white">
                          {loadingStores ? (
                            <div className="p-4 text-center text-gray-500">Зареждане...</div>
                          ) : stores.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Няма намерени магазини</div>
                          ) : (
                            stores.map((store) => (
                              <button
                                key={store.id}
                                onClick={() => {
                                  setSelectedStore(store)
                                  setStorePopoverOpen(false)
                                }}
                                className={cn(
                                  "w-full text-left px-6 py-4 text-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
                                  selectedStore?.id === store.id && "bg-gray-50"
                                )}
                              >
                                {store.city}, {store.name}
                              </button>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Selected Store Details for Pickup */}
                {deliveryMethod === "pickup" && selectedStore && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-700 mb-2">Избран магазин:</h4>
                    <p className="font-semibold">{selectedStore.name}</p>
                    <p className="text-sm text-gray-600">{selectedStore.city}, {selectedStore.address}</p>
                    {selectedStore.phone && (
                      <p className="text-sm text-gray-600">Тел: {selectedStore.phone}</p>
                    )}
                    {selectedStore.working_hours && (
                      <p className="text-sm text-gray-600">
                        Работно време: {selectedStore.working_hours}
                      </p>
                    )}
                  </div>
                )}

                {/* Address Delivery Form */}
                {deliveryMethod === "address" && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* City */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Град <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full mt-1 border-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        placeholder=""
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Адрес <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full mt-1 border-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        placeholder=""
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Пощенски код <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full mt-1 border-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        placeholder=""
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Държава <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={countryPopoverOpen}
                            className="w-full justify-between mt-1 font-normal border-0 border-b border-gray-400 rounded-none px-0 hover:bg-transparent focus:ring-0 h-auto py-2"
                          >
                            <span className="text-gray-600">{country}</span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 shadow-xl border-0 rounded-none"
                          align="start"
                          side="bottom"
                          sideOffset={4}
                          style={{ width: 'var(--radix-popover-trigger-width)' }}
                        >
                          <div className="bg-white">
                            {["България", "Румъния", "Гърция", "Сърбия", "Северна Македония"].map((countryOption) => (
                              <button
                                key={countryOption}
                                onClick={() => {
                                  setCountry(countryOption)
                                  setCountryPopoverOpen(false)
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
                                  country === countryOption && "bg-gray-50"
                                )}
                              >
                                {countryOption}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {/* City and Office Selection for Econt */}
                {deliveryMethod === "econt" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* City Selection */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Изберете град <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={cityPopoverOpen}
                            className="w-full justify-between mt-1 font-normal border-0 border-b border-gray-400 rounded-none px-0 hover:bg-transparent focus:ring-0"
                          >
                            {loadingCities ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Зареждане...
                              </span>
                            ) : selectedEcontCity ? (
                              <span>{selectedEcontCity.name} {selectedEcontCity.postCode && `(${selectedEcontCity.postCode})`}</span>
                            ) : (
                              <span className="text-muted-foreground">Изберете град</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 shadow-xl border-0 rounded-none"
                          align="start"
                          side="bottom"
                          sideOffset={-40}
                          style={{ width: 'var(--radix-popover-trigger-width)' }}
                        >
                          <div className="bg-gray-100 p-4">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder=""
                                value={citySearchQuery}
                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                className="w-full bg-white border-0 py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-0"
                                autoFocus
                              />
                              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>
                            </div>
                          </div>
                          <div className="max-h-[350px] overflow-auto bg-white">
                            {loadingCities ? (
                              <div className="p-4 text-center text-gray-500">Зареждане...</div>
                            ) : filteredCities.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">Няма намерени градове</div>
                            ) : (
                              filteredCities.map((city) => (
                                <button
                                  key={city.id}
                                  onClick={() => {
                                    setSelectedEcontCity(city)
                                    setCityPopoverOpen(false)
                                    setCitySearchQuery("")
                                  }}
                                  className={cn(
                                    "w-full text-left px-6 py-4 text-lg hover:bg-gray-50 transition-colors",
                                    selectedEcontCity?.id === city.id && "bg-gray-50"
                                  )}
                                >
                                  {city.name}
                                </button>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Office Selection */}
                    <div>
                      <Label className="text-sm text-gray-600">
                        Изберете офис <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={officePopoverOpen} onOpenChange={setOfficePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={officePopoverOpen}
                            className="w-full justify-between mt-1 font-normal border-0 border-b border-gray-400 rounded-none px-0 hover:bg-transparent focus:ring-0"
                            disabled={!selectedEcontCity}
                          >
                            {loadingOffices ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Зареждане...
                              </span>
                            ) : selectedEcontOffice ? (
                              <span className="truncate">{selectedEcontOffice.name}</span>
                            ) : !selectedEcontCity ? (
                              <span className="text-muted-foreground">Първо изберете град</span>
                            ) : (
                              <span className="text-muted-foreground">Изберете офис</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 shadow-xl border-0 rounded-none"
                          align="start"
                          side="bottom"
                          sideOffset={-40}
                          style={{ width: 'var(--radix-popover-trigger-width)' }}
                        >
                          <div className="bg-gray-100 p-4">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder=""
                                value={officeSearchQuery}
                                onChange={(e) => setOfficeSearchQuery(e.target.value)}
                                className="w-full bg-white border-0 py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-0"
                                autoFocus
                              />
                              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              </svg>
                            </div>
                          </div>
                          <div className="max-h-[350px] overflow-auto bg-white">
                            {loadingOffices ? (
                              <div className="p-4 text-center text-gray-500">Зареждане...</div>
                            ) : filteredOffices.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">Няма намерени офиси</div>
                            ) : (
                              filteredOffices.map((office) => (
                                <button
                                  key={office.id}
                                  onClick={() => {
                                    setSelectedEcontOffice(office)
                                    setOfficePopoverOpen(false)
                                    setOfficeSearchQuery("")
                                  }}
                                  className={cn(
                                    "w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors",
                                    selectedEcontOffice?.id === office.id && "bg-gray-50"
                                  )}
                                >
                                  <p className="text-lg">{office.name}</p>
                                  <p className="text-sm text-gray-500">{office.address}</p>
                                </button>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {/* Selected Office Details */}
                {deliveryMethod === "econt" && selectedEcontOffice && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-[#dc2626] mb-2">Избран офис на Еконт:</h4>
                    <p className="font-semibold">{selectedEcontOffice.name}</p>
                    <p className="text-sm text-gray-600">{selectedEcontOffice.address}</p>
                    {selectedEcontOffice.phone && (
                      <p className="text-sm text-gray-600">Тел: {selectedEcontOffice.phone}</p>
                    )}
                    {selectedEcontOffice.workBegin && selectedEcontOffice.workEnd && (
                      <p className="text-sm text-gray-600">
                        Работно време: {selectedEcontOffice.workBegin} - {selectedEcontOffice.workEnd}
                        {selectedEcontOffice.workBeginSaturday && selectedEcontOffice.workEndSaturday && (
                          <span> | Събота: {selectedEcontOffice.workBeginSaturday} - {selectedEcontOffice.workEndSaturday}</span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Delivery Info Text */}
                <div className="text-sm text-gray-500 mt-8 space-y-1">
                  <p>Поръчки за продукти в наличност се обработват</p>
                  <p>и изпращат в рамките на 7 работни дни.</p>
                  <p>Поръчки, направени в събота и неделя,</p>
                  <p>започват да се обработват в понеделник.</p>
                  <p>Доставките са съобразени с обслужващия</p>
                  <p>график на Еконт.</p>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <h2 className="text-lg font-semibold">Изберете начин на плащане</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Cash on Delivery */}
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`border rounded-lg text-center transition-all overflow-hidden flex flex-col ${
                      paymentMethod === "cod" 
                        ? "border-[#dc2626] border-2" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-6 flex-1 flex flex-col items-center justify-center">
                      <Package className={`w-8 h-8 mb-3 ${paymentMethod === "cod" ? "text-[#dc2626]" : "text-gray-400"}`} />
                      <p className={`text-sm font-medium ${paymentMethod === "cod" ? "text-[#dc2626]" : "text-gray-700"}`}>
                        Наложен платеж
                      </p>
                    </div>
                  </button>

                  {/* Card Payment */}
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`border rounded-lg text-center transition-all overflow-hidden flex flex-col ${
                      paymentMethod === "card" 
                        ? "border-[#dc2626] border-2" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-6 flex-1 flex flex-col items-center justify-center">
                      <div className="flex justify-center gap-1 mb-3">
                        <Image src="/images/visa-inc.png" alt="Visa" width={40} height={26} className="object-contain" />
                        <Image src="/images/mastercard-logo.png" alt="Mastercard" width={40} height={26} className="object-contain" />
                      </div>
                      <p className={`text-sm font-medium ${paymentMethod === "card" ? "text-[#dc2626]" : "text-gray-700"}`}>
                        Онлайн с карта
                      </p>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="bg-[#dc2626] text-white px-3 py-2.5 flex items-center justify-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        <p className="text-xs text-center">
                          Поддържаме Visa, Mastercard, Apple Pay и Google Pay.
                        </p>
                      </div>
                    )}
                  </button>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setPaymentMethod("bank")}
                    className={`border rounded-lg text-center transition-all overflow-hidden flex flex-col ${
                      paymentMethod === "bank" 
                        ? "border-[#dc2626] border-2" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-6 flex-1 flex flex-col items-center justify-center">
                      <Landmark className={`w-8 h-8 mb-3 ${paymentMethod === "bank" ? "text-[#dc2626]" : "text-gray-400"}`} />
                      <p className={`text-sm font-medium ${paymentMethod === "bank" ? "text-[#dc2626]" : "text-gray-700"}`}>
                        Банков превод
                      </p>
                    </div>
                  </button>
                </div>

                {/* Bank Transfer Details */}
                {paymentMethod === "bank" && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Банкови данни за превод:</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">IBAN:</p>
                        <p className="font-mono font-medium text-gray-900">BG26IORT80481094085400</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Име на получател:</p>
                        <p className="font-medium text-gray-900">ЗАЛОЖНА КЪЩА КЕШ - ШУМЕН</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Банка:</p>
                        <p className="font-medium text-gray-900">Investbank</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Основание за плащане:</p>
                        <p className="font-medium text-gray-900">Поръчка # (ще получите номер след потвърждение)</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                      След получаване на плащането, поръчката ви ще бъде обработена в рамките на 1-2 работни дни.
                    </p>
                  </div>
                )}

                {/* Payment Conditions - Only show when card is selected */}
                {paymentMethod === "card" && (
                  <div className="text-sm text-gray-600 mt-6">
                    <p className="font-semibold mb-2">Условия:</p>
                    <p className="mb-2">
                      Приемаме единствено карти, издадени в държави-членки на ЕС, на физически лица. При карти, издадени извън България, изискваме проверка на платежната карта и документ за самоличност на клиента.
                    </p>
                    <p>Клиентът и платецът трябва да са едно и също лице.</p>
                  </div>
                )}
              </div>

              {/* Section 4: Personal Data */}
              <div className="bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <h2 className="text-lg font-semibold">Въведете Вашите данни и създайте заявката</h2>
                </div>

                {/* Person Type Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-l-4 border-[#dc2626] mb-6">
                  <User className="w-5 h-5 text-[#dc2626]" />
                  <span className="text-sm font-medium text-[#dc2626]">Аз съм физическо лице</span>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Три имена <span className="text-red-500">*</span>
                    </Label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Тел. <span className="text-red-500">*</span>
                    </Label>
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+359"
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Държава <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors cursor-pointer"
                    >
                      <option value="България">България</option>
                      <option value="Германия">Германия</option>
                      <option value="Австрия">Австрия</option>
                    </select>
                  </div>
                </div>

                {/* Address Section */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-sm text-gray-600">
                      Адрес <span className="text-red-500">*</span>
                    </Label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      Град <span className="text-red-500">*</span>
                    </Label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">Допълнителни бележки</Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-[#dc2626] transition-colors resize-none h-24"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Съгласен/на съм с{" "}
                      <Link href="/terms" className="text-[#dc2626] underline hover:text-[#b91c1c]">Общите условия за дистанционни продажби</Link>
                      {" "}и{" "}
                      <Link href="/privacy" className="text-[#dc2626] underline hover:text-[#b91c1c]">Политиката на поверителност</Link>
                      {" "}на КЕШ
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeNewsletter}
                      onChange={(e) => setAgreeNewsletter(e.target.checked)}
                      className="mt-1 w-4 h-4 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Желая да получавам специални оферти и новини от света на златото
                    </span>
                  </label>
                </div>

                {/* Notice */}
                <p className="text-sm text-gray-600 mb-6">
                  Клиентът, платецът и получателят трябва да са едно и също лице. Трети лица нямат право да получат поръчката.
                </p>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!agreeTerms || isSubmitting}
                  className="w-full md:w-auto px-12 py-6 text-base font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white disabled:bg-gray-300 disabled:text-gray-500 rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Изпращане...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Потвърдете заявката
                    </>
                  )}
                </Button>
              </div>

              {/* Back Link */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад към количката
              </Link>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-black p-6 text-white sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#f9d355]">Обобщение на заявката</h2>
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4 text-sm">
                  {/* Products Total */}
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      Продукти ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} продукта)
                    </span>
                    <div className="text-right">
                      <p className="font-semibold">{subtotal.toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Delivery Method Display */}
                  <div className="pt-4">
                    <p className="text-gray-400 text-xs mb-2">Изберете начин на доставка</p>
                    <div className="border-b border-white px-0 py-3">
                      <span>{deliveryMethod === "econt" ? "Доставка до офис на Еконт" : deliveryMethod === "address" ? "Доставка до адрес" : deliveryMethod === "inkaso" ? "Доставка с инкасо" : "Вземане от офис"}</span>
                    </div>
                  </div>

                  {/* Delivery Cost */}
                  <div className="flex justify-between">
                    <span className="text-gray-300">Доставка</span>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#22c55e' }}>
                        {deliveryCost === 0 ? "БЕЗПЛАТНО" : `${deliveryCost.toFixed(2)} €`}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between pt-4">
                    <span className="font-bold text-white">ОБЩО</span>
                    <div className="text-right">
                      <p className="font-bold text-lg">{total.toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* VAT */}
                  <div className="flex justify-between text-gray-400">
                    <span>ДДС</span>
                    <div className="text-right">
                      <p>{vat.toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Discount Code */}
                  <div className="pt-4">
                    <p className="text-[#f9d355] text-xs mb-2">Въведете код за отстъпка</p>
                    <div className="flex items-end gap-0">
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-b border-white px-0 py-2 text-white placeholder-gray-500 focus:outline-none"
                        placeholder=""
                      />
                      <div
                        className="relative w-14 h-10 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                        style={{
                          background: '#f9d355',
                          clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pl-2">
                          <ArrowRight className="w-5 h-5 text-[#1e1e3f]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items Preview */}
              <div className="bg-white mt-4 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Количка</h3>
                  <Link href="/cart" className="text-sm text-[#7c3aed] hover:underline">
                    Редакция
                  </Link>
                </div>

                {cartItems.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Количество: {item.quantity}</p>
                      <p className="text-xs text-gray-500">
                        Единична цена: {item.price.toFixed(2)} € | {(item.price * bgRate).toFixed(2)} лв.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{(item.price * item.quantity).toFixed(2)} €</p>
                      <p className="text-xs text-gray-500">{(item.price * item.quantity * bgRate).toFixed(2)} лв.</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SSL Badge */}
              <div className="mt-6 flex items-start gap-3 text-sm">
                <ShieldCheck className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <p className="text-xs leading-relaxed text-black">
                  <span className="font-medium">Вашите лични данни са защитени</span> и изцяло
                  криптирани с SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
