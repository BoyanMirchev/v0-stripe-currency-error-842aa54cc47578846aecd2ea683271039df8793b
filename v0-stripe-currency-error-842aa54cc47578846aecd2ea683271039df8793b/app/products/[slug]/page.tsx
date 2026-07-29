import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Heart, ShoppingCart, ChevronRight, Star } from "lucide-react"

import { getProductBySlug } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header" // Assuming you have a Header component

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Начало</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Продукти</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square relative bg-gray-100 rounded-lg mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex gap-4">
              {product.images?.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square relative w-24 h-24 bg-gray-100 rounded-md cursor-pointer border-2 border-transparent hover:border-red-500"
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5" />
              </div>
              <a href="#" className="text-sm text-gray-600 hover:underline">
                (123 ревюта)
              </a>
            </div>
            <p className="text-4xl font-bold text-red-600 mb-6">
              {product.price.split(".")[0]}
              <span className="text-2xl align-top">.{product.price.split(".")[1]}</span> лв.
            </p>

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6">
                <ShoppingCart className="w-6 h-6 mr-3" />
                КУПИ
              </Button>
              <Button size="lg" variant="outline" className="px-4 py-6 bg-transparent">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Основни характеристики:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Description and Specs Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6 px-4 border rounded-b-md">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="py-6 px-4 border rounded-b-md">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2 font-medium bg-gray-50 w-1/3">{spec.key}</td>
                      <td className="py-3 px-2">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
