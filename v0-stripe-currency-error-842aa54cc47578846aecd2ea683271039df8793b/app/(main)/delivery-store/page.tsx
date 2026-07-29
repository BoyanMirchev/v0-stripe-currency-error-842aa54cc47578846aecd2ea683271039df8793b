import Header from "@/components/header"
import { Store, Home, Truck, Clock, CheckCircle, Phone } from "lucide-react"

export default function DeliveryStorePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Home className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Доставка до врата при покупка от магазин</h1>
              <p className="text-lg md:text-xl text-white/90">Пазарувайте в магазина и получете доставка до дома</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* How it works */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Как работи услугата</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Посетете нашия магазин</h3>
                    <p className="text-gray-600">
                      Разгледайте продуктите на живо и направете избора си с помощта на нашите консултанти
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Заявете доставка</h3>
                    <p className="text-gray-600">
                      Информирайте продавача, че желаете доставка до дома. Оставете адрес и телефон за контакт
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Платете в магазина</h3>
                    <p className="text-gray-600">Заплатете покупката си удобно на касата с карта или в брой</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Получете продукта</h3>
                    <p className="text-gray-600">Очаквайте доставка на посочения адрес в рамките на 1-2 работни дни</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <Store className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Вижте преди да купите</h3>
                <p className="text-gray-600 text-sm">Разгледайте и тествайте продуктите в магазина</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <Truck className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Удобна доставка</h3>
                <p className="text-gray-600 text-sm">Не се притеснявайте за транспорта</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Експертна помощ</h3>
                <p className="text-gray-600 text-sm">Консултация на място от специалист</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Clock className="w-8 h-8" />
                Цени и срокове
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span>София</span>
                  <span className="font-bold">Безплатна / 1-2 дни</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span>Областни градове</span>
                  <span className="font-bold">10 лв / 2-3 дни</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Малки населени места</span>
                  <span className="font-bold">15 лв / 3-4 дни</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <Phone className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Допълнителни въпроси?</h3>
              <p className="text-gray-600 mb-4">Попитайте нашите продавачи в магазина или се свържете с нас</p>
              <a
                href="/stores"
                className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                Намери магазин
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
