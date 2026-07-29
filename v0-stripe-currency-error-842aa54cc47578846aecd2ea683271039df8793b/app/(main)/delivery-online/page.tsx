import Header from "@/components/header"
import { ShoppingCart, Package, MapPin, CreditCard, CheckCircle, Clock } from "lucide-react"

export default function DeliveryOnlinePage() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Избор на продукт",
      description: "Добавете желаните продукти в количката",
    },
    {
      icon: MapPin,
      title: "Адрес за доставка",
      description: "Въведете точен адрес и телефон за контакт",
    },
    {
      icon: CreditCard,
      title: "Плащане",
      description: "Изберете удобен за вас метод на плащане",
    },
    {
      icon: Package,
      title: "Обработка",
      description: "Подготвяме поръчката ви за изпращане",
    },
    {
      icon: CheckCircle,
      title: "Доставка",
      description: "Получавате продуктите до посочения адрес",
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Доставка при онлайн покупка</h1>
              <p className="text-lg md:text-xl text-white/90">Бърза и удобна доставка директно до вашата врата</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Как работи доставката</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center relative">
                      <step.icon className="w-7 h-7 text-white relative z-10" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-sm font-bold text-indigo-600">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <Clock className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Срокове за доставка</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• София: 1-2 работни дни</li>
                  <li>• Областни градове: 2-3 работни дни</li>
                  <li>• Малки населени места: 3-4 работни дни</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold mb-2">БЕЗПЛАТНА</div>
                <p className="text-white/90 text-lg">доставка за поръчки над 50 лв</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
