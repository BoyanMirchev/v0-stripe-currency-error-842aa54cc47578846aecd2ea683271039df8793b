import { Car, Gem, Laptop } from "lucide-react"
import Image from "next/image"

export function SellSection() {
  const sellCategories = [
    {
      title: "Автомобил",
      icon: Car,
      image: "/car-automobile-vehicle.jpg",
      href: "/cars",
    },
    {
      title: "Злато",
      icon: Gem,
      image: "/gold-jewelry-precious-metals.jpg",
      href: "/gold",
    },
    {
      title: "Техника",
      icon: Laptop,
      image: "/electronics-technology-devices-gadgets.jpg",
      href: "/equipment/categories",
    },
  ]

  return (
    <section className="py-6 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Продай</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellCategories.map((category) => (
            <a
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <category.icon className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
