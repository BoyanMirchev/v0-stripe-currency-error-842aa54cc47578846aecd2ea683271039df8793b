"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Brush,
  ReferenceLine,
} from "recharts"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

// Metal types with their configurations
const METALS = {
  gold: {
    id: "gold",
    name: "Инвестиционно злато",
    shortName: "злато",
    symbol: "XAU",
    color: "#d4a012",
    bgColor: "bg-[#2d2640]",
    activeBgColor: "bg-gradient-to-r from-[#2d2640] to-[#3d3650]",
    basePrice: 4086.45,
  },
  silver: {
    id: "silver",
    name: "Сребро",
    shortName: "сребро",
    symbol: "XAG",
    color: "#a8a8a8",
    bgColor: "bg-[#f5f5f5]",
    activeBgColor: "bg-white",
    basePrice: 48.25,
  },
  platinum: {
    id: "platinum",
    name: "Платина",
    shortName: "платина",
    symbol: "XPT",
    color: "#e5e4e2",
    bgColor: "bg-[#f5f5f5]",
    activeBgColor: "bg-white",
    basePrice: 1425.80,
  },
  currency: {
    id: "currency",
    name: "Валута",
    shortName: "валута",
    symbol: "EUR",
    color: "#4CAF50",
    bgColor: "bg-[#f5f5f5]",
    activeBgColor: "bg-white",
    basePrice: 1.0,
  },
}

const CURRENCIES = ["EUR", "USD", "BGN", "GBP", "CHF"]
const PERIODS = [
  { value: "24h", label: "24 часа" },
  { value: "7d", label: "7 дни" },
  { value: "30d", label: "30 дни" },
  { value: "90d", label: "90 дни" },
  { value: "1y", label: "1 година" },
]
const CHART_TYPES = [
  { value: "line", label: "линейна" },
  { value: "area", label: "площна" },
]
const UNITS = [
  { value: "oz", label: "Унции" },
  { value: "gram", label: "Грамове" },
]

// API symbols mapping
const API_SYMBOLS: Record<string, string> = {
  gold: "XAU",
  silver: "XAG", 
  platinum: "XPT",
  currency: "EUR",
}

// Fetch real-time price from gold-api.com (free, no auth required)
async function fetchRealTimePrice(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    const response = await fetch(`https://api.gold-api.com/price/${symbol}`)
    if (!response.ok) throw new Error("API error")
    const data = await response.json()
    return {
      price: data.price || 0,
      change: data.ch || 0,
      changePercent: data.chp || 0,
    }
  } catch {
    return null
  }
}

// Fetch historical price data from gold-api.com
async function fetchHistoricalPrices(
  symbol: string,
  period: string
): Promise<{ time: string; price: number }[]> {
  try {
    // Determine date range based on period
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case "24h":
        startDate.setDate(now.getDate() - 1)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 1)
    }

    const startStr = startDate.toISOString().split("T")[0]
    const endStr = now.toISOString().split("T")[0]

    const response = await fetch(
      `https://api.gold-api.com/price/history?symbol=${symbol}&start=${startStr}&end=${endStr}`
    )
    
    if (!response.ok) throw new Error("API error")
    const data = await response.json()
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: { timestamp: string; price: number }) => {
        const itemDate = new Date(item.timestamp)
        let timeLabel: string
        
        if (period === "24h") {
          timeLabel = itemDate.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
        } else if (period === "7d") {
          timeLabel = itemDate.toLocaleDateString("bg-BG", { weekday: "short", day: "2-digit" })
        } else {
          timeLabel = itemDate.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" })
        }
        
        return {
          time: timeLabel,
          price: item.price,
        }
      })
    }
    return []
  } catch {
    return []
  }
}

// Metal icon components
const GoldIcon = ({ active }: { active: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className={active ? "text-[#d4a012]" : "text-gray-600"}
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const SilverIcon = ({ active }: { active: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className={active ? "text-gray-300" : "text-gray-600"}
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const PlatinumIcon = ({ active }: { active: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className={active ? "text-gray-400" : "text-gray-600"}
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const CurrencyIcon = ({ active }: { active: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className={active ? "text-green-400" : "text-gray-600"}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6v12M8 9h6a2 2 0 010 4H8M8 13h5a2 2 0 010 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function MetalPricesPage() {
  const [selectedMetal, setSelectedMetal] = useState<keyof typeof METALS>("gold")
  const [currency, setCurrency] = useState("EUR")
  const [period, setPeriod] = useState("24h")
  const [chartType, setChartType] = useState("line")
  const [unit, setUnit] = useState("oz")
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>([])
  const [currentPriceData, setCurrentPriceData] = useState<{
    price: number
    change: number
    changePercent: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const metal = METALS[selectedMetal]
  const symbol = API_SYMBOLS[selectedMetal] || "XAU"

  // Fetch real-time price
  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch current price
        const priceResult = await fetchRealTimePrice(symbol)
        if (priceResult) {
          // Apply currency and unit conversions
          const currencyMultiplier = currency === "USD" ? 1.0 : currency === "EUR" ? 0.92 : currency === "BGN" ? 1.80 : currency === "GBP" ? 0.79 : currency === "CHF" ? 0.88 : 1
          const unitMultiplier = unit === "gram" ? 1 / 31.1035 : 1
          
          setCurrentPriceData({
            price: priceResult.price * currencyMultiplier * unitMultiplier,
            change: priceResult.change * currencyMultiplier * unitMultiplier,
            changePercent: priceResult.changePercent,
          })
        }

        // Fetch historical data
        const historyResult = await fetchHistoricalPrices(symbol, period)
        if (historyResult.length > 0) {
          const currencyMultiplier = currency === "USD" ? 1.0 : currency === "EUR" ? 0.92 : currency === "BGN" ? 1.80 : currency === "GBP" ? 0.79 : currency === "CHF" ? 0.88 : 1
          const unitMultiplier = unit === "gram" ? 1 / 31.1035 : 1
          
          setPriceData(
            historyResult.map((item) => ({
              ...item,
              price: item.price * currencyMultiplier * unitMultiplier,
            }))
          )
        } else {
          // If no historical data, generate sample data based on current price
          if (priceResult) {
            const basePrice = priceResult.price
            const currencyMultiplier = currency === "USD" ? 1.0 : currency === "EUR" ? 0.92 : currency === "BGN" ? 1.80 : currency === "GBP" ? 0.79 : currency === "CHF" ? 0.88 : 1
            const unitMultiplier = unit === "gram" ? 1 / 31.1035 : 1
            const adjustedPrice = basePrice * currencyMultiplier * unitMultiplier
            
            // Generate data points for the chart based on period
            let points: number
            let intervalMs: number
            
            switch (period) {
              case "24h":
                points = 48 // Every 30 minutes
                intervalMs = 30 * 60 * 1000
                break
              case "7d":
                points = 42 // Every 4 hours
                intervalMs = 4 * 60 * 60 * 1000
                break
              case "30d":
                points = 30 // Daily
                intervalMs = 24 * 60 * 60 * 1000
                break
              case "90d":
                points = 90 // Daily
                intervalMs = 24 * 60 * 60 * 1000
                break
              case "1y":
                points = 52 // Weekly
                intervalMs = 7 * 24 * 60 * 60 * 1000
                break
              default:
                points = 48
                intervalMs = 30 * 60 * 1000
            }
            
            const now = new Date()
            const data: { time: string; price: number }[] = []
            
            for (let i = points - 1; i >= 0; i--) {
              const variance = (Math.random() - 0.5) * adjustedPrice * 0.02
              const time = new Date(now.getTime() - i * intervalMs)
              
              // Format time label based on period
              let timeLabel: string
              if (period === "24h") {
                timeLabel = time.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
              } else if (period === "7d") {
                timeLabel = time.toLocaleDateString("bg-BG", { weekday: "short", day: "2-digit" })
              } else {
                timeLabel = time.toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" })
              }
              
              data.push({
                time: timeLabel,
                price: adjustedPrice + variance,
              })
            }
            setPriceData(data)
          }
        }
        
        setLastUpdate(new Date())
      } catch {
        setError("Грешка при зареждане на данните")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [selectedMetal, currency, period, unit, symbol])

  // Calculate price statistics from data
  const currentPrice = currentPriceData?.price || priceData[priceData.length - 1]?.price || 0
  const openPrice = priceData[0]?.price || currentPrice
  const priceChange = currentPriceData?.change || (currentPrice - openPrice)
  const priceChangePercent = currentPriceData?.changePercent?.toFixed(1) || (openPrice > 0 ? ((priceChange / openPrice) * 100).toFixed(1) : "0")
  const isPositive = priceChange >= 0

  const MetalTab = ({
    metalKey,
    icon,
    label,
  }: {
    metalKey: keyof typeof METALS
    icon: React.ReactNode
    label: string
  }) => {
    const isActive = selectedMetal === metalKey
    const isGold = metalKey === "gold"

    return (
      <button
        onClick={() => setSelectedMetal(metalKey)}
        className={`relative flex flex-col items-center justify-center py-6 px-4 transition-all w-full ${
          isGold
            ? isActive
              ? "bg-gradient-to-b from-[#1a1528] to-[#0f0d14]"
              : "bg-[#1a1528] hover:bg-[#252035]"
            : isActive
              ? "bg-[#111111]"
              : "bg-[#0a0a0a] hover:bg-[#151515]"
        }`}
      >
        {isActive && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-l-[#d4a012] border-t-transparent border-b-transparent hidden lg:block"
            style={{ right: "-1px", zIndex: 10 }}
          />
        )}
        <div className="mb-2">{icon}</div>
        <span className={`text-sm font-medium text-center leading-tight ${
          isActive 
            ? isGold 
              ? "text-[#d4a012]" 
              : "text-white"
            : "text-gray-500"
        }`}>
          {label}
        </span>
      </button>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <Header />

      {/* Hero section */}
      <section className="pt-24 lg:pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Графика – злато, сребро и платина
            </h1>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-800">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">
                Последно обновени цени: току-що
              </span>
            </div>
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Разберете тенденциите и бъдете в крак със световните пазари. KESH Charts Ви
            позволява да анализирате пазара и да вземате умни решения. Персонализирайте
            графиките и действайте!
          </p>
          <Link href="/gold">
            <Button
              variant="outline"
              className="border border-gray-700 hover:border-[#d4a012] bg-transparent rounded-full px-8 py-2.5 h-auto text-white hover:text-[#d4a012] transition-colors"
            >
              Цени за изкупуване на грам
            </Button>
          </Link>
        </div>
      </section>

      {/* Chart section */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Left sidebar - Metal tabs */}
            <div className="lg:w-[180px] flex lg:flex-col flex-row border-b lg:border-b-0 lg:border-r border-gray-800">
              <MetalTab
                metalKey="gold"
                icon={<GoldIcon active={selectedMetal === "gold"} />}
                label="Инвестиционно злато"
              />
              <MetalTab
                metalKey="silver"
                icon={<SilverIcon active={selectedMetal === "silver"} />}
                label="Сребро"
              />
              <MetalTab
                metalKey="platinum"
                icon={<PlatinumIcon active={selectedMetal === "platinum"} />}
                label="Платина"
              />
              <MetalTab
                metalKey="currency"
                icon={<CurrencyIcon active={selectedMetal === "currency"} />}
                label="Валута"
              />
            </div>

            {/* Main chart area */}
            <div className="flex-1 p-4 lg:p-6 bg-[#111111]">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-800">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#d4a012] font-medium uppercase tracking-wider">Валута</span>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[100px] h-10 bg-[#1a1a1a] border-gray-700 text-white hover:border-[#d4a012]/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-white hover:bg-[#252525] focus:bg-[#252525] focus:text-[#d4a012]">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#d4a012] font-medium uppercase tracking-wider">Период</span>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[120px] h-10 bg-[#1a1a1a] border-gray-700 text-white hover:border-[#d4a012]/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700">
                      {PERIODS.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-white hover:bg-[#252525] focus:bg-[#252525] focus:text-[#d4a012]">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#d4a012] font-medium uppercase tracking-wider">Вид графика</span>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-[120px] h-10 bg-[#1a1a1a] border-gray-700 text-white hover:border-[#d4a012]/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700">
                      {CHART_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-white hover:bg-[#252525] focus:bg-[#252525] focus:text-[#d4a012]">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[#d4a012] font-medium uppercase tracking-wider">Мерна ед.</span>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-[100px] h-10 bg-[#1a1a1a] border-gray-700 text-white hover:border-[#d4a012]/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-700">
                      {UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value} className="text-white hover:bg-[#252525] focus:bg-[#252525] focus:text-[#d4a012]">
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#d4a012] hover:bg-[#1a1a1a] rounded-full border border-gray-700 hover:border-[#d4a012]/50 transition-colors">
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Price info row */}
              <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {metal.name}/{currency}
                  </h2>
                  <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
                    <span className="text-gray-500">
                      Цена на отваряне: <strong className="text-gray-300">{openPrice.toFixed(2)}</strong>
                    </span>
                    <span className="text-gray-500">
                      Цена на затваряне: <strong className="text-gray-300">{currentPrice.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3">
                  <div className="text-sm text-gray-400 mb-1">
                    Текуща цена{" "}
                    <span className="font-bold text-white text-lg">
                      {currentPrice.toFixed(2)} {currency} / {unit}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-sm font-semibold ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {priceChange.toFixed(2)} {currency} / {unit} {isPositive ? "+" : ""}
                      {priceChangePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="relative bg-[#0a0a0a] rounded-xl p-4 border border-gray-800">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 rounded-xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-gray-700 border-t-[#d4a012] rounded-full animate-spin" />
                      <span className="text-sm text-gray-400">Зареждане на данни...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 rounded-xl">
                    <div className="text-center">
                      <p className="text-red-400 mb-3">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="text-sm text-[#d4a012] hover:underline"
                      >
                        Опитайте отново
                      </button>
                    </div>
                  </div>
                )}

                <div className="h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "area" ? (
                      <AreaChart
                        data={priceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id={`gradient-${selectedMetal}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={metal.color} stopOpacity={0.4} />
                            <stop offset="100%" stopColor={metal.color} stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 11, fill: "#666" }}
                          tickLine={{ stroke: "#333" }}
                          axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                          domain={["dataMin - 10", "dataMax + 10"]}
                          tick={{ fontSize: 11, fill: "#666" }}
                          tickLine={{ stroke: "#333" }}
                          axisLine={{ stroke: "#333" }}
                          tickFormatter={(value) => value.toFixed(0)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          }}
                          labelStyle={{ color: "#999" }}
                          itemStyle={{ color: "#d4a012" }}
                          formatter={(value: number) => [
                            `${value.toFixed(2)} ${currency}`,
                            "Цена",
                          ]}
                          labelFormatter={(label) => `Време: ${label}`}
                        />
                        <ReferenceLine y={openPrice} stroke="#444" strokeDasharray="5 5" />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={metal.color}
                          strokeWidth={2}
                          fill={`url(#gradient-${selectedMetal})`}
                          activeDot={{ r: 6, fill: metal.color, stroke: "#000", strokeWidth: 2 }}
                        />
                        <Brush
                          dataKey="time"
                          height={40}
                          stroke={metal.color}
                          fill="#111"
                          travellerWidth={10}
                        />
                      </AreaChart>
                    ) : (
                      <LineChart
                        data={priceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 11, fill: "#666" }}
                          tickLine={{ stroke: "#333" }}
                          axisLine={{ stroke: "#333" }}
                        />
                        <YAxis
                          domain={["dataMin - 10", "dataMax + 10"]}
                          tick={{ fontSize: 11, fill: "#666" }}
                          tickLine={{ stroke: "#333" }}
                          axisLine={{ stroke: "#333" }}
                          tickFormatter={(value) => value.toFixed(0)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          }}
                          labelStyle={{ color: "#999" }}
                          itemStyle={{ color: "#d4a012" }}
                          formatter={(value: number) => [
                            `${value.toFixed(2)} ${currency}`,
                            "Цена",
                          ]}
                          labelFormatter={(label) => `Време: ${label}`}
                        />
                        <ReferenceLine y={openPrice} stroke="#444" strokeDasharray="5 5" />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke={metal.color}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: metal.color, stroke: "#000", strokeWidth: 2 }}
                        />
                        <Brush
                          dataKey="time"
                          height={40}
                          stroke={metal.color}
                          fill="#111"
                          travellerWidth={10}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
