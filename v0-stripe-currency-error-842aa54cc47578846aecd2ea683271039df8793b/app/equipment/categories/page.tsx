"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import Image from "next/image"

interface Category {
  id: number
  name: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
  images: string[] | null
  created_at: string
  updated_at: string
}

export default function EquipmentCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/equipment/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30" variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Топ качество на най-добри цени
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
                Открийте перфектната техника за вас
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-pretty leading-relaxed">
                Разгледайте нашата колекция от висококачествена техника. Гарантирано качество, конкурентни цени и бърза
                доставка.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="border-y bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-sm md:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Гаранция за качество</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">Бърза доставка</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium">Най-добри цени</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Няма налични категории</h3>
              <p className="text-muted-foreground text-lg">Категориите ще се появят скоро</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Разгледайте по категория</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Изберете категория и намерете точно това, което търсите
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const categoryImage = category.images && category.images.length > 0 ? category.images[0] : null

                  return (
                    <Link key={category.id} href={`/equipment?category=${category.id}`} className="group">
                      <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-red-600 overflow-hidden border-2 hover:border-primary/50 bg-card">
                        <CardContent className="p-0">
                          <div className="relative w-full h-56 overflow-hidden bg-muted">
                            {categoryImage ? (
                              <>
                                <Image
                                  src={categoryImage || "/placeholder.svg"}
                                  alt={category.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                                <Package className="h-20 w-20 text-primary/40 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-300" />
                              </div>
                            )}

                            {index < 3 && (
                              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg">
                                Популярно
                              </Badge>
                            )}
                          </div>

                          <div className="p-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                                {category.description}
                              </p>
                            )}

                            <Button
                              variant="ghost"
                              className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            >
                              <span className="font-semibold">Разгледай</span>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Не намирате това, което търсите?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto text-pretty">
              Свържете се с нас и ще ви помогнем да намерите точно това, от което се нуждаете
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base font-semibold" asChild>
                <Link href="/contact">
                  Свържете се с нас
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
