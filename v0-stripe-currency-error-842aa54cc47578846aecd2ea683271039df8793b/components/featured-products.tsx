import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    promoTag: "+ СИЛИКОНОВ КАЛЪФ В КОМПЛЕКТА",
    image: "/placeholder.svg?width=200&height=200&text=Phone",
    brochureTag: true,
    name: 'Смартфон GSM MOTOROLA EDGE 60 PRO Green 6.67 ", 512 GB, RAM...',
    rating: 5,
    reviews: 1,
    price: "999.99",
    financing: true,
    freeDelivery: true,
  },
  {
    id: 2,
    promoTag: "НОВО",
    promoTagColor: "bg-green-500",
    image: "/placeholder.svg?width=200&height=200&text=TV",
    brochureTag: true,
    name: "Телевизор SONY BRAVIA 8 II K-65XR8M2 4K Ultra HD OLED...",
    price: "5499.00",
    financing: true,
    freeDelivery: true,
  },
  {
    id: 3,
    image: "/placeholder.svg?width=200&height=200&text=Fridge",
    brochureTag: true,
    name: "Хладилник с горен фризер BEKO RDSO 206 K40WN 143.00 см",
    price: "429.99",
    financing: true,
    freeDelivery: true,
  },
  {
    id: 4,
    image: "/placeholder.svg?width=200&height=200&text=Ice+Maker",
    brochureTag: true,
    name: "ЛЕДОГЕНЕРАТОР SENCOR SIM3000BK ЧЕРЕН",
    price: "279.00",
    financing: false,
    freeDelivery: true,
  },
  {
    id: 5,
    image: "/placeholder.svg?width=200&height=200&text=PS+Portal",
    brochureTag: true,
    name: "PLAYSTATION PORTAL REMOTE PLAYER MIDNIGHT BLACK",
    price: "439.00",
    financing: true,
    freeDelivery: true,
  },
  {
    id: 6,
    image: "/placeholder.svg?width=200&height=200&text=Laptop",
    brochureTag: true,
    name: 'Гейминг лаптоп LENOVO LOQ 15IRX9 83DV00HWBM 15.6 ", INTE...',
    price: "2399.00",
    financing: true,
    freeDelivery: true,
  },
]

const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
  <div className="p-4 flex flex-col justify-between h-full bg-white">
    <div>
      {product.promoTag && (
        <div
          className={cn("text-white text-xs font-bold p-2 mb-2 inline-block", product.promoTagColor || "bg-red-600")}
        >
          {product.promoTag}
        </div>
      )}
      <div className="relative w-full h-48 mb-4">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} layout="fill" objectFit="contain" />
      </div>
      {product.brochureTag && (
        <div className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-2">
          ОТ БРОШУРАТА
        </div>
      )}
      <h3 className="text-sm font-semibold mb-2 h-10 overflow-hidden">{product.name}</h3>
      <a href="#" className="text-xs underline text-gray-600 hover:text-red-600 mb-4 block">
        Виж опции за взимане и доставка
      </a>
    </div>
    <div className="mt-auto">
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-bold text-red-600">
          Цена: {product.price.split(".")[0]}
          <span className="text-sm align-top">{product.price.split(".")[1]}</span> лв.
        </p>
      </div>
      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-none">
        <ShoppingCart className="w-4 h-4 mr-2" />
        КУПИ
      </Button>
    </div>
  </div>
)

export function FeaturedProducts() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-8">Актуални предложения</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
