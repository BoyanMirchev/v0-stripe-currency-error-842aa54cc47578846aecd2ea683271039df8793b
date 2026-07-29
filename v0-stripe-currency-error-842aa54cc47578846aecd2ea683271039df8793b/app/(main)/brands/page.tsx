import Header from "@/components/header"
import { Award, Shield, TrendingUp, Sparkles } from "lucide-react"

export default function BrandsPage() {
  const brands = [
    { name: "Apple", logo: "/brands/apple.png", category: "Техника" },
    { name: "Samsung", logo: "/brands/samsung.png", category: "Техника" },
    { name: "LG", logo: "/brands/lg.png", category: "Техника" },
    { name: "Sony", logo: "/brands/sony.png", category: "Техника" },
    { name: "BMW", logo: "/brands/bmw.png", category: "Автомобили" },
    { name: "Mercedes-Benz", logo: "/brands/mercedes.png", category: "Автомобили" },
    { name: "Audi", logo: "/brands/audi.png", category: "Автомобили" },
    { name: "Volkswagen", logo: "/brands/vw.png", category: "Автомобили" },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Нашите марки</h1>
              <p className="text-lg md:text-xl text-white/90">Работим само с водещи световни производители</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Shield className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Гарантирано качество</h3>
              <p className="text-gray-600">Оригинални продукти с пълна гаранция</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <TrendingUp className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Световни лидери</h3>
              <p className="text-gray-600">Само марки с доказан успех</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Иновации</h3>
              <p className="text-gray-600">Най-новите технологии на пазара</p>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Партньорски марки</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center justify-center gap-4 group cursor-pointer"
                >
                  <div className="w-24 h-24 relative">
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                      <span className="text-gray-400 text-sm font-medium">{brand.name}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
                    <span className="text-sm text-gray-500">{brand.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
