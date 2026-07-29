import Header from "@/components/header"
import { Wrench, Shield, Smartphone, Car, Clock, Award } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Wrench,
      title: "Ремонт и сервиз",
      description: "Професионален ремонт на всички видове техника и автомобили",
      features: [
        "Оригинални резервни части",
        "Сертифицирани специалисти",
        "Гаранция на извършените услуги",
        "Експресен ремонт при възможност",
      ],
    },
    {
      icon: Shield,
      title: "Удължена гаранция",
      description: "Допълнителна защита на вашата инвестиция",
      features: [
        "До 5 години гаранционно покритие",
        "Покриване на случайни повреди",
        "Безплатна подмяна при неизправност",
        "Приоритетно обслужване",
      ],
    },
    {
      icon: Smartphone,
      title: "Инсталация и настройка",
      description: "Помощ при първоначалната настройка на устройствата",
      features: [
        "Настройка на смартфони и таблети",
        "Инсталиране на необходими приложения",
        "Пренасяне на данни от старо устройство",
        "Обучение за основни функции",
      ],
    },
    {
      icon: Car,
      title: "Преглед и диагностика",
      description: "Цялостна проверка на техническото състояние",
      features: [
        "Компютърна диагностика",
        "Проверка на ключови системи",
        "Консултация за необходими действия",
        "Писмен доклад за състоянието",
      ],
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Wrench className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Нашите услуги</h1>
              <p className="text-lg md:text-xl text-white/90">Професионална грижа за вашите продукти</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-rose-600 to-pink-600"></div>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Benefits */}
          <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Clock className="w-12 h-12 text-rose-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Работно време</h3>
              <p className="text-gray-600 mb-3">Нашите сервизни центрове работят:</p>
              <p className="text-gray-700">Понеделник - Петък: 9:00 - 18:00</p>
              <p className="text-gray-700">Събота: 10:00 - 16:00</p>
            </div>

            <div className="bg-gradient-to-br from-rose-600 to-pink-600 text-white rounded-xl p-6 shadow-lg">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="font-bold text-xl mb-2">Гарантирано качество</h3>
              <p className="text-white/90">
                Всички наши услуги се извършват от сертифицирани специалисти с дългогодишен опит. Гарантираме качеството
                на работата и използваме само оригинални резервни части.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Нуждаете се от услуга?</h2>
            <p className="text-gray-600 mb-6">Свържете се с нас или посетете някой от нашите сервизни центрове</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-700 hover:to-pink-700 transition-all"
              >
                Свържете се с нас
              </a>
              <a
                href="/service"
                className="inline-block bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Намери сервиз
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
