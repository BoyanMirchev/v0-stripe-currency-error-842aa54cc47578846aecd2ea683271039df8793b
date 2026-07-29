"use client"

import { X, Phone, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCompare } from "@/lib/compare-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface ProductDetails {
  id: number
  specifications?: any
  brand?: string
  model?: string
  condition?: string
  stock_quantity?: number
  category?: string
  promotions?: number | null
  price?: number
}

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [productDetails, setProductDetails] = useState<Record<number, ProductDetails>>({})
  const [loading, setLoading] = useState(false)

  // Fetch full product details including specifications
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      const details: Record<number, ProductDetails> = {}
      
      for (const item of compareItems) {
        if (item.type === "equipment") {
          try {
            const response = await fetch(`/api/equipment/${item.id}`)
            if (response.ok) {
              const data = await response.json()
              details[Number(item.id)] = data
            }
          } catch (error) {
            console.error(`Error fetching details for equipment ${item.id}:`, error)
          }
        } else if (item.type === "gold") {
          try {
            const response = await fetch(`/api/gold/${item.id}`)
            if (response.ok) {
              const data = await response.json()
              details[Number(item.id)] = data
            }
          } catch (error) {
            console.error(`Error fetching details for gold ${item.id}:`, error)
          }
        } else if (item.type === "car" || item.type === "cars") {
          try {
            const response = await fetch(`/api/cars/${item.id}`)
            if (response.ok) {
              const data = await response.json()
              details[Number(item.id)] = data
            }
          } catch (error) {
            console.error(`Error fetching details for car ${item.id}:`, error)
          }
        }
      }
      
      setProductDetails(details)
      setLoading(false)
    }

    if (compareItems.length > 0) {
      fetchProductDetails()
    }
  }, [compareItems])

  // Parse specifications into a consistent format
  const parseSpecifications = (specs: any): Record<string, string> => {
    if (!specs) return {}
    
    if (Array.isArray(specs)) {
      const result: Record<string, string> = {}
      specs.forEach((spec: any) => {
        const key = spec.name || spec.key || ""
        const value = spec.value || ""
        if (key) result[key] = String(value)
      })
      return result
    }
    
    if (typeof specs === "object" && specs !== null) {
      const result: Record<string, string> = {}
      Object.entries(specs).forEach(([key, value]) => {
        result[key] = String(value)
      })
      return result
    }
    
    return {}
  }

  // Get all unique specification keys across all products
  const getAllSpecKeys = (): string[] => {
    const allKeys = new Set<string>()
    
    Object.values(productDetails).forEach((detail) => {
      const specs = parseSpecifications(detail.specifications)
      Object.keys(specs).forEach((key) => allKeys.add(key))
    })
    
    return Array.from(allKeys)
  }

  const handleAddToCart = (item: any) => {
    const price = typeof item.price === 'string' 
      ? Number.parseFloat(item.price.replace(",", "."))
      : Number(item.price)
    
    addToCart({
      id: item.id,
      name: item.name,
      price: price,
      quantity: 1,
      image: item.image,
      type: item.type,
    })

    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${item.name} беше добавен в количката.`,
    })
  }

  const handleRemove = (id: string | number) => {
    removeFromCompare(id)
    toast({
      title: "Премахнато",
      description: "Продуктът беше премахнат от сравнението.",
    })
  }

  const getProductUrl = (item: any) => {
    switch (item.type) {
      case "gold":
        return `/gold/${item.id}`
      case "equipment":
        return `/equipment/${item.id}`
      case "car":
      case "cars":
        return `/cars/${item.id}`
      default:
        return `/products/${item.id}`
    }
  }

  const getPrice = (item: any): number => {
    if (typeof item.price === 'string') {
      return Number.parseFloat(item.price.replace(",", "."))
    }
    return Number(item.price)
  }

  const isCar = (item: any) => item.type === "car" || item.type === "cars"

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Hero Section - matching cart page style */}
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
          
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex items-center gap-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <polygon fill="white" points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                <polygon fill="white" points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
              </svg>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Сравнение на продукти</h1>
                <p className="text-white/70 mt-1">
                  {compareItems.length} {compareItems.length === 1 ? "продукт" : "продукта"} за сравнение
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Empty State */}
          {compareItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-16 bg-white rounded-lg shadow-sm"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                  <polygon fill="#1b6ea5" points="2.1,16.8 9.8,22 9.8,19.6 21.9,19.6 21.9,13.8 9.8,13.8 9.8,11.4" />
                  <polygon fill="#1b6ea5" points="21.9,7.3 14.2,2 14.2,4.4 2.1,4.4 2.1,10.2 14.2,10.2 14.2,12.6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#282828] mb-3">Няма продукти за сравнение</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Добавете продукти за сравнение, като натиснете бутона &quot;Сравни&quot;
              </p>
              <Link href="/">
                <Button className="bg-[#1b6ea5] hover:bg-[#155a8a] text-white px-8 py-3 rounded-lg font-semibold">
                  Разгледай продукти
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6 pb-4">
                <p className="text-gray-700 font-medium">
                  {compareItems.length} {compareItems.length === 1 ? "продукт" : "продукта"} (максимум 4)
                </p>
                <Button
                  onClick={() => {
                    clearCompare()
                    toast({
                      title: "Изчистено",
                      description: "Всички продукти за сравнение бяха премахнати.",
                    })
                  }}
                  variant="ghost"
                  className="text-gray-600 hover:text-red-600 hover:bg-transparent rounded-lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Изчисти всички
                </Button>
              </div>

              {/* Compare Grid - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-max">
                  {/* Product Cards Row */}
                  <div className="flex gap-4 mb-6">
                    <AnimatePresence mode="popLayout">
                      {compareItems.map((item, index) => {
                        const originalPrice = getPrice(item)
                        const details = productDetails[Number(item.id)]
                        const discountAmount = Number(details?.promotions || 0)
                        const finalPrice = Math.max(0, originalPrice - discountAmount)
                        const hasPromotion = discountAmount > 0

                        return (
                          <motion.div
                            key={`${item.type}-${item.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="w-[280px] flex-shrink-0 bg-white rounded-lg p-3 relative group transition-all flex flex-col border h-full"
                            style={{ minHeight: "420px", borderColor: "#f1f2f3" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#e60200"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#f1f2f3"
                            }}
                          >
                            {/* Promotion Badge */}
                            {hasPromotion && (
                              <div
                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border z-10"
                                style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                              >
                                ПРОМОЦИЯ
                              </div>
                            )}

                            {/* Remove Button */}
                            <div className="absolute top-2 right-2 z-10">
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                                title="Премахни от сравнение"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Product Image */}
                            <Link href={getProductUrl(item)} className="relative mb-3 flex-shrink-0 flex items-center justify-center" style={{ height: "180px" }}>
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                  <span className="text-gray-400">Няма снимка</span>
                                </div>
                              )}
                            </Link>

                            {/* Product Info */}
                            <Link href={getProductUrl(item)} className="block">
                              <h3
                                className="text-base font-medium mb-2 line-clamp-2 hover:text-red-600 transition-colors"
                                style={{ color: "#282828" }}
                              >
                                {item.name}
                              </h3>
                            </Link>

                            {item.description && (
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                            )}

                            {/* Price - with promotion styling */}
                            {hasPromotion ? (
                              <div className="mb-3 mt-auto flex items-baseline gap-2 flex-wrap">
                                <span className="text-lg text-red-500 line-through font-semibold">
                                  {originalPrice.toFixed(2)} &euro;
                                </span>
                                <span className="text-lg text-gray-400">/</span>
                                <span className="text-xl font-bold" style={{ color: "#1a4b8c" }}>
                                  {finalPrice.toFixed(2)} &euro;
                                </span>
                              </div>
                            ) : (
                              <div className="text-xl font-bold mb-3 text-red-600 mt-auto" style={{ fontFamily: "var(--font-open-sans)" }}>
                                {finalPrice.toFixed(2)} &euro;
                              </div>
                            )}

                            {/* Action Button - Equipment style */}
                            {isCar(item) ? (
                              <a
                                href="tel:+359882738155"
                                className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                                style={{ height: "44px" }}
                              >
                                <div
                                  className="flex items-center justify-center rounded-l-lg"
                                  style={{ backgroundColor: "#eaebee", width: "48px", height: "44px" }}
                                >
                                  <Phone className="w-5 h-5" style={{ color: "#3d3d3d" }} />
                                </div>
                                <div
                                  className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                                  style={{ backgroundColor: "#1b6ea5", height: "44px" }}
                                >
                                  <span className="text-white text-base font-semibold">Обади се</span>
                                </div>
                              </a>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="w-full flex items-center overflow-hidden transition-all hover:opacity-90 rounded-lg"
                                style={{ height: "44px" }}
                              >
                                <div
                                  className="flex items-center justify-center rounded-l-lg"
                                  style={{ backgroundColor: "#eaebee", width: "48px", height: "44px" }}
                                >
                                  <ShoppingCart className="w-5 h-5" style={{ color: "#3d3d3d" }} />
                                </div>
                                <div
                                  className="flex-1 flex items-center justify-center rounded-lg -ml-1"
                                  style={{ backgroundColor: "#f8212a", height: "44px" }}
                                >
                                  <span className="text-white text-base font-semibold">Добави</span>
                                </div>
                              </button>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>

                    {/* Add More Placeholder */}
                    {compareItems.length < 4 && (
                      <Link
                        href="/"
                        className="w-[280px] flex-shrink-0 bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-[#1b6ea5] transition-colors flex flex-col items-center justify-center min-h-[400px]"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <span className="text-3xl text-gray-400">+</span>
                        </div>
                        <span className="text-gray-500 font-medium">Добави продукт</span>
                        <span className="text-sm text-gray-400 mt-1">за сравнение</span>
                      </Link>
                    )}
                  </div>

                  {/* Comparison Table */}
                  {compareItems.length > 1 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[150px]">Характеристика</th>
                              {compareItems.map((item) => (
                                <th key={item.id} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-[280px]">
                                  {item.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {/* Type row */}
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-600">Тип</td>
                              {compareItems.map((item) => (
                                <td key={item.id} className="px-4 py-3 text-center text-sm text-[#282828]">
                                  {item.type === "cars" || item.type === "car" ? "Автомобил" : 
                                   item.type === "equipment" ? "Техника" : 
                                   item.type === "gold" ? "Злато" : "Продукт"}
                                </td>
                              ))}
                            </tr>
                            
                            {/* Price row with promotion styling */}
                            <tr className="bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-600">Цена</td>
                              {compareItems.map((item) => {
                                const originalPrice = getPrice(item)
                                const details = productDetails[Number(item.id)]
                                const discountAmount = Number(details?.promotions || 0)
                                const finalPrice = Math.max(0, originalPrice - discountAmount)
                                const hasPromotion = discountAmount > 0
                                
                                return (
                                  <td key={item.id} className="px-4 py-3 text-center text-sm">
                                    {hasPromotion ? (
                                      <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <span className="text-red-500 line-through font-semibold">
                                          {originalPrice.toFixed(2)} &euro;
                                        </span>
                                        <span className="text-gray-400">/</span>
                                        <span className="font-bold" style={{ color: "#1a4b8c" }}>
                                          {finalPrice.toFixed(2)} &euro;
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="font-bold text-red-600">
                                        {finalPrice.toFixed(2)} &euro;
                                      </span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                            
                            {/* Brand row - if any product has brand */}
                            {compareItems.some((item) => productDetails[Number(item.id)]?.brand) && (
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-600">Марка</td>
                                {compareItems.map((item) => (
                                  <td key={item.id} className="px-4 py-3 text-center text-sm text-[#282828]">
                                    {productDetails[Number(item.id)]?.brand || "-"}
                                  </td>
                                ))}
                              </tr>
                            )}
                            
                            {/* Model row - if any product has model */}
                            {compareItems.some((item) => productDetails[Number(item.id)]?.model) && (
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-600">Модел</td>
                                {compareItems.map((item) => (
                                  <td key={item.id} className="px-4 py-3 text-center text-sm text-[#282828]">
                                    {productDetails[Number(item.id)]?.model || "-"}
                                  </td>
                                ))}
                              </tr>
                            )}
                            
                            {/* Condition row - if any product has condition */}
                            {compareItems.some((item) => productDetails[Number(item.id)]?.condition) && (
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-600">Състояние</td>
                                {compareItems.map((item) => (
                                  <td key={item.id} className="px-4 py-3 text-center text-sm text-[#282828]">
                                    {productDetails[Number(item.id)]?.condition || "-"}
                                  </td>
                                ))}
                              </tr>
                            )}
                            
                            {/* Dynamic specification rows */}
                            {getAllSpecKeys().map((specKey, index) => (
                              <tr key={specKey} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="px-4 py-3 text-sm text-gray-600">{specKey}</td>
                                {compareItems.map((item) => {
                                  const specs = parseSpecifications(productDetails[Number(item.id)]?.specifications)
                                  return (
                                    <td key={item.id} className="px-4 py-3 text-center text-sm text-[#282828]">
                                      {specs[specKey] || "-"}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                            
                            {/* Description row */}
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-600">Описание</td>
                              {compareItems.map((item) => (
                                <td key={item.id} className="px-4 py-3 text-center text-sm text-gray-500">
                                  {item.description || "-"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Compare Cards - Mobile */}
              <div className="md:hidden space-y-4">
                <AnimatePresence mode="popLayout">
                  {compareItems.map((item, index) => {
                    const originalPrice = getPrice(item)
                    const details = productDetails[Number(item.id)]
                    const discountAmount = Number(details?.promotions || 0)
                    const finalPrice = Math.max(0, originalPrice - discountAmount)
                    const hasPromotion = discountAmount > 0

                    return (
                      <motion.div
                        key={`mobile-${item.type}-${item.id}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 relative"
                      >
                        {/* Promotion Badge */}
                        {hasPromotion && (
                          <div
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold border z-10"
                            style={{ color: "#1a6ea5", borderColor: "#1a6ea5", backgroundColor: "#ffffff" }}
                          >
                            ПРОМОЦИЯ
                          </div>
                        )}
                        
                        <div className="flex p-4">
                          {/* Product Image */}
                          <Link href={getProductUrl(item)} className="flex-shrink-0 w-24 h-24 relative">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <span className="text-xs text-gray-400">Няма снимка</span>
                              </div>
                            )}
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 pl-4">
                            <div className="flex justify-between items-start">
                              <Link href={getProductUrl(item)}>
                                <h3 className="font-medium text-[#282828] line-clamp-2 hover:text-[#1b6ea5] transition-colors text-sm">
                                  {item.name}
                                </h3>
                              </Link>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="ml-2 w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full transition-colors flex-shrink-0"
                                title="Премахни"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price with promotion styling */}
                            {hasPromotion ? (
                              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                                <span className="text-sm text-red-500 line-through font-semibold">
                                  {originalPrice.toFixed(2)} &euro;
                                </span>
                                <span className="text-lg font-bold" style={{ color: "#1a4b8c" }}>
                                  {finalPrice.toFixed(2)} &euro;
                                </span>
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-red-600 mt-2" style={{ fontFamily: "var(--font-open-sans)" }}>
                                {finalPrice.toFixed(2)} &euro;
                              </div>
                            )}

                            <div className="mt-3">
                              {isCar(item) ? (
                                <a
                                  href="tel:+359882738155"
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold"
                                  style={{ backgroundColor: "#1b6ea5" }}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Обади се</span>
                                </a>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold"
                                  style={{ backgroundColor: "#f8212a" }}
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Добави</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Add More Button - Mobile */}
                {compareItems.length < 4 && (
                  <Link
                    href="/"
                    className="block bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-[#1b6ea5] transition-colors p-6 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400">+</span>
                    </div>
                    <span className="text-gray-500 font-medium">Добави продукт за сравнение</span>
                  </Link>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-6 p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-left">
                    <p className="font-semibold text-[#282828] text-lg">Търсите още продукти?</p>
                    <p className="text-gray-500 text-sm">Разгледайте нашата пълна колекция</p>
                  </div>
                  <Link href="/">
                    <Button className="bg-[#1b6ea5] hover:bg-[#155a8a] text-white font-semibold px-6 py-3 rounded-lg">
                      Разгледай каталога
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
