import * as React from "react"
import { Tv, Laptop, Smartphone, Refrigerator, Coffee, Camera, Gamepad2, Tag } from "lucide-react"
import Image from "next/image"
import { IpadCarousel } from "@/components/banner-slider"
import { FeaturedProducts } from "@/components/featured-products-section"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { neon } from "@neondatabase/serverless"
import { CarsSection } from "@/components/cars-section"
import { EquipmentSection } from "@/components/equipment-section"
import RemingtonFeaturedSection from "@/components/remington-featured-section"
import { SmartphoneUpgradeBanner } from "@/components/smartphone-upgrade-banner"
import { PromotionalCardsSection } from "@/components/promotional-cards-section"
import { GoldCategoriesSection } from "@/components/gold-categories-section"
import { SilverProductsSection } from "@/components/silver-products-section"
import { goldToProduct, carToProduct, equipmentToProduct } from "@/lib/product-adapter"
import type { Product } from "@/lib/data"

const KeshLogo = () => (
  <div className="flex items-center flex-shrink-0">
    <Image src="/kesh-logo.png" alt="Кеш Logo" width={110} height={40} className="object-contain" />
  </div>
)

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

const menuCategories: { title: string; href: string; description: string; icon: React.ElementType }[] = [
  {
    title: "TV, Аудио и Видео",
    href: "/products/tv-audio",
    description: "Телевизори, саундбар системи, проектори.",
    icon: Tv,
  },
  {
    title: "Компютри и периферия",
    href: "/products/computers",
    description: "Лаптопи, настолни компютри, монитори.",
    icon: Laptop,
  },
  {
    title: "Смартфони и таблети",
    href: "/products/mobile",
    description: "Смартфони, таблети и смарт часовници.",
    icon: Smartphone,
  },
  {
    title: "Големи електроуреди",
    href: "/products/large-appliances",
    description: "Хладилници, перални, съдомиялни.",
    icon: Refrigerator,
  },
  {
    title: "Малки електроуреди",
    href: "/products/small-appliances",
    description: "Кафемашини, прахосмукачки, ютии.",
    icon: Coffee,
  },
  {
    title: "Фото и Видео",
    href: "/products/photo-video",
    description: "Фотоапарати, камери и аксесоари.",
    icon: Camera,
  },
  {
    title: "Гейминг",
    href: "/products/gaming",
    description: "Конзоли, игри и аксесоари.",
    icon: Gamepad2,
  },
  {
    title: "Всички промоции",
    href: "/promotions",
    description: "Вижте актуалните ни оферти.",
    icon: Tag,
  },
]

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let slides = [
    { src: "/banners/lg-refrigerator-banner.png", alt: "LG Refrigerator Banner" },
    { src: "/banners/philips-tv-banner.png", alt: "Philips Ambilight TV Banner" },
    { src: "/banners/acer-laptop-banner.png", alt: "Acer Aspire Go 15 Banner" },
  ]

  let mobileSlides: any[] = []
  let desktopSlides: any[] = []

  // Gold + Silver categories for the "Категории" drill-down section (fetched server-side)
  let goldCategories: any[] = []
  let silverCategories: any[] = []

  // Root "Категории" card images (Злато / Сребро), editable from the admin panel
  let categoryRootImages: { gold?: string; silver?: string } = {}

  // Gold products for the "Злато" section (fetched server-side)
  let goldProducts: Product[] = []

  // Car products for the "Автомобили" section (fetched server-side)
  let carProducts: Product[] = []

  // Equipment products for the "Техника" section (fetched server-side)
  let equipmentProducts: Product[] = []

  // Silver products for the "Сребро" section (fetched server-side)
  let silverProducts: Product[] = []

  // Remington featured section (fetched server-side)
  let remingtonProducts: Product[] = []
  let remingtonSettings = {
    title: "Стилизирай косата си с Remington AIRvive",
    image_url: "/remington-hair-dryer.jpg",
    button_link: "/products",
  }

  // Section visibility settings with defaults
  let sectionVisibility = {
    gold: true,
    equipment: true,
    cars: true
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Fetch mobile banners
    const mobileBanners = await sql`
      SELECT * FROM home_banners 
      WHERE is_active = true AND is_mobile = true
      ORDER BY display_order ASC
    `

    // Fetch desktop banners
    const desktopBanners = await sql`
      SELECT * FROM home_banners 
      WHERE is_active = true AND (is_mobile = false OR is_mobile IS NULL)
      ORDER BY display_order ASC
    `

    if (mobileBanners && mobileBanners.length > 0) {
      mobileSlides = mobileBanners.map((banner: any) => ({
        src: banner.image_url,
        alt: banner.alt_text || "Banner",
        link: banner.link_url,
      }))
    }

    if (desktopBanners && desktopBanners.length > 0) {
      desktopSlides = desktopBanners.map((banner: any) => ({
        src: banner.image_url,
        alt: banner.alt_text || "Banner",
        link: banner.link_url,
      }))
    }

    // If we have device-specific banners, use those; otherwise fall back to default
    if (mobileSlides.length === 0 && desktopSlides.length === 0) {
      // Query old way for backward compatibility
      const banners = await sql`
        SELECT * FROM home_banners 
        WHERE is_active = true 
        ORDER BY display_order ASC
      `

      if (banners && banners.length > 0) {
        slides = banners.map((banner: any) => ({
          src: banner.image_url,
          alt: banner.alt_text || "Banner",
          link: banner.link_url,
        }))
      }
    }
    
    // Fetch section visibility settings
    const visibilityResult = await sql`
      SELECT section_key, is_visible
      FROM homepage_section_visibility
    `
    
    if (visibilityResult && visibilityResult.length > 0) {
      visibilityResult.forEach((row: any) => {
        if (row.section_key in sectionVisibility) {
          sectionVisibility[row.section_key as keyof typeof sectionVisibility] = row.is_visible
        }
      })
    }

    // Fetch the full gold + silver category trees for the "Категории" drill-down section
    const [goldCatRows, silverCatRows] = await Promise.all([
      sql`
        SELECT id, name, slug, parent_id, homepage_image, display_order
        FROM gold_categories
        WHERE is_active = true
        ORDER BY display_order ASC, name ASC
      `,
      sql`
        SELECT id, name, slug, parent_id, display_order
        FROM silver_categories
        WHERE is_active = true
        ORDER BY display_order ASC, name ASC
      `,
    ])
    goldCategories = goldCatRows || []
    silverCategories = silverCatRows || []

    // Fetch the admin-managed root images for the "Категории" cards
    try {
      const rootImageRows = await sql`
        SELECT metal_key, image_url FROM homepage_category_images
      `
      ;(rootImageRows || []).forEach((row: any) => {
        if (row.image_url && (row.metal_key === "gold" || row.metal_key === "silver")) {
          categoryRootImages[row.metal_key as "gold" | "silver"] = row.image_url
        }
      })
    } catch (imageError) {
      console.error("[v0] Error loading homepage category images:", imageError)
    }

    // Fetch gold products for the "Злато" section
    const goldItems = await sql`
      SELECT gs.*, gc.name as category_name, gc.slug as category_slug 
      FROM gold_sales gs
      LEFT JOIN gold_categories gc ON gs.category_id = gc.id
      ORDER BY gs.created_at DESC
    `

    goldProducts = (goldItems || [])
      .filter((item: any) => item.status === "available")
      .slice(0, 12)
      .map((item: any) => {
        const primaryImage = item.images && item.images.length > 0 ? item.images[0] : null
        const basePrice = Number(Number(item.total_amount).toFixed(2))
        const promotion = item.promotions ? Number(item.promotions) : null

        return {
          id: item.id,
          slug: `gold-${item.id}`,
          type: "gold",
          image: primaryImage,
          images: item.images || [],
          name: item.gold_type || `Злато ${item.purity_percentage}%`,
          price: basePrice,
          promotion: promotion && promotion > 0 ? promotion : null,
          description: item.description || item.gold_type,
        } as Product
      })

    // Fetch cars for the "Автомобили" section
    const carItems = await sql`SELECT *, brand AS make FROM cars ORDER BY created_at DESC`

    carProducts = (carItems || [])
      .filter((car: any) => car.status === "available")
      .slice(0, 12)
      .map((car: any) => {
        const primaryImage =
          car.image_url || (car.images && car.images.length > 0 ? car.images[0] : "/classic-red-convertible.png")
        const basePrice = Number(car.price)
        const promotion = car.promotions ? Number(car.promotions) : null

        return {
          id: car.id,
          slug: `car-${car.id}`,
          type: "car",
          image: primaryImage,
          images: car.images || [primaryImage],
          name: `${car.make || car.brand} ${car.model}`,
          price: basePrice,
          promotion: promotion && promotion > 0 ? promotion : null,
          description: car.description || `${car.year} год., ${car.mileage} км`,
        } as Product
      })

    // Fetch equipment for the "Техника" section
    const equipmentItems = await sql`SELECT * FROM equipment ORDER BY created_at DESC`

    equipmentProducts = (equipmentItems || [])
      .filter((item: any) => item.status === "available")
      .slice(0, 12)
      .map((item: any) => {
        const primaryImage =
          item.image_url || (item.images && item.images.length > 0 ? item.images[0] : "/electronics-components.png")
        const basePrice = Number(item.price)
        const promotion = item.promotions ? Number(item.promotions) : null

        return {
          id: item.id,
          slug: `equipment-${item.id}`,
          type: "equipment",
          image: primaryImage,
          images: item.images || [primaryImage],
          name: item.name,
          price: basePrice,
          promotion: promotion && promotion > 0 ? promotion : null,
          description: item.description || `${item.brand || ""} ${item.model || ""}`.trim(),
        } as Product
      })

    // Fetch silver products for the "Сребро" section
    const silverItems = await sql`
      SELECT ss.*, sc.name as category_name, sc.slug as category_slug 
      FROM silver_sales ss
      LEFT JOIN silver_categories sc ON ss.category_id = sc.id
      ORDER BY ss.created_at DESC
    `

    silverProducts = (silverItems || [])
      .filter((item: any) => item.status === "available")
      .slice(0, 12)
      .map((item: any) => {
        const primaryImage = item.images && item.images.length > 0 ? item.images[0] : "/shimmering-silver.png"
        const basePrice = Number((item.price_per_gram * item.weight_grams).toFixed(2))
        const promotion = item.promotions ? Number(item.promotions) : null

        return {
          id: item.id,
          slug: `silver-${item.id}`,
          type: "silver",
          image: primaryImage,
          images: item.images || [primaryImage],
          name: `${item.category_name || item.silver_type} ${item.silver_type}`,
          price: basePrice,
          promotion: promotion && promotion > 0 ? promotion : null,
          description: item.description || `${item.silver_type} - ${item.weight_grams}g`,
        } as Product
      })

    // Remington featured section: mix of gold, cars and equipment
    const [remGold, remCars, remEquipment, remSettingsRows] = await Promise.all([
      sql`SELECT gs.* FROM gold_sales gs WHERE gs.status = 'available' ORDER BY gs.created_at DESC`,
      sql`SELECT *, brand AS make FROM cars WHERE status = 'available' ORDER BY created_at DESC`,
      sql`SELECT * FROM equipment WHERE status = 'available' ORDER BY created_at DESC`,
      sql`SELECT * FROM remington_settings ORDER BY id DESC LIMIT 1`,
    ])

    remingtonProducts = [
      ...(remGold || []).map((g: any) => goldToProduct(g)),
      ...(remCars || []).map((c: any) => carToProduct(c)),
      ...(remEquipment || []).map((e: any) => equipmentToProduct(e)),
    ].slice(0, 4)

    if (remSettingsRows && remSettingsRows.length > 0) {
      remingtonSettings = {
        title: remSettingsRows[0].title,
        image_url: remSettingsRows[0].image_url,
        button_link: remSettingsRows[0].button_link,
      }
    }
  } catch (error) {
    console.error("[v0] Error loading homepage data from database:", error)
    // Falls back to default slides and visibility if database query fails
  }

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen pt-[180px] lg:pt-[120px]">
        <div className="bg-white overflow-x-hidden py-3">
          <IpadCarousel
            slides={slides}
            mobileSlides={mobileSlides}
            desktopSlides={desktopSlides}
            options={{ loop: true }}
            className="mx-auto px-4 max-w-full"
          />
        </div>
        {sectionVisibility.gold && (
          <GoldCategoriesSection
            goldCategories={goldCategories}
            silverCategories={silverCategories}
            rootImages={categoryRootImages}
          />
        )}
        {sectionVisibility.equipment && <EquipmentSection products={equipmentProducts} />}
        <RemingtonFeaturedSection products={remingtonProducts} settings={remingtonSettings} />
        {sectionVisibility.cars && <CarsSection products={carProducts} />}
        <SmartphoneUpgradeBanner />
        {sectionVisibility.gold && <FeaturedProducts products={goldProducts} />}
        <SilverProductsSection products={silverProducts} />
        <PromotionalCardsSection />
      </div>
    </>
  )
}
