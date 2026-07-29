"use client"

import { Recycle, Leaf, RefreshCw, Award, MapPin, Package } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"

const benefits = [
  {
    icon: Leaf,
    title: "Опазване на околната среда",
    description: "Рециклирането на електроника предотвратява замърсяването на почвата и водите с токсични вещества",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: RefreshCw,
    title: "Повторна употреба на материали",
    description: "Извличаме ценни материали като метали, пластмаси и стъкло за повторна употреба",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Социална отговорност",
    description: "Партнираме с екологични организации за правилно третиране на електронни отпадъци",
    gradient: "from-purple-500 to-pink-500",
  },
]

const acceptedItems = [
  "Мобилни телефони и таблети",
  "Лаптопи и компютри",
  "Телевизори и монитори",
  "Домакински уреди (малки и големи)",
  "Аудио и видео техника",
  "Батерии и акумулатори",
  "Кабели и аксесоари",
  "Принтери и скенери",
]

const howItWorks = [
  {
    icon: Package,
    title: "Подгответе уредите",
    description: "Изключете и опаковайте старите си електронни уреди",
  },
  {
    icon: MapPin,
    title: "Донесете в магазин",
    description: "Предайте ги в някой от нашите магазини безплатно",
  },
  {
    icon: Recycle,
    title: "Ние се грижим за рециклирането",
    description: "Предаваме уредите на лицензирани партньори за рециклиране",
  },
]

export default function RecyclePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="container mx-auto px-4 py-12 md:py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
                <Recycle className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Рециклиране на електроника</h1>
              <p className="text-lg md:text-xl text-white/90">
                Грижим се за околната среда заедно. Донесете старите си уреди за безплатно рециклиране
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Начало
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Рециклиране</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Защо е важно рециклирането?</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Accepted Items */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Какво приемаме за рециклиране?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {acceptedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span className="text-gray-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How it Works */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Как работи?</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {howItWorks.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Important Info */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-amber-200 mb-12">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Важна информация</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>Уредите трябва да бъдат без лични данни (форматирани)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>Не е необходимо уредите да са работещи</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>Батериите се рециклират отделно</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>Получавате сертификат за рециклиране при поискване</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Помогнете за чиста планета</h3>
              <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
                Всеки рециклиран уред е крачка към по-чиста околна среда. Намерете най-близкия магазин и донесете
                старите си електронни уреди днес
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/stores"
                  className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Намери магазин
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-colors text-lg"
                >
                  Свържи се с нас
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
