"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CloseIcon,
  ShieldCheckIcon,
  LockIcon,
  PhoneIcon,
  ChevronDownIcon,
  ArrowRightIcon,
} from "@/components/custom-icons"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import { useDeliverySettings } from "@/contexts/delivery-settings-context"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { settings: deliverySettings } = useDeliverySettings()
  const [deliveryMethod, setDeliveryMethod] = useState("Доставка до адрес")
  const [deliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false)
  const [discountCode, setDiscountCode] = useState("")

  const deliveryOptions = [
    { name: "Доставка до офис на Еконт", price: deliverySettings.econt_office_price },
    { name: "Доставка до адрес", price: deliverySettings.econt_address_price },
    { name: "Вземане от офис", price: 0 }
  ]

  const getDeliveryPrice = () => {
    const totalPrice = getTotalPrice()
    if (totalPrice >= deliverySettings.free_delivery_threshold) {
      return 0 // Free delivery
    }
    const selected = deliveryOptions.find(opt => opt.name === deliveryMethod)
    return selected ? selected.price : 0
  }

  const handleUpdateQuantity = (id: number, type: "equipment" | "gold", change: number) => {
    const item = cartItems.find((i) => i.id === id && i.type === type)
    if (item) {
      updateQuantity(id, type, item.quantity + change)
    }
  }

  const handleRemoveItem = (id: number, type: "equipment" | "gold") => {
    removeFromCart(id, type)
  }

  const subtotal = getTotalPrice()
  const shipping = getDeliveryPrice()
  const total = subtotal + shipping
  const vat = 0

  // Convert to лв (BGN) - approximate rate 1.96
  const bgRate = 1.96
  const subtotalBgn = subtotal * bgRate
  const totalBgn = total * bgRate

  const checkoutSteps = [
    { id: 1, name: "ПРОДУКТИ И ДОСТАВКА", active: true, completed: false },
    { id: 2, name: "ДАННИ И ПРЕГЛЕД", active: false, completed: false },
    { id: 3, name: "УСПЕШНА ЗАЯВКА ЗА ПОРЪЧКА", active: false, completed: false },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Checkout Steps Banner - matching profile page style */}
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
                {/* Horizontal line - positioned to pass through center of step 2 and 3 dots */}
                <div className="absolute top-[22px] left-[44px] right-0 flex items-center">
                  <div className="flex-1 h-[1px] bg-gray-400/60" />
                </div>
                
                {/* Step 1 - ПРОДУКТИ И ДОСТАВКА */}
                <div className="flex flex-col items-start relative z-10">
                  {/* Rounded circle with cart icon - RED */}
                  <div className="w-11 h-11 rounded-full border-2 border-[#dc2626] flex items-center justify-center bg-[#111827] mb-3">
                    <ShoppingCartIcon className="w-5 h-5 text-[#dc2626]" />
                  </div>
                  <span className="text-[#dc2626] text-xs md:text-sm font-medium tracking-wide">
                    {checkoutSteps[0].name}
                  </span>
                </div>
                
                {/* Step 2 - ДАННИ И ПРЕГЛЕД */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Circle with inner dot - line passes through center */}
                  <div className="w-4 h-4 rounded-full border border-gray-600 bg-[#1b6ea5] flex items-center justify-center mt-[14px] mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
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

        <div className="bg-[#f8f9fb]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <LockIcon className="w-5 h-5 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">Количка</h1>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>
                    Имате въпрос? <span className="font-semibold">(02) 9 888 666</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-amber-100 animate-pulse" />
                <div className="absolute inset-2 bg-white flex items-center justify-center shadow-lg">
                  <ShoppingCartIcon className="w-12 h-12 text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Вашата количка е празна</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Добавете продукти, за да продължите с поръчката си</p>
              <Link href="/">
                <Button className="bg-[#1e1e3f] hover:bg-[#2e2e5f] text-white px-8 py-6 text-lg">
                  Разгледайте продуктите
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-white text-sm font-semibold text-gray-700">
                    <div className="col-span-6">Продукт</div>
                    <div className="col-span-3 text-center">Количество</div>
                    <div className="col-span-3 text-right">Цена (вкл. ДДС)</div>
                  </div>

                  {/* Cart Items */}
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center"
                      >
                        {/* Product Info */}
                        <div className="col-span-6 flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-white overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCartIcon className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-500">
                              Единична цена: <span className="font-semibold">{(Number(item.price) || 0).toFixed(2)} €</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-3 flex justify-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.type, -1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.type, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="col-span-3 flex items-center justify-end gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{((Number(item.price) || 0) * item.quantity).toFixed(2)} €</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.type)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <CloseIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

              </div>

              <div className="lg:col-span-1">
                <div className="bg-black p-6 text-white sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#f9d355]">Обобщение на заявката</h2>
                    <LockIcon className="w-5 h-5 text-gray-400" />
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

                    {/* Delivery Method */}
                    <div className="pt-4 relative">
                      <p className="text-gray-400 text-xs mb-2">Изберете начин на доставка</p>
                      <div className="relative">
                        <button 
                          onClick={() => setDeliveryDropdownOpen(!deliveryDropdownOpen)}
                          className="w-full flex items-center justify-between bg-transparent border-b border-white px-0 py-3"
                        >
                          <span>{deliveryMethod}</span>
                          <ChevronDownIcon className={`w-4 h-4 transition-transform ${deliveryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {deliveryDropdownOpen && (
                          <div className="absolute left-0 right-0 top-0 z-50 bg-white border-t-4 border-[#5b3a8c] shadow-lg">
                            {deliveryOptions.map((option) => (
                              <button
                                key={option.name}
                                onClick={() => {
                                  setDeliveryMethod(option.name)
                                  setDeliveryDropdownOpen(false)
                                }}
                                className="w-full text-left px-4 py-4 text-gray-800 hover:bg-gray-100 transition-colors"
                              >
                                {option.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Cost */}
                    <div className="flex justify-between">
                      <span className="text-gray-300">Доставка</span>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: '#22c55e' }}>
                          {getDeliveryPrice() === 0 ? "БЕЗПЛАТНО" : `${getDeliveryPrice().toFixed(2)} €`}
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
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
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
                            <ArrowRightIcon className="w-5 h-5 text-[#1e1e3f]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="mt-4 space-y-3">
                  <Link href={user ? "/checkout-guest" : "/login?redirect=/checkout-guest"} className="block">
                    <Button className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white h-12 text-base font-semibold rounded-none">
                      Завършете с КЕШ
                    </Button>
                  </Link>

                  <Link href="/checkout-guest" className="block">
                    <Button
                      className="w-full h-12 text-base font-semibold text-[#1e1e3f] rounded-none"
                      style={{
                        background: "linear-gradient(135deg, #f9d355 0%, #e6b93d 100%)",
                      }}
                    >
                      Завършете като гост
                    </Button>
                  </Link>
                </div>

                {/* SSL Badge */}
                <div className="mt-6 flex items-start gap-3 text-sm">
                  <ShieldCheckIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <p className="text-xs leading-relaxed text-black">
                    <span className="font-medium">Вашите лични данни са защитени</span> и изцяло
                    криптирани с SSL
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
