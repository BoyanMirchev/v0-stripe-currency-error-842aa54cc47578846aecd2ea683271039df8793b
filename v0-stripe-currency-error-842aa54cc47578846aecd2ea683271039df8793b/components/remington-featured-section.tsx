"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/data"

interface RemingtonSettings {
  title: string
  image_url: string
  button_link: string
}

export default function RemingtonFeaturedSection({
  products = [],
  settings = {
    title: "Стилизирай косата си с Remington AIRvive",
    image_url: "/remington-hair-dryer.jpg",
    button_link: "/products",
  },
}: {
  products?: Product[]
  settings?: RemingtonSettings
}) {
  const remingtonSettings = settings

  const formatPrice = (priceStr: string) => {
    const price = Number.parseFloat(priceStr)
    return price.toFixed(2)
  }

  return (
    <section className="w-full py-4 relative overflow-hidden bg-black">

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10">
        {/* Hero Banner - Split Layout */}
        <div className="flex items-start gap-3 px-4 mb-4">
          {/* Left - Small Image */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={remingtonSettings.image_url || "/placeholder.svg"}
              alt="Remington AIRvive"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Right - Text and Button */}
          <div className="flex flex-col justify-center flex-1 overflow-hidden">
            <h2 className="text-white text-sm sm:text-base font-bold mb-2 leading-tight">{remingtonSettings.title}</h2>
            <Link
              href={remingtonSettings.button_link}
              className="inline-block px-4 py-1.5 text-xs border-2 border-white text-white rounded-full hover:bg-white hover:text-[#5c0713] transition-colors w-fit"
            >
              Виж повече
            </Link>
          </div>
        </div>

        {/* Product Cards - Horizontal Scroll */}
        <div className="pb-4">
          {products.length === 0 ? (
            <div className="text-white text-center py-12">Няма налични продукти</div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 px-3" style={{ minWidth: "min-content" }}>
                {products.map((product) => (
                  <Link href={`/${product.type}/${product.id}`} key={product.id}>
                    <div
                      className="bg-white rounded-lg p-3 relative group hover:border-2 transition-all cursor-pointer flex flex-col"
                      style={{ width: "160px", minHeight: "220px", border: "2px solid transparent" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#e60200"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "transparent"
                      }}
                    >
                      {/* Product Image with Icons Inside */}
                      <div className="relative w-full h-24 mb-2 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Product Name */}
                      <h3 className="text-xs md:text-base font-medium mb-1 leading-tight" style={{ color: "#282828" }}>
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="text-base font-bold text-red-600 mt-auto">
                        {formatPrice(product.price)} €
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="container mx-auto px-4 hidden lg:block relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Left promotional banner */}
          <div className="lg:col-span-3 relative">
            <div className="relative aspect-[4/3] overflow-hidden max-w-[240px] rounded-xl">
              <Image
                src={remingtonSettings.image_url || "/placeholder.svg"}
                alt="Remington AIRvive"
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-white text-lg font-bold mb-4">{remingtonSettings.title}</h2>
              <Link
                href={remingtonSettings.button_link}
                className="inline-block px-4 py-1.5 text-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-[#5c0713] transition-colors"
              >
                Виж повече
              </Link>
            </div>
          </div>

          {/* Right products grid */}
          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="text-white text-center py-12">Няма налични продукти</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {products.map((product) => (
                  <Link href={`/${product.type}/${product.id}`} key={product.id}>
                    <div
                      className="bg-white rounded-lg p-3 relative group hover:border-2 transition-all cursor-pointer flex flex-col h-[260px]"
                      style={{ border: "2px solid transparent" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#e60200"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "transparent"
                      }}
                    >
                      {/* Product Image with Icons Inside */}
                      <div className="relative w-full h-[150px] mb-1 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* Product Name */}
                      <h3
                        className="font-medium line-clamp-2 text-xs md:text-base leading-tight tracking-tight mb-1"
                        style={{ color: "#282828" }}
                      >
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="text-lg font-bold text-red-600 mt-auto">
                        {formatPrice(product.price)} €
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
