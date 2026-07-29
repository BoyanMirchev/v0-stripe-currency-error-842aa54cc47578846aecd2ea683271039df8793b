import Header from "@/components/header"
import { RotateCcw, Clock, CheckCircle, AlertTriangle, Package, XCircle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Връщане на поръчка</h1>
              <p className="text-lg md:text-xl text-white/90">Лесна процедура за връщане в рамките на 14 дни</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Return Period */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <Clock className="w-12 h-12 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">14 дни за връщане</h2>
                  <p className="text-gray-600">Имате право да върнете продукта без да посочвате причина</p>
                </div>
              </div>
            </div>

            {/* How to Return */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Как да върна продукт</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Свържете се с нас</h3>
                    <p className="text-gray-600">
                      Попълнете формуляр за връщане на нашия сайт или се обадете на 0700 123 456
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Опаковайте продукта</h3>
                    <p className="text-gray-600">
                      Продуктът трябва да е в оригинална опаковка с всички аксесоари и документи
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Изпратете обратно</h3>
                    <p className="text-gray-600">Изпратете продукта с куриер или го върнете в магазин</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Получете възстановяване</h3>
                    <p className="text-gray-600">След проверка на продукта, ще върнем парите в рамките на 14 дни</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-lg text-green-900">Приемаме връщане</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Продукт в оригинална опаковка</li>
                  <li>• Неизползван продукт</li>
                  <li>• С всички аксесоари</li>
                  <li>• С фактура или касова бележка</li>
                  <li>• В рамките на 14 дни</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h3 className="font-bold text-lg text-red-900">Не приемаме връщане</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Използвани продукти</li>
                  <li>• Повредена опаковка</li>
                  <li>• Липсващи части</li>
                  <li>• Персонализирани продукти</li>
                  <li>• След 14-дневния срок</li>
                </ul>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-3 text-amber-900">Важна информация</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Разходите за обратна доставка са за сметка на купувача</li>
                    <li>• Парите се възстановяват по същия начин, по който са платени</li>
                    <li>• За гаранционни рекламации разходите са за наша сметка</li>
                    <li>• Запазете номера за проследяване на пратката</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <Package className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Готови да върнете продукт?</h3>
              <p className="text-gray-600 mb-6">Свържете се с нас и ще ви помогнем с процедурата</p>
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-red-700 hover:to-orange-700 transition-all"
              >
                Контакти
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
