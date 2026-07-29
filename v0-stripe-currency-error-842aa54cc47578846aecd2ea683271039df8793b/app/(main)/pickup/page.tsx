import Header from "@/components/header"
import { MapPin, Clock, ShoppingBag, CheckCircle, Store, AlertCircle } from "lucide-react"

export default function PickupPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Вземи от магазин</h1>
              <p className="text-lg md:text-xl text-white/90">Поръчай онлайн и вземи от удобен за теб магазин</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="text-4xl font-bold text-violet-600 mb-2">БЕЗПЛАТНО</div>
                <p className="text-gray-600">Няма разходи за доставка</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="text-4xl font-bold text-violet-600 mb-2">2 ЧАСА</div>
                <p className="text-gray-600">Готово за вземане</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="text-4xl font-bold text-violet-600 mb-2">30+</div>
                <p className="text-gray-600">Магазина в цялата страна</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Как да поръчам за вземане от магазин</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Направете поръчката си онлайн</h3>
                    <p className="text-gray-600">Изберете продуктите, които желаете да закупите</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Изберете магазин</h3>
                    <p className="text-gray-600">
                      При завършване на поръчката изберете опция "Вземи от магазин" и изберете най-удобния за вас адрес
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Получете уведомление</h3>
                    <p className="text-gray-600">След като поръчката е готова за вземане, ще получите SMS и имейл</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Вземете продукта</h3>
                    <p className="text-gray-600">
                      Посетете избрания магазин с валиден документ за самоличност. Платете на място или използвайте
                      онлайн плащане
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-900">Важна информация</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Поръчката се пази в магазина до 7 дни след уведомлението</li>
                    <li>• Необходим е валиден документ за самоличност при вземане</li>
                    <li>• Проверете продукта на място преди да напуснете магазина</li>
                    <li>• При онлайн плащане имате право на връщане в рамките на 14 дни</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Готови за поръчка?</h2>
              <p className="text-white/90 mb-6">Разгледайте нашите магазини и изберете най-близкия до вас</p>
              <a
                href="/stores"
                className="inline-block bg-white text-violet-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Виж магазини
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
