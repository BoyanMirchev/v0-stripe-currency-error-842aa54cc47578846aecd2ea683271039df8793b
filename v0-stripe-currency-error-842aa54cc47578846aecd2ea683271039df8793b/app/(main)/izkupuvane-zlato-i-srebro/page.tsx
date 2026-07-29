"use client"

import { useState, useEffect } from "react"
import { Bell, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Metal price interface
interface MetalPrice {
  id: number
  metal_type: string
  purity: string
  purity_label: string
  price_per_gram: number
  display_order: number
  is_active: boolean
  updated_at: string
}

// Fallback prices data (used while loading or on error)
const fallbackGoldPrices = [
  { product: "1 грам злато проба 375 (9 карата)", price: "46,06 €" },
  { product: "1 грам злато проба 585 (14 карата)", price: "71,86 €" },
  { product: "1 грам злато проба 750 (18 карата)", price: "92,12 €" },
  { product: "1 грам злато проба 917 (22 карата)", price: "112,59 €" },
  { product: "1 грам злато проба 999 (24 карата)", price: "125,08 €" },
]

const fallbackSilverPrices = [
  { product: "1 грам сребро проба 800", price: "1,44 €" },
  { product: "1 грам сребро проба 925", price: "1,66 €" },
  { product: "1 грам сребро проба 999", price: "1,82 €" },
]

const fallbackMetalOptions = [
  { value: "gold-375", label: "1 грам злато проба 375 (9 карата)", pricePerGram: 46.06 },
  { value: "gold-585", label: "1 грам злато проба 585 (14 карата)", pricePerGram: 71.86 },
  { value: "gold-750", label: "1 грам злато проба 750 (18 карата)", pricePerGram: 92.12 },
  { value: "gold-917", label: "1 грам злато проба 917 (22 карата)", pricePerGram: 112.59 },
  { value: "gold-999", label: "1 грам злато проба 999 (24 карата)", pricePerGram: 125.08 },
  { value: "silver-800", label: "1 грам сребро проба 800", pricePerGram: 1.44 },
  { value: "silver-925", label: "1 грам сребро проба 925", pricePerGram: 1.66 },
  { value: "silver-999", label: "1 грам сребро проба 999", pricePerGram: 1.82 },
]

// FAQ data
const faqItems = [
  { question: "Как определяте колко карата е едно изделие?", answer: "Каратите се определят чрез специализирани уреди за анализ на метала, които измерват процента на чисто злато в сплавта." },
  { question: "Защо изисквате документ при продажбата на злато?", answer: "Документът за самоличност е необходим съгласно закона за борба с прането на пари и за да гарантираме легитимността на сделката." },
  { question: "Изкупувате ли скъпоценни камъни или диаманти?", answer: "Да, изкупуваме скъпоценни камъни и диаманти след оценка от нашите експерти." },
  { question: "Защо не мога да продам злато само с разрешително за пребиваване?", answer: "Съгласно българското законодателство, за продажба на благородни метали е необходим валиден документ за самоличност." },
  { question: "Къде става изкупуването на злато?", answer: "Изкупуването се извършва във всички наши физически магазини или чрез дистанционна продажба." },
  { question: "Печатите, поставени върху бижутата, гарантират ли съдържанието на благороден метал в тях?", answer: "Печатите показват пробата на метала, но за точна оценка се използват специализирани уреди." },
  { question: "Какво е карат?", answer: "Каратът е мярка за чистота на златото. 24 карата означава чисто злато, докато 14 карата означава 58.5% чисто злато." },
  { question: "Какво е бяло злато?", answer: "Бялото злато е сплав от злато с бели метали като никел, палладий или сребро, което придава сребрист цвят." },
  { question: "Купувате ли самородно злато?", answer: "Да, изкупуваме самородно злато след оценка и проверка на автентичността." },
  { question: "Търгувате ли с други ценни или редки метали?", answer: "Да, работим с платина, паладий и други благородни метали." },
]

export default function IzkupuvaneZlatoISrebroPage() {
  const [weight, setWeight] = useState("10")
  const [weightUnit, setWeightUnit] = useState("грам")
  const [selectedMetal, setSelectedMetal] = useState("gold-585")
  const [priceTab, setPriceTab] = useState("gold")
  const [calculatorTab, setCalculatorTab] = useState("calculator")

  // Dynamic prices from database
  const [metalPrices, setMetalPrices] = useState<MetalPrice[]>([])
  const [pricesLoading, setPricesLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch prices from database
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/metal-prices")
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setMetalPrices(data)
            // Get the most recent update time
            const latestUpdate = data.reduce((latest: string, price: MetalPrice) => {
              return price.updated_at > latest ? price.updated_at : latest
            }, data[0].updated_at)
            setLastUpdated(latestUpdate)
          }
        }
      } catch (error) {
        console.error("Failed to fetch metal prices:", error)
      } finally {
        setPricesLoading(false)
      }
    }
    fetchPrices()
  }, [])

  // Derived price data from database
  const goldPrices = metalPrices.length > 0
    ? metalPrices
      .filter(p => p.metal_type === "gold")
      .map(p => ({ product: p.purity_label, price: `${Number(p.price_per_gram).toFixed(2).replace(".", ",")} €` }))
    : fallbackGoldPrices

  const silverPrices = metalPrices.length > 0
    ? metalPrices
      .filter(p => p.metal_type === "silver")
      .map(p => ({ product: p.purity_label, price: `${Number(p.price_per_gram).toFixed(2).replace(".", ",")} €` }))
    : fallbackSilverPrices

  const metalOptions = metalPrices.length > 0
    ? metalPrices.map(p => ({
      value: `${p.metal_type}-${p.purity}`,
      label: p.purity_label,
      pricePerGram: Number(p.price_per_gram),
      metalType: p.metal_type
    }))
    : fallbackMetalOptions.map(option => ({
      ...option,
      metalType: option.value.startsWith("gold") ? "gold" : "silver"
    }))

  // Filter metal options based on the selected price tab
  const filteredMetalOptions = metalOptions.filter(
    option => option.metalType === priceTab
  )

  // Sync selected metal when price tab changes
  useEffect(() => {
    const currentSelection = metalOptions.find(m => m.value === selectedMetal)
    if (currentSelection?.metalType !== priceTab) {
      // Select the first option of the new metal type
      const firstOption = filteredMetalOptions[0]
      if (firstOption) {
        setSelectedMetal(firstOption.value)
      }
    }
  }, [priceTab, filteredMetalOptions, metalOptions, selectedMetal])

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Зареждане..."
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "преди по-малко от минута"
    if (diffMins < 60) return `преди ${diffMins} минути`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `преди ${diffHours} часа`
    return date.toLocaleDateString("bg-BG")
  }

  // Calculate total price
  const calculateTotal = () => {
    const metalOption = metalOptions.find((m) => m.value === selectedMetal)
    if (!metalOption) return 0
    const weightValue = parseFloat(weight) || 0
    const multiplier = weightUnit === "унция" ? 31.1035 : 1
    return (weightValue * multiplier * metalOption.pricePerGram).toFixed(2)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20 lg:pt-0">
        {/* Hero Section */}
        <section className="relative bg-black text-white pt-16 lg:pt-20 pb-48 lg:pb-64 overflow-hidden">
          {/* Background jewelry image */}
          <div className="absolute inset-0">
            <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full">
              <Image
                src="/images/gold-silver-hero.jpg"
                alt="Gold and silver jewelry"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Main heading - Centered */}
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6 text-balance">
                Цена на златото - <span className="font-semibold">изкупуване на злато и сребро</span>
                <br />
                калкулатор и графики на борсови цени.
              </h1>
              <p className="text-gray-400 text-lg mb-10">
                Продайте Вашите златни и сребърни бижута, монети, кюлчета и други продукти.
              </p>

              {/* Chart button - dark outlined style */}
              <Button
                variant="outline"
                className="rounded-full border border-gray-500 bg-transparent text-white hover:bg-white hover:text-black hover:border-white px-8 py-6 text-base transition-all duration-300"
              >
                Графика на борсовите цени
              </Button>
            </div>
          </div>
        </section>

        {/* Price Tables and Calculator Section - Floating into hero */}
        <section className="relative z-20 -mt-40 lg:-mt-52 pb-8 lg:pb-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column - Price Tables */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <Tabs value={priceTab} onValueChange={setPriceTab} className="w-full">
                  <TabsList className="w-full h-auto p-0 bg-transparent border-b border-gray-200 rounded-none justify-start">
                    <TabsTrigger
                      value="gold"
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#5B4DC7] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6 text-base font-medium text-gray-400 data-[state=active]:text-gray-900 transition-colors"
                    >
                      Злато
                    </TabsTrigger>
                    <TabsTrigger
                      value="silver"
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#5B4DC7] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-6 text-base font-medium text-gray-400 data-[state=active]:text-gray-900 transition-colors"
                    >
                      Сребро
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="gold" className="mt-0 p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Продукт</th>
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Купуваме</th>
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Известие</th>
                          </tr>
                        </thead>
                        <tbody>
                          {goldPrices.map((item, index) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-900">{item.product}</td>
                              <td className="py-4 px-4 text-gray-900 font-medium">{item.price}</td>
                              <td className="py-4 px-4">
                                <button className="text-gray-400 hover:text-[#5B4DC7] transition-colors">
                                  <Bell className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="silver" className="mt-0 p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Продукт</th>
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Купуваме</th>
                            <th className="text-left py-4 px-4 font-medium text-gray-500 text-sm">Известие</th>
                          </tr>
                        </thead>
                        <tbody>
                          {silverPrices.map((item, index) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="py-4 px-4 text-gray-900">{item.product}</td>
                              <td className="py-4 px-4 text-gray-900 font-medium">{item.price}</td>
                              <td className="py-4 px-4">
                                <button className="text-gray-400 hover:text-[#5B4DC7] transition-colors">
                                  <Bell className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Calculator and Help */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <Tabs value={calculatorTab} onValueChange={setCalculatorTab} className="w-full">
                  <TabsList className="w-full h-auto p-0 bg-transparent border-b border-gray-200 rounded-none flex justify-start">
                    <TabsTrigger
                      value="calculator"
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#5B4DC7] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-5 text-base font-medium text-gray-400 data-[state=active]:text-gray-900 transition-colors"
                    >
                      Калкулатор
                    </TabsTrigger>
                    <TabsTrigger
                      value="help"
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-[#5B4DC7] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-5 text-base font-medium text-gray-400 data-[state=active]:text-gray-900 transition-colors"
                    >
                      Помощ
                    </TabsTrigger>
                    <Link
                      href="/grafika-tseni-zlato-srebro"
                      className="rounded-none border-b-[3px] border-transparent py-4 px-5 text-base font-medium text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                      Графики <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/contact"
                      className="rounded-none border-b-[3px] border-transparent py-4 px-5 text-base font-medium text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                      Контакти <ExternalLink className="w-3 h-3" />
                    </Link>
                  </TabsList>

                  <TabsContent value="calculator" className="mt-0 p-6">
                    <div className="space-y-8">
                      {/* Step 1 - Weight */}
                      <div className="flex items-start gap-6">
                        <span className="text-6xl font-light text-gray-200">1</span>
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 mb-2 block">Въведете тегло</label>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              className="text-3xl font-semibold border-0 border-b-2 border-gray-200 rounded-none focus:border-[#5B4DC7] focus:ring-0 p-0 h-auto"
                            />
                            <Select value={weightUnit} onValueChange={setWeightUnit}>
                              <SelectTrigger className="w-24 border-0 text-gray-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="грам">грам</SelectItem>
                                <SelectItem value="унция">унция</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 - Metal Type */}
                      <div className="flex items-start gap-6">
                        <span className="text-6xl font-light text-gray-200">2</span>
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 mb-2 block">Изберете чистота на метала</label>
                          <div className="flex items-start gap-4">
                            <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                              <SelectTrigger className="flex-1 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 focus:border-[#5B4DC7] focus:ring-2 focus:ring-[#5B4DC7]/20 text-left h-auto py-3 px-4 transition-all">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white">
                                {filteredMetalOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="py-3 px-4 cursor-pointer hover:bg-gray-50 focus:bg-gray-100 rounded-md mx-1 my-0.5"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-500 max-w-[180px]">
                              Най-разпространени в България са 14-каратовите златни бижута (585).
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 - Total */}
                      <div className="flex items-start gap-6">
                        <span className="text-6xl font-light text-gray-200">3</span>
                        <div className="flex-1">
                          <label className="text-sm text-gray-500 mb-2 block">Обща стойност на артикула</label>
                          <p className="text-4xl font-bold text-gray-900">{calculateTotal()} EUR</p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-6 rounded-full text-base font-medium shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-300">
                        Изпратете заявка за дистанционна продажба
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="help" className="mt-0 p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 px-6">
                          <AccordionTrigger className="text-left text-gray-900 hover:no-underline py-5">
                            <span className="pr-4">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="charts" className="mt-0 p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Преглед на графиките на борсовите цени</p>
                      <Link
                        href="/grafika-tseni-zlato-srebro"
                        className="text-[#5B4DC7] hover:text-[#4a3eb5] font-medium"
                      >
                        Отвори графиките
                      </Link>
                    </div>
                  </TabsContent>

                  <TabsContent value="contacts" className="mt-0 p-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Свържете се с нас за повече информация</p>
                      <Link href="/contact" className="text-[#5B4DC7] hover:text-[#4a3eb5] font-medium">
                        Контакти
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
