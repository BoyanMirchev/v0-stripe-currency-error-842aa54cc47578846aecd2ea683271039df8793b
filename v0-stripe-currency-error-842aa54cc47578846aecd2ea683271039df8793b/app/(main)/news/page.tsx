import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Newspaper, Calendar, ArrowRight, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: "Нов магазин в София",
      excerpt: "Радваме се да обявим отварянето на нашия нов магазин в центъра на София",
      date: "10 Януари 2026",
      category: "Магазини",
      image: "/modern-electronics-store.png",
    },
    {
      id: 2,
      title: "Зимна промоция - до 50% отстъпка",
      excerpt: "Не пропускайте нашата зимна разпродажба с отстъпки до 50% на избрани продукти",
      date: "5 Януари 2026",
      category: "Промоции",
      image: "/winter-sale-discount-promotion.jpg",
    },
    {
      id: 3,
      title: "Нови марки в портфолиото",
      excerpt: "Добавихме още 15 водещи марки в нашия асортимент от електроника и техника",
      date: "28 Декември 2025",
      category: "Продукти",
      image: "/premium-electronics-brands.jpg",
    },
    {
      id: 4,
      title: "Подобрена доставка в страната",
      excerpt: "Въведохме експресна доставка за София и Пловдив - получи поръчката си до 24 часа",
      date: "20 Декември 2025",
      category: "Услуги",
      image: "/fast-delivery.png",
    },
    {
      id: 5,
      title: "Коледна кампания 2025",
      excerpt: "Благодарим на всички клиенти за успешната коледна кампания",
      date: "15 Декември 2025",
      category: "Събития",
      image: "/christmas-holiday-celebration.jpg",
    },
    {
      id: 6,
      title: "Награда за най-добър онлайн магазин",
      excerpt: "КЕШ бе отличен като най-добър онлайн магазин за електроника в България за 2025",
      date: "10 Декември 2025",
      category: "Новини",
      image: "/award-trophy-winner.jpg",
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-12 md:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Newspaper className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Новини</h1>
              <p className="text-xl text-blue-100">Последни новини и актуализации от КЕШ</p>
            </div>
          </div>
        </section>

        {/* Featured News */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {news.slice(0, 2).map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium">
                            <Tag className="h-3 w-3" />
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4" />
                          {item.date}
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{item.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                          Прочети повече
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* All News */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.slice(2).map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                            <Tag className="h-3 w-3" />
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{item.excerpt}</p>
                        <span className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium group-hover:gap-3 transition-all">
                          Прочети
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Абонирай се за новините</h2>
              <p className="text-blue-100 mb-8">Получавай последните новини и промоции директно на email</p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Твоят email"
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold">
                  Абонирай се
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
