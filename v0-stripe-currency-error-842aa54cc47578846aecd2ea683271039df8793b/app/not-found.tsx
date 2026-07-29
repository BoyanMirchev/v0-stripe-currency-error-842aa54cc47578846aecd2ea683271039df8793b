"use client"

import Link from "next/link"
import Image from "next/image"
import { Home, Search, ShoppingBag, Car, Gem, Laptop, ArrowLeft, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const CONTACT_PHONE = "+359 54 800 800"
const WHATSAPP_LINK = "https://wa.me/359548008000"

export default function NotFound() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/gold?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const popularCategories = [
    {
      name: "Злато",
      href: "/gold",
      icon: Gem,
      color: "from-amber-500 to-yellow-600",
      description: "Златни бижута",
    },
    {
      name: "Техника",
      href: "/equipment",
      icon: Laptop,
      color: "from-blue-500 to-blue-600",
      description: "Електроника",
    },
    {
      name: "Автомобили",
      href: "/cars",
      icon: Car,
      color: "from-gray-600 to-gray-700",
      description: "Автопарк",
    },
    {
      name: "Магазини",
      href: "/stores",
      icon: ShoppingBag,
      color: "from-red-500 to-red-600",
      description: "Локации",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section with Yellow Gradient */}
      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 px-4 py-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/kesh-logo.png"
                alt="Кеш Logo"
                width={120}
                height={44}
                className="object-contain"
              />
            </Link>
          </div>

          {/* 404 Content */}
          <div className="flex flex-col items-center text-center px-4 pb-12">
            {/* 404 Number with Animation */}
            <div className="relative mb-6">
              <h1 className="text-[140px] md:text-[180px] font-black text-white leading-none tracking-tighter drop-shadow-lg">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Search className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Страницата не е намерена
            </h2>
            <p className="text-gray-700 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Съжаляваме, но страницата, която търсите, не съществува или е била преместена.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
              <div
                className={`relative flex items-center bg-white rounded-full shadow-xl transition-all duration-300 ${
                  isSearchFocused ? "ring-2 ring-red-500 shadow-2xl" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Търсете продукт..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="flex-1 px-6 py-4 rounded-l-full text-gray-800 placeholder:text-gray-500 focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full mr-2 transition-colors shadow-md hover:shadow-lg"
                  aria-label="Търси"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Back to Home Button */}
            <Link href="/">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full px-8 py-3 h-auto text-base shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                <Home className="w-5 h-5" />
                Към началната страница
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Categories Section */}
      <div className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-gray-900 mb-2">
            Разгледайте нашите продукти
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Или посетете една от популярните категории
          </p>

          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {popularCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </Link>
              )
            })}
          </div>

          {/* All Products Button */}
          <div className="flex justify-center mb-12">
            <Link href="/gold">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-8 py-3 h-auto text-base shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                <ShoppingBag className="w-5 h-5" />
                Всички продукти
              </Button>
            </Link>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
            <h4 className="text-center font-bold text-gray-900 mb-6">
              Имате нужда от помощ?
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
              >
                <Phone className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">{CONTACT_PHONE}</span>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Back Link */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Върнете се назад</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
