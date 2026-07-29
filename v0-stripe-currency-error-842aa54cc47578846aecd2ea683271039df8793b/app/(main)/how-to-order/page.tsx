"use client"

import { ShoppingCart, CreditCard, Package, CheckCircle, MapPin, Search } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

const steps = [
  {
    icon: Search,
    title: "1. Изберете продукти",
    description: "Разгледайте нашия каталог и изберете желаните от вас продукти",
    details: [
      "Използвайте търсачката или категориите за навигация",
      "Сравнете характеристики и цени",
      "Прочетете отзиви от други клиенти",
      "Проверете наличността в магазин или онлайн",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ShoppingCart,
    title: "2. Добавете в количката",
    description: "Кликнете 'Добави в количка' на избраните продукти",
    details: [
      "Прегледайте количката си по всяко време",
      "Променете количеството или премахнете артикули",
      "Виждате общата сума и спестявания",
      "Продължете с пазаруването или преминете към плащане",
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    title: "3. Изберете доставка",
    description: "Посочете адрес за доставка или магазин за получаване",
    details: [
      "Доставка до врата - бърза и удобна",
      "Вземи от магазин - безплатно за всички поръчки",
      "Доставка до офис на Еконт или Спиди",
      "Изберете удобна дата и час за доставка",
    ],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: CreditCard,
    title: "4. Платете",
    description: "Изберете удобен за вас начин на плащане",
    details: [
      "Карта онлайн - Visa, Mastercard, Maestro",
      "Google Pay и Apple Pay",
      "Банков превод чрез ePay.bg",
      "Наложен платеж при получаване",
      "На изплащане с 0% лихва",
    ],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Package,
    title: "5. Проследете доставката",
    description: "Получете tracking номер и проследете пратката си",
    details: [
      "SMS и имейл с потвърждение на поръчката",
      "Tracking номер за проследяване в реално време",
      "Известия при промяна на статуса",
      "Контакт с куриера при необходимост",
    ],
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: CheckCircle,
    title: "6. Получете и се радвайте",
    description: "Получете вашите продукти и започнете да ги използвате",
    details: [
      "Проверете продуктите при получаване",
      "Всички документи и гаранция са приложени",
      "14 дни право на връщане",
      "Оценете продукта и споделете мнение",
    ],
    gradient: "from-teal-500 to-cyan-500",
  },
]

export default function HowToOrderPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="container mx-auto px-4 py-12 md:py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Как да поръчам</h1>
              <p className="text-lg md:text-xl text-white/90">
                Поръчването е лесно и бързо. Следвайте тези 6 прости стъпки
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Начало
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Как да поръчам</span>
          </div>
        </div>

        {/* Steps */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600 mb-4 text-lg">{step.description}</p>

                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-3">
                                <div
                                  className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.gradient}`}
                                ></div>
                                <span className="text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Готови ли сте да направите поръчка?</h3>
              <p className="text-white/90 mb-6 text-lg">Започнете да пазарувате сега</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Разгледай продукти
                </Link>
                <Link
                  href="/faq"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-colors text-lg"
                >
                  Често задавани въпроси
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
