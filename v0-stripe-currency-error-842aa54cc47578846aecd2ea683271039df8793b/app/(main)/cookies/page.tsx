import Header from "@/components/header"
import { Cookie, CheckCircle2, Info, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CookiesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-600 to-orange-600 text-white py-12 md:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Cookie className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Политика за бисквитките</h1>
              <p className="text-xl text-amber-100">Как използваме "бисквитки" за подобряване на вашето изживяване</p>
            </div>
          </div>
        </section>

        {/* What are Cookies */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
                <div className="flex gap-4">
                  <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Какво са "бисквитките"?</h3>
                    <p className="text-amber-800 text-sm">
                      "Бисквитките" (cookies) са малки текстови файлове, които се съхраняват на вашето устройство когато
                      посещавате уебсайт. Те помагат на сайта да запомня вашите предпочитания и да подобри вашето
                      изживяване.
                    </p>
                  </div>
                </div>
              </div>

              {/* Types of Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8 text-center">Видове бисквитки</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Необходими бисквитки",
                      icon: <CheckCircle2 className="h-8 w-8" />,
                      description: "Необходими за функционирането на сайта. Без тях някои функции няма да работят.",
                      examples: ["Автентикация", "Сесии", "Предпочитания за сигурност"],
                      gradient: "from-green-500 to-emerald-500",
                    },
                    {
                      title: "Функционални бисквитки",
                      icon: <Settings className="h-8 w-8" />,
                      description: "Запомнят вашите предпочитания и персонализират изживяването.",
                      examples: ["Езикови настройки", "Регион", "История на търсене"],
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      title: "Аналитични бисквитки",
                      icon: <Info className="h-8 w-8" />,
                      description: "Помагат ни да разберем как използвате сайта и да го подобрим.",
                      examples: ["Google Analytics", "Статистика на посещенията", "Поведение на потребителите"],
                      gradient: "from-purple-500 to-pink-500",
                    },
                    {
                      title: "Рекламни бисквитки",
                      icon: <Cookie className="h-8 w-8" />,
                      description: "Използват се за показване на персонализирани реклами.",
                      examples: ["Ретаргетинг", "Рекламни кампании", "Партньорски мрежи"],
                      gradient: "from-orange-500 to-red-500",
                    },
                  ].map((cookie, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${cookie.gradient} text-white mb-4`}
                      >
                        {cookie.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{cookie.title}</h3>
                      <p className="text-gray-600 mb-4">{cookie.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Примери:</p>
                        <ul className="space-y-1">
                          {cookie.examples.map((example, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-8">
                {[
                  {
                    title: "Как използваме бисквитките",
                    content: `Използваме бисквитки за да:`,
                    list: [
                      "Осигурим основни функции на сайта (вход, количка, навигация)",
                      "Запомним вашите предпочитания и настройки",
                      "Анализираме трафика и подобрим нашите услуги",
                      "Персонализираме съдържанието и рекламите",
                      "Осигурим сигурност и предотвратим злоупотреби",
                    ],
                  },
                  {
                    title: "Управление на бисквитките",
                    content: `Можете да контролирате и управлявате бисквитките по няколко начина:`,
                    list: [
                      "Чрез настройките на вашия браузър (Chrome, Firefox, Safari, Edge)",
                      "Чрез нашия инструмент за управление на бисквитки",
                      "Изтриване на съществуващи бисквитки",
                      "Блокиране на бъдещи бисквитки",
                    ],
                  },
                  {
                    title: "Трети страни",
                    content: `Някои бисквитки се поставят от трети страни, когато използвате нашия сайт:`,
                    list: [
                      "Google Analytics - за анализ на трафика",
                      "Facebook Pixel - за рекламни кампании",
                      "Платежни системи - за обработка на плащания",
                      "Доставчици на съдържание - за вградено съдържание",
                    ],
                  },
                  {
                    title: "Вашите права",
                    content: `Съгласно GDPR имате право да:`,
                    list: [
                      "Откажете използването на неприщими бисквитки",
                      "Изтриете съществуващи бисквитки по всяко време",
                      "Промените вашите предпочитания",
                      "Поискате информация за съхранените данни",
                    ],
                  },
                  {
                    title: "Промени в политиката",
                    content: `Ние можем да актуализираме тази политика периодично. При значими промени ще ви уведомим чрез:`,
                    list: [
                      "Известие на уебсайта",
                      "Email (ако сте регистриран потребител)",
                      "Банер при следващото ви посещение",
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <p className="text-gray-700 mb-4">{section.content}</p>
                    <ul className="space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="mt-12 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Имате въпроси?</h2>
                <p className="mb-6 text-amber-100">
                  За допълнителна информация относно нашата политика за бисквитки, моля свържете се с нас
                </p>
                <Button className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-6 text-lg rounded-xl">
                  Свържи се с нас
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
