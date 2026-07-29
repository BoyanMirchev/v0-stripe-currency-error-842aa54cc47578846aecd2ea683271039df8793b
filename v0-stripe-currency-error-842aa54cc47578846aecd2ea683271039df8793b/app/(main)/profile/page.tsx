"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Package,
  User,
  LogOut,
  ChevronDown,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  Info,
  Lock,
  Home,
  Clock,
  Truck,
  CheckCircle2,
  CreditCard,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface OrderItem {
  id: number
  product_name: string
  product_image: string | null
  quantity: number
  price: number | null
  weight_grams: number | null
}

interface Order {
  id: number
  total_amount: number | null
  status: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string | null
  phone: string
  created_at: string
  delivery_method: string | null
  payment_method: string | null
  delivery_cost: number | null
  econt_city: string | null
  econt_office_name: string | null
  econt_office_address: string | null
  store_name: string | null
  store_address: string | null
  country: string | null
  items: OrderItem[]
}

type ActiveSection = "orders" | "personal"

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

const getStatusStep = (status: string) => {
  const steps = ["pending", "processing", "shipped", "delivered"]
  return steps.indexOf(status)
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<ActiveSection>("orders")
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/orders?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const normalizedOrders = data.map((order: any) => ({
          ...order,
          total_amount: order.total_amount ? Number(order.total_amount) : 0,
          items: order.items.map((item: any) => ({
            ...item,
            price: item.price ? Number(item.price) : 0,
            weight_grams: item.weight_grams ? Number(item.weight_grams) : null,
          })),
        }))
        setOrders(normalizedOrders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }


  if (!user) {
    return null
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "orders":
        return "Поръчки"
      case "personal":
        return "Лични данни"
      default:
        return ""
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        {/* Section Header Bar - Much taller when viewing personal data */}
        <div className={`relative overflow-hidden transition-all duration-300 ${activeSection === "personal" ? "pb-32" : ""}`}>
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
          
          <div className="container mx-auto px-4 relative z-10 py-10">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white">
                <Link href="/profile" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Табло</span>
                </Link>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-lg">{getSectionTitle()}</span>
              </div>

              {/* Top Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
                >
                  ТАБЛО
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors text-sm font-medium">
                    МОЯТ ПРОФИЛ
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button
                      onClick={() => setActiveSection("orders")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg"
                    >
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">Поръчки</span>
                    </button>
                    <button
                      onClick={() => setActiveSection("personal")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors last:rounded-b-lg border-t"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Лични данни</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Hidden when viewing personal data */}
            {activeSection !== "personal" && (
              <div className="lg:w-80 flex-shrink-0">
                {/* My Profile Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                    МОЯТ ПРОФИЛ
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveSection("orders")}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all text-left ${
                        activeSection === "orders"
                          ? "bg-white shadow-md border-l-4 border-black"
                          : "bg-white hover:shadow-sm"
                      }`}
                    >
                      <Package className={`w-5 h-5 ${activeSection === "orders" ? "text-black" : "text-gray-400"}`} />
                      <span className={`font-medium ${activeSection === "orders" ? "text-black" : "text-gray-700"}`}>
                        Поръчки
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveSection("personal")}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all text-left ${
                        activeSection === "personal"
                          ? "bg-white shadow-md border-l-4 border-black"
                          : "bg-white hover:shadow-sm"
                      }`}
                    >
                      <User className={`w-5 h-5 ${activeSection === "personal" ? "text-black" : "text-gray-400"}`} />
                      <span className={`font-medium ${activeSection === "personal" ? "text-black" : "text-gray-700"}`}>
                        Лични данни
                      </span>
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white hover:bg-red-50 text-red-600 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Изход</span>
                </button>
              </div>
            )}

            {/* Main Content Area - Centered when no sidebar */}
            <div className={`flex-1 min-w-0 ${activeSection === "personal" ? "max-w-4xl mx-auto" : ""}`}>
              {/* Orders Section */}
              {activeSection === "orders" && (
                <div className="bg-transparent">
                  {isLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 animate-pulse" />
                      <p className="text-gray-500">Зареждане на поръчките...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Няма поръчки</h3>
                      <p className="text-gray-500 mb-8 max-w-sm mx-auto">Все още нямате направени поръчки.</p>
                      <Button
                        onClick={() => router.push("/")}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      >
                        Разгледайте продуктите
                      </Button>
                    </div>
                  ) : (
<div className="space-y-4">
                                      {orders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                                          {/* Order Header */}
                                          <div className="p-5">
                                            <div className="flex items-center justify-between">
                                              <div className="grid grid-cols-4 gap-8 flex-1">
                                                <div>
                                                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Дата</p>
                                                  <p className="font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Поръчка</p>
                                                  <p className="font-semibold text-gray-900">#{order.id}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Общо</p>
                                                  <p className="font-semibold text-gray-900">{(order.total_amount || 0).toFixed(2)} €</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Статус</p>
                                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                                                    {statusLabels[order.status] || order.status}
                                                  </span>
                                                </div>
                                              </div>
                                              <button
                                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ml-4 ${
                                                  expandedOrderId === order.id
                                                    ? "bg-[#1e40af] text-white shadow-md"
                                                    : "bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white hover:shadow-lg hover:scale-105"
                                                }`}
                                              >
                                                <span>Детайли</span>
                                                <ChevronDown
                                                  className={`w-4 h-4 transition-transform duration-200 ${
                                                    expandedOrderId === order.id ? "rotate-180" : ""
                                                  }`}
                                                />
                                              </button>
                                            </div>
                                          </div>

{/* Expanded Order Details */}
                                          {expandedOrderId === order.id && (
                                            <div className="bg-gradient-to-b from-gray-50 to-white">
{/* Status Progress Steps */}
                                              {order.status !== "cancelled" && (
                                                <div className="p-4 bg-white/80">
                                  <div className="flex items-center justify-between relative max-w-md mx-auto">
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

{/* Order Info Grid */}
                                              <div className="p-4 bg-white/80">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">Дата на поръчка</p>
                                      <p className="font-medium text-gray-900">{formatDateTime(order.created_at)}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">Начин на плащане</p>
                                      <p className="font-medium text-gray-900">
                                        {paymentMethodLabels[order.payment_method || ""] || order.payment_method || "—"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        {deliveryMethodLabels[order.delivery_method || ""] || "Доставка"}
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {order.delivery_method === "econt" && order.econt_office_name
                                          ? `${order.econt_office_name}, ${order.econt_city}`
                                          : order.delivery_method === "store" && order.store_name
                                          ? `${order.store_name}, ${order.store_address}`
                                          : `${order.shipping_address}, ${order.shipping_city}${order.shipping_postal_code ? ` ${order.shipping_postal_code}` : ""}`
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-gray-500">Телефон</p>
                                      <p className="font-medium text-gray-900">{order.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Products Section */}
                              <div className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] px-4 py-3">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                  <ShoppingBag className="w-4 h-4" />
                                  Продукти в поръчката
                                  <span className="ml-auto text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">
                                    {order.items.filter(item => item.id !== null).length} {order.items.filter(item => item.id !== null).length === 1 ? "продукт" : "продукта"}
                                  </span>
                                </h3>
                              </div>

                              <div className="p-4">
                                <div className="space-y-3">
                                  {order.items.filter(item => item.id !== null).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                        {item.product_image ? (
                                          <Image
                                            src={item.product_image}
                                            alt={item.product_name}
                                            width={80}
                                            height={80}
                                            className="object-contain w-full h-full"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                                            <Package className="w-8 h-8 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {item.quantity} бр. x {(item.price || 0).toFixed(2)} €
                                          {item.weight_grams && ` • ${item.weight_grams}g`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-[#dc2626]">
                                          {((item.price || 0) * item.quantity).toFixed(2)} €
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Total Section */}
                                <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                    <span>Междинна сума</span>
                                    <span className="font-medium">
                                      {((order.total_amount || 0) - (order.delivery_cost || 0)).toFixed(2)} €
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm text-gray-600 pb-3 border-b border-gray-200">
                                    <span>Доставка</span>
                                    <span className="font-medium">
                                      {order.delivery_cost && Number(order.delivery_cost) > 0 
                                        ? `${Number(order.delivery_cost).toFixed(2)} €` 
                                        : "Безплатна"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-3">
                                    <span className="text-base font-semibold text-gray-900">Общо за плащане</span>
                                    <span className="text-xl font-bold text-[#dc2626]">
                                      {(order.total_amount || 0).toFixed(2)} €
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Personal Data Section */}
              {activeSection === "personal" && (
                <div className="space-y-6 -mt-24 relative z-20">
                  {/* Personal Info Card - Floating */}
                  <Card className="p-6 border-0 shadow-lg rounded-lg bg-white">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Лични данни</h2>
                    
                    {/* Info Notice */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                      <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">
                        Ако желаете да промените личните си данни или фирмените си данни, моля, свържете се с нас!
                      </p>
                    </div>

                    {/* User Details */}
                    <div className="space-y-3">
                      <div className="flex py-2">
                        <span className="text-gray-500 w-48">Име:</span>
                        <span className="font-medium text-gray-900">{user.firstName || "—"}</span>
                      </div>
                      <div className="flex py-2">
                        <span className="text-gray-500 w-48">Фамилия:</span>
                        <span className="font-medium text-gray-900">{user.lastName || "—"}</span>
                      </div>
                      <div className="flex py-2">
                        <span className="text-gray-500 w-48">Имейл за вход:</span>
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </div>

                      <div className="flex py-2">
                        <span className="text-gray-500 w-48">Държава:</span>
                        <span className="font-medium text-gray-900">България</span>
                      </div>
                      <div className="flex py-2">
                        <span className="text-gray-500 w-48">Citizenship:</span>
                        <span className="font-medium text-gray-900">България</span>
                      </div>
                    </div>
                  </Card>

                  {/* Contact Data Card */}
                  <Card className="p-6 border-0 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Данни за контакт</h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-center py-2">
                        <span className="text-gray-500 w-48">Мобилен тел.:</span>
                        <span className="font-medium text-gray-900 flex-1">{user.phone || "—"}</span>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center py-2">
                        <span className="text-gray-500 w-48">Тел.:</span>
                        <span className="font-medium text-gray-900 flex-1">{user.phone || "—"}</span>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Shipping Address Card */}
                  <Card className="p-6 border-0 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Адрес за доставка</h2>
                    
                    {orders.length > 0 && orders[0].shipping_address ? (
                      <div className="flex items-center py-2">
                        <span className="text-gray-500 w-48">Настоящ адрес:</span>
                        <span className="font-medium text-gray-900 flex-1">
                          {orders[0].shipping_address}, {orders[0].shipping_city}, България
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Няма запазен адрес за доставка.</p>
                    )}

                    <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
                      Добавяне на нов адрес
                    </Button>
                  </Card>

                  {/* Password Card */}
                  <Card className="p-6 border-0 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Парола</h2>
                    
                    <div className="flex items-center py-2 mb-4">
                      <span className="text-gray-500 w-48">Последно влизане:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(new Date().toISOString())}</span>
                    </div>

                    <Button className="bg-black hover:bg-gray-800 text-white">
                      Промяна на паролата
                    </Button>
                  </Card>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </>
  )
}
