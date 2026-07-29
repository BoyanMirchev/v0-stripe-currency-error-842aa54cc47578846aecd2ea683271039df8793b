import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Users, TrendingUp, Heart, MapPin, Clock } from "lucide-react"

export default function CareersPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-12 md:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Briefcase className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Работа при нас</h1>
              <p className="text-xl text-purple-100">
                Присъедини се към нашия динамичен екип и помогни за трансформацията на е-търговията
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Защо КЕШ?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Кариерно развитие",
                  description: "Възможности за израстване и професионално развитие",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Страхотен екип",
                  description: "Работи с талантливи и мотивирани колеги",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: "Баланс работа-живот",
                  description: "Гъвкави работни условия и внимание към благосъстоянието",
                  gradient: "from-red-500 to-orange-500",
                },
                {
                  icon: <Briefcase className="h-8 w-8" />,
                  title: "Конкурентни условия",
                  description: "Атрактивно възнаграждение и социални придобивки",
                  gradient: "from-green-500 to-emerald-500",
                },
              ].map((benefit, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Отворени позиции</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  title: "Full Stack Developer",
                  department: "Технологии",
                  location: "София / Хибридно",
                  type: "Пълен работен ден",
                },
                {
                  title: "UX/UI Designer",
                  department: "Дизайн",
                  location: "София",
                  type: "Пълен работен ден",
                },
                {
                  title: "Customer Support Specialist",
                  department: "Обслужване на клиенти",
                  location: "София / Отдалечено",
                  type: "Пълен работен ден",
                },
                {
                  title: "Marketing Manager",
                  department: "Маркетинг",
                  location: "София",
                  type: "Пълен работен ден",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-purple-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      Кандидатствай
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-2">Свържи се с нас</h2>
                <p className="text-center text-gray-600 mb-8">Не виждаш подходяща позиция? Изпрати ни своето CV</p>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Име</label>
                      <Input placeholder="Вашето име" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Фамилия</label>
                      <Input placeholder="Вашата фамилия" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон</label>
                    <Input type="tel" placeholder="+359 ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Позиция</label>
                    <Input placeholder="За каква позиция кандидатствате?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Съобщение</label>
                    <Textarea placeholder="Разкажете ни повече за себе си..." rows={5} />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg">
                    Изпрати кандидатура
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
