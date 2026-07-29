"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, AlertCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface OrderItem {
  id: number
  product_type: string
  product_id: number
  product_name: string
  product_image: string
  quantity: number
  price: number
  weight_grams: number | null
}

interface Order {
  id: number
  status: string
  total_amount: number
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  delivery_method: string
  payment_method: string
  delivery_cost: number
  econt_city: string | null
  econt_office_name: string | null
  econt_office_address: string | null
  store_name: string | null
  store_address: string | null
  country: string
  created_at: string
  guest_first_name: string | null
  guest_last_name: string | null
  items: OrderItem[]
}

const statusLabels: Record<string, string> = {
  pending: "Изчакваща",
  processing: "В обработка",
  shipped: "Изпратена",
  delivered: "Доставена",
  cancelled: "Отказана",
}

const statusColors: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const deliveryMethodLabels: Record<string, string> = {
  address: "Доставка до адрес",
  econt: "Еконт офис",
  store: "Вземи от магазин",
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Наложен платеж",
  cod: "Наложен платеж",
  card: "Карта при доставка",
  online: "Онлайн плащане",
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderCode.trim()) {
      setError("Моля, въведете номер на поръчка")
      return
    }

    setIsLoading(true)
    setError(null)
    setOrder(null)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/orders/track?orderId=${orderCode.trim()}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Поръчката не е намерена")
        return
      }

      setOrder(data)
    } catch (err) {
      setError("Грешка при свързването със сървъра")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusStep = (status: string) => {
    const steps = ["pending", "processing", "shipped", "delivered"]
    return steps.indexOf(status)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Hero Banner */}
        <div className="relative overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            <polygon points="0,0 350,0 300,100 0,100" fill="#111827" />
            <polygon points="350,0 650,0 600,100 300,100" fill="#dc2626" />
            <polygon points="650,0 1000,0 1000,100 600,100" fill="#eab308" />
          </svg>

          <div className="container mx-auto px-4 relative z-10 py-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Проследи поръчка
              </h1>
              <p className="text-white/80 text-sm">
                Въведете номера на вашата поръчка, за да проследите статуса й
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <form onSubmit={handleSearch}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер на поръчка
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Въведете номера от потвърждението (напр. 12345)"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full h-14 pl-12 pr-32 text-base rounded-xl border-gray-200 focus-visible:border-[#dc2626] focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-0 bg-[#f8f9fb]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-10 px-5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium rounded-lg"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Търси"
                      )}
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Можете да намерите номера на поръчката в имейла за потвърждение или на страницата след успешно поръчване.
                </p>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-medium">{error}</p>
                    <p className="text-red-600 text-sm mt-1">
                      Проверете дали номерът е въведен правилно
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            {order && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Поръчка</p>
                      <h3 className="text-xl font-bold text-gray-900">#{order.id}</h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>

                  {/* Progress Steps */}
                  {order.status !== "cancelled" && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                          <div 
                            className="h-full bg-[#1e40af] transition-all duration-500"
                            style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                          />
                        </div>

                        {/* Steps */}
                        {[
                          { key: "pending", icon: Clock, label: "Изчакваща" },
                          { key: "processing", icon: Package, label: "В обработка" },
                          { key: "shipped", icon: Truck, label: "Изпратена" },
                          { key: "delivered", icon: CheckCircle2, label: "Доставена" },
                        ].map((step, index) => {
                          const isCompleted = getStatusStep(order.status) >= index
                          const isCurrent = getStatusStep(order.status) === index
                          return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? "bg-[#1e40af] text-white" 
                                  : "bg-gray-200 text-gray-400"
                              } ${isCurrent ? "ring-4 ring-[#1e40af]/20" : ""}`}>
                                <step.icon className="w-5 h-5" />
                              </div>
                              <span className={`mt-2 text-xs font-medium ${
                                isCompleted ? "text-gray-900" : "text-gray-400"
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Дата на поръчка</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.created_at).toLocaleDateString("bg-BG", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Начин на плащане</p>
                        <p className="font-medium text-gray-900">
                          {paymentMethodLabels[order.payment_method] || order.payment_method}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {deliveryMethodLabels[order.delivery_method] || "Доставка"}
                        </p>
                        <p className="font-medium text-gray-900">
                          {order.delivery_method === "econt" && order.econt_office_name
                            ? `${order.econt_office_name}, ${order.econt_city}`
                            : order.delivery_method === "store" && order.store_name
                            ? `${order.store_name}, ${order.store_address}`
                            : `${order.shipping_address}, ${order.shipping_city} ${order.shipping_postal_code}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Продукти в поръчката
                      <span className="ml-auto text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full">
                        {order.items.filter(item => item.id !== null).length} {order.items.filter(item => item.id !== null).length === 1 ? "продукт" : "продукта"}
                      </span>
                    </h3>
                  </div>

                  <div className="p-6">
                    {/* Product Items */}
                    <div className="space-y-3">
                      {order.items.filter(item => item.id !== null).map((item, index) => (
                        <div 
                          key={item.id || index} 
                          className="flex items-center gap-4 p-4 bg-[#f8f9fb] rounded-xl"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.quantity} бр. x {Number(item.price).toFixed(2)} €
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#dc2626]">
                              {(item.quantity * Number(item.price)).toFixed(2)} €
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Section */}
                    <div className="mt-6 bg-[#f8f9fb] rounded-xl p-4">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Междинна сума</span>
                        <span className="font-medium">{(Number(order.total_amount) - Number(order.delivery_cost || 0)).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 pb-3 border-b border-gray-200">
                        <span>Доставка</span>
                        <span className="font-medium">{order.delivery_cost && Number(order.delivery_cost) > 0 ? `${Number(order.delivery_cost).toFixed(2)} €` : "Безплатна"}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-base font-semibold text-gray-900">Общо за плащане</span>
                        <span className="text-xl font-bold text-[#dc2626]">{Number(order.total_amount).toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </div>

                </div>
            )}

            {/* Empty State - when searched but no order */}
            {hasSearched && !order && !error && !isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Търсене на поръчка
                </h3>
                <p className="text-gray-500">
                  Въведете номера на вашата поръчка в полето по-горе
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
