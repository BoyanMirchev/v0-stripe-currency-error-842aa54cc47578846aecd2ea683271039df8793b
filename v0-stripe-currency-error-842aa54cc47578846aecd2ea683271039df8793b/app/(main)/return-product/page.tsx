"use client"

import { RotateCcw, Clock, CheckCircle2, Phone, Package } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

const returnSteps = [
  {
    icon: Phone,
    title: "Свържете се с нас",
    description: "Свържете се с нашия екип за поддръжка",
    details: "Телефон: 0700 123 456 или имейл: support@kesh.bg",
  },
  {
    icon: Package,
    title: "Опаковайте продукта",
    description: "Подгответе продукта за връщане",
    details: "Продуктът трябва да е в оригинална опаковка и неизползван",
  },
  {
    icon: RotateCcw,
    title: "Изпратете обратно",
    description: "Изберете начин за връщане",
    details: "Връщане в магазин или чрез куриер за наша сметка",
  },
  {
    icon: CheckCircle2,
    title: "Получете възстановяване",
    description: "Получете парите обратно",
    details: "До 14 работни дни след получаване на продукта",
  },
]

const conditions = [
  {
    icon: "✅",
    title: "14 дни за връщане",
    description: "Имате 14 дни от получаването на продукта да го върнете без да посочвате причина",
  },
  {
    icon: "📦",
    title: "Оригинална опаковка",
    description: "Продуктът трябва да е в оригинална опаковка с всички аксесоари и документи",
  },
  {
    icon: "🆕",
    title: "Неизползван продукт",
    description: "Продуктът не трябва да показва следи от употреба или повреди",
  },
  {
    icon: "🧾",
    title: "Фактура/Касова бележка",
    description: "Необходимо е да предоставите доказателство за покупка",
  },
]

export default function ReturnProductPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="container mx-auto px-4 py-12 md:py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
                <RotateCcw className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Как да върна продукт?</h1>
              <p className="text-lg md:text-xl text-white/90">
                Връщането на продукт е лесно и безпроблемно. 14 дни право на връщане
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Начало
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Как да върна продукт</span>
          </div>
        </div>

        {/* Conditions */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Условия за връщане</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {conditions.map((condition, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{condition.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{condition.title}</h3>
                      <p className="text-gray-600">{condition.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Steps */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Стъпки за връщане</h2>
            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-red-200 to-pink-200 -translate-x-1/2"></div>

              <div className="space-y-8">
                {returnSteps.map((step, index) => {
                  const Icon = step.icon
                  const isEven = index % 2 === 0
                  return (
                    <div key={index} className="relative">
                      <div
                        className={`flex flex-col md:flex-row items-center gap-6 ${!isEven ? "md:flex-row-reverse" : ""}`}
                      >
                        {/* Content */}
                        <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600 mb-2">{step.description}</p>
                            <p className="text-sm text-gray-500">{step.details}</p>
                          </div>
                        </div>

                        {/* Icon */}
                        <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Spacer */}
                        <div className="hidden md:block flex-1"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Важна информация</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Транспортните разходи при връщане са за наша сметка</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Възстановяването се извършва по същия начин, по който е направено плащането</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>При покупка с наложен платеж, необходима е банкова сметка за възстановяване</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Продукти на промоция се връщат при същите условия</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Нуждаете се от помощ?</h3>
              <p className="text-white/90 mb-6 text-lg">Нашият екип е на ваше разположение</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-orange-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Свържете се с нас
                </Link>
                <a
                  href="tel:+359700123456"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-colors text-lg"
                >
                  📞 0700 123 456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
