"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RawCategory {
  id: number
  name: string
  slug: string
  parent_id: number | null
  homepage_image?: string | null
  display_order?: number
}

type Metal = "gold" | "silver"

interface CatNode {
  key: string
  id: number | string
  name: string
  slug?: string
  metal: Metal
  image?: string | null
  children: CatNode[]
}

const ROOT_IMAGES: Record<Metal, string> = {
  gold: "/gold-jewelry.jpg",
  silver: "/shimmering-silver.png",
}

// Build a nested tree from a flat list using parent_id relationships.
function buildTree(categories: RawCategory[], metal: Metal): CatNode[] {
  const byParent = new Map<number | null, RawCategory[]>()
  for (const cat of categories) {
    const list = byParent.get(cat.parent_id ?? null) || []
    list.push(cat)
    byParent.set(cat.parent_id ?? null, list)
  }

  const make = (cat: RawCategory): CatNode => ({
    key: `${metal}-${cat.id}`,
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    metal,
    image: cat.homepage_image ?? null,
    children: (byParent.get(cat.id) || []).map(make),
  })

  return (byParent.get(null) || []).map(make)
}

export function GoldCategoriesSection({
  goldCategories = [],
  silverCategories = [],
  rootImages,
}: {
  goldCategories?: RawCategory[]
  silverCategories?: RawCategory[]
  rootImages?: Partial<Record<Metal, string>>
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  // Drill-down path: empty = root (Злато / Сребро), otherwise the chain of opened nodes.
  const [path, setPath] = useState<CatNode[]>([])

  const rootItems = useMemo<CatNode[]>(() => {
    return [
      {
        key: "gold-root",
        id: "gold-root",
        name: "Злато",
        metal: "gold",
        image: rootImages?.gold || ROOT_IMAGES.gold,
        children: buildTree(goldCategories, "gold"),
      },
      {
        key: "silver-root",
        id: "silver-root",
        name: "Сребро",
        metal: "silver",
        image: rootImages?.silver || ROOT_IMAGES.silver,
        children: buildTree(silverCategories, "silver"),
      },
    ]
  }, [goldCategories, silverCategories, rootImages])

  const currentItems = path.length === 0 ? rootItems : path[path.length - 1].children
  const currentNode = path.length === 0 ? null : path[path.length - 1]

  const getImage = (node: CatNode) => node.image || ROOT_IMAGES[node.metal]

  // Where a leaf node links to (no children -> go to the listing page).
  const leafHref = (node: CatNode) => {
    if (typeof node.id === "string" && node.id.endsWith("-root")) {
      return `/${node.metal}`
    }
    return `/${node.metal}?category=${node.slug}`
  }

  const handleNodeClick = (node: CatNode) => {
    if (node.children.length > 0) {
      setPath([...path, node])
    }
  }

  const renderCard = (node: CatNode) => {
    const hasChildren = node.children.length > 0
    const inner = (
      <>
        <Image
          src={getImage(node) || "/placeholder.svg"}
          alt={node.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            hoveredKey === node.key ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
          <span className="text-white text-lg md:text-xl lg:text-2xl font-medium tracking-wide drop-shadow-lg text-center text-balance">
            {node.name}
          </span>
          {hasChildren && (
            <span className="flex items-center gap-1 text-white/80 text-xs md:text-sm">
              Разгледай <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
        <div
          className={`absolute inset-0 border-2 rounded-xl transition-all duration-300 ${
            hoveredKey === node.key ? "border-[#b8860b] opacity-100" : "border-transparent opacity-0"
          }`}
        />
      </>
    )

    const sharedClass = "relative group overflow-hidden rounded-xl aspect-square block w-full text-left"
    const hoverHandlers = {
      onMouseEnter: () => setHoveredKey(node.key),
      onMouseLeave: () => setHoveredKey(null),
      onTouchStart: () => setHoveredKey(node.key),
      onTouchEnd: () => setHoveredKey(null),
    }

    if (hasChildren) {
      return (
        <button key={node.key} type="button" className={sharedClass} onClick={() => handleNodeClick(node)} {...hoverHandlers}>
          {inner}
        </button>
      )
    }

    return (
      <Link key={node.key} href={leafHref(node)} className={sharedClass} {...hoverHandlers}>
        {inner}
      </Link>
    )
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{ color: "#b8860b" }}>
          Категории
        </h2>

        {/* Breadcrumb / back navigation (only when drilled in) */}
        {path.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm md:text-base">
            <button
              type="button"
              onClick={() => setPath(path.slice(0, -1))}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-[#b8860b] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setPath([])}
              className="text-gray-600 hover:text-[#b8860b] transition-colors"
            >
              Категории
            </button>
            {path.map((node, index) => (
              <span key={node.key} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <button
                  type="button"
                  onClick={() => setPath(path.slice(0, index + 1))}
                  className={`transition-colors ${
                    index === path.length - 1
                      ? "text-[#b8860b] font-medium"
                      : "text-gray-600 hover:text-[#b8860b]"
                  }`}
                >
                  {node.name}
                </button>
              </span>
            ))}
            {currentNode && (
              <>
                <span className="text-gray-300">|</span>
                <Link
                  href={leafHref(currentNode)}
                  className="text-gray-600 hover:text-[#b8860b] transition-colors"
                >
                  Виж всички
                </Link>
              </>
            )}
          </div>
        )}

        {currentItems.length > 0 ? (
          <div
            className={
              path.length === 0
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
                : "grid grid-cols-2 md:grid-cols-4 gap-4"
            }
          >
            {currentItems.map(renderCard)}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Няма налични подкатегории.</p>
            {currentNode && (
              <Link
                href={leafHref(currentNode)}
                className="inline-block mt-3 text-[#b8860b] hover:underline font-medium"
              >
                Виж всички {currentNode.name}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
