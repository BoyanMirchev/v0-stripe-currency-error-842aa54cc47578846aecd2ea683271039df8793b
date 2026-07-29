"use client"

import { HelpCircle, ChevronDown, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"

interface Question {
  q: string
  a: string
}

interface FAQCategory {
  category: string
  icon: string
  questions: Question[]
}

interface FAQContent {
  hero_title: string
  hero_description: string
  search_placeholder: string
  contact_title: string
  contact_subtitle: string
  contact_button_text: string
  contact_button_link: string
  contact_phone: string
  faq_categories: FAQCategory[]
}

const defaultFaqs: FAQCategory[] = [
  {
    category: "Поръчки и доставка",
    icon: "🚚",
    questions: [
      {
        q: "Колко време отнема доставката?",
        a: "Стандартната доставка отнема 1-4 работни дни в зависимост от вашето местоположение. За София доставката обикновено е в рамките на 24 часа.",
      },
      {
        q: "Колко струва доставката?",
        a: "Доставката е безплатна за поръчки над 100 лв. За по-малки поръчки цената е 5.90 лв.",
      },
      {
        q: "Мога ли да проследя моята поръчка?",
        a: "Да, след потвърждение на поръчката ще получите tracking номер по имейл, с който можете да проследите статуса на доставката в реално време.",
      },
      {
        q: "Може ли да сменя адреса за доставка?",
        a: "Да, можете да смените адреса преди изпращането на пратката. Свържете се с нашия екип на телефон или чрез имейл.",
      },
    ],
  },
  {
    category: "Плащане",
    icon: "💳",
    questions: [
      {
        q: "Какви методи за плащане приемате?",
        a: "Приемаме плащане с дебитни и кредитни карти (Visa, Mastercard, Maestro), Google Pay, Apple Pay, ePay.bg и наложен платеж.",
      },
      {
        q: "Безопасно ли е да плащам онлайн?",
        a: "Да, всички онлайн плащания се обработват чрез сигурни криптирани канали и отговарят на международните стандарти за сигурност PCI DSS.",
      },
      {
        q: "Мога ли да купя на изплащане?",
        a: "Да, предлагаме изплащане до 12 месеца с 0% лихва чрез нашите партньори TBI Bank и други финансови институции.",
      },
    ],
  },
  {
    category: "Връщане и рекламация",
    icon: "↩️",
    questions: [
      {
        q: "Мога ли да върна продукт?",
        a: "Да, имате право да върнете продукт в срок от 14 дни от получаването му без да посочвате причина, ако е в оригинална опаковка и не е използван.",
      },
      {
        q: "Как да върна продукт?",
        a: "Свържете се с нашия екип за поддръжка, за да организираме връщането. Можете да върнете продукта в магазин или чрез куриер за наша сметка.",
      },
      {
        q: "Кога ще получа възстановяване на сумата?",
        a: "След получаване и проверка на върнатия продукт, сумата се възстановява в срок до 14 работни дни по същия начин, по който е направено плащането.",
      },
      {
        q: "Какво да направя при дефектен продукт?",
        a: "При дефект в гаранционния срок, можете да направите рекламация в магазин или онлайн. Ще направим безплатен ремонт или замяна на продукта.",
      },
    ],
  },
  {
    category: "Акаунт и поверителност",
    icon: "👤",
    questions: [
      {
        q: "Как да създам акаунт?",
        a: "Кликнете на бутона 'Влез/Регистрация' в горната част на страницата и попълнете необходимата информация. Акаунтът ви дава достъп до история на поръчки, любими продукти и специални оферти.",
      },
      {
        q: "Забравил съм паролата си. Какво да направя?",
        a: "На страницата за вход кликнете на 'Забравена парола' и следвайте инструкциите за възстановяване чрез имейл.",
      },
      {
        q: "Сигурни ли са моите лични данни?",
        a: "Да, вашите лични данни са защитени съгласно GDPR и се използват само за обработка на вашите поръчки. Прочетете нашата политика за поверителност за повече информация.",
      },
    ],
  },
  {
    category: "Продукти и наличност",
    icon: "📦",
    questions: [
      {
        q: "Как да проверя наличността на продукт?",
        a: "Наличността на всеки продукт е показана на страницата му. Можете да видите дали е наличен онлайн или в конкретен магазин.",
      },
      {
        q: "Какво означава 'По заявка'?",
        a: "Това означава, че продуктът не е на склад, но може да бъде поръчан. Срокът за доставка обикновено е 7-14 работни дни.",
      },
      {
        q: "Имате ли гаранция на продуктите?",
        a: "Да, всички продукти имат минимум 2 години гаранция. За някои категории като автомобили гаранцията може да бъде различна.",
      },
    ],
  },
]

const defaultContent: FAQContent = {
  hero_title: "Често задавани въпроси",
  hero_description: "Намерете отговори на най-често задаваните въпроси от нашите клиенти",
  search_placeholder: "Търсене в въпросите...",
  contact_title: "Не намерихте отговор?",
  contact_subtitle: "Свържете се с нашия екип за поддръжка",
  contact_button_text: "Свържете се с нас",
  contact_button_link: "/contact",
  contact_phone: "0700 123 456",
  faq_categories: defaultFaqs,
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [content, setContent] = useState<FAQContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/faq-content")
        if (response.ok) {
          const data = await response.json()
          if (data.faq_categories && data.faq_categories.length > 0) {
            setContent(data)
          }
        }
      } catch (error) {
        console.error("Error fetching FAQ content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const faqs = content.faq_categories

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }))

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Зареждане...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="container mx-auto px-4 py-12 md:py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
                <HelpCircle className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.hero_title}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {content.hero_description}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={content.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Начало
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Често задавани въпроси</span>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                {category.questions.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                    </div>

                    <div className="space-y-3">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex
                        const isOpen = openIndex === globalIndex

                        return (
                          <div
                            key={faqIndex}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                              <ChevronDown
                                className={`w-5 h-5 text-red-600 flex-shrink-0 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}

            {filteredFaqs.every((cat) => cat.questions.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Няма намерени резултати за &quot;{searchQuery}&quot;</p>
              </div>
            )}

            {/* Contact Section */}
            <div className="mt-12 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 md:p-12 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">{content.contact_title}</h3>
              <p className="text-white/90 mb-6">{content.contact_subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={content.contact_button_link}
                  className="px-8 py-3 bg-white text-red-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  {content.contact_button_text}
                </Link>
                <a
                  href={`tel:${content.contact_phone.replace(/\s/g, "")}`}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-colors"
                >
                  {content.contact_phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
