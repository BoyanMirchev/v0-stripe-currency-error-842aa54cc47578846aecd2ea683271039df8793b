import Header from "@/components/header"
import { Lightbulb, ShoppingCart, Shield, TrendingUp, Zap, Award } from "lucide-react"

export default function AdvicePage() {
  const adviceCategories = [
    {
      icon: ShoppingCart,
      title: "Как да изберете правилния продукт",
      description: "Научете как да откриете най-доброто съотношение качество-цена",
      tips: [
        "Сравнете характеристиките и цените на няколко модела",
        "Прочетете отзиви от реални потребители",
        "Проверете гаранционните условия и поддръжката",
        "Обърнете внимание на енергийната ефективност",
      ],
    },
    {
      icon: Shield,
      title: "Грижа и поддръжка",
      description: "Удължете живота на вашите устройства",
      tips: [
        "Редовно почиствайте устройствата според инструкциите",
        "Използвайте оригинални аксесоари и консумативи",
        "Съхранявайте на подходящо място - избягвайте влага и прах",
        "Правете софтуерни актуализации за оптимална работа",
      ],
    },
    {
      icon: Zap,
      title: "Енергийна ефективност",
      description: "Пестете енергия и опазвайте околната среда",
      tips: [
        "Избирайте уреди с висок клас на енергийна ефективност",
        "Използвайте режими за енергоспестяване",
        "Изключвайте напълно неизползваните уреди",
        "Регулирайте настройките за оптимална консумация",
      ],
    },
    {
      icon: TrendingUp,
      title: "Технологични тенденции",
      description: "Бъдете в крак с най-новите иновации",
      tips: [
        "Следете за най-новите модели и функции",
        "Обмислете дали новите функции си струват допълнителната цена",
        "Проверете съвместимостта с вашите други устройства",
        "Инвестирайте в технологии, които ще са актуални дълго време",
      ],
    },
    {
      icon: Award,
      title: "Гаранция и сервиз",
      description: "Защитете инвестицията си",
      tips: [
        "Запазете гаранционната карта и касовата бележка",
        "Разберете какво покрива гаранцията",
        "Обърнете се към официален сервиз при проблеми",
        "Обмислете допълнителна гаранция за скъпи продукти",
      ],
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Съвети за покупки</h1>
              <p className="text-lg md:text-xl text-white/90">
                Експертни препоръки за разумни решения и дълготрайни инвестиции
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {adviceCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h2>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
                          </div>
                          <span className="text-gray-700 leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Нужда от допълнителна помощ?</h2>
            <p className="text-white/90 mb-6">
              Нашите експерти са на разположение да ви помогнат с избора на идеалния продукт
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Свържете се с нас
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
