"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ArrowLeft, CreditCard, MapPin, User } from "lucide-react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

function CheckoutContent() {
  const { user } = useAuth()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isGuestCheckout = searchParams.get("guest") === "true"

  const [formData, setFormData] = useState({
    guestEmail: "",
    guestFirstName: "",
    guestLastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: user?.phone || "",
    notes: "",
  })

  useEffect(() => {
    if (!user && !isGuestCheckout) {
      router.push("/login")
      return
    }
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [user, cartItems, router, isGuestCheckout])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isGuestCheckout && !formData.guestEmail) {
      toast({
        title: "Грешка",
        description: "Моля въведете email адрес",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare order items with original price and promotion info
      const items = cartItems.map((item) => ({
        type: item.type || "product",
        id: item.id,
        name: item.name,
        image: item.image_url || item.image,
        quantity: item.quantity,
        price: item.price,
        weight_grams: item.weight_grams || null,
        originalPrice: item.originalPrice || item.price,
        hasPromotion: item.hasPromotion || false,
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          guestEmail: isGuestCheckout ? formData.guestEmail : null,
          guestFirstName: isGuestCheckout ? formData.guestFirstName : null,
          guestLastName: isGuestCheckout ? formData.guestLastName : null,
          items,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingPostalCode: formData.postalCode,
          phone: formData.phone,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        clearCart()
        toast({
          title: "Успешна поръчка!",
          description: `Поръчка #${data.orderId} е създадена успешно`,
        })
        router.push(user ? "/profile" : "/")
      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна грешка при създаване на поръчката",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = getTotalPrice()
  const shipping = 10
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button variant="ghost" onClick={() => router.push("/cart")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Обратно към количката
          </Button>

          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            Завършване на поръчка
          </h1>

          {isGuestCheckout && (
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900">
                Продължавате като гост. Имате акаунт?{" "}
                <Link href="/login" className="font-semibold underline hover:text-blue-700">
                  Влезте тук
                </Link>
              </p>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {isGuestCheckout && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Вашите данни
                    </h2>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="guestEmail">Email *</Label>
                        <Input
                          id="guestEmail"
                          name="guestEmail"
                          type="email"
                          value={formData.guestEmail}
                          onChange={handleInputChange}
                          required
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guestFirstName">Име</Label>
                          <Input
                            id="guestFirstName"
                            name="guestFirstName"
                            value={formData.guestFirstName}
                            onChange={handleInputChange}
                            placeholder="Иван"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guestLastName">Фамилия</Label>
                          <Input
                            id="guestLastName"
                            name="guestLastName"
                            value={formData.guestLastName}
                            onChange={handleInputChange}
                            placeholder="Иванов"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Shipping Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Информация за доставка
                  </h2>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="address">Адрес *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="ул. Примерна 123"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Град *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="София"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Пощенски код</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="1000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+359 888 123 456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Бележки за поръчката</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Допълнителни инструкции..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>

                {/* Order Items */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Вашата поръчка
                  </h2>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} лв</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Обобщение</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Междинна сума:</span>
                      <span className="font-medium">{subtotal.toFixed(2)} лв</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Доставка:</span>
                      <span className="font-medium">{shipping.toFixed(2)} лв</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Общо:</span>
                      <span className="font-bold text-red-600">{total.toFixed(2)} лв</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Обработване..." : "Завърши поръчката"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    С натискане на бутона потвърждавате поръчката
                  </p>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  )
}
