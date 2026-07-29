import Header from "@/components/header"
import { Truck, Package, MapPin, Clock, Phone, Shield } from "lucide-react"

export default function TransportPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Транспорт и логистика</h1>
              <p className="text-lg md:text-xl text-white/90">Бърза и сигурна доставка до всяка точка на страната</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Transport Options */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Транспортни опции</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Стандартна доставка</h3>
                    <p className="text-gray-600 mb-2">Доставка в рамките на 1-4 работни дни</p>
                    <p className="text-sm text-gray-500">Безплатна доставка за поръчки над 50 лв</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Експресна доставка</h3>
                    <p className="text-gray-600 mb-2">Доставка на следващия работен ден</p>
                    <p className="text-sm text-gray-500">Налична за София и големите градове</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Доставка до офис на куриер</h3>
                    <p className="text-gray-600 mb-2">Вземете пратката си от удобен за вас офис</p>
                    <p className="text-sm text-gray-500">Над 1000 офиса в цялата страна</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Map */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-green-600" />
                Покритие
              </h2>
              <p className="text-gray-600 mb-4">
                Доставяме до всички населени места в България. Специални условия за доставка на големи и тежки продукти
                като автомобили и техника.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">София и областни градове</h4>
                  <p className="text-sm text-green-700">Доставка до 24 часа</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Останала част на страната</h4>
                  <p className="text-sm text-blue-700">Доставка до 2-4 работни дни</p>
                </div>
              </div>
            </div>

            {/* Safety */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-12 h-12" />
                <h2 className="text-2xl font-bold">Сигурност на пратката</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>Всички пратки са застраховани</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>Проследяване в реално време</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>SMS уведомяване преди доставка</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Въпроси за доставката?</h3>
              <p className="text-gray-600 mb-4">Нашият екип е на разположение 24/7</p>
              <a
                href="tel:+359700123456"
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                0700 123 456
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
