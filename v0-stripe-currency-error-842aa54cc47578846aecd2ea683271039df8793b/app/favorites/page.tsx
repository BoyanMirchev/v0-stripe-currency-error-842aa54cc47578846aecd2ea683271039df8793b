"use client"

import { useState } from "react"
import { Heart, X, Check, Minus, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const getQuantity = (id: string | number) => {
    return quantities[String(id)] || 1
  }

  const updateQuantity = (id: string | number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [String(id)]: Math.max(1, (prev[String(id)] || 1) + delta)
    }))
  }

  const handleAddToCart = (favorite: any) => {
    const qty = getQuantity(favorite.id)
    const price = typeof favorite.price === 'string' 
      ? Number.parseFloat(favorite.price.replace(",", "."))
      : Number(favorite.price)
    
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: favorite.id,
        name: favorite.name,
        price: price,
        quantity: 1,
        image: favorite.image,
        type: favorite.type,
      })
    }

    toast({
      variant: "cart",
      title: "Успешно добавено!",
      description: `${favorite.name} беше добавен в количката.`,
    })
  }

  const handleRemove = (type: string, id: string | number) => {
    removeFavorite(type, id)
    toast({
      title: "Премахнато",
      description: "Продуктът беше премахнат от любимите.",
    })
  }

  const getProductUrl = (favorite: any) => {
    switch (favorite.type) {
      case "gold":
        return `/gold/${favorite.id}`
      case "equipment":
        return `/equipment/${favorite.id}`
      case "car":
      case "cars":
        return `/cars/${favorite.id}`
      default:
        return `/products/${favorite.id}`
    }
  }

  const getPrice = (favorite: any): number => {
    if (typeof favorite.price === 'string') {
      return Number.parseFloat(favorite.price.replace(",", "."))
    }
    return Number(favorite.price)
  }

  const getBGNPrice = (favorite: any): number => {
    return getPrice(favorite) * 1.96
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Hero Section - Diagonal colorful banner like cart page */}
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
          
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="flex items-center gap-4">
              <Heart className="w-10 h-10 text-white fill-white/30" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Любими продукти</h1>
                <p className="text-white/80 mt-1">
                  {favorites.length} {favorites.length === 1 ? "продукт" : "продукта"} в списъка
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Empty State */}
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-16 bg-[#0e0e0e]"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-[#ffd35b]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Нямате любими продукти</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Добавете продукти към любимите си, като натиснете иконата сърце
              </p>
              <Link href="/">
                <Button className="bg-[#ffd35b] hover:bg-[#faa410] text-[#1a1a1a] px-8 py-3 rounded-none font-semibold">
                  Разгледай продукти
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-700 font-medium">
                  {favorites.length} {favorites.length === 1 ? "продукт" : "продукта"}
                </p>
                <Button
                  onClick={() => {
                    clearFavorites()
                    toast({
                      title: "Изчистено",
                      description: "Всички любими продукти бяха премахнати.",
                    })
                  }}
                  variant="ghost"
                  className="text-gray-600 hover:text-red-600 hover:bg-transparent rounded-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Изчисти всички
                </Button>
              </div>

              {/* Favorites Grid - Store Product Card Design */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {favorites.map((favorite, index) => {
                    const price = getPrice(favorite)
                    const bgnPrice = getBGNPrice(favorite)
                    const quantity = getQuantity(favorite.id)

                    return (
                      <motion.div
                        key={`${favorite.type}-${favorite.id}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#0e0e0e] overflow-hidden shadow-sm hover:shadow-lg transition-all relative group/card"
                      >
                        {/* Remove Button - Top Right */}
                        <button
                          onClick={() => handleRemove(favorite.type, favorite.id)}
                          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white/70 hover:text-white transition-colors"
                          title="Премахни от любими"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col md:flex-row md:min-h-[320px]">
                          {/* Product Image Section - Full width on mobile, fixed width on desktop */}
                          <div className="relative w-full md:w-[280px] flex-shrink-0 flex flex-col">
                            <Link
                              href={getProductUrl(favorite)}
                              className="relative flex items-center justify-center p-4 min-h-[200px] md:min-h-[180px] md:flex-1"
                            >
                              {favorite.image ? (
                                <Image
                                  src={favorite.image}
                                  alt={favorite.name}
                                  fill
                                  className="object-contain p-4"
                                />
                              ) : (
                                <Sparkles className="h-16 w-16 text-[#ffd35b]" />
                              )}
                            </Link>
                            
                            {/* Stock Status - Below image */}
                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm px-4 pb-4">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-white font-medium">В наличност</span>
                            </div>
                          </div>

                          {/* Product Info Section */}
                          <div className="flex-1 p-4 md:p-6 pb-14 md:pb-6 flex flex-col relative overflow-hidden">
                            {/* Product Name */}
                            <Link href={getProductUrl(favorite)}>
                              <h3 className="font-semibold text-white mb-2 md:mb-6 hover:text-gray-200 transition-colors line-clamp-2 md:line-clamp-3 text-sm md:text-xl leading-tight text-center md:text-left">
                                {favorite.name}
                              </h3>
                            </Link>

                            {/* Price with labels */}
                            <div className="mb-2 md:mb-6 space-y-1 md:space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs md:text-sm text-[#e7e7e7]">цена в евро</span>
                                <span className="text-base md:text-2xl font-bold text-white">
                                  {price.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs md:text-sm text-[#e7e7e7]">цена в лева</span>
                                <span className="text-xs md:text-sm text-gray-400 italic">
                                  {bgnPrice.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} лв.
                                </span>
                              </div>
                            </div>

                            {/* Quantity Selector - Hidden on mobile */}
                            <div className="hidden md:flex items-center justify-between mb-4">
                              <span className="text-sm text-white font-semibold italic">Количество</span>
                              <div className="flex items-center gap-2 md:gap-3">
                                <button
                                  onClick={() => updateQuantity(favorite.id, -1)}
                                  className="w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] flex items-center justify-center hover:bg-white transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium text-lg text-white border-b border-gray-500 pb-1">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(favorite.id, 1)}
                                  className="w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] flex items-center justify-center hover:bg-white transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Overlay - Always visible on mobile at bottom right, hover on desktop */}
                        <div className="absolute bottom-0 right-0 z-20 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0 transition-all duration-300 ease-out">
                          <svg width="148" height="44" viewBox="0 0 148 44" className="block md:hidden">
                            {/* Remove Button - Red */}
                            <polygon 
                              points="20,0 56,0 48,44 0,44" 
                              fill="#dc2626" 
                              className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                handleRemove(favorite.type, favorite.id)
                              }}
                            />
                            {/* Compare Button - Yellow */}
                            <polygon 
                              points="56,0 100,0 92,44 48,44" 
                              fill="#eab308" 
                              className="hover:fill-[#ca8a04] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                toast({
                                  title: "Добавено за сравнение",
                                  description: `${favorite.name} беше добавено за сравнение.`,
                                })
                              }}
                            />
                            {/* Cart Button - Red */}
                            <polygon 
                              points="100,0 148,0 148,44 92,44" 
                              fill="#dc2626" 
                              className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                handleAddToCart(favorite)
                              }}
                            />
                            {/* X/Remove Icon */}
                            <g transform="translate(26, 12)" stroke="white" strokeWidth="2" fill="none">
                              <path d="M4 4L16 16M16 4L4 16" />
                            </g>
                            {/* Compare Icon */}
                            <g transform="translate(66, 12)">
                              <polygon fill="white" points="1,11.5 6,15 6,13.2 15,13.2 15,9.8 6,9.8 6,8" />
                              <polygon fill="white" points="15,5.5 10,2 10,3.8 1,3.8 1,7.2 10,7.2 10,9" />
                            </g>
                            {/* Cart Icon */}
                            <g transform="translate(112, 12)" stroke="white" strokeWidth="1.5" fill="none">
                              <path d="M4 4h13l-1.2 7.5H5.5z" />
                              <circle cx="7" cy="17" r="1" />
                              <circle cx="14" cy="17" r="1" />
                              <path d="M4 4L3 1H1" />
                            </g>
                          </svg>
                          <svg width="148" height="44" viewBox="0 0 148 44" className="hidden md:block">
                            {/* Remove Button - Gold */}
                            <polygon 
                              points="20,0 56,0 48,44 0,44" 
                              fill="#d4a539" 
                              className="hover:fill-[#b8942f] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                handleRemove(favorite.type, favorite.id)
                              }}
                            />
                            {/* Compare Button - Gold */}
                            <polygon 
                              points="56,0 100,0 92,44 48,44" 
                              fill="#d4a539" 
                              className="hover:fill-[#b8942f] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                toast({
                                  title: "Добавено за сравнение",
                                  description: `${favorite.name} беше добавено за сравнение.`,
                                })
                              }}
                            />
                            {/* Cart Button - Red */}
                            <polygon 
                              points="100,0 148,0 148,44 92,44" 
                              fill="#dc2626" 
                              className="hover:fill-[#b91c1c] cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                handleAddToCart(favorite)
                              }}
                            />
                            {/* X/Remove Icon */}
                            <g transform="translate(26, 12)" stroke="white" strokeWidth="2" fill="none">
                              <path d="M4 4L16 16M16 4L4 16" />
                            </g>
                            {/* Compare Icon */}
                            <g transform="translate(66, 12)">
                              <polygon fill="white" points="1,11.5 6,15 6,13.2 15,13.2 15,9.8 6,9.8 6,8" />
                              <polygon fill="white" points="15,5.5 10,2 10,3.8 1,3.8 1,7.2 10,7.2 10,9" />
                            </g>
                            {/* Cart Icon */}
                            <g transform="translate(112, 12)" stroke="white" strokeWidth="1.5" fill="none">
                              <path d="M4 4h13l-1.2 7.5H5.5z" />
                              <circle cx="7" cy="17" r="1" />
                              <circle cx="14" cy="17" r="1" />
                              <path d="M4 4L3 1H1" />
                            </g>
                          </svg>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-6 p-6 bg-[#0e0e0e]">
                  <div className="text-left">
                    <p className="font-semibold text-white text-lg">Търсите още продукти?</p>
                    <p className="text-gray-400 text-sm">Разгледайте нашата пълна колекция</p>
                  </div>
                  <Link href="/">
                    <Button className="bg-[#ffd35b] hover:bg-[#faa410] text-[#1a1a1a] font-semibold px-6 py-3 rounded-none">
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
