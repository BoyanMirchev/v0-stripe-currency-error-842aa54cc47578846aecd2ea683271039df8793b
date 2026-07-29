import Header from "@/components/header"
import { Shield, CheckCircle2, Lock, Eye, UserCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-12 md:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Политика за защита на личните данни</h1>
              <p className="text-xl text-emerald-100">Вашата поверителност е наш приоритет</p>
            </div>
          </div>
        </section>

        {/* Key Principles */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-12">
                <div className="flex gap-4">
                  <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 mb-2">Нашето задължение</h3>
                    <p className="text-emerald-800 text-sm">
                      КЕШ се задължава да защитава вашите лични данни в съответствие с Регламент (ЕС) 2016/679 (GDPR) и
                      Закона за защита на личните данни в България.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Points */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: <Lock className="h-8 w-8" />,
                    title: "Сигурност",
                    description: "Използваме модерни технологии за защита на вашите данни",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <Eye className="h-8 w-8" />,
                    title: "Прозрачност",
                    description: "Винаги ви информираме как използваме вашите данни",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: <UserCheck className="h-8 w-8" />,
                    title: "Контрол",
                    description: "Вие имате пълен контрол над вашите лични данни",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((point, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${point.gradient} text-white mb-4 mx-auto`}
                    >
                      {point.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{point.title}</h3>
                    <p className="text-gray-600 text-sm">{point.description}</p>
                  </div>
                ))}
              </div>

              {/* Detailed Sections */}
              <div className="space-y-8">
                {[
                  {
                    title: "1. Администратор на лични данни",
                    content: `Администратор на вашите лични данни е КЕШ ООД, със седалище в гр. София, ул. Примерна 123. 
                    За въпроси относно обработката на вашите данни можете да се свържете с нас на: privacy@kesh.bg`,
                  },
                  {
                    title: "2. Какви данни събираме",
                    content: `Събираме следните категории лични данни:`,
                    list: [
                      "Идентификационни данни (име, адрес, телефон, email)",
                      "Платежни данни (методи на плащане, банкови реквизити)",
                      "Данни за поръчките (история, предпочитания)",
                      "Технически данни (IP адрес, тип браузър, устройство)",
                      "Данни от комуникация (съобщения, обратна връзка)",
                      "Маркетингови предпочитания",
                    ],
                  },
                  {
                    title: "3. Защо събираме вашите данни",
                    content: `Обработваме вашите лични данни за следните цели:`,
                    list: [
                      "Обработка и изпълнение на поръчки",
                      "Комуникация относно поръчки и услуги",
                      "Подобряване на нашите услуги и продукти",
                      "Персонализиране на вашето изживяване",
                      "Маркетинг и промоции (с ваше съгласие)",
                      "Изпълнение на законови задължения",
                      "Предотвратяване на измами и злоупотреби",
                    ],
                  },
                  {
                    title: "4. Правно основание",
                    content: `Обработваме вашите данни на базата на:`,
                    list: [
                      "Договор - за изпълнение на поръчки и услуги",
                      "Законово задължение - за счетоводни и данъчни цели",
                      "Съгласие - за маркетингови комуникации",
                      "Легитимен интерес - за подобряване на услугите",
                    ],
                  },
                  {
                    title: "5. С кого споделяме вашите данни",
                    content: `Можем да споделим вашите данни с:`,
                    list: [
                      "Куриерски компании - за доставка на поръчки",
                      "Платежни системи - за обработка на плащания",
                      "Банки и финансови институции - за плащания на изплащане",
                      "IT доставчици - за поддръжка на системите",
                      "Маркетингови партньори - с ваше изрично съгласие",
                      "Държавни органи - при законово изискване",
                    ],
                  },
                  {
                    title: "6. Колко дълго съхраняваме данните",
                    content: `Съхраняваме вашите лични данни:`,
                    list: [
                      "Данни за поръчки - 5 години (счетоводни цели)",
                      "Маркетингови данни - до оттегляне на съгласие",
                      "Технически данни - до 24 месеца",
                      "Профилни данни - до изтриване на акаунта",
                    ],
                  },
                  {
                    title: "7. Вашите права",
                    content: `Съгласно GDPR имате следните права:`,
                    list: [
                      "Право на достъп - да получите копие от вашите данни",
                      "Право на коригиране - да поправите неточни данни",
                      "Право на изтриване - да поискате изтриване на данните",
                      "Право на ограничаване - да ограничите обработката",
                      "Право на преносимост - да получите данните в структуриран формат",
                      "Право на възражение - да възразите срещу обработката",
                      "Право да оттеглите съгласие - по всяко време",
                    ],
                  },
                  {
                    title: "8. Сигурност на данните",
                    content: `Прилагаме следните мерки за сигурност:`,
                    list: [
                      "SSL криптиране на всички транзакции",
                      "Защитени сървъри и бази данни",
                      "Редовни одити на сигурността",
                      "Ограничен достъп до личните данни",
                      "Обучение на персонала за защита на данните",
                    ],
                  },
                  {
                    title: "9. Деца",
                    content: `Нашите услуги не са предназначени за лица под 16 години. Не събираме съзнателно лични данни от деца. 
                    При установяване на такива данни, те ще бъдат изтрити незабавно.`,
                  },
                  {
                    title: "10. Промени в политиката",
                    content: `Можем да актуализираме тази политика периодично. При значителни промени ще ви уведомим чрез 
                    email или банер на уебсайта. Последната актуализация е отбелязана в началото на документа.`,
                  },
                  {
                    title: "11. Свържете се с нас",
                    content: `За въпроси относно тази политика или вашите права:`,
                    list: [
                      "Email: privacy@kesh.bg",
                      "Телефон: +359 2 XXX XXXX",
                      "Адрес: гр. София, ул. Примерна 123",
                      "Работно време: Пон-Пет 9:00-18:00",
                    ],
                  },
                ].map((section, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                    {section.list && (
                      <ul className="space-y-2">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Warning Box */}
              <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Подаване на жалба</h3>
                    <p className="text-amber-800 text-sm">
                      Ако смятате, че вашите права по GDPR са нарушени, имате право да подадете жалба в Комисията за
                      защита на личните данни (КЗЛД) на адрес: София 1592, бул. "Проф. Цветан Лазаров" № 2.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Управлявайте вашите данни</h2>
                <p className="mb-6 text-emerald-100">
                  Достъп до вашия профил за управление на лични данни и настройки за поверителност
                </p>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg rounded-xl">
                  Управление на данните
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
