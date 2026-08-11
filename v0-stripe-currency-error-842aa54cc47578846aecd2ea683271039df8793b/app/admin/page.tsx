"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  CarIcon,
  Home,
  MonitorSmartphone,
  Coins,
  Users,
  Package,
  Mail,
  MapPin,
  DollarSign,
  LogIn,
  Smartphone,
  ImageIcon,
  Tag,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Search,
  Globe,
  Twitter,
  Facebook,
  Settings,
  Check,
  UserCog,
  Shield,
  Eye,
  Menu,
  X,
  Building2,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image" // Added import for Image
import Link from "next/link"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { AboutPageEditor } from "@/components/admin/about-page-editor"
import { FAQPageEditor } from "@/components/admin/faq-page-editor"

// Placeholder for Header and Footer components if they exist and are used in updates
// import Header from "@/components/Header"; // Assuming Header component path
// import Footer from "@/components/Footer"; // Assuming Footer component path

interface Banner {
  id: number
  title: string
  image_url: string
  alt_text: string | null
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface HomeBanner {
  id: number
  image_url: string
  alt_text: string | null
  link_url: string | null
  display_order: number
  is_active: boolean
  is_mobile: boolean
  created_at: string
  updated_at: string
}

// Renamed interface to CarData to avoid conflict with the imported DbCar
interface CarData {
  id: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color: string
  engine_size: string
  horsepower: number
  doors: number
  seats: number
  condition: string
  description: string | null
  image_url: string | null
  images: string[] | null
  location: string
  status: string
  created_at: string
  updated_at: string
  promotions: number | null
  store_id: number | null // Added store_id
}

interface Equipment {
  id: number
  name: string
  category: string
  brand: string | null
  model: string | null
  oborudvane: string | null
  sku: string | null
  price: number
  condition: string | null
  images: string[] | null
  description: string | null
  specifications: any
  features: string[] | null
  stock_quantity: number
  location: string
  status: string
  created_at: string
  updated_at: string
  promotions: number | null
  store_id: number | null // Added store_id
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
}

interface GoldCategory {
  id: number
  name: string
  slug: string
  display_order: number
  is_active: boolean
  parent_id: number | null
  parent_name?: string | null
  // Homepage fields
  show_on_homepage?: boolean
  homepage_image?: string
  homepage_order?: number
}

interface Gold {
  id: number
  gold_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  status: string
  notes: string | null
  undefined_images: string | null
  images: string[] | null
  created_at: string
  updated_at: string
  promotions: number | null
  store_id: number | null
  category_id: number | null // Added category_id
  subcategory_id: number | null // Added subcategory_id
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
}

interface SilverCategory {
  id: number
  name: string
  slug: string
  display_order: number
  is_active: boolean
  parent_id: number | null
  parent_name?: string | null
  show_on_homepage?: boolean
  homepage_image?: string
  homepage_order?: number
}

interface Silver {
  id: number
  silver_type: string
  weight_grams: number
  purity_percentage: number
  price_per_gram: number
  total_amount: number
  currency: string
  description: string | null
  status: string
  notes: string | null
  images: string[] | null
  created_at: string
  updated_at: string
  promotions: number | null
  store_id: number | null
  category_id: number | null
  subcategory_id: number | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
}

interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  created_at: string
  order_count: number
  total_spent: number
}

interface Order {
  id: number
  user_id: number
  user_email: string
  user_first_name: string | null
  user_last_name: string | null
  total_amount: number
  status: string
  shipping_address: string
  shipping_city: string | null
  shipping_postal_code: string | null
  phone: string
  notes: string | null
  delivery_method: string | null
  payment_method: string | null
  delivery_cost: number | null
  econt_city: string | null
  econt_office_name: string | null
  econt_office_address: string | null
  store_name: string | null
  store_address: string | null
  country: string | null
  created_at: string
  updated_at: string
  items: any[]
}

// Added Message interface
interface Message {
  id: number
  email: string
  subscribed_at: string
  is_active: boolean
}

interface Store {
  id: number
  name: string
  address: string
  city: string
  neighborhood: string | null
  working_hours: string
  weekly_hours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  } | null
  image_url: string | null
  rating: number
  is_24_7: boolean
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// New interface for contact messages
interface ContactMessage {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  created_at: string
  is_read: boolean
}

// Admin Worker interface
interface AdminWorker {
  id: number
  username: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  role: 'admin' | 'worker'
  store_id: number | null
  store_name: string | null
  is_active: boolean
  allowed_tabs: string[]
  hide_global_price: boolean
  created_at: string
  updated_at: string
}

interface UpgradeBannerSettings {
  id?: number
  background_image_url: string
  mobile_background_image_url?: string // Added mobile_background_image_url
  link_url: string
  is_active?: boolean
}

interface HomepageSeoSettings {
  id?: number
  site_name: string
  title: string
  description: string
  keywords: string
  og_title: string
  og_description: string
  og_image: string
  og_image_alt: string
  og_image_width: number
  og_image_height: number
  og_type: string
  og_locale: string
  og_site_name: string
  og_url: string
  twitter_card: string
  twitter_site: string
  twitter_creator: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
  twitter_image_alt: string
  author: string
  robots: string
  googlebot: string
  bingbot: string
  revisit_after: string
  rating: string
  referrer: string
  canonical_url: string
  alternate_languages: any[]
  logo_url: string
  logo_alt: string
  logo_width: number
  logo_height: number
  favicon_url: string
  apple_touch_icon: string
  theme_color: string
  ms_tile_color: string
  background_color: string
  google_site_verification: string
  bing_site_verification: string
  yandex_verification: string
  facebook_domain_verification: string
  json_ld_organization: any
  json_ld_website: any
  json_ld_local_business: any
  json_ld_breadcrumb: any
  enable_google_analytics: boolean
  google_analytics_id: string
  enable_facebook_pixel: boolean
  facebook_pixel_id: string
  enable_google_tag_manager: boolean
  google_tag_manager_id: string
  custom_head_tags: string
}

// Remington settings interface
interface RemingtonSettings {
  title: string
  image_url: string
  button_link: string
}

// Dynamically build SEO fields for an equipment product from the data the
// admin enters in the other columns (name, brand, model, category, etc.).
function generateEquipmentSeo(data: {
  name?: string
  brand?: string
  model?: string
  category?: string
  condition?: string
  price?: number
  description?: string
  specifications?: { name: string; value: string }[]
}) {
  const name = (data.name || "").trim()
  const brand = (data.brand || "").trim()
  const model = (data.model || "").trim()
  const category = (data.category || "").trim()
  const condition = (data.condition || "").trim()
  const price = Number(data.price) || 0
  const description = (data.description || "").replace(/\s+/g, " ").trim()

  // SEO Title (max 60 chars): name + brand/model + category, avoiding duplicates
  const titleParts: string[] = []
  if (name) titleParts.push(name)
  const brandModel = [brand, model].filter(Boolean).join(" ").trim()
  if (brandModel && !name.toLowerCase().includes(brandModel.toLowerCase())) {
    titleParts.push(brandModel)
  }
  if (category && !titleParts.join(" ").toLowerCase().includes(category.toLowerCase())) {
    titleParts.push(category)
  }
  let seo_title = titleParts.join(" | ")
  if (seo_title.length > 60) seo_title = seo_title.slice(0, 57).trimEnd() + "..."

  // SEO Description (max 160 chars): a short natural summary of the product
  const descBits: string[] = []
  const nameCat = category && name ? `${name} - ${category}` : name || category
  if (nameCat) descBits.push(nameCat)
  if (condition) descBits.push(`Състояние: ${condition}`)
  if (price > 0) descBits.push(`Цена: ${price.toFixed(2)} €`)
  if (description) descBits.push(description)
  let seo_description = descBits.join(". ")
  if (seo_description.length > 160) seo_description = seo_description.slice(0, 157).trimEnd() + "..."

  // SEO Keywords: unique comma-separated tokens from the key attributes
  const keywordSet = new Set<string>()
  const addKeyword = (v?: string) => {
    const t = (v || "").trim()
    if (t) keywordSet.add(t)
  }
  addKeyword(name)
  addKeyword(brand)
  addKeyword(model)
  if (brand && model) addKeyword(`${brand} ${model}`)
  addKeyword(category)
  addKeyword(condition)
  ;(data.specifications || []).slice(0, 4).forEach((s) => addKeyword(s?.value))
  const seo_keywords = Array.from(keywordSet).join(", ")

  return { seo_title, seo_description, seo_keywords }
}

export default function AdminPage() {
  const { settings } = useSiteSettings()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminWorker | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Admin workers state
  const [adminWorkers, setAdminWorkers] = useState<AdminWorker[]>([])
  const [adminWorkersLoading, setAdminWorkersLoading] = useState(true)
  const [adminWorkerDialogOpen, setAdminWorkerDialogOpen] = useState(false)
  const [editingAdminWorker, setEditingAdminWorker] = useState<AdminWorker | null>(null)
  const [deletingAdminWorkerId, setDeletingAdminWorkerId] = useState<number | null>(null)
  const [deleteAdminWorkerDialogOpen, setDeleteAdminWorkerDialogOpen] = useState(false)
  const [adminWorkerFormData, setAdminWorkerFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "worker" as "admin" | "worker",
    store_id: null as number | null,
    is_active: true,
    allowed_tabs: ["equipment", "gold", "cars"] as string[],
    hide_global_price: false,
  })

  // All available tabs for permissions
  const allTabs = [
    { id: "home-banners", label: "Банери хоум" },
    { id: "upgrade-banner", label: "Банер ъпгрейд" },
    { id: "category-banners", label: "Банери категории" },
    { id: "promotional-cards", label: "Промо карти" },
    { id: "cars", label: "Коли" },
    { id: "equipment", label: "Техника" },
    { id: "categories", label: "Категории" },
    { id: "gold", label: "Злато" },
    { id: "gold-categories", label: "Злато категории" },
    { id: "silver", label: "Сребро" },
    { id: "silver-categories", label: "Сребро категории" },
    { id: "metal-prices", label: "Цени злато/сребро" },
    { id: "users", label: "Клиенти" },
    { id: "orders", label: "Поръчки" },
    { id: "messages", label: "Абонаменти" },
    { id: "stores", label: "Мага��ини" },
    { id: "contact", label: "Контакти" },
    { id: "remington-settings", label: "Remington секция" },
    { id: "delivery-settings", label: "Настройки доставка" },
    { id: "homepage-visibility", label: "Видимост секции" },
    { id: "homepage-category-images", label: "Изображения категории" },
    { id: "seo-settings", label: "SEO Настройки" },
    { id: "admin-workers", label: "Потребители" },
    { id: "about-page", label: "Компанията" },
    { id: "faq-page", label: "ЧЗВ" },
  ]

  const [cars, setCars] = useState<CarData[]>([]) // Use CarData here
  const [banners, setBanners] = useState<Banner[]>([])
  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([])
  const [categoryBanners, setCategoryBanners] = useState<any[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [gold, setGold] = useState<Gold[]>([])
  const [silver, setSilver] = useState<Silver[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null)

  // REMOVED: 'loading' state is no longer used for the main page load
  const [bannersLoading, setBannersLoading] = useState(true)
  const [homeBannersLoading, setHomeBannersLoading] = useState(true)
  const [categoryBannersLoading, setCategoryBannersLoading] = useState(true)
  const [equipmentLoading, setEquipmentLoading] = useState(true)
  const [goldLoading, setGoldLoading] = useState(true)
  const [silverLoading, setSilverLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false)
  const [homeBannerDialogOpen, setHomeBannerDialogOpen] = useState(false)
  const [categoryBannerDialogOpen, setCategoryBannerDialogOpen] = useState(false)
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false)
  const [goldDialogOpen, setGoldDialogOpen] = useState(false)
  const [silverDialogOpen, setSilverDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteBannerDialogOpen, setDeleteBannerDialogOpen] = useState(false)
  const [deleteHomeBannerDialogOpen, setDeleteHomeBannerDialogOpen] = useState(false)
  const [deleteCategoryBannerDialogOpen, setDeleteCategoryBannerDialogOpen] = useState(false)
  const [deleteEquipmentDialogOpen, setDeleteEquipmentDialogOpen] = useState(false)
  const [deleteGoldDialogOpen, setDeleteGoldDialogOpen] = useState(false)
  const [deleteSilverDialogOpen, setDeleteSilverDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<CarData | null>(null) // Use CarData here
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [editingHomeBanner, setEditingHomeBanner] = useState<HomeBanner | null>(null)
  const [editingCategoryBanner, setEditingCategoryBanner] = useState<any | null>(null)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [equipmentSearch, setEquipmentSearch] = useState("")
  const [equipmentConditions, setEquipmentConditions] = useState<string[]>(["Ново", "Употребявано", "Реновирано"])
  const [newConditionInput, setNewConditionInput] = useState("")
  const [showAddCondition, setShowAddCondition] = useState(false)
  // Brands added during the current session (before they exist on a saved product)
  const [customBrands, setCustomBrands] = useState<string[]>([])
  const [newBrandInput, setNewBrandInput] = useState("")
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [equipmentProductType, setEquipmentProductType] = useState<string>("")
  const [editingGold, setEditingGold] = useState<Gold | null>(null)
  const [editingSilver, setEditingSilver] = useState<Silver | null>(null)
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null)
  const [deletingBannerId, setDeletingBannerId] = useState<number | null>(null)
  const [deletingHomeBannerId, setDeletingHomeBannerId] = useState<number | null>(null)
  const [deletingCategoryBannerId, setDeletingCategoryBannerId] = useState<number | null>(null)
  const [deletingEquipmentId, setDeletingEquipmentId] = useState<number | null>(null)
  const [deletingGoldId, setDeletingGoldId] = useState<number | null>(null)
  const [deletingSilverId, setDeletingSilverId] = useState<number | null>(null)
  const { toast } = useToast()

  const [categories, setCategories] = useState<any[]>([])
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    icon: "",
    display_order: 0,
    is_active: true,
    images: [] as string[], // Added images array to category form data
    parent_id: null as number | null, // Added parent_id for subcategory support
  })
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false)

  const [messages, setMessages] = useState<Message[]>([]) // Use Message interface
  const [messagesLoading, setMessagesLoading] = useState(true)

  // Added stores state and loading state
  const [stores, setStores] = useState<Store[]>([])
  const [storesLoading, setStoresLoading] = useState(true)
  const [storeDialogOpen, setStoreDialogOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [deletingStoreId, setDeletingStoreId] = useState<number | null>(null)
  const [deleteStoreDialogOpen, setDeleteStoreDialogOpen] = useState(false)
  
  const defaultWeeklyHours = {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "14:00", closed: false },
    sunday: { open: "09:00", close: "14:00", closed: true },
  }
  
  const [storeFormData, setStoreFormData] = useState<Omit<Store, "id" | "created_at" | "updated_at">>({
    name: "",
    address: "",
    city: "",
    neighborhood: "",
    working_hours: "",
    weekly_hours: defaultWeeklyHours,
    image_url: "",
    rating: 0,
    is_24_7: false,
    latitude: null,
    longitude: null,
    google_maps_url: "",
    phone: "",
  })

  // State for contact messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [contactMessagesLoading, setContactMessagesLoading] = useState(true)

  const [promotionalCards, setPromotionalCards] = useState<any[]>([])
  const [promotionalCardsLoading, setPromotionalCardsLoading] = useState(true)
  const [isUploadingPromoCard, setIsUploadingPromoCard] = useState<number | null>(null)

  const [globalGoldPricePerGram, setGlobalGoldPricePerGram] = useState<number>(0)
  const [goldPriceDialogOpen, setGoldPriceDialogOpen] = useState(false)
  const [silverPriceDialogOpen, setSilverPriceDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Added for form submission state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingCarImages, setUploadingCarImages] = useState<{ [key: number]: boolean }>({})
  const [uploadingEquipmentImages, setUploadingEquipmentImages] = useState<{ [key: number]: boolean }>({})
  const [uploadingGoldImages, setUploadingGoldImages] = useState<{ [key: number]: boolean }>({})

  const [homeBannerImageFile, setHomeBannerImageFile] = useState<File | null>(null)
  const [homeBannerImagePreview, setHomeBannerImagePreview] = useState<string>("")
  const [isUploadingHomeBannerImage, setIsUploadingHomeBannerImage] = useState(false)

  const [upgradeBannerSettings, setUpgradeBannerSettings] = useState<UpgradeBannerSettings>({
    background_image_url: "",
    link_url: "/mobile-upgrade",
  })
  const [upgradeBannerLoading, setUpgradeBannerLoading] = useState(true)
  const [upgradeBannerImagePreview, setUpgradeBannerImagePreview] = useState<string>("")
  const [isUploadingUpgradeBannerImage, setIsUploadingUpgradeBannerImage] = useState(false)

  // Category banner image upload states
  const [categoryBannerImagePreview, setCategoryBannerImagePreview] = useState<string>("")
  const [categoryBannerMobileImagePreview, setCategoryBannerMobileImagePreview] = useState<string>("")
  const [isUploadingCategoryBannerImage, setIsUploadingCategoryBannerImage] = useState(false)
  const [isUploadingCategoryBannerMobileImage, setIsUploadingCategoryBannerMobileImage] = useState(false)
  const [isUploadingUpgradeBannerMobileImage, setIsUploadingUpgradeBannerMobileImage] = useState(false)
  const [upgradeBannerMobileImagePreview, setUpgradeBannerMobileImagePreview] = useState<string>("")

  // Remington settings state and functions
  const [remingtonSettings, setRemingtonSettings] = useState<RemingtonSettings>({
    title: "",
    image_url: "",
    button_link: "",
  })
  const [remingtonImageFile, setRemingtonImageFile] = useState<File | null>(null)
  const [remingtonImagePreview, setRemingtonImagePreview] = useState<string>("")

  // Delivery settings state
  const [deliverySettings, setDeliverySettings] = useState({
    free_delivery_threshold: 100,
    econt_office_price: 1.79,
    econt_address_price: 2.68
  })
  const [deliverySettingsLoading, setDeliverySettingsLoading] = useState(true)

  // Homepage section visibility state
  const [sectionVisibility, setSectionVisibility] = useState({
    gold: true,
    equipment: true,
    cars: true
  })
  const [sectionVisibilityLoading, setSectionVisibilityLoading] = useState(true)

  // Root "Категории" card images (Злато / Сребро)
  const [categoryRootImages, setCategoryRootImages] = useState<{ gold: string; silver: string }>({
    gold: "",
    silver: "",
  })
  const [categoryRootImagesLoading, setCategoryRootImagesLoading] = useState(true)
  const [uploadingCategoryRootImage, setUploadingCategoryRootImage] = useState<"gold" | "silver" | null>(null)
  // Uploading state for the per-category homepage image in the gold/silver category forms
  const [uploadingCategoryFormImage, setUploadingCategoryFormImage] = useState<"gold" | "silver" | null>(null)

  const [goldCategories, setGoldCategories] = useState<GoldCategory[]>([])
  const [goldCategoriesLoading, setGoldCategoriesLoading] = useState(true)
  const [goldCategoryDialogOpen, setGoldCategoryDialogOpen] = useState(false)

  // Silver categories state
  const [silverCategories, setSilverCategories] = useState<SilverCategory[]>([])
  const [silverCategoriesLoading, setSilverCategoriesLoading] = useState(true)
  const [silverCategoryDialogOpen, setSilverCategoryDialogOpen] = useState(false)
  const [editingSilverCategory, setEditingSilverCategory] = useState<SilverCategory | null>(null)
  const [silverCategoryFormData, setSilverCategoryFormData] = useState({
    name: "",
    display_order: 0,
    is_active: true,
    parent_id: null as number | null,
    show_on_homepage: false,
    homepage_image: "",
    homepage_order: 0,
  })
  const [deletingSilverCategory, setDeletingSilverCategory] = useState<SilverCategory | null>(null)
  const [uploadingSilverImages, setUploadingSilverImages] = useState<{ [key: number]: boolean }>({})
  const [globalSilverPricePerGram, setGlobalSilverPricePerGram] = useState<number>(0)

  // Metal prices state for buy gold/silver calculator
  const [metalPrices, setMetalPrices] = useState<{
    id: number
    metal_type: string
    purity: string
    purity_label: string
    price_per_gram: number
    display_order: number
    is_active: boolean
    updated_at: string
  }[]>([])
  const [metalPricesLoading, setMetalPricesLoading] = useState(true)
  const [editingMetalPriceId, setEditingMetalPriceId] = useState<number | null>(null)
  const [editingMetalPriceValue, setEditingMetalPriceValue] = useState("")

  // Live gold price state
  const [liveGoldPrice, setLiveGoldPrice] = useState<{
    success: boolean
    source: string
    timestamp: number
    currency: string
    prices: {
      price_per_ounce: number
      price_per_gram: number
      price_gram_24k: number
      price_gram_22k: number
      price_gram_21k: number
      price_gram_18k: number
      price_gram_14k: number
    }
    change: number
    change_percent: number
  } | null>(null)
  const [liveGoldPriceLoading, setLiveGoldPriceLoading] = useState(false)
  const [editingGoldCategory, setEditingGoldCategory] = useState<GoldCategory | null>(null)
  const [goldCategoryFormData, setGoldCategoryFormData] = useState({
    name: "",
    display_order: 0,
    is_active: true,
    parent_id: null as number | null,
    show_on_homepage: false,
    homepage_image: "",
    homepage_order: 0,
  })
  const [deletingGoldCategory, setDeletingGoldCategory] = useState<GoldCategory | null>(null)

  const [activeTab, setActiveTab] = useState("home-banners")

  // SEO Settings state
  const [seoSettings, setSeoSettings] = useState<HomepageSeoSettings>({
    site_name: "КЕШ",
    title: "КЕШ - Онлайн магазин за електроника, коли и злато",
    description: "КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута.",
    keywords: "КЕШ, електроника, коли, злато, онлайн магазин",
    og_title: "",
    og_description: "",
    og_image: "",
    og_image_alt: "",
    og_image_width: 1200,
    og_image_height: 630,
    og_type: "website",
    og_locale: "bg_BG",
    og_site_name: "",
    og_url: "",
    twitter_card: "summary_large_image",
    twitter_site: "",
    twitter_creator: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    twitter_image_alt: "",
    author: "КЕШ",
    robots: "index, follow",
    googlebot: "index, follow",
    bingbot: "index, follow",
    revisit_after: "7 days",
    rating: "general",
    referrer: "origin-when-cross-origin",
    canonical_url: "",
    alternate_languages: [],
    logo_url: "/kesh-logo.png",
    logo_alt: "КЕШ Logo",
    logo_width: 110,
    logo_height: 40,
    favicon_url: "/icon.svg",
    apple_touch_icon: "/apple-icon.png",
    theme_color: "#D4AF37",
    ms_tile_color: "#ffffff",
    background_color: "#ffffff",
    google_site_verification: "",
    bing_site_verification: "",
    yandex_verification: "",
    facebook_domain_verification: "",
    json_ld_organization: null,
    json_ld_website: null,
    json_ld_local_business: null,
    json_ld_breadcrumb: null,
    enable_google_analytics: false,
    google_analytics_id: "",
    enable_facebook_pixel: false,
    facebook_pixel_id: "",
    enable_google_tag_manager: false,
    google_tag_manager_id: "",
    custom_head_tags: "",
  })
  const [seoLoading, setSeoLoading] = useState(true)
  const [seoSaving, setSeoSaving] = useState(false)
  const [seoActiveSection, setSeoActiveSection] = useState("basic")

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  const handleHomeBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setHomeBannerImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Blob
    setIsUploadingHomeBannerImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setHomeBannerFormData({ ...homeBannerFormData, image_url: data.url })
      toast({
        title: "Успех",
        description: "Снимката е качена успешно",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Грешка",
        description: "Грешка при качване на снимката",
        variant: "destructive",
      })
    } finally {
      setIsUploadingHomeBannerImage(false)
    }
  }

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: "бензин",
    transmission: "автоматична", // Changed default to 'автоматична'
    color: "черна", // Added default color
    engine_size: "", // Changed from number to string to allow for "1.6" etc.
    horsepower: 0,
    doors: 4,
    seats: 5,
    condition: "нова",
    description: "",
    image_url: "",
    images: [] as string[],
    location: "КЕШ Шумен",
    status: "available",
    promotions: 0, // Changed from string to number
    store_id: null as number | null,
  })

  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    image_url: "",
    alt_text: "",
    link_url: "",
    display_order: 0,
    is_active: true,
  })

const [homeBannerFormData, setHomeBannerFormData] = useState({
  image_url: "",
  alt_text: "",
  link_url: "",
  display_order: 0,
  is_active: true,
  is_mobile: false,
  })
  
  const [categoryBannerFormData, setCategoryBannerFormData] = useState({
    category_type: "equipment",
    category_id: null as number | null,
    title: "",
    subtitle: "",
    image_url: "",
    mobile_image_url: "",
    link_url: "",
    link_text: "Научи повече",
    is_active: true,
    display_order: 0,
    start_date: "",
    end_date: "",
  })
  
  // Specification templates state
  const [specificationTemplates, setSpecificationTemplates] = useState<{ id: number; name: string }[]>([])
  const [specificationTemplatesLoading, setSpecificationTemplatesLoading] = useState(true)
  const [newSpecName, setNewSpecName] = useState("")

  const [equipmentFormData, setEquipmentFormData] = useState({
    name: "",
    category: "",
    category_id: null as number | null, // Added category_id for linking to equipment_categories
    subcategory_id: null as number | null, // Added subcategory_id for subcategory selection
    brand: "",
    model: "",
    oborudvane: "",
    sku: "",
    price: 0,
    condition: "Ново",
    image_url: "",
    images: [] as string[],
    description: "",
    features: "",
    specifications: [] as { name: string; value: string }[], // Added specifications as name-value pairs
    stock_quantity: 1,
    location: "КЕШ Шумен",
    status: "available",
    promotions: 0, // Changed from string to number
    store_id: null as number | null,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  })

  // When true, the equipment SEO fields are auto-generated from the other
  // fields. Set to false as soon as the admin manually edits an SEO field.
  const equipmentSeoAuto = useRef(true)

  // Regenerate the SEO fields whenever the source fields change (unless the
  // admin has manually overridden them for this product).
  useEffect(() => {
    if (!equipmentSeoAuto.current) return
    const generated = generateEquipmentSeo(equipmentFormData)
    setEquipmentFormData((prev) => {
      if (
        prev.seo_title === generated.seo_title &&
        prev.seo_description === generated.seo_description &&
        prev.seo_keywords === generated.seo_keywords
      ) {
        return prev
      }
      return { ...prev, ...generated }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    equipmentFormData.name,
    equipmentFormData.brand,
    equipmentFormData.model,
    equipmentFormData.category,
    equipmentFormData.condition,
    equipmentFormData.price,
    equipmentFormData.description,
    equipmentFormData.specifications,
  ])

const [goldFormData, setGoldFormData] = useState({
  gold_type: "",
  weight_grams: 0,
  purity_percentage: 100, // This field name is being changed in the updates
  price_per_gram: 0, // Changed from number to string to allow for "0.00"
  total_amount: 0,
  currency: "EUR", // Changed from string to number
  description: "",
  status: "available",
  notes: "",
  images: [] as string[],
  promotions: 0 as number | null,
  store_id: null as number | null,
  category_id: null as number | null, // Added category_id
  subcategory_id: null as number | null, // Added subcategory_id
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
})

  const [silverFormData, setSilverFormData] = useState({
  silver_type: "",
  weight_grams: 0,
  purity_percentage: 92.5,
  price_per_gram: 0,
  total_amount: 0,
  currency: "EUR",
  description: "",
  status: "available",
  notes: "",
  images: [] as string[],
  promotions: 0 as number | null,
  store_id: null as number | null,
  category_id: null as number | null,
  subcategory_id: null as number | null,
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
})

  // Effect to re-fetch store-specific data when currentUser changes (after login)
  useEffect(() => {
    if (currentUser && isAuthenticated) {
      const storeId = currentUser.role === 'worker' && currentUser.store_id ? currentUser.store_id : null
      fetchCars(storeId)
      fetchEquipment(storeId)
      fetchGold(storeId)
      fetchSilver(storeId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isAuthenticated])

  useEffect(() => {
    // Run database migrations
    fetch('/api/setup/add-sku-column', { method: 'POST' }).catch(() => {})
    fetch('/api/setup/fix-silver-purity', { method: 'POST' }).catch(() => {})
    
    // Initial data fetch - will fetch all data (no store filter since not logged in yet)
    fetchCars()
    fetchEquipment()
    fetchGold()
    fetchSilver()
    fetchHomeBanners()
    fetchCategoryBanners()
    fetchCategories()
    fetchUsers()
    fetchOrders()
    fetchBanners() // Added fetchBanners here
    fetchMessages()
    // Fetch stores
    fetchStores()
    fetchContactMessages() // Added fetching contact messages
    fetchUpgradeBannerSettings()
    fetchRemingtonSettings() // Fetch Remington settings
    fetchDeliverySettings() // Fetch delivery settings
    fetchSectionVisibility() // Fetch section visibility
  fetchCategoryRootImages() // Fetch root category images
    fetchGoldCategories() // Fetch gold categories
    fetchSilverCategories() // Fetch silver categories
    fetchHomepageSeo() // Fetch SEO settings
    fetchMetalPrices() // Fetch metal prices for calculator
    fetchSpecificationTemplates() // Fetch specification templates for equipment
    fetchAdminWorkers() // Fetch admin workers

    if (isAuthenticated) {
      fetch("/api/promotional-cards")
        .then((res) => res.json())
        .then((data) => {
          setPromotionalCards(data)
          setPromotionalCardsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching promotional cards:", error)
          setPromotionalCardsLoading(false)
        })
    }

    const savedPrice = localStorage.getItem("globalGoldPricePerGram")
    if (savedPrice) {
      setGlobalGoldPricePerGram(Number.parseFloat(savedPrice))
    }
    
    const savedSilverPrice = localStorage.getItem("globalSilverPricePerGram")
    if (savedSilverPrice) {
      setGlobalSilverPricePerGram(Number.parseFloat(savedSilverPrice))
    }
  }, [isAuthenticated]) // Added isAuthenticated to dependency array

  useEffect(() => {
    if (goldFormData.weight_grams > 0 && globalGoldPricePerGram > 0) {
      const total = goldFormData.weight_grams * globalGoldPricePerGram
      setGoldFormData((prev) => ({ ...prev, total_amount: Number(total.toFixed(2)) }))
    } else if (goldFormData.weight_grams === 0 || globalGoldPricePerGram === 0) {
      setGoldFormData((prev) => ({
        ...prev,
        total_amount: 0, // Reset total amount if inputs are zero or invalid
      }))
    }
  }, [goldFormData.weight_grams, globalGoldPricePerGram])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    try {
      const response = await fetch("/api/admin-workers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
        setIsAuthenticated(true)
        setLoginError("")
        // Set active tab to first accessible tab
        if (userData.role === "admin") {
          setActiveTab("home-banners")
        } else if (userData.allowed_tabs && userData.allowed_tabs.length > 0) {
          setActiveTab(userData.allowed_tabs[0])
        }
        toast({
          title: "Успешно влизане",
          description: `Добре дошли, ${userData.first_name || userData.username}!`,
        })
      } else {
        // Fallback to hardcoded admin for initial setup
        if (username === "admin" && password === "admin123") {
          setCurrentUser({
            id: 0,
            username: "admin",
            first_name: "Admin",
            last_name: "User",
            email: null,
            phone: null,
            role: "admin",
            store_id: null,
            store_name: null,
            is_active: true,
            allowed_tabs: allTabs.map(t => t.id),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          setIsAuthenticated(true)
          setLoginError("")
          toast({
            title: "Успешно влизане",
            description: "Добре дошли в админ панела.",
          })
        } else {
          const error = await response.json()
          setLoginError(error.error || "Грешно потребителско име или парола")
          toast({
            title: "Грешка при вход",
            description: "Моля, проверете вашето потребителско име и парола.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      // Fallback to hardcoded admin if API fails
      if (username === "admin" && password === "admin123") {
        setCurrentUser({
          id: 0,
          username: "admin",
          first_name: "Admin",
          last_name: "User",
          email: null,
          phone: null,
          role: "admin",
          store_id: null,
          store_name: null,
          is_active: true,
          allowed_tabs: allTabs.map(t => t.id),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setIsAuthenticated(true)
        setLoginError("")
        toast({
          title: "Успешно влизане",
          description: "Добре дошли в админ панела.",
        })
      } else {
        setLoginError("Грешно потребителско име или парола")
        toast({
          title: "Грешка при вход",
          description: "Моля, проверете вашето потребителско име и парола.",
          variant: "destructive",
        })
      }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setUsername("")
    setPassword("")
    toast({
      title: "Успешен изход",
      description: "Вие излязохте от админ панела.",
    })
  }

  const fetchCars = async (userStoreId?: number | null) => {
    try {
      // Use the provided storeId or get from currentUser if they are a worker with a store
      const storeIdToUse = userStoreId !== undefined ? userStoreId : 
        (currentUser?.role === 'worker' && currentUser?.store_id ? currentUser.store_id : null)
      
      const url = storeIdToUse ? `/api/cars?store_id=${storeIdToUse}` : "/api/cars"
      const response = await fetch(url, { cache: "no-store" })
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("[v0] Error fetching cars:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на колите",
        variant: "destructive",
      })
    } finally {
      // setLoading(false) // This `loading` state is unused and can be removed.
    }
  }

  const fetchHomepageSeo = async () => {
    try {
      setSeoLoading(true)
      const response = await fetch("/api/homepage-seo")
      if (!response.ok) {
        console.error("[v0] Failed to fetch SEO settings:", response.statusText)
        return
      }
      const data = await response.json()
      setSeoSettings(data)
    } catch (error) {
      console.error("[v0] Error fetching SEO settings:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на SEO настройките",
        variant: "destructive",
      })
    } finally {
      setSeoLoading(false)
    }
  }

  const saveHomepageSeo = async () => {
    try {
      setSeoSaving(true)
      const response = await fetch("/api/homepage-seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seoSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save SEO settings")
      }

      const data = await response.json()
      setSeoSettings(data)
      toast({
        title: "Успех",
        description: "SEO настройките са запазени успешно",
      })
    } catch (error) {
      console.error("[v0] Error saving SEO settings:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на SEO настройките",
        variant: "destructive",
      })
    } finally {
      setSeoSaving(false)
    }
  }

  const handleSeoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "og_image" | "twitter_image" | "favicon_url" | "apple_touch_icon" | "logo_url") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setSeoSettings({ ...seoSettings, [field]: data.url })
      toast({
        title: "Успех",
        description: "Изображението е качено успешно",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Грешка",
        description: "Грешка при качване на изображението",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners")
      if (!response.ok) {
        console.error("[v0] Failed to fetch banners:", response.statusText)
        setBanners([])
        return
      }
      const data = await response.json()
      setBanners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching banners:", error)
      setBanners([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на банерите",
        variant: "destructive",
      })
    } finally {
      setBannersLoading(false)
    }
  }

  const fetchHomeBanners = async () => {
    try {
      const response = await fetch("/api/home-banners")
      if (!response.ok) {
        console.error("[v0] Failed to fetch home banners:", response.statusText)
        setHomeBanners([])
        return
      }
      const data = await response.json()
      setHomeBanners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching home banners:", error)
      setHomeBanners([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на банерите за начална страница",
        variant: "destructive",
      })
    } finally {
      setHomeBannersLoading(false)
    }
  }

  const fetchCategoryBanners = async () => {
    try {
      const response = await fetch("/api/category-banners/all")
      if (!response.ok) {
        console.error("[v0] Failed to fetch category banners:", response.statusText)
        setCategoryBanners([])
        return
      }
      const data = await response.json()
      setCategoryBanners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching category banners:", error)
      setCategoryBanners([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на банерите за категории",
        variant: "destructive",
      })
    } finally {
      setCategoryBannersLoading(false)
    }
  }

  const fetchEquipment = async (userStoreId?: number | null) => {
    try {
      // Use the provided storeId or get from currentUser if they are a worker with a store
      const storeIdToUse = userStoreId !== undefined ? userStoreId : 
        (currentUser?.role === 'worker' && currentUser?.store_id ? currentUser.store_id : null)
      
      const params = new URLSearchParams()
      params.append("admin", "true")
      if (storeIdToUse) {
        params.append("store_id", storeIdToUse.toString())
      }
      
      const response = await fetch(`/api/equipment?${params.toString()}`, { cache: "no-store" })
      if (!response.ok) {
        console.error("[v0] Failed to fetch equipment:", response.statusText)
        setEquipment([])
        return
      }
      const data = await response.json()
      const equipmentData = Array.isArray(data) ? data : []
      setEquipment(equipmentData)
      
      // Extract unique conditions from equipment data and merge with defaults
      const defaultConditions = ["Ново", "Употребявано", "Реновирано"]
      const existingConditions = equipmentData
        .map((item: Equipment) => item.condition)
        .filter((condition: string | null): condition is string => !!condition)
      const uniqueConditions = [...new Set([...defaultConditions, ...existingConditions])]
      setEquipmentConditions(uniqueConditions)
    } catch (error) {
      console.error("[v0] Error fetching equipment:", error)
      setEquipment([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на техниката",
        variant: "destructive",
      })
    } finally {
      setEquipmentLoading(false)
    }
  }

  const fetchGold = async (userStoreId?: number | null) => {
    try {
      // Use the provided storeId or get from currentUser if they are a worker with a store
      const storeIdToUse = userStoreId !== undefined ? userStoreId : 
        (currentUser?.role === 'worker' && currentUser?.store_id ? currentUser.store_id : null)
      
      const params = new URLSearchParams()
      if (storeIdToUse) {
        params.append("store_id", storeIdToUse.toString())
      }
      
      const url = storeIdToUse ? `/api/gold?${params.toString()}` : "/api/gold"
      const response = await fetch(url, { cache: "no-store" })
      if (!response.ok) {
        console.error("[v0] Failed to fetch gold:", response.statusText)
        setGold([])
        return
      }
      const data = await response.json()
      setGold(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching gold:", error)
      setGold([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на златото",
        variant: "destructive",
      })
    } finally {
      setGoldLoading(false)
    }
  }

  const fetchSilver = async (userStoreId?: number | null) => {
    try {
      const storeIdToUse = userStoreId !== undefined ? userStoreId : 
        (currentUser?.role === 'worker' && currentUser?.store_id ? currentUser.store_id : null)
      
      const params = new URLSearchParams()
      if (storeIdToUse) {
        params.append("store_id", storeIdToUse.toString())
      }
      
      const url = storeIdToUse ? `/api/silver?${params.toString()}` : "/api/silver"
      const response = await fetch(url, { cache: "no-store" })
      if (!response.ok) {
        console.error("[v0] Failed to fetch silver:", response.statusText)
        setSilver([])
        return
      }
      const data = await response.json()
      setSilver(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching silver:", error)
      setSilver([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на среброто",
        variant: "destructive",
      })
    } finally {
      setSilverLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setMessagesLoading(false)
    }
  }

  // Fetch specification templates
  const fetchSpecificationTemplates = async () => {
    try {
      const response = await fetch("/api/specification-templates")
      if (response.ok) {
        const data = await response.json()
        setSpecificationTemplates(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching specification templates:", error)
    } finally {
      setSpecificationTemplatesLoading(false)
    }
  }

  // Add a new specification template
  const addSpecificationTemplate = async (name: string) => {
    try {
      const response = await fetch("/api/specification-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (response.ok) {
        const newTemplate = await response.json()
        // Add to local state if not already present
        if (!specificationTemplates.find((t) => t.name === newTemplate.name)) {
          setSpecificationTemplates([...specificationTemplates, newTemplate].sort((a, b) => a.name.localeCompare(b.name)))
        }
        return newTemplate
      }
    } catch (error) {
      console.error("Error adding specification template:", error)
    }
    return null
  }

  // Fetch stores from API
  const fetchStores = async () => {
    setStoresLoading(true)
    try {
      const response = await fetch("/api/stores")
      if (!response.ok) {
        console.error("Failed to fetch stores:", response.statusText)
        setStores([])
        return
      }
      const data = await response.json()
      setStores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching stores:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на обектите",
        variant: "destructive",
      })
    } finally {
      setStoresLoading(false)
    }
  }

  // Fetch contact messages from API
  const fetchContactMessages = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setContactMessages(data)
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error)
    } finally {
      setContactMessagesLoading(false)
    }
  }

  // Fetch upgrade banner settings from API
  const fetchUpgradeBannerSettings = async () => {
    try {
      const response = await fetch("/api/upgrade-banner")
      if (response.ok) {
        const data = await response.json()
        setUpgradeBannerSettings(data)
        if (data.background_image_url) {
          setUpgradeBannerImagePreview(data.background_image_url)
        }
        if (data.mobile_background_image_url) {
          setUpgradeBannerMobileImagePreview(data.mobile_background_image_url)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching upgrade banner settings:", error)
    } finally {
      setUpgradeBannerLoading(false)
    }
  }

  const fetchRemingtonSettings = async () => {
    try {
      const res = await fetch("/api/remington-settings")
      const data = await res.json()
      setRemingtonSettings(data)
      setRemingtonImagePreview(data.image_url)
    } catch (error) {
      console.error("Error fetching Remington settings:", error)
    }
  }

  const fetchDeliverySettings = async () => {
    try {
      setDeliverySettingsLoading(true)
      const res = await fetch("/api/delivery-settings")
      const data = await res.json()
      setDeliverySettings({
        free_delivery_threshold: Number(data.free_delivery_threshold) || 100,
        econt_office_price: Number(data.econt_office_price) || 1.79,
        econt_address_price: Number(data.econt_address_price) || 2.68
      })
    } catch (error) {
      console.error("Error fetching delivery settings:", error)
    } finally {
      setDeliverySettingsLoading(false)
    }
  }

  const saveDeliverySettings = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/delivery-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliverySettings)
      })
      if (res.ok) {
        toast({
          title: "Успешно",
          description: "Настройките за доставка са запазени успешно",
        })
      } else {
        throw new Error("Failed to save delivery settings")
      }
    } catch (error) {
      console.error("Error saving delivery settings:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на настройките за доставка",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchSectionVisibility = async () => {
    try {
      setSectionVisibilityLoading(true)
      const res = await fetch("/api/homepage-visibility")
      const data = await res.json()
      setSectionVisibility({
        gold: data.gold ?? true,
        equipment: data.equipment ?? true,
        cars: data.cars ?? true
      })
    } catch (error) {
      console.error("Error fetching section visibility:", error)
    } finally {
      setSectionVisibilityLoading(false)
    }
  }

  const saveSectionVisibility = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/homepage-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionVisibility)
      })
      if (res.ok) {
        toast({
          title: "Успешно",
          description: "Настройките за вид��мост са запазени успешно",
        })
      } else {
        throw new Error("Failed to save section visibility")
      }
    } catch (error) {
      console.error("Error saving section visibility:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на настройките за видимост",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchCategoryRootImages = async () => {
    try {
      setCategoryRootImagesLoading(true)
      const res = await fetch("/api/homepage-category-images")
      const data = await res.json()
      setCategoryRootImages({
        gold: data.gold ?? "",
        silver: data.silver ?? "",
      })
    } catch (error) {
      console.error("Error fetching category root images:", error)
    } finally {
      setCategoryRootImagesLoading(false)
    }
  }

  const handleCategoryRootImageUpload = async (metal: "gold" | "silver", file: File) => {
    try {
      setUploadingCategoryRootImage(metal)
      const url = await handleImageUpload(file)
      setCategoryRootImages((prev) => ({ ...prev, [metal]: url }))
    } catch (error) {
      console.error("Error uploading category root image:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно качване на изображението",
        variant: "destructive",
      })
    } finally {
      setUploadingCategoryRootImage(null)
    }
  }

  const saveCategoryRootImages = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/homepage-category-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryRootImages),
      })
      if (res.ok) {
        toast({
          title: "Успешно",
          description: "Изображенията на категориите са запазени успешно",
        })
      } else {
        throw new Error("Failed to save category images")
      }
    } catch (error) {
      console.error("Error saving category root images:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на изображенията",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchGoldCategories = async () => {
    try {
      const response = await fetch("/api/gold-categories")
      if (response.ok) {
        const data = await response.json()
        // Enrich data with parent_name for display
        const enrichedData = data.map((cat: GoldCategory) => {
          const parent = data.find((p: GoldCategory) => p.id === cat.parent_id)
          return {
            ...cat,
            parent_name: parent ? parent.name : null,
          }
        })
        setGoldCategories(enrichedData)
      }
    } catch (error) {
      console.error("Error fetching gold categories:", error)
    } finally {
      setGoldCategoriesLoading(false)
    }
  }

  const fetchSilverCategories = async () => {
    try {
      const response = await fetch("/api/silver-categories")
      if (response.ok) {
        const data = await response.json()
        const enrichedData = data.map((cat: SilverCategory) => {
          const parent = data.find((p: SilverCategory) => p.id === cat.parent_id)
          return {
            ...cat,
            parent_name: parent ? parent.name : null,
          }
        })
        setSilverCategories(enrichedData)
      }
    } catch (error) {
      console.error("Error fetching silver categories:", error)
    } finally {
      setSilverCategoriesLoading(false)
    }
  }

  // Pre-existing function for fetching gold sales, commented out as it's not defined
  // const fetchGoldSales = async () => { ... }

  // Fetch admin workers
  const fetchAdminWorkers = async () => {
    setAdminWorkersLoading(true)
    try {
      const response = await fetch("/api/admin-workers")
      if (response.ok) {
        const data = await response.json()
        setAdminWorkers(data)
      }
    } catch (error) {
      console.error("Error fetching admin workers:", error)
    } finally {
      setAdminWorkersLoading(false)
    }
  }

  // Handle admin worker form submit
  const handleAdminWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAdminWorker
        ? `/api/admin-workers/${editingAdminWorker.id}`
        : "/api/admin-workers"
      const method = editingAdminWorker ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminWorkerFormData),
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: editingAdminWorker
            ? "Потребителят е обновен успешно"
            : "Потребителят е създаден успешно",
        })
        setAdminWorkerDialogOpen(false)
        setEditingAdminWorker(null)
        resetAdminWorkerForm()
        fetchAdminWorkers()
      } else {
        const error = await response.json()
        toast({
          title: "Грешка",
          description: error.error || "Неуспешна операция",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving admin worker:", error)
      toast({
        title: "Грешка",
        description: "Грешка при запазване",
        variant: "destructive",
      })
    }
  }

  // Delete admin worker
  const handleDeleteAdminWorker = async () => {
    if (!deletingAdminWorkerId) return
    try {
      const response = await fetch(`/api/admin-workers/${deletingAdminWorkerId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Потребителят е изтрит успешно",
        })
        fetchAdminWorkers()
      } else {
        const error = await response.json()
        toast({
          title: "Грешка",
          description: error.error || "Неуспешно изтриване",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting admin worker:", error)
      toast({
        title: "Грешка",
        description: "Грешка при изтриване",
        variant: "destructive",
      })
    } finally {
      setDeleteAdminWorkerDialogOpen(false)
      setDeletingAdminWorkerId(null)
    }
  }

  // Reset admin worker form
  const resetAdminWorkerForm = () => {
    setAdminWorkerFormData({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "worker",
      store_id: null,
      is_active: true,
      allowed_tabs: ["equipment", "gold", "cars"],
      hide_global_price: false,
    })
  }

  // Edit admin worker
  const openEditAdminWorker = (worker: AdminWorker) => {
    setEditingAdminWorker(worker)
    setAdminWorkerFormData({
      username: worker.username,
      password: "", // Don't show password
      first_name: worker.first_name || "",
      last_name: worker.last_name || "",
      email: worker.email || "",
      phone: worker.phone || "",
      role: worker.role,
      store_id: worker.store_id,
      is_active: worker.is_active,
      allowed_tabs: worker.allowed_tabs || ["equipment", "gold", "cars"],
      hide_global_price: worker.hide_global_price || false,
    })
    setAdminWorkerDialogOpen(true)
  }

  // Check if user has access to a tab
  const hasTabAccess = (tabId: string) => {
    if (!currentUser) return false
    if (currentUser.role === "admin") return true
    return currentUser.allowed_tabs?.includes(tabId) || false
  }

  // Handle tab change and close mobile sidebar
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setMobileSidebarOpen(false)
  }

  // Fetch metal prices for calculator
  const fetchMetalPrices = async () => {
    try {
      const response = await fetch("/api/metal-prices")
      if (response.ok) {
        const data = await response.json()
        setMetalPrices(data)
      }
    } catch (error) {
      console.error("Error fetching metal prices:", error)
    } finally {
      setMetalPricesLoading(false)
    }
  }

  // Update metal price
  const handleUpdateMetalPrice = async (id: number, newPrice: number) => {
    try {
      const response = await fetch("/api/metal-prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price_per_gram: newPrice }),
      })
      if (response.ok) {
        toast({
          title: "Успех",
          description: "Цената е обновена успешно",
        })
        fetchMetalPrices()
        setEditingMetalPriceId(null)
        setEditingMetalPriceValue("")
      } else {
        throw new Error("Failed to update price")
      }
    } catch (error) {
      console.error("Error updating metal price:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно обновяване на цената",
        variant: "destructive",
      })
    }
  }

  // Fetch live gold price from API
  const fetchLiveGoldPrice = async () => {
    setLiveGoldPriceLoading(true)
    try {
      const response = await fetch("/api/gold-price")
      if (response.ok) {
        const data = await response.json()
        setLiveGoldPrice(data)
      }
    } catch (error) {
      console.error("Error fetching live gold price:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на актуалната цена на златото",
        variant: "destructive",
      })
    } finally {
      setLiveGoldPriceLoading(false)
    }
  }

  // Apply live gold price to global price
  const applyLiveGoldPrice = (karat: number) => {
    if (!liveGoldPrice) return
    
    let price = liveGoldPrice.prices.price_gram_24k
    switch (karat) {
      case 24:
        price = liveGoldPrice.prices.price_gram_24k
        break
      case 22:
        price = liveGoldPrice.prices.price_gram_22k
        break
      case 21:
        price = liveGoldPrice.prices.price_gram_21k
        break
      case 18:
        price = liveGoldPrice.prices.price_gram_18k
        break
      case 14:
        price = liveGoldPrice.prices.price_gram_14k
        break
    }
    
    setGlobalGoldPricePerGram(Number(price.toFixed(2)))
    toast({
      title: "Успех",
      description: `Цената за ${karat}К злато е приложена: ${price.toFixed(2)} €/гр`,
    })
  }

const fetchCategories = async () => {
  try {
  const response = await fetch("/api/equipment/categories?includeInactive=true")
  if (response.ok) {
  const data = await response.json()
  setCategories(data)
  }
  } catch (error) {
  console.error("Error fetching categories:", error)
  }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        console.error("Failed to fetch users:", response.statusText)
        setUsers([])
        return
      }
      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на клиентите",
        variant: "destructive",
      })
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (!response.ok) {
        console.error("Failed to fetch orders:", response.statusText)
        setOrders([])
        return
      }
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на поръчките",
        variant: "destructive",
      })
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update order")

      toast({
        title: "Успех",
        description: "Статусът на поръчката е обновен",
      })

      fetchOrders()
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно обновяване на поръчката",
        variant: "destructive",
      })
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCategory ? `/api/equipment/categories/${editingCategory.id}` : "/api/equipment/categories"

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...categoryFormData,
          images: categoryFormData.images.filter((img) => img.trim() !== ""), // Filter empty images before sending
        }),
      })

      if (response.ok) {
        fetchCategories()
        setCategoryDialogOpen(false)
        resetCategoryForm()
      }
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      display_order: category.display_order || 0,
      is_active: category.is_active,
      images: category.images || [], // Added images to edit form
      parent_id: category.parent_id || null, // Added parent_id to edit form
    })
    setCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return

    try {
      const response = await fetch(`/api/equipment/categories/${deletingCategoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCategories()
        setDeleteCategoryDialogOpen(false)
        setDeletingCategoryId(null)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category")
    }
  }

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryFormData({
      name: "",
      description: "",
      icon: "",
      display_order: 0,
      is_active: true,
      images: [], // Added images to reset
      parent_id: null, // Added parent_id to reset
    })
  }

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този абонамент?")) return

    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id))
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  // New handler for marking contact messages as read
  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
      })

      if (response.ok) {
        setContactMessages(contactMessages.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)))
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  // New handler for deleting contact messages
  const handleDeleteContactMessage = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете това съобщение?")) return

    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setContactMessages(contactMessages.filter((msg) => msg.id !== id))
      }
    } catch (error) {
      console.error("Error deleting contact message:", error)
    }
  }

  // Added store form handling functions
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingStore ? `/api/stores/${editingStore.id}` : "/api/stores"
      const method = editingStore ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeFormData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to save store")
      }

      toast({
        title: "Успех",
        description: editingStore ? "Обектът е обновен успешно" : "Обектът е добавен успешно",
      })

      setStoreDialogOpen(false)
      resetStoreForm()
      fetchStores()
    } catch (error) {
      console.error("Error saving store:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно запазване на обекта",
        variant: "destructive",
      })
    }
  }

const handleEditStore = (store: Store) => {
  setEditingStore(store)
  setStoreFormData({
  name: store.name,
  address: store.address,
  city: store.city,
  neighborhood: store.neighborhood || "",
  working_hours: store.working_hours,
  weekly_hours: store.weekly_hours || defaultWeeklyHours,
  image_url: store.image_url || "",
  rating: store.rating,
  is_24_7: store.is_24_7,
  latitude: store.latitude,
  longitude: store.longitude,
  google_maps_url: store.google_maps_url || "",
  phone: store.phone || "",
  })
  setStoreDialogOpen(true)
  }

  const handleDeleteStore = async (storeId: number) => {
    if (!storeId) return

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to delete store")
      }

      toast({
        title: "Успех",
        description: "Обектът е изтрит успешно",
      })

      setDeleteStoreDialogOpen(false)
      setDeletingStoreId(null)
      fetchStores()
    } catch (error) {
      console.error("Error deleting store:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на обекта",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!userId) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast({
        title: "Успех",
        description: "Клиентът е изтрит успешно",
      })

      setDeletingUserId(null)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на клиента",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    if (!orderId) return

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error:", errorData)
        throw new Error(errorData.error || "Failed to delete order")
      }

      toast({
        title: "Успех",
        description: "Поръчката е изтрита успешно",
      })

      setDeletingOrderId(null)
      fetchOrders()
    } catch (error) {
      console.error("Error deleting order:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на поръчката",
        variant: "destructive",
      })
    }
  }

const resetStoreForm = () => {
  setEditingStore(null)
  setStoreFormData({
  name: "",
  address: "",
  city: "",
  neighborhood: "",
  working_hours: "",
  weekly_hours: defaultWeeklyHours,
  image_url: "",
  rating: 0,
  is_24_7: false,
  latitude: null,
  longitude: null,
  google_maps_url: "",
  phone: "",
  })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : "/api/cars"
      const method = editingCar ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: formData.images.filter((img) => img.trim() !== ""),
        }),
      })

      if (!response.ok) throw new Error("Failed to save car")

      toast({
        title: "Успех",
        description: editingCar ? "Колата е обновена успешно" : "Колата е добавена успешно",
      })

      setDialogOpen(false)
      resetForm()
      fetchCars()
    } catch (error) {
      console.error("[v0] Error saving car:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на колата",
        variant: "destructive",
      })
    }
  }

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : "/api/banners"
      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerFormData),
      })

      if (!response.ok) throw new Error("Failed to save banner")

      toast({
        title: "Успех",
        description: editingBanner ? "Банерът е обновена успешно" : "Банерът е добавен успешно",
      })

      setBannerDialogOpen(false)
      resetBannerForm()
      fetchBanners()
    } catch (error) {
      console.error("[v0] Error saving banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на банера",
        variant: "destructive",
      })
    }
  }

  const handleHomeBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingHomeBanner ? `/api/home-banners/${editingHomeBanner.id}` : "/api/home-banners"
      const method = editingHomeBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeBannerFormData),
      })

      if (!response.ok) throw new Error("Failed to save home banner")

      toast({
        title: "Успех",
        description: editingHomeBanner ? "Банерът е обновен успешно" : "Банерът е добавен успешно",
      })

      setHomeBannerDialogOpen(false)
      resetHomeBannerForm()
      fetchHomeBanners()
    } catch (error) {
      console.error("[v0] Error saving home banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на банера",
        variant: "destructive",
      })
    }
  }

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingEquipment ? `/api/equipment/${editingEquipment.id}` : "/api/equipment"
      const method = editingEquipment ? "PUT" : "POST"

      const featuresArray = equipmentFormData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...equipmentFormData,
          features: featuresArray,
          images: equipmentFormData.images.filter((img) => img.trim() !== ""),
          specifications: equipmentFormData.specifications.filter(s => s.name.trim() !== "" && s.value.trim() !== ""),
        }),
      })

      if (!response.ok) throw new Error("Failed to save equipment")

      toast({
        title: "Успех",
        description: editingEquipment ? "Техниката е обновена успешн����" : "Техниката е добавена успешно",
      })

      setEquipmentDialogOpen(false)
      resetEquipmentForm()
      fetchEquipment()
    } catch (error) {
      console.error("[v0] Error saving equipment:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на техниката",
        variant: "destructive",
      })
    }
  }

  const handleSaveGlobalGoldPrice = async () => {
    if (globalGoldPricePerGram <= 0) {
      toast({
        title: "Грешка",
        description: "Моля, въведете валидна цена",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Update all gold products in the database
      const response = await fetch("/api/gold", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_per_gram: globalGoldPricePerGram }),
      })

      if (!response.ok) {
        throw new Error("Failed to update gold prices")
      }

      const result = await response.json()

      // Save to localStorage for persistence
      localStorage.setItem("globalGoldPricePerGram", globalGoldPricePerGram.toString())

      // Refresh the gold list to show updated prices
      const goldResponse = await fetch("/api/gold")
      if (goldResponse.ok) {
        const goldData = await goldResponse.json()
        setGold(goldData)
      }

      toast({
        title: "Успех",
        description: `Глобалната цена е запазена и ${result.updated_count} продукта са актуализирани`,
      })
      setGoldPriceDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error saving global gold price:", error)
      toast({
        title: "Грешка",
        description: "Неуспе��но запазване на глобалната цена",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseGlobalPrice = () => {
    if (globalGoldPricePerGram > 0) {
      setGoldFormData((prev) => ({
        ...prev,
        price_per_gram: globalGoldPricePerGram,
      }))
    }
  }

  const handleSaveGlobalSilverPrice = async () => {
    if (globalSilverPricePerGram <= 0) {
      toast({
        title: "Грешка",
        description: "Моля, въведете валидна цена",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Update all silver products in the database
      const response = await fetch("/api/silver", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price_per_gram: globalSilverPricePerGram }),
      })

      if (!response.ok) {
        throw new Error("Failed to update silver prices")
      }

      const result = await response.json()

      // Save to localStorage for persistence
      localStorage.setItem("globalSilverPricePerGram", globalSilverPricePerGram.toString())

      // Refresh the silver list to show updated prices
      const silverResponse = await fetch("/api/silver")
      if (silverResponse.ok) {
        const silverData = await silverResponse.json()
        setSilver(silverData)
      }

      toast({
        title: "Успех",
        description: `Глобалната цена е запазена и ${result.updated_count || 0} продукта са актуализирани`,
      })
      setSilverPriceDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error saving global silver price:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на глобалната цена",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoldSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (globalGoldPricePerGram <= 0 && !editingGold) {
      // Allow editing without global price set
      alert("Моля, първо задайте глобалната цена на грам злато")
      return
    }

    setIsSubmitting(true)
    try {
      const url = editingGold ? `/api/gold/${editingGold.id}` : "/api/gold"
      const method = editingGold ? "PUT" : "POST"

      console.log("[v0] Submitting gold data:", goldFormData)
      console.log("[v0] URL:", url, "Method:", method)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...goldFormData,
          price_per_gram: editingGold ? goldFormData.price_per_gram : globalGoldPricePerGram, // Use current input for editing, global for new
          currency: "EUR",
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Server error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to save gold")
      }

      toast({
        title: "Успех",
        description: editingGold ? "Златото е обновено успешно" : "Златото е добавено успешно",
      })

      setGoldDialogOpen(false)
      resetGoldForm()
      fetchGold()
    } catch (error) {
      console.error("[v0] Error saving gold:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно запазване на златото",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSilverSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (globalSilverPricePerGram <= 0 && !editingSilver) {
      alert("Моля, първо задайте глобалната цена на грам сребро")
      return
    }

    setIsSubmitting(true)
    try {
      const url = editingSilver ? `/api/silver/${editingSilver.id}` : "/api/silver"
      const method = editingSilver ? "PUT" : "POST"

      console.log("[v0] Submitting silver data:", silverFormData)

      // Calculate total_amount from weight and price per gram
      const pricePerGram = editingSilver ? silverFormData.price_per_gram : globalSilverPricePerGram
      const calculatedTotal = silverFormData.weight_grams * pricePerGram

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...silverFormData,
          price_per_gram: pricePerGram,
          total_amount: calculatedTotal,
          currency: "EUR",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Server error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to save silver")
      }

      toast({
        title: "Успех",
        description: editingSilver ? "Среброто е обновено успешно" : "Среброто е добавено успешно",
      })

      setSilverDialogOpen(false)
      resetSilverForm()
      fetchSilver()
    } catch (error) {
      console.error("[v0] Error saving silver:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно запазване на среброто",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (car: CarData) => {
    // Use CarData here
    setEditingCar(car)
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      color: car.color,
      engine_size: car.engine_size, // Keep as string
      horsepower: car.horsepower,
      doors: car.doors,
      seats: car.seats,
      condition: car.condition,
      description: car.description || "",
      image_url: car.image_url || "",
      images: car.images || [],
      location: car.location || "КЕШ Шумен",
      status: car.status || "available",
      promotions: car.promotions || 0, // Ensure it's a number
      store_id: (car as any).store_id || null,
    })
    setDialogOpen(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerFormData({
      title: banner.title,
      image_url: banner.image_url,
      alt_text: banner.alt_text || "",
      link_url: banner.link_url || "",
      display_order: banner.display_order,
      is_active: banner.is_active,
    })
    setBannerDialogOpen(true)
  }

  const handleEditHomeBanner = (banner: HomeBanner) => {
    setEditingHomeBanner(banner)
    setHomeBannerFormData({
      image_url: banner.image_url,
      alt_text: banner.alt_text || "",
      link_url: banner.link_url || "",
      display_order: banner.display_order,
      is_active: banner.is_active,
      // Added is_mobile field to edit form
      is_mobile: banner.is_mobile,
    })
    setHomeBannerDialogOpen(true)
  }

  const handleEditEquipment = (item: Equipment) => {
    setEditingEquipment(item)
    // Regenerate SEO dynamically from the product's fields when editing.
    equipmentSeoAuto.current = true
    const featuresString = Array.isArray(item.features) ? item.features.join(", ") : ""
    // Parse specifications - handle both array and object formats
    let specs: { name: string; value: string }[] = []
    if (item.specifications) {
      if (Array.isArray(item.specifications)) {
        specs = item.specifications
      } else if (typeof item.specifications === 'object') {
        // Convert object format {key: value} to array format
        specs = Object.entries(item.specifications).map(([name, value]) => ({
          name,
          value: String(value),
        }))
      }
    }
    setEquipmentFormData({
      name: item.name,
      category: item.category,
      category_id: (item as any).category_id || null,
      subcategory_id: (item as any).subcategory_id || null,
      brand: item.brand || "",
      model: item.model || "",
      oborudvane: item.oborudvane || "",
      sku: item.sku || "",
      price: item.price,
      condition: (item as any).condition || "Ново",
      image_url: (item.images && item.images.length > 0 ? item.images[0] : "") || "",
      images: item.images || [],
      description: item.description || "",
      features: featuresString,
      specifications: specs,
      stock_quantity: item.stock_quantity,
      location: item.location,
      status: item.status,
      promotions: item.promotions || 0, // Ensure it's a number
      store_id: (item as any).store_id || null,
      seo_title: item.seo_title || "",
      seo_description: item.seo_description || "",
      seo_keywords: item.seo_keywords || "",
    })
    setNewSpecName("") // Reset new spec name
    setEquipmentDialogOpen(true)
  }

const handleEditGold = (item: Gold) => {
  setEditingGold(item)
  setGoldFormData({
  gold_type: item.gold_type,
  weight_grams: item.weight_grams,
  purity_percentage: item.purity_percentage, // This field name is being changed in the updates
  price_per_gram: item.price_per_gram, // Keep for editing
  total_amount: item.total_amount,
  currency: item.currency, // Keep for editing
  description: item.description || "",
  status: item.status,
  notes: item.notes || "",
  images: item.images || [],
  promotions: item.promotions || 0, // Ensure it's a number
  store_id: (item as any).store_id || null,
  category_id: item.category_id || null, // Added category_id
  subcategory_id: item.subcategory_id || null, // Added subcategory_id
  seo_title: item.seo_title || "",
  seo_description: item.seo_description || "",
  seo_keywords: item.seo_keywords || "",
  })
  setGoldDialogOpen(true)
  }

const handleEditSilver = (item: Silver) => {
  setEditingSilver(item)
  setSilverFormData({
    silver_type: item.silver_type,
    weight_grams: item.weight_grams,
    purity_percentage: item.purity_percentage,
    price_per_gram: item.price_per_gram,
    total_amount: item.total_amount,
    currency: item.currency,
    description: item.description || "",
    status: item.status,
    notes: item.notes || "",
    images: item.images || [],
    promotions: item.promotions || 0,
    store_id: (item as any).store_id || null,
    category_id: item.category_id || null,
    subcategory_id: item.subcategory_id || null,
    seo_title: item.seo_title || "",
    seo_description: item.seo_description || "",
    seo_keywords: item.seo_keywords || "",
  })
  setSilverDialogOpen(true)
}

  const handleDelete = async () => {
    if (!deletingCarId) return

    try {
      const response = await fetch(`/api/cars/${deletingCarId}`, {
        method: "DELETE",
        cache: "no-store",
      })

      if (!response.ok) {
        let serverMessage = ""
        try {
          const body = await response.json()
          serverMessage = body?.details || body?.error || ""
        } catch {}
        throw new Error(serverMessage || `Failed to delete car (${response.status})`)
      }

      toast({
        title: "Успех",
        description: "Колата е изтрита успешно",
      })

      setDeleteDialogOpen(false)
      setDeletingCarId(null)
      fetchCars()
    } catch (error) {
      console.error("[v0] Error deleting car:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на колата",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBanner = async () => {
    if (!deletingBannerId) return

    try {
      const response = await fetch(`/api/banners/${deletingBannerId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete banner")

      toast({
        title: "Успех",
        description: "Банерът е изтрит успешно",
      })

      setDeleteBannerDialogOpen(false)
      setDeletingBannerId(null)
      fetchBanners()
    } catch (error) {
      console.error("[v0] Error deleting banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на банера",
        variant: "destructive",
      })
    }
  }

  const handleDeleteHomeBanner = async () => {
    if (!deletingHomeBannerId) return

    try {
      const response = await fetch(`/api/home-banners/${deletingHomeBannerId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete home banner")

      toast({
        title: "Успех",
        description: "Банерът е изтрит успешно",
      })

      setDeleteHomeBannerDialogOpen(false)
      setDeletingHomeBannerId(null)
      fetchHomeBanners()
    } catch (error) {
      console.error("[v0] Error deleting home banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на банера",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEquipment = async () => {
    if (!deletingEquipmentId) return

    try {
      const response = await fetch(`/api/equipment/${deletingEquipmentId}`, {
        method: "DELETE",
        cache: "no-store",
      })

      if (!response.ok) {
        let serverMessage = ""
        try {
          const body = await response.json()
          serverMessage = body?.details || body?.error || ""
        } catch {}
        throw new Error(serverMessage || `Failed to delete equipment (${response.status})`)
      }

      toast({
        title: "Успех",
        description: "Техниката е изтрита успешно",
      })

      setDeleteEquipmentDialogOpen(false)
      setDeletingEquipmentId(null)
      fetchEquipment()
    } catch (error) {
      console.error("[v0] Error deleting equipment:", error)
      toast({
        title: "Грешка",
        description:
          error instanceof Error ? error.message : "Неуспешно изтриване на техниката",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGold = async () => {
    if (!deletingGoldId) return

    try {
      const response = await fetch(`/api/gold/${deletingGoldId}`, {
        method: "DELETE",
        cache: "no-store",
      })

      if (!response.ok) {
        let serverMessage = ""
        try {
          const body = await response.json()
          serverMessage = body?.details || body?.error || ""
        } catch {}
        throw new Error(serverMessage || `Failed to delete gold (${response.status})`)
      }

      toast({
        title: "Успех",
        description: "Златото е изтрито успешно",
      })

      setDeleteGoldDialogOpen(false)
      setDeletingGoldId(null)
      fetchGold()
    } catch (error) {
      console.error("[v0] Error deleting gold:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на златото",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSilver = async () => {
    if (!deletingSilverId) return

    try {
      const response = await fetch(`/api/silver/${deletingSilverId}`, {
        method: "DELETE",
        cache: "no-store",
      })

      if (!response.ok) {
        let serverMessage = ""
        try {
          const body = await response.json()
          serverMessage = body?.details || body?.error || ""
        } catch {}
        throw new Error(serverMessage || `Failed to delete silver (${response.status})`)
      }

      toast({
        title: "Успех",
        description: "Среброто е изтрито успешно",
      })

      setDeleteSilverDialogOpen(false)
      setDeletingSilverId(null)
      fetchSilver()
    } catch (error) {
      console.error("[v0] Error deleting silver:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Неуспешно изтриване на среброто",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingCar(null)
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel_type: "бензин",
      transmission: "автоматична",
      color: "черна",
      engine_size: "",
      horsepower: 0,
      doors: 4,
      seats: 5,
      condition: "нова",
      description: "",
      image_url: "",
      images: [],
      location: "КЕШ Шумен",
      status: "available",
      promotions: 0, // Ensure it's a number
      store_id: null,
    })
  }

  const resetBannerForm = () => {
    setEditingBanner(null)
    setBannerFormData({
      title: "",
      image_url: "",
      alt_text: "",
      link_url: "",
      display_order: 0,
      is_active: true,
    })
  }

const resetHomeBannerForm = () => {
  setEditingHomeBanner(null)
  setHomeBannerFormData({
  image_url: "",
  alt_text: "",
  link_url: "",
  display_order: 0,
  is_active: true,
  // Added is_mobile field to reset form
  is_mobile: false,
  })
  // Reset image file states as well
  setHomeBannerImageFile(null)
  setHomeBannerImagePreview("")
  }

  const resetCategoryBannerForm = () => {
    setEditingCategoryBanner(null)
    setCategoryBannerFormData({
      category_type: "equipment",
      category_id: null,
      title: "",
      subtitle: "",
      image_url: "",
      mobile_image_url: "",
      link_url: "",
      link_text: "Научи повече",
      is_active: true,
      display_order: 0,
      start_date: "",
      end_date: "",
    })
    setCategoryBannerImagePreview("")
    setCategoryBannerMobileImagePreview("")
  }

  const handleEditCategoryBanner = (banner: any) => {
    setEditingCategoryBanner(banner)
    setCategoryBannerFormData({
      category_type: banner.category_type || "equipment",
      category_id: banner.category_id,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image_url: banner.image_url || "",
      mobile_image_url: banner.mobile_image_url || "",
      link_url: banner.link_url || "",
      link_text: banner.link_text || "Научи повече",
      is_active: banner.is_active ?? true,
      display_order: banner.display_order || 0,
      start_date: banner.start_date || "",
      end_date: banner.end_date || "",
    })
    setCategoryBannerImagePreview("")
    setCategoryBannerMobileImagePreview("")
    setCategoryBannerDialogOpen(true)
  }

  const handleCategoryBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      if (isMobile) {
        setCategoryBannerMobileImagePreview(reader.result as string)
      } else {
        setCategoryBannerImagePreview(reader.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Upload to Blob
    if (isMobile) {
      setIsUploadingCategoryBannerMobileImage(true)
    } else {
      setIsUploadingCategoryBannerImage(true)
    }
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      if (isMobile) {
        setCategoryBannerFormData({ ...categoryBannerFormData, mobile_image_url: data.url })
      } else {
        setCategoryBannerFormData({ ...categoryBannerFormData, image_url: data.url })
      }
    } catch (error) {
      console.error("[v0] Error uploading category banner image:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно качване на изображението",
        variant: "destructive",
      })
    } finally {
      if (isMobile) {
        setIsUploadingCategoryBannerMobileImage(false)
      } else {
        setIsUploadingCategoryBannerImage(false)
      }
    }
  }

  const handleCategoryBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategoryBanner
        ? `/api/category-banners/${editingCategoryBanner.id}`
        : "/api/category-banners"
      const method = editingCategoryBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryBannerFormData),
      })

      if (!response.ok) throw new Error("Failed to save category banner")

      toast({
        title: "Успех",
        description: editingCategoryBanner ? "Банерът е обновен успешно" : "Банерът е добавен успешно",
      })

      setCategoryBannerDialogOpen(false)
      resetCategoryBannerForm()
      fetchCategoryBanners()
    } catch (error) {
      console.error("[v0] Error saving category banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на банера",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategoryBanner = async () => {
    if (!deletingCategoryBannerId) return
    try {
      const response = await fetch(`/api/category-banners/${deletingCategoryBannerId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete category banner")

      toast({
        title: "Успех",
        description: "Банерът е изтрит успешно",
      })

      setDeleteCategoryBannerDialogOpen(false)
      setDeletingCategoryBannerId(null)
      fetchCategoryBanners()
    } catch (error) {
      console.error("[v0] Error deleting category banner:", error)
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на банера",
        variant: "destructive",
      })
    }
  }

  const resetEquipmentForm = () => {
    setEditingEquipment(null)
    setEquipmentProductType("")
    equipmentSeoAuto.current = true
    setEquipmentFormData({
      name: "",
      category: "",
      category_id: null,
      subcategory_id: null,
      brand: "",
      model: "",
      oborudvane: "",
      sku: "",
      price: 0,
      condition: "Ново",
      image_url: "",
      images: [] as string[],
      description: "",
      features: "",
      specifications: [], // Reset specifications
      stock_quantity: 1,
      location: "КЕШ Шумен",
      status: "available",
      promotions: 0, // Ensure it's a number
      store_id: null,
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    })
    setNewSpecName("") // Reset new spec name input
  }

const resetGoldForm = () => {
  setEditingGold(null)
  setGoldFormData({
  gold_type: "",
  weight_grams: 0,
  purity_percentage: 100, // This field name is being changed in the updates
  price_per_gram: 0, // Changed from number to string to allow for "0.00"
  total_amount: 0,
  currency: "EUR", // Changed from string to number
  description: "",
  status: "available",
  notes: "",
  images: [] as string[],
  promotions: 0, // Ensure it's a number
  store_id: null,
  category_id: null, // Reset category_id
  subcategory_id: null, // Reset subcategory_id
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  })
  }

const resetSilverForm = () => {
  setEditingSilver(null)
  setSilverFormData({
  silver_type: "",
    weight_grams: 0,
    purity_percentage: 92.5,
    price_per_gram: 0,
    total_amount: 0,
    currency: "EUR",
    description: "",
    status: "available",
    notes: "",
    images: [] as string[],
    promotions: 0,
    store_id: null,
    category_id: null,
    subcategory_id: null,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  })
}

  const resetGoldCategoryForm = () => {
    setGoldCategoryFormData({
      name: "",
      display_order: 0,
      is_active: true,
      parent_id: null,
      show_on_homepage: false,
      homepage_image: "",
      homepage_order: 0,
    })
    setEditingGoldCategory(null)
  }

  const handleGoldCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingGoldCategory ? `/api/gold-categories/${editingGoldCategory.id}` : "/api/gold-categories"
      const method = editingGoldCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goldCategoryFormData),
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: editingGoldCategory ? "Категорията е обновена успешно" : "Категорията е добавена успешно",
        })
        fetchGoldCategories()
        setGoldCategoryDialogOpen(false)
        resetGoldCategoryForm()
      } else {
        throw new Error("Failed to save gold category")
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на категорията",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGoldCategory = async () => {
    if (!deletingGoldCategory) return

    try {
      const response = await fetch(`/api/gold-categories/${deletingGoldCategory.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Категорията е изтрита успешно",
        })
        fetchGoldCategories()
        fetchGold() // Refresh gold items as their category might have been removed
      } else {
        throw new Error("Failed to delete gold category")
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на категорията",
        variant: "destructive",
      })
    } finally {
      setDeletingGoldCategory(null)
    }
  }

  const resetSilverCategoryForm = () => {
    setSilverCategoryFormData({
      name: "",
      display_order: 0,
      is_active: true,
      parent_id: null,
      show_on_homepage: false,
      homepage_image: "",
      homepage_order: 0,
    })
    setEditingSilverCategory(null)
  }

  const handleSilverCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingSilverCategory ? `/api/silver-categories/${editingSilverCategory.id}` : "/api/silver-categories"
      const method = editingSilverCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(silverCategoryFormData),
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: editingSilverCategory ? "Категорията е обновена успешно" : "��атегорията е добавена успешно",
        })
        fetchSilverCategories()
        setSilverCategoryDialogOpen(false)
        resetSilverCategoryForm()
      } else {
        throw new Error("Failed to save silver category")
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно запазване на категорията",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSilverCategory = async () => {
    if (!deletingSilverCategory) return

    try {
      const response = await fetch(`/api/silver-categories/${deletingSilverCategory.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Категорията е изтрита успешно",
        })
        fetchSilverCategories()
        fetchSilver()
      } else {
        throw new Error("Failed to delete silver category")
      }
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно изтриване на категорията",
        variant: "destructive",
      })
    } finally {
      setDeletingSilverCategory(null)
    }
  }

  const handleSaveUpgradeBanner = async () => {
    try {
      const response = await fetch("/api/upgrade-banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upgradeBannerSettings),
      })

      if (!response.ok) throw new Error("Failed to update")

      toast({
        title: "Успех",
        description: "Банерът за ъпгрейд е обновен успешно",
      })
      fetchUpgradeBannerSettings()
    } catch (error) {
      console.error("Error updating upgrade banner:", error)
      toast({
        title: "Грешка",
        description: "Грешка при обновяване на банера",
        variant: "destructive",
      })
    }
  }

  const handleUpgradeBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setUpgradeBannerImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Blob
    setIsUploadingUpgradeBannerImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setUpgradeBannerSettings({ ...upgradeBannerSettings, background_image_url: data.url })
      toast({
        title: "Успех",
        description: "Снимката е качена успешно",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Грешка",
        description: "Грешка при качване на снимката",
        variant: "destructive",
      })
    } finally {
      setIsUploadingUpgradeBannerImage(false)
    }
  }

  const handleUpgradeBannerMobileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingUpgradeBannerMobileImage(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const { url } = await uploadResponse.json()

      setUpgradeBannerSettings({ ...upgradeBannerSettings, mobile_background_image_url: url })
      setUpgradeBannerMobileImagePreview(url)
    } catch (error) {
      console.error("Error uploading mobile upgrade banner image:", error)
      alert("Грешка при качване на изображението")
    } finally {
      setIsUploadingUpgradeBannerMobileImage(false)
    }
  }

  const handlePromoCardImageUpload = async (position: number, file: File) => {
    setIsUploadingPromoCard(position)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()

      // Update the card in the database
      await fetch("/api/promotional-cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          image_url: data.url,
          link_url: promotionalCards.find((c) => c.position === position)?.link_url || "#",
        }),
      })

      // Refresh cards
      const updatedCards = await fetch("/api/promotional-cards").then((res) => res.json())
      setPromotionalCards(updatedCards)

      toast({
        title: "Успех",
        description: "Снимката е качена успешно",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Грешка",
        description: "Грешка при качване на снимката",
        variant: "destructive",
      })
    } finally {
      setIsUploadingPromoCard(null)
    }
  }

  const handlePromoCardLinkUpdate = async (position: number, link_url: string) => {
    try {
      const card = promotionalCards.find((c) => c.position === position)
      if (!card) return

      await fetch("/api/promotional-cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          image_url: card.image_url,
          link_url,
        }),
      })

      const updatedCards = await fetch("/api/promotional-cards").then((res) => res.json())
      setPromotionalCards(updatedCards)

      toast({
        title: "Успех",
        description: "Линкът е обновен успешно",
      })
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Грешка",
        description: "Грешка при обновяване на линка",
        variant: "destructive",
      })
    }
  }

  const handleRemingtonImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRemingtonImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setRemingtonImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveRemingtonSettings = async () => {
    try {
      let imageUrl = remingtonSettings.image_url

      if (remingtonImageFile) {
        const formData = new FormData()
        formData.append("file", remingtonImageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) throw new Error("Upload failed")

        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      const res = await fetch("/api/remington-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: remingtonSettings.title,
          image_url: imageUrl,
          button_link: remingtonSettings.button_link,
        }),
      })

      if (res.ok) {
        toast({
          title: "Успех",
          description: "Remington настройките са обновени",
        })
        setRemingtonImageFile(null) // Reset file input
        fetchRemingtonSettings()
      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving Remington settings:", error)
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Грешка при запазване на настройките",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
        {/* Header with logo */}
        <div className="py-8 flex justify-center">
          <Link href="/">
            <Image 
              src={settings.logo_url || "/kesh-logo.png"} 
              alt={settings.logo_alt || "Кеш Logo"} 
              width={settings.logo_width || 110} 
              height={settings.logo_height || 40} 
              className="object-contain" 
            />
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-start justify-center px-4 pb-16">
          <div className="w-full max-w-md bg-white p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Админ Панел</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-red-600 font-medium">
                  Потребителско име
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-0 border-b-2 border-gray-300 rounded-none focus:border-red-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none px-0 bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-red-600 font-medium">
                  Парола
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-0 border-b-2 border-gray-300 rounded-none focus:border-red-600 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none px-0 bg-transparent"
                />
              </div>

              {loginError && <div className="text-sm text-red-500 text-center">{loginError}</div>}

              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold mt-6"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Влизане
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-[#1a1a2e] hover:text-gray-700 font-medium hover:underline"
              >
                Към началната страница
              </Link>
            </div>
          </div>
        </div>

        {/* Version number */}
        <div className="text-right text-gray-500 text-xs pb-4 pr-4">
          1.0.0
        </div>
      </div>
    )
  }

  // Initial loading check
  if (
    // loading || // REMOVED: 'loading' is not used for the main page load anymore
    bannersLoading ||
    homeBannersLoading ||
    equipmentLoading ||
    goldLoading ||
    usersLoading ||
    ordersLoading ||
    messagesLoading || // Added messagesLoading to initial loading check
    storesLoading || // Add storesLoading to initial loading check
    contactMessagesLoading || // Add contactMessagesLoading to initial loading check
    upgradeBannerLoading || // Added upgradeBannerLoading to initial loading check
    promotionalCardsLoading || // Added promotionalCardsLoading to initial loading check
    goldCategoriesLoading // Added goldCategoriesLoading
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
        <div className="text-lg text-white">Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a2e]">
      <Toaster />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-white hover:bg-gray-700 rounded-lg"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/">
            <Image 
              src={settings.logo_url || "/kesh-logo.png"} 
              alt={settings.logo_alt || "Кеш Logo"} 
              width={80} 
              height={30} 
              className="object-contain" 
            />
          </Link>
        </div>
        <span className="text-white text-sm font-medium">Админ панел</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Menu */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#1a1a2e] border-r border-gray-700 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:transform-none
      `}>
        <div className="p-6 border-b border-gray-700 hidden lg:block">
          <Link href="/">
            <Image 
              src={settings.logo_url || "/kesh-logo.png"} 
              alt={settings.logo_alt || "Кеш Logo"} 
              width={settings.logo_width || 110} 
              height={settings.logo_height || 40} 
              className="object-contain" 
            />
          </Link>
          <h1 className="text-lg font-semibold text-white mt-4">Админ панел</h1>
        </div>
        
        {/* Mobile sidebar header spacer */}
        <div className="lg:hidden h-16 border-b border-gray-700" />

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Show current user info */}
          {currentUser && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Влязъл като:</p>
              <p className="text-white font-medium">{currentUser.first_name || currentUser.username}</p>
              {currentUser.store_name && (
                <p className="text-xs text-gray-400 mt-1">Офис: {currentUser.store_name}</p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {currentUser.role === "admin" ? "Администратор" : "Служител"}
                </span>
              </div>
            </div>
          )}

          {hasTabAccess("home-banners") && (
            <button
              onClick={() => handleTabChange("home-banners")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "home-banners" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Банери хоум</span>
            </button>
          )}
          {hasTabAccess("upgrade-banner") && (
            <button
              onClick={() => handleTabChange("upgrade-banner")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "upgrade-banner" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Банер ъпгрейд</span>
            </button>
          )}
          {hasTabAccess("category-banners") && (
            <button
              onClick={() => handleTabChange("category-banners")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "category-banners" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Tag className="w-5 h-5" />
              <span>Банери категории</span>
            </button>
          )}
          {hasTabAccess("promotional-cards") && (
            <button
              onClick={() => handleTabChange("promotional-cards")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "promotional-cards" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span>Промо карти</span>
            </button>
          )}
          {hasTabAccess("cars") && (
            <button
              onClick={() => handleTabChange("cars")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "cars" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <CarIcon className="w-5 h-5" />
              <span>Коли</span>
            </button>
          )}
          {hasTabAccess("equipment") && (
            <button
              onClick={() => handleTabChange("equipment")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "equipment" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <MonitorSmartphone className="w-5 h-5" />
              <span>Техника</span>
            </button>
          )}
          {hasTabAccess("categories") && (
            <button
              onClick={() => handleTabChange("categories")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "categories" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Категории</span>
            </button>
          )}
          {hasTabAccess("gold") && (
            <button
              onClick={() => handleTabChange("gold")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "gold" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Coins className="w-5 h-5" />
              <span>Злато</span>
            </button>
          )}
          {hasTabAccess("gold-categories") && (
            <button
              onClick={() => handleTabChange("gold-categories")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "gold-categories" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Злато категории</span>
            </button>
          )}
          {hasTabAccess("silver") && (
            <button
              onClick={() => handleTabChange("silver")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "silver" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Coins className="w-5 h-5" />
              <span>Сребро</span>
            </button>
          )}
          {hasTabAccess("silver-categories") && (
            <button
              onClick={() => handleTabChange("silver-categories")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "silver-categories" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Сребро категории</span>
            </button>
          )}
          {hasTabAccess("metal-prices") && (
            <button
              onClick={() => handleTabChange("metal-prices")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "metal-prices" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Цени метали</span>
            </button>
          )}
          {hasTabAccess("users") && (
            <button
              onClick={() => handleTabChange("users")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "users" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Потребители</span>
            </button>
          )}
          {hasTabAccess("admin-workers") && (
            <button
              onClick={() => handleTabChange("admin-workers")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "admin-workers" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <UserCog className="w-5 h-5" />
              <span>Админ потребители</span>
            </button>
          )}
          {hasTabAccess("orders") && (
            <button
              onClick={() => handleTabChange("orders")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "orders" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Поръчки</span>
            </button>
          )}
          {hasTabAccess("messages") && (
            <button
              onClick={() => handleTabChange("messages")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "messages" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Абонаменти</span>
            </button>
          )}
          {hasTabAccess("stores") && (
            <button
              onClick={() => handleTabChange("stores")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "stores" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span>Магазини</span>
            </button>
          )}
          {hasTabAccess("contact") && (
            <button
              onClick={() => handleTabChange("contact")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "contact" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span>Контакти</span>
            </button>
          )}
                    {hasTabAccess("remington-settings") && (
                      <button
                        onClick={() => handleTabChange("remington-settings")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          activeTab === "remington-settings" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        <span>Remington секция</span>
                      </button>
                    )}
                    {hasTabAccess("delivery-settings") && (
                      <button
                        onClick={() => handleTabChange("delivery-settings")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          activeTab === "delivery-settings" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <Package className="w-5 h-5" />
                        <span>Настройки доставка</span>
                      </button>
                    )}
                    {hasTabAccess("homepage-visibility") && (
                      <button
                        onClick={() => handleTabChange("homepage-visibility")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          activeTab === "homepage-visibility" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <Eye className="w-5 h-5" />
                        <span>Видимост секции</span>
                      </button>
                    )}
                    {hasTabAccess("homepage-category-images") && (
                      <button
                        onClick={() => handleTabChange("homepage-category-images")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          activeTab === "homepage-category-images" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }`}
                      >
                        <ImageIcon className="w-5 h-5" />
                        <span>Изображения категории</span>
                      </button>
                    )}
                    {hasTabAccess("seo-settings") && (
            <button
              onClick={() => handleTabChange("seo-settings")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "seo-settings" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Search className="w-5 h-5" />
              <span>SEO Настройки</span>
            </button>
          )}
                    {hasTabAccess("about-page") && (
            <button
              onClick={() => handleTabChange("about-page")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "about-page" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Компанията</span>
            </button>
          )}
                    {hasTabAccess("faq-page") && (
            <button
              onClick={() => handleTabChange("faq-page")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === "faq-page" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>ЧЗВ</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
            Изход
          </Button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-100 pt-16 lg:pt-0">
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              <TabsTrigger value="home-banners">Home Banners</TabsTrigger>
              <TabsTrigger value="upgrade-banner">Upgrade Banner</TabsTrigger>
              <TabsTrigger value="category-banners">Category Banners</TabsTrigger>
              {/* Added promotional-cards tab trigger */}
              <TabsTrigger value="promotional-cards">Promotional Cards</TabsTrigger>
              <TabsTrigger value="cars">Cars</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="gold">Gold</TabsTrigger>
              <TabsTrigger value="gold-categories">Gold Categories</TabsTrigger>
              <TabsTrigger value="silver">Silver</TabsTrigger>
              <TabsTrigger value="silver-categories">Silver Categories</TabsTrigger>
              <TabsTrigger value="metal-prices">Metal Prices</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              {/* Added Remington settings tab trigger */}
                    <TabsTrigger value="remington-settings">Remington Settings</TabsTrigger>
                    <TabsTrigger value="delivery-settings">Delivery Settings</TabsTrigger>
                    <TabsTrigger value="homepage-visibility">Homepage Visibility</TabsTrigger>
                    <TabsTrigger value="homepage-category-images">Homepage Category Images</TabsTrigger>
                    <TabsTrigger value="seo-settings">SEO Settings</TabsTrigger>
              <TabsTrigger value="admin-workers">Admin Workers</TabsTrigger>
              <TabsTrigger value="about-page">About Page</TabsTrigger>
              <TabsTrigger value="faq-page">FAQ Page</TabsTrigger>
            </TabsList>

            <TabsContent value="home-banners">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Home className="w-6 h-6" />
                    Управление на банери за начална страница
                  </CardTitle>
                  <Dialog open={homeBannerDialogOpen} onOpenChange={setHomeBannerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetHomeBannerForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави банер
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingHomeBanner ? "Редактирай банер" : "Добави нов банер за начална страница"}
                        </DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за банера. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleHomeBannerSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="home-banner-image">Снимка на банера *</Label>
                          <Input
                            id="home-banner-image"
                            type="file"
                            accept="image/*"
                            onChange={handleHomeBannerImageChange}
                            disabled={isUploadingHomeBannerImage}
                          />
                          {isUploadingHomeBannerImage && <p className="text-sm text-muted-foreground">Качва��е...</p>}
                          {(homeBannerImagePreview || homeBannerFormData.image_url) && (
                            <div className="mt-2 border rounded-lg overflow-hidden">
                              <img
                                src={homeBannerImagePreview || homeBannerFormData.image_url || "/placeholder.svg"}
                                alt="Преглед на банера"
                                className="w-full h-auto"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=800"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home-banner-alt-text">Алтернативен текст</Label>
                          <Input
                            id="home-banner-alt-text"
                            value={homeBannerFormData.alt_text}
                            onChange={(e) => setHomeBannerFormData({ ...homeBannerFormData, alt_text: e.target.value })}
                            placeholder="Описание на снимката за достъпност"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home-banner-link-url">URL за пренасочване</Label>
                          <Input
                            id="home-banner-link-url"
                            type="url"
                            value={homeBannerFormData.link_url}
                            onChange={(e) => setHomeBannerFormData({ ...homeBannerFormData, link_url: e.target.value })}
                            placeholder="https://example.com/promo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home-banner-display-order">Ред на показване</Label>
                          <Input
                            id="home-banner-display-order"
                            type="number"
                            value={homeBannerFormData.display_order}
                            onChange={(e) =>
                              setHomeBannerFormData({
                                ...homeBannerFormData,
                                display_order: Number.parseInt(e.target.value),
                              })
                            }
                          />
                          <p className="text-sm text-muted-foreground">По-ниските числа се показват първи</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="home-banner-active"
                            checked={homeBannerFormData.is_active}
                            onCheckedChange={(checked) =>
                              setHomeBannerFormData({ ...homeBannerFormData, is_active: checked })
                            }
                          />
                          <Label htmlFor="home-banner-active">Активен</Label>
                        </div>
                        {/* Added is_mobile field to form */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="home-banner-mobile"
                            checked={homeBannerFormData.is_mobile}
                            onCheckedChange={(checked) =>
                              setHomeBannerFormData({ ...homeBannerFormData, is_mobile: checked })
                            }
                          />
                          <Label htmlFor="home-banner-mobile">За мобилни устройства</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setHomeBannerDialogOpen(false)
                              resetHomeBannerForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingHomeBanner ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {homeBanners.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени банери. Натиснете "Добави банер" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Преглед</TableHead>
                            <TableHead>Ред</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Мобилен</TableHead> {/* Added column for mobile status */}
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {homeBanners.map((banner) => (
                            <TableRow key={banner.id}>
                              <TableCell>
                                <img
                                  src={banner.image_url || "/placeholder.svg"}
                                  alt={banner.alt_text || "Banner"}
                                  className="w-24 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=48&width=96"
                                  }}
                                />
                              </TableCell>
                              <TableCell>{banner.display_order}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {banner.is_active ? "Активен" : "Неактивен"}
                                </span>
                              </TableCell>
                              {/* Added mobile status display */}
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    banner.is_mobile ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {banner.is_mobile ? "Да" : "Не"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditHomeBanner(banner)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingHomeBannerId(banner.id)
                                      setDeleteHomeBannerDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Home Banner Confirmation Dialog */}
              <AlertDialog open={deleteHomeBannerDialogOpen} onOpenChange={setDeleteHomeBannerDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на банер</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтрие��е този банер? То����а действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingHomeBannerId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteHomeBanner}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="upgrade-banner">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    Настройки на банер за смартфон ъпгрейд
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upgrade-banner-image">Фоново изображение</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="upgrade-banner-image"
                          type="file"
                          accept="image/*"
                          onChange={handleUpgradeBannerImageChange}
                          disabled={isUploadingUpgradeBannerImage}
                        />
                        {isUploadingUpgradeBannerImage && (
                          <span className="text-sm text-muted-foreground">Качване...</span>
                        )}
                      </div>
                      {upgradeBannerImagePreview && (
                        <div className="mt-2">
                          <img
                            src={upgradeBannerImagePreview || "/placeholder.svg"}
                            alt="Преглед"
                            className="max-w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upgrade-banner-mobile-image">Мобилно фоново изображение</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="upgrade-banner-mobile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleUpgradeBannerMobileImageChange}
                          disabled={isUploadingUpgradeBannerMobileImage}
                        />
                        {isUploadingUpgradeBannerMobileImage && (
                          <span className="text-sm text-muted-foreground">Качване...</span>
                        )}
                      </div>
                      {upgradeBannerMobileImagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Преглед:</p>
                          <img
                            src={upgradeBannerMobileImagePreview || "/placeholder.svg"}
                            alt="Преглед"
                            className="max-w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upgrade-banner-link">URL за линк</Label>
                      <Input
                        id="upgrade-banner-link"
                        placeholder="/mobile-upgrade"
                        value={upgradeBannerSettings.link_url}
                        onChange={(e) =>
                          setUpgradeBannerSettings({ ...upgradeBannerSettings, link_url: e.target.value })
                        }
                      />
                    </div>

                    <Button onClick={handleSaveUpgradeBanner} className="w-full">
                      Запаз�� промените
                    </Button>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-2">Текущ изглед:</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Текстът и бутонът са фиксирани. Можете да редактирате само фоновото изображение и линка.
                    </p>
                    <div
                      className="relative overflow-hidden rounded-2xl h-[200px] flex items-center justify-between px-8"
                      style={
                        upgradeBannerSettings.background_image_url
                          ? {
                              backgroundImage: `url(${upgradeBannerSettings.background_image_url})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : {
                              background: "linear-gradient(135deg, #7BA4D4 0%, #9BC4E2 50%, #B8D8ED 100%)",
                            }
                      }
                    >
                      <div className="flex-1 z-10">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: "#2E4A5F" }}>
                          ВРЕМЕ Е ЗА ЪПГРЕЙД
                        </h2>
                        <div className="space-y-1 mb-4">
                          <p className="text-lg font-semibold" style={{ color: "#2E4A5F" }}>
                            ВРЪЩАШ <span className="font-bold">стар смартфон</span>
                          </p>
                          <p className="text-lg font-semibold" style={{ color: "#2E4A5F" }}>
                            ВЗЕМИ{" "}
                            <span className="font-bold" style={{ color: "#F4A300" }}>
                              отстъпка за нов
                            </span>
                          </p>
                        </div>
                        <button
                          className="px-6 py-2 rounded-full font-semibold text-white"
                          style={{ backgroundColor: "#2E4A5F" }}
                        >
                          Виж още
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category-banners">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Управление на банери по категории
                  </CardTitle>
                  <Dialog open={categoryBannerDialogOpen} onOpenChange={setCategoryBannerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetCategoryBannerForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        ��обави банер
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCategoryBanner ? "Редактирай банер" : "Добави нов банер за категория"}
                        </DialogTitle>
                        <DialogDescription>
                          Попълнете инф��рмацията за банера. Банерите се показват в началото на страниците за категории.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCategoryBannerSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category-banner-type">Тип категория *</Label>
                            <Select
                              value={categoryBannerFormData.category_type}
                              onValueChange={(value) =>
                                setCategoryBannerFormData({ ...categoryBannerFormData, category_type: value, category_id: null })
                              }
                            >
                              <SelectTrigger id="category-banner-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equipment">Техника</SelectItem>
                                <SelectItem value="gold">Злато</SelectItem>
                                <SelectItem value="cars">Коли</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category-banner-category">Категория</Label>
                            <Select
                              value={categoryBannerFormData.category_id?.toString() || "all"}
                              onValueChange={(value) =>
                                setCategoryBannerFormData({
                                  ...categoryBannerFormData,
                                  category_id: value === "all" ? null : Number(value),
                                })
                              }
                            >
                              <SelectTrigger id="category-banner-category">
                                <SelectValue placeholder="Всички категории" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Всички катего��ии</SelectItem>
                                {categoryBannerFormData.category_type === "equipment" &&
                                  categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-banner-title">Заглавие</Label>
                          <Input
                            id="category-banner-title"
                            value={categoryBannerFormData.title}
                            onChange={(e) =>
                              setCategoryBannerFormData({ ...categoryBannerFormData, title: e.target.value })
                            }
                            placeholder="Заглавие на банера"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-banner-subtitle">Подзаглавие</Label>
                          <Textarea
                            id="category-banner-subtitle"
                            value={categoryBannerFormData.subtitle}
                            onChange={(e) =>
                              setCategoryBannerFormData({ ...categoryBannerFormData, subtitle: e.target.value })
                            }
                            placeholder="Допълнителен текст за банера"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-banner-image">Изображение (десктоп) *</Label>
                          <Input
                            id="category-banner-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCategoryBannerImageChange(e, false)}
                            disabled={isUploadingCategoryBannerImage}
                          />
                          {isUploadingCategoryBannerImage && <p className="text-sm text-muted-foreground">Качване...</p>}
                          {(categoryBannerImagePreview || categoryBannerFormData.image_url) && (
                            <div className="mt-2 border rounded-lg overflow-hidden">
                              <img
                                src={categoryBannerImagePreview || categoryBannerFormData.image_url || "/placeholder.svg"}
                                alt="Преглед на банера"
                                className="w-full h-auto"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=800"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-banner-mobile-image">Изображение (мобилно)</Label>
                          <Input
                            id="category-banner-mobile-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCategoryBannerImageChange(e, true)}
                            disabled={isUploadingCategoryBannerMobileImage}
                          />
                          {isUploadingCategoryBannerMobileImage && <p className="text-sm text-muted-foreground">Качване...</p>}
                          {(categoryBannerMobileImagePreview || categoryBannerFormData.mobile_image_url) && (
                            <div className="mt-2 border rounded-lg overflow-hidden max-w-xs">
                              <img
                                src={categoryBannerMobileImagePreview || categoryBannerFormData.mobile_image_url || "/placeholder.svg"}
                                alt="Преглед на мобилен банер"
                                className="w-full h-auto"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category-banner-link-url">URL за пренасочване</Label>
                            <Input
                              id="category-banner-link-url"
                              type="url"
                              value={categoryBannerFormData.link_url}
                              onChange={(e) =>
                                setCategoryBannerFormData({ ...categoryBannerFormData, link_url: e.target.value })
                              }
                              placeholder="https://example.com/promo"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category-banner-link-text">Текст на бутона</Label>
                            <Input
                              id="category-banner-link-text"
                              value={categoryBannerFormData.link_text}
                              onChange={(e) =>
                                setCategoryBannerFormData({ ...categoryBannerFormData, link_text: e.target.value })
                              }
                              placeholder="Научи повече"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-banner-display-order">Ред на показване</Label>
                          <Input
                            id="category-banner-display-order"
                            type="number"
                            value={categoryBannerFormData.display_order}
                            onChange={(e) =>
                              setCategoryBannerFormData({
                                ...categoryBannerFormData,
                                display_order: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="category-banner-active"
                            checked={categoryBannerFormData.is_active}
                            onCheckedChange={(checked) =>
                              setCategoryBannerFormData({ ...categoryBannerFormData, is_active: checked })
                            }
                          />
                          <Label htmlFor="category-banner-active">Активен</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCategoryBannerDialogOpen(false)
                              resetCategoryBannerForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingCategoryBanner ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {categoryBannersLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане...</div>
                  ) : categoryBanners.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени банери. Натиснете &quot;Добави банер&quot; за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Преглед</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead>Заглавие</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryBanners.map((banner) => (
                            <TableRow key={banner.id}>
                              <TableCell>
                                <img
                                  src={banner.image_url || "/placeholder.svg"}
                                  alt={banner.title || "Banner"}
                                  className="w-32 h-16 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=64&width=128"
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {banner.category_type === "equipment"
                                  ? "Техника"
                                  : banner.category_type === "gold"
                                    ? "Злато"
                                    : "Коли"}
                              </TableCell>
                              <TableCell>{banner.category_id ? `ID: ${banner.category_id}` : "Всички"}</TableCell>
                              <TableCell className="max-w-xs truncate">{banner.title || "-"}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {banner.is_active ? "Активен" : "Неактивен"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditCategoryBanner(banner)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingCategoryBannerId(banner.id)
                                      setDeleteCategoryBannerDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Delete Category Banner Confirmation Dialog */}
            <AlertDialog open={deleteCategoryBannerDialogOpen} onOpenChange={setDeleteCategoryBannerDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Изтриване на банер</AlertDialogTitle>
                  <AlertDialogDescription>
                    Сигурни ли сте, че искате да изтриете този банер? Това действие не може да бъде отменено.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeletingCategoryBannerId(null)}>Отказ</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteCategoryBanner}>��зтрий</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <TabsContent value="promotional-cards">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Промоционални карти</h2>
                  <p className="text-muted-foreground mb-6">
                    Управление на трите промоционални карти на началната страница
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {promotionalCards.map((card) => (
                    <Card key={card.id}>
                      <CardHeader>
                        <CardTitle>Карта {card.position}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Текуща снимка</Label>
                          <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                            <Image
                              src={card.image_url || "/placeholder.svg"}
                              alt={`Card ${card.position}`}
                              fill
                              className="object-contain p-4"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=200&width=800"
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`card-image-${card.position}`}>Нова снимка</Label>
                          <Input
                            id={`card-image-${card.position}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handlePromoCardImageUpload(card.position, file)
                            }}
                            disabled={isUploadingPromoCard === card.position}
                          />
                          {isUploadingPromoCard === card.position && (
                            <p className="text-sm text-muted-foreground">Качва се...</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`card-link-${card.position}`}>YouTube линк</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`card-link-${card.position}`}
                              type="text"
                              defaultValue={card.link_url}
                              placeholder="https://www.youtube.com/watch?v=..."
                              onBlur={(e) => {
                                if (e.target.value !== card.link_url) {
                                  handlePromoCardLinkUpdate(card.position, e.target.value)
                                }
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Постави YouTube линк. Снимката по-горе се използва само като резервна.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cars">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <CarIcon className="w-6 h-6" />
                    Управление на коли
                  </CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави кола
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingCar ? "Редактирай кола" : "Добави нова кола"}</DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за колата. Всички полета с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="brand">Марка *</Label>
                            <Input
                              id="brand"
                              required
                              value={formData.brand}
                              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="model">Модел *</Label>
                            <Input
                              id="model"
                              required
                              value={formData.model}
                              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="year">Година *</Label>
                            <Input
                              id="year"
                              type="number"
                              required
                              value={formData.year}
                              onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Цена (���) *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              required
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mileage">Пробег (км) *</Label>
                            <Input
                              id="mileage"
                              type="number"
                              required
                              value={formData.mileage}
                              onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fuel_type">Гориво *</Label>
                            <Select
                              value={formData.fuel_type}
                              onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="бензин">Бензин</SelectItem>
                                <SelectItem value="дизел">Дизел</SelectItem>
                                <SelectItem value="електрически">Електрически</SelectItem>
                                <SelectItem value="хибрид">Хибрид</SelectItem>
                                <SelectItem value="газ">Газ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="transmission">Скоростна кутия *</Label>
                            <Select
                              value={formData.transmission}
                              onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ръчна">Ръчна</SelectItem>
                                <SelectItem value="автоматична">Автоматична</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="color">Цвят *</Label>
                            <Input
                              id="color"
                              required
                              value={formData.color}
                              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="engine_size">Обем на двигателя (л) *</Label>
                            <Input
                              id="engine_size"
                              type="text" // Changed type to text to match formData
                              required
                              value={formData.engine_size}
                              onChange={
                                (e) => setFormData({ ...formData, engine_size: e.target.value }) // Keep as string
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="horsepower">Конски сили *</Label>
                            <Input
                              id="horsepower"
                              type="number"
                              required
                              value={formData.horsepower}
                              onChange={(e) =>
                                setFormData({ ...formData, horsepower: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doors">Брой врати *</Label>
                            <Input
                              id="doors"
                              type="number"
                              required
                              value={formData.doors}
                              onChange={(e) => setFormData({ ...formData, doors: Number.parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="seats">Брой места *</Label>
                            <Input
                              id="seats"
                              type="number"
                              required
                              value={formData.seats}
                              onChange={(e) => setFormData({ ...formData, seats: Number.parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="condition">Състояние *</Label>
                            <Select
                              value={formData.condition}
                              onValueChange={(value) => setFormData({ ...formData, condition: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="нова">Нова</SelectItem>
                                <SelectItem value="употребявана">Употребявана</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Локация</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="car-status">Статус *</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                          >
                            <SelectTrigger id="car-status">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Налична</SelectItem>
                              <SelectItem value="sold">Продадена</SelectItem>
                              <SelectItem value="reserved">Резервирана</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="car-store">Магазин</Label>
                          <Select
                            value={formData.store_id?.toString() || "none"}
                            onValueChange={(value) =>
                              setFormData({ ...formData, store_id: value === "none" ? null : Number(value) })
                            }
                          >
                            <SelectTrigger id="car-store">
                              <SelectValue placeholder="Изберете магазин" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Без магазин</SelectItem>
                              {stores.map((store) => (
                                <SelectItem key={store.id} value={store.id.toString()}>
                                  {store.name} - {store.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="car-promotions">Промоция (€)</Label>
                          <Input
                            id="car-promotions"
                            type="number"
                            step="0.01"
                            placeholder="Нап��. 50.00"
                            value={formData.promotions ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                promotions: e.target.value === "" ? null : Number.parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        {/* In the cars form section, replace URL inputs with file uploads */}
                        <div className="space-y-2">
                          <Label htmlFor="image_file">Основна снимка</Label>
                          <Input
                            id="image_file"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setUploadingImage(true)
                                try {
                                  const url = await handleImageUpload(file)
                                  setFormData({ ...formData, image_url: url })
                                  toast({
                                    title: "Успех",
                                    description: "Снимката е качена успешно",
                                  })
                                } catch (error) {
                                  toast({
                                    title: "Грешка",
                                    description: "Неуспешно качване на снимката",
                                    variant: "destructive",
                                  })
                                } finally {
                                  setUploadingImage(false)
                                }
                              }
                            }}
                          />
                          {uploadingImage && <p className="text-sm text-muted-foreground">Качване...</p>}
                          {formData.image_url && (
                            <div className="mt-2">
                              <img
                                src={formData.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Допълнителни снимки</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              const files = e.target.files
                              if (files && files.length > 0) {
                                setUploadingCarImages({ uploading: true })
                                try {
                                  const uploadPromises = Array.from(files).map((file) => handleImageUpload(file))
                                  const urls = await Promise.all(uploadPromises)
                                  setFormData({ ...formData, images: [...formData.images, ...urls] })
                                  toast({
                                    title: "Успех",
                                    description: `${urls.length} снимки са качени успешно`,
                                  })
                                } catch (error) {
                                  toast({
                                    title: "Грешка",
                                    description: "Неуспешно ��ачван�� на снимките",
                                    variant: "destructive",
                                  })
                                } finally {
                                  setUploadingCarImages({})
                                  e.target.value = ""
                                }
                              }
                            }}
                          />
                          {uploadingCarImages.uploading && (
                            <p className="text-sm text-muted-foreground">Качване на снимки...</p>
                          )}
                          {formData.images.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Няма добавени снимки. Изберете файлове за да добавите.
                            </p>
                          ) : (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {formData.images.map((img, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={img || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      const newImages = formData.images.filter((_, i) => i !== index)
                                      setFormData({ ...formData, images: newImages })
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Описание</Label>
                          <Textarea
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setDialogOpen(false)
                              resetForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingCar ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {cars.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени коли. Натиснете "Добави кола" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Марка</TableHead>
                            <TableHead>Модел</TableHead>
                            <TableHead>Година</TableHead>
                            <TableHead>Цена</TableHead>
                            <TableHead>Пробег</TableHead>
                            <TableHead>Гориво</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cars.map((car) => (
                            <TableRow key={car.id}>
                              <TableCell className="font-medium">{car.brand}</TableCell>
                              <TableCell>{car.model}</TableCell>
                              <TableCell>{car.year}</TableCell>
                              <TableCell>{car.price.toLocaleString()} €</TableCell>
                              <TableCell>{car.mileage.toLocaleString()} км</TableCell>
                              <TableCell className="capitalize">{car.fuel_type}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(car)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingCarId(car.id)
                                      setDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <MonitorSmartphone className="w-6 h-6" />
                    Управление на техника
                  </CardTitle>
                  <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetEquipmentForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави техника
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingEquipment ? "Редактирай техника" : "Добави нова техника"}</DialogTitle>
                        <DialogDescription>
                          Попъл��ете информацията за техниката. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="eq-name">Име *</Label>
                          <Input
                            id="eq-name"
                            required
                            value={equipmentFormData.name}
                            onChange={(e) => setEquipmentFormData({ ...equipmentFormData, name: e.target.value })}
                            placeholder="Напр. Лаптоп HP ProBook"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="eq-category">Категория *</Label>
                            <Select
                              value={equipmentFormData.category_id?.toString() || ""}
                              onValueChange={(value) => {
                                const selectedCat = categories.find((c) => c.id.toString() === value)
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  category: selectedCat?.name || "",
                                  category_id: selectedCat ? selectedCat.id : null,
                                  subcategory_id: null, // Reset subcategory when main category changes
                                })
                              }}
                            >
                              <SelectTrigger id="eq-category">
                                <SelectValue placeholder="Изберете категория..." />
                              </SelectTrigger>
                              <SelectContent>
                                {categories
                                  .filter((cat) => !cat.parent_id) // Only show main categories
                                  .map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-subcategory">Подкатегория</Label>
                            <Select
                              value={equipmentFormData.subcategory_id?.toString() || "none"}
                              onValueChange={(value) => {
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  subcategory_id: value === "none" ? null : Number(value),
                                })
                              }}
                              disabled={!equipmentFormData.category_id || categories.filter((c) => c.parent_id === equipmentFormData.category_id).length === 0}
                            >
                              <SelectTrigger id="eq-subcategory">
                                <SelectValue placeholder="Изберете подкатегория..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Без подкатегория</SelectItem>
                                {categories
                                  .filter((cat) => cat.parent_id === equipmentFormData.category_id)
                                  .map((subcat) => (
                                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                                      {subcat.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {equipmentFormData.category_id && categories.filter((c) => c.parent_id === equipmentFormData.category_id).length === 0 && (
                              <p className="text-xs text-muted-foreground">Тази катего��ия няма подкатегории</p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="eq-brand">Марка</Label>
                            <Select
                              value={equipmentFormData.brand || undefined}
                              onValueChange={(value) => {
                                if (value === "__add_new__") {
                                  setShowAddBrand(true)
                                } else {
                                  setEquipmentFormData({ ...equipmentFormData, brand: value })
                                }
                              }}
                            >
                              <SelectTrigger id="eq-brand">
                                <SelectValue placeholder="Изберете марка..." />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  new Set(
                                    [...equipment.map((e) => e.brand), ...customBrands]
                                      .filter((b): b is string => Boolean(b && b.trim()))
                                      .map((b) => b.trim()),
                                  ),
                                )
                                  .sort((a, b) => a.localeCompare(b))
                                  .map((brand) => (
                                    <SelectItem key={brand} value={brand}>
                                      {brand}
                                    </SelectItem>
                                  ))}
                                <SelectItem value="__add_new__" className="text-primary font-medium">
                                  + Добави нова марка
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {showAddBrand && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="Въведете нова марка..."
                                  value={newBrandInput}
                                  onChange={(e) => setNewBrandInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && newBrandInput.trim()) {
                                      e.preventDefault()
                                      const newBrand = newBrandInput.trim()
                                      if (!customBrands.includes(newBrand)) {
                                        setCustomBrands([...customBrands, newBrand])
                                      }
                                      setEquipmentFormData({ ...equipmentFormData, brand: newBrand })
                                      setNewBrandInput("")
                                      setShowAddBrand(false)
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    if (newBrandInput.trim()) {
                                      const newBrand = newBrandInput.trim()
                                      if (!customBrands.includes(newBrand)) {
                                        setCustomBrands([...customBrands, newBrand])
                                      }
                                      setEquipmentFormData({ ...equipmentFormData, brand: newBrand })
                                      setNewBrandInput("")
                                      setShowAddBrand(false)
                                    }
                                  }}
                                >
                                  Добави
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setNewBrandInput("")
                                    setShowAddBrand(false)
                                  }}
                                >
                                  Отказ
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-model">Модел</Label>
                            <Input
                              id="eq-model"
                              value={equipmentFormData.model}
                              onChange={(e) => setEquipmentFormData({ ...equipmentFormData, model: e.target.value })}
                              placeholder="Напр. ProBook 450"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-oborudvane">Оборудване</Label>
                            <Input
                              id="eq-oborudvane"
                              value={equipmentFormData.oborudvane}
                              onChange={(e) => setEquipmentFormData({ ...equipmentFormData, oborudvane: e.target.value })}
                              placeholder="Напр. С калъф"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-sku">Артикулен номер</Label>
                            <Input
                              id="eq-sku"
                              value={equipmentFormData.sku}
                              onChange={(e) => setEquipmentFormData({ ...equipmentFormData, sku: e.target.value })}
                              placeholder="Напр. SKU-12345"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-price">Цена (€) *</Label>
                            <Input
                              id="eq-price"
                              type="number"
                              step="0.01"
                              required
                              value={equipmentFormData.price}
                              onChange={(e) =>
                                setEquipmentFormData({ ...equipmentFormData, price: Number.parseFloat(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-condition">Състояние *</Label>
                            <Select
                              value={equipmentFormData.condition}
                              onValueChange={(value) => {
                                if (value === "__add_new__") {
                                  setShowAddCondition(true)
                                } else {
                                  setEquipmentFormData({ ...equipmentFormData, condition: value })
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {equipmentConditions.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                                <SelectItem value="__add_new__" className="text-primary font-medium">
                                  + Добави ново състояние
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {showAddCondition && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="Въведете ново състояние..."
                                  value={newConditionInput}
                                  onChange={(e) => setNewConditionInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && newConditionInput.trim()) {
                                      e.preventDefault()
                                      const newCondition = newConditionInput.trim()
                                      if (!equipmentConditions.includes(newCondition)) {
                                        setEquipmentConditions([...equipmentConditions, newCondition])
                                      }
                                      setEquipmentFormData({ ...equipmentFormData, condition: newCondition })
                                      setNewConditionInput("")
                                      setShowAddCondition(false)
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    if (newConditionInput.trim()) {
                                      const newCondition = newConditionInput.trim()
                                      if (!equipmentConditions.includes(newCondition)) {
                                        setEquipmentConditions([...equipmentConditions, newCondition])
                                      }
                                      setEquipmentFormData({ ...equipmentFormData, condition: newCondition })
                                      setNewConditionInput("")
                                      setShowAddCondition(false)
                                    }
                                  }}
                                >
                                  Добави
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setNewConditionInput("")
                                    setShowAddCondition(false)
                                  }}
                                >
                                  Отказ
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-stock">Налично количество *</Label>
                            <Input
                              id="eq-stock"
                              type="number"
                              required
                              value={equipmentFormData.stock_quantity}
                              onChange={(e) =>
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  stock_quantity: Number.parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-status">Статус *</Label>
                            <Select
                              value={equipmentFormData.status}
                              onValueChange={(value) => setEquipmentFormData({ ...equipmentFormData, status: value })}
                            >
                              <SelectTrigger id="eq-status">
                                <SelectValue placeholder="Изберете статус..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Налична</SelectItem>
                                <SelectItem value="sold">Продадена</SelectItem>
                                <SelectItem value="reserved">Резервирана</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-store">Магазин</Label>
                            <Select
                              value={equipmentFormData.store_id?.toString() || "none"}
                              onValueChange={(value) =>
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  store_id: value === "none" ? null : Number(value),
                                })
                              }
                            >
                              <SelectTrigger id="eq-store">
                                <SelectValue placeholder="Изберете магазин" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Без магазин</SelectItem>
                                {stores.map((store) => (
                                  <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name} - {store.city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eq-promotions">Промоция (€)</Label>
                            <Input
                              id="eq-promotions"
                              type="number"
                              step="0.01"
                              placeholder="Напр. 50.00"
                              value={equipmentFormData.promotions ?? ""}
                              onChange={(e) =>
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  promotions: e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eq-description">Описание</Label>
                          <Textarea
                            id="eq-description"
                            rows={3}
                            value={equipmentFormData.description || ""}
                            onChange={(e) =>
                              setEquipmentFormData({ ...equipmentFormData, description: e.target.value })
                            }
                          />
                        </div>
                        {/* Technical Specifications - Name/Value pairs */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Технически спецификации</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  specifications: [...equipmentFormData.specifications, { name: "", value: "" }],
                                })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Добави спецификация
                            </Button>
                          </div>
                          
                          {/* Product Type Dropdown for predefined specs */}
                          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                            <Label>Тип продукт (за бързо добавяне)</Label>
                            <Select
                              value={equipmentProductType}
                              onValueChange={(value) => {
                                setEquipmentProductType(value)
                                let presetSpecs: { name: string; value: string }[] = []
                                if (value === "телефон") {
                                  presetSpecs = [
                                    { name: "Памет", value: "" },
                                    { name: "RAM", value: "" },
                                    { name: "Капацитет", value: "" },
                                    { name: "Цвят", value: "" },
                                    { name: "Гаранция", value: "" },
                                    { name: "Оборудване", value: "" },
                                  ]
                                } else if (value === "часовници") {
                                  presetSpecs = [
                                    { name: "Капацитет", value: "" },
                                    { name: "Гаранция", value: "" },
                                    { name: "Оборудване", value: "" },
                                  ]
                                } else if (value === "телевизор") {
                                  presetSpecs = [
                                    { name: "Екран", value: "" },
                                    { name: "Гаранция", value: "" },
                                  ]
                                }
                                if (presetSpecs.length > 0) {
                                  setEquipmentFormData({
                                    ...equipmentFormData,
                                    specifications: presetSpecs,
                                  })
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Изберете тип продукт..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="телефон">Телефон</SelectItem>
                                <SelectItem value="телевизор">Телевизор</SelectItem>
                                <SelectItem value="часовн��ци">Часовници</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {equipmentFormData.specifications.length === 0 && (
                            <p className="text-sm text-muted-foreground">Няма добавени специф��кации</p>
                          )}
                          {equipmentFormData.specifications.map((spec, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <div className="flex-1">
                                <Select
                                  value={spec.name}
                                  onValueChange={async (value) => {
                                    const newSpecs = [...equipmentFormData.specifications]
                                    if (value === "__new__") {
                                      // User wants to add a new spec name
                                      const newName = newSpecName.trim()
                                      if (newName) {
                                        await addSpecificationTemplate(newName)
                                        newSpecs[index].name = newName
                                        setNewSpecName("")
                                      }
                                    } else {
                                      newSpecs[index].name = value
                                    }
                                    setEquipmentFormData({ ...equipmentFormData, specifications: newSpecs })
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Изберете име" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {specificationTemplates.map((template) => (
                                      <SelectItem key={template.id} value={template.name}>
                                        {template.name}
                                      </SelectItem>
                                    ))}
                                    <div className="px-2 py-1.5 border-t">
                                      <div className="flex gap-1">
                                        <Input
                                          placeholder="Ново име..."
                                          value={newSpecName}
                                          onChange={(e) => setNewSpecName(e.target.value)}
                                          className="h-8 text-sm"
                                          onClick={(e) => e.stopPropagation()}
                                          onKeyDown={(e) => {
                                            e.stopPropagation()
                                            if (e.key === "Enter" && newSpecName.trim()) {
                                              e.preventDefault()
                                              const newSpecs = [...equipmentFormData.specifications]
                                              addSpecificationTemplate(newSpecName.trim())
                                              newSpecs[index].name = newSpecName.trim()
                                              setEquipmentFormData({ ...equipmentFormData, specifications: newSpecs })
                                              setNewSpecName("")
                                            }
                                          }}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          className="h-8"
                                          onClick={async (e) => {
                                            e.stopPropagation()
                                            if (newSpecName.trim()) {
                                              const newSpecs = [...equipmentFormData.specifications]
                                              await addSpecificationTemplate(newSpecName.trim())
                                              newSpecs[index].name = newSpecName.trim()
                                              setEquipmentFormData({ ...equipmentFormData, specifications: newSpecs })
                                              setNewSpecName("")
                                            }
                                          }}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Input
                                  placeholder="Стойност"
                                  value={spec.value}
                                  onChange={(e) => {
                                    const newSpecs = [...equipmentFormData.specifications]
                                    const oldValue = newSpecs[index].value
                                    const newValue = e.target.value
                                    newSpecs[index].value = newValue

                                    // For the "Екран" spec, keep the screen value appended at the end of the name.
                                    let updatedName = equipmentFormData.name
                                    if (newSpecs[index].name === "Екран") {
                                      let baseName = equipmentFormData.name
                                      if (oldValue && baseName.trimEnd().endsWith(oldValue)) {
                                        baseName = baseName.trimEnd().slice(0, baseName.trimEnd().length - oldValue.length).trimEnd()
                                      }
                                      updatedName = newValue ? `${baseName} ${newValue}`.trim() : baseName
                                    }

                                    setEquipmentFormData({
                                      ...equipmentFormData,
                                      name: updatedName,
                                      specifications: newSpecs,
                                    })
                                  }}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newSpecs = equipmentFormData.specifications.filter((_, i) => i !== index)
                                  setEquipmentFormData({ ...equipmentFormData, specifications: newSpecs })
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Image Uploads */}
                        <div className="space-y-2">
                          <Label htmlFor="eq-main-image">Основн�� снимка</Label>
                          <Input
                            id="eq-main-image"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setUploadingImage(true)
                                try {
                                  const url = await handleImageUpload(file)
                                  setEquipmentFormData({ ...equipmentFormData, image_url: url })
                                  toast({
                                    title: "Успех",
                                    description: "Снимката е качена успешно",
                                  })
                                } catch (error) {
                                  toast({
                                    title: "Грешка",
                                    description: "Неуспешно качване на снимката",
                                    variant: "destructive",
                                  })
                                } finally {
                                  setUploadingImage(false)
                                }
                              }
                            }}
                          />
                          {uploadingImage && <p className="text-sm text-muted-foreground">Качване...</p>}
                          {equipmentFormData.image_url && (
                            <div className="mt-2">
                              <img
                                src={equipmentFormData.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Допълнителни снимки</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEquipmentFormData({
                                  ...equipmentFormData,
                                  images: [...equipmentFormData.images, ""],
                                })
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Добави слот
                            </Button>
                          </div>
                          {equipmentFormData.images.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Няма добавени снимки. Натиснете "Добави слот" за да добавите.
                            </p>
                          )}
                          <div className="space-y-2">
                            {equipmentFormData.images.map((img, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        setUploadingEquipmentImages({ ...uploadingEquipmentImages, [index]: true })
                                        try {
                                          const url = await handleImageUpload(file)
                                          const newImages = [...equipmentFormData.images]
                                          newImages[index] = url
                                          setEquipmentFormData({ ...equipmentFormData, images: newImages })
                                          toast({
                                            title: "Успех",
                                            description: `Снимка ${index + 1} е качена успешно`,
                                          })
                                        } catch (error) {
                                          toast({
                                            title: "Грешка",
                                            description: "Неуспешно качване на снимката",
                                            variant: "destructive",
                                          })
                                        } finally {
                                          setUploadingEquipmentImages({ ...uploadingEquipmentImages, [index]: false })
                                        }
                                      }
                                    }}
                                  />
                                  {uploadingEquipmentImages[index] && (
                                    <p className="text-xs text-muted-foreground mt-1">Качване...</p>
                                  )}
                                  {img && (
                                    <img
                                      src={img || "/placeholder.svg"}
                                      alt={`Preview ${index + 1}`}
                                      className="w-20 h-20 object-cover rounded mt-2"
                                    />
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => {
                                    const newImages = equipmentFormData.images.filter((_, i) => i !== index)
                                    setEquipmentFormData({ ...equipmentFormData, images: newImages })
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SEO Section */}
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">SEO Настройки</h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Генерират се автоматично от данните на продукта. Можете да ги редактирате ръчно.
                          </p>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor="eq-seo-title">SEO Заглавие</Label>
                              <Input
                                id="eq-seo-title"
                                value={equipmentFormData.seo_title || ""}
                                onChange={(e) => {
                                  equipmentSeoAuto.current = false
                                  setEquipmentFormData({ ...equipmentFormData, seo_title: e.target.value })
                                }}
                                placeholder="Заглавие за търсачките (до 60 символа)"
                                maxLength={60}
                              />
                              <p className="text-xs text-muted-foreground">
                                {(equipmentFormData.seo_title || "").length}/60 символа
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="eq-seo-description">SEO Описание</Label>
                              <Textarea
                                id="eq-seo-description"
                                rows={2}
                                value={equipmentFormData.seo_description || ""}
                                onChange={(e) => {
                                  equipmentSeoAuto.current = false
                                  setEquipmentFormData({ ...equipmentFormData, seo_description: e.target.value })
                                }}
                                placeholder="Описание за търсачките (до 160 символа)"
                                maxLength={160}
                              />
                              <p className="text-xs text-muted-foreground">
                                {(equipmentFormData.seo_description || "").length}/160 символа
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="eq-seo-keywords">SEO Ключови думи</Label>
                              <Input
                                id="eq-seo-keywords"
                                value={equipmentFormData.seo_keywords || ""}
                                onChange={(e) => {
                                  equipmentSeoAuto.current = false
                                  setEquipmentFormData({ ...equipmentFormData, seo_keywords: e.target.value })
                                }}
                                placeholder="Ключови думи (разделени със запетая)"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEquipmentDialogOpen(false)
                              resetEquipmentForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingEquipment ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {/* Search Input */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Търсене по име или артикулен номер..."
                        value={equipmentSearch}
                        onChange={(e) => setEquipmentSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {equipment.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавена техника. Натиснете "Добави техника" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead>Цена</TableHead>
                            <TableHead>Наличност</TableHead>
                            <TableHead>Стату��</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {equipment
                            .filter((item) => {
                              if (!equipmentSearch.trim()) return true
                              const searchLower = equipmentSearch.toLowerCase().trim()
                              const nameMatch = item.name.toLowerCase().includes(searchLower)
                              const skuMatch = item.sku?.toLowerCase().includes(searchLower) || false
                              return nameMatch || skuMatch
                            })
                            .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.price.toLocaleString()} €</TableCell>
                              <TableCell>{item.stock_quantity}</TableCell>
                              <TableCell className="capitalize">{item.status}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditEquipment(item)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingEquipmentId(item.id)
                                      setDeleteEquipmentDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Equipment Confirmation Dialog */}
              <AlertDialog open={deleteEquipmentDialogOpen} onOpenChange={setDeleteEquipmentDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на техника</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете този продукт? Това действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingEquipmentId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEquipment}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Упра��ление на категории
                  </CardTitle>
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetCategoryForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави категория
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? "Редактирай категория" : "Добави нова категория"}</DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за категорията. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="cat-name">Име *</Label>
                            <Input
                              id="cat-name"
                              required
                              value={categoryFormData.name}
                              onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                              placeholder="Напр. Лаптопи"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="cat-parent">Главна категория (опционално)</Label>
                            <select
                              id="cat-parent"
                              value={categoryFormData.parent_id || ""}
                              onChange={(e) =>
                                setCategoryFormData({
                                  ...categoryFormData,
                                  parent_id: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Без главна категория (основна)</option>
                              {categories
                                .filter((c) => !c.parent_id && c.id !== editingCategory?.id)
                                .map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                              Оставете празно за да създадете основна категория, или изберете главна ��атегория за да създадете подкатегория.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cat-icon">Икона (Font Awesome class)</Label>
                            <Input
                              id="cat-icon"
                              value={categoryFormData.icon}
                              onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                              placeholder="Напр. fa-laptop"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cat-display-order">Ред на показване</Label>
                            <Input
                              id="cat-display-order"
                              type="number"
                              value={categoryFormData.display_order}
                              onChange={(e) =>
                                setCategoryFormData({
                                  ...categoryFormData,
                                  display_order: Number.parseInt(e.target.value),
                                })
                              }
                              placeholder="Напр. 1"
                            />
                          </div>
                          <div className="flex items-center space-x-2 col-span-2 mt-2">
                            <Switch
                              id="cat-active"
                              checked={categoryFormData.is_active}
                              onCheckedChange={(checked) =>
                                setCategoryFormData({ ...categoryFormData, is_active: checked })
                              }
                            />
                            <Label htmlFor="cat-active">Активна</Label>
                          </div>
                        </div>

                        {/* Image Uploads */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Снимки</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCategoryFormData({
                                  ...categoryFormData,
                                  images: [...categoryFormData.images, ""],
                                })
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Добави слот
                            </Button>
                          </div>
                          {categoryFormData.images.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Няма добавени снимки. Натиснете "Добави слот" за да добавите.
                            </p>
                          )}
                          <div className="space-y-2">
                            {categoryFormData.images.map((img, index) => (
                              <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        // Assuming a generic image upload handler if not specific
                                        // For simplicity, reusing handleImageUpload
                                        try {
                                          const url = await handleImageUpload(file)
                                          const newImages = [...categoryFormData.images]
                                          newImages[index] = url
                                          setCategoryFormData({ ...categoryFormData, images: newImages })
                                          toast({
                                            title: "Успех",
                                            description: `Снимка ${index + 1} е качена успешно`,
                                          })
                                        } catch (error) {
                                          toast({
                                            title: "Грешка",
                                            description: "Неуспешно качване на снимката",
                                            variant: "destructive",
                                          })
                                        }
                                      }
                                    }}
                                  />
                                  {img && (
                                    <img
                                      src={img || "/placeholder.svg"}
                                      alt={`Preview ${index + 1}`}
                                      className="w-20 h-20 object-cover rounded mt-2"
                                    />
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => {
                                    const newImages = categoryFormData.images.filter((_, i) => i !== index)
                                    setCategoryFormData({ ...categoryFormData, images: newImages })
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cat-description">Описание</Label>
                          <Textarea
                            id="cat-description"
                            rows={3}
                            value={categoryFormData.description}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                            placeholder="Кратко описание на категорията"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCategoryDialogOpen(false)
                              resetCategoryForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingCategory ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {categories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени категории. Натиснете "Добави категория" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Главна категория</TableHead>
                            <TableHead>Икона</TableHead>
                            <TableHead>Ред</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories
                            .filter((c) => !c.parent_id)
                            .map((category) => (
                            <>
                            <TableRow key={category.id} className="bg-gray-50">
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>{category.icon ? <i className={category.icon}></i> : "-"}</TableCell>
                              <TableCell>{category.display_order}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    category.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {category.is_active ? "Активна" : "Неактивна"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingCategoryId(category.id)
                                      setDeleteCategoryDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            {/* Subcategories */}
                            {categories
                              .filter((sub) => sub.parent_id === category.id)
                              .map((subcategory) => (
                                <TableRow key={subcategory.id}>
                                  <TableCell className="font-medium pl-8">
                                    <span className="text-muted-foreground">└</span> {subcategory.name}
                                  </TableCell>
                                  <TableCell>{category.name}</TableCell>
                                  <TableCell>{subcategory.icon ? <i className={subcategory.icon}></i> : "-"}</TableCell>
                                  <TableCell>{subcategory.display_order}</TableCell>
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        subcategory.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {subcategory.is_active ? "Активна" : "Неактивна"}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(subcategory)}>
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          setDeletingCategoryId(subcategory.id)
                                          setDeleteCategoryDialogOpen(true)
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Category Confirmation Dialog */}
              <AlertDialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на категория</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете тази категория? Това действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingCategoryId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCategory}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="gold">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Coins className="w-6 h-6" />
                    Управление на злато
                  </CardTitle>
                  <div className="flex gap-2">
                    {!currentUser?.hide_global_price && (
                      <>
                        <Button variant="outline" onClick={fetchLiveGoldPrice} disabled={liveGoldPriceLoading}>
                          <RefreshCw className={`w-4 h-4 mr-2 ${liveGoldPriceLoading ? "animate-spin" : ""}`} />
                          Актуални цени
                        </Button>
                        <Button onClick={() => setGoldPriceDialogOpen(true)}>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Глобална цена (гр)
                        </Button>
                      </>
                    )}
                    <Dialog open={goldDialogOpen} onOpenChange={setGoldDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetGoldForm}>
                          <Plus className="w-4 h-4 mr-2" />
                          Добави злато
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingGold ? "Редактирай златен продукт" : "Добави нов златен продукт"}
                          </DialogTitle>
                          <DialogDescription>
                            Попълнете информацията за златния продукт. Полетата с * са задължителни.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleGoldSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="gold-type">Тип злато *</Label>
                              <Input
                                id="gold-type"
                                type="text"
                                required
                                placeholder="Въведете тип злато"
                                value={goldFormData.gold_type}
                                onChange={(e) => setGoldFormData({ ...goldFormData, gold_type: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-weight">Тегло (гр) *</Label>
                              <Input
                                id="gold-weight"
                                type="number"
                                step="0.01"
                                required
                                value={goldFormData.weight_grams}
                                onChange={(e) =>
                                  setGoldFormData({ ...goldFormData, weight_grams: Number.parseFloat(e.target.value) })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-purity">Чистота (%) *</Label>
                              <Input
                                id="gold-purity"
                                type="number"
                                required
                                value={goldFormData.purity_percentage}
                                onChange={(e) =>
                                  setGoldFormData({
                                    ...goldFormData,
                                    purity_percentage: Number.parseInt(e.target.value),
                                  })
                                }
                                placeholder="Напр. 18, 24"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-price-per-gram">Цена за грам (€) *</Label>
                              <Input
                                id="gold-price-per-gram"
                                type="number"
                                step="0.01"
                                required
                                value={editingGold ? goldFormData.price_per_gram : globalGoldPricePerGram}
                                onChange={(e) =>
                                  setGoldFormData({
                                    ...goldFormData,
                                    price_per_gram: Number.parseFloat(e.target.value),
                                  })
                                }
                                disabled={!editingGold && globalGoldPricePerGram > 0}
                              />
                              {!editingGold && globalGoldPricePerGram > 0 && (
                                <Button type="button" size="sm" variant="outline" onClick={handleUseGlobalPrice}>
                                  Използвай глобална цена
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-total-amount">Обща сума (€) *</Label>
                              <Input
                                id="gold-total-amount"
                                type="number"
                                step="0.01"
                                required
                                value={goldFormData.total_amount}
                                onChange={(e) =>
                                  setGoldFormData({ ...goldFormData, total_amount: Number.parseFloat(e.target.value) })
                                }
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-currency">Валута</Label>
                              <Select
                                value={goldFormData.currency}
                                onValueChange={(value) => setGoldFormData({ ...goldFormData, currency: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="BGN">BGN</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-status">Статус *</Label>
                              <Select
                                value={goldFormData.status}
                                onValueChange={(value) => setGoldFormData({ ...goldFormData, status: value })}
                              >
                                <SelectTrigger id="gold-status">
                                  <SelectValue placeholder="Изберете статус..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Наличен</SelectItem>
                                  <SelectItem value="sold">Продаден</SelectItem>
                                  <SelectItem value="reserved">Резервиран</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-store">Магазин</Label>
                              <Select
                                value={goldFormData.store_id?.toString() || "none"}
                                onValueChange={(value) =>
                                  setGoldFormData({
                                    ...goldFormData,
                                    store_id: value === "none" ? null : Number(value),
                                  })
                                }
                              >
                                <SelectTrigger id="gold-store">
                                  <SelectValue placeholder="Изберете магазин" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Без магазин</SelectItem>
                                  {stores.map((store) => (
                                    <SelectItem key={store.id} value={store.id.toString()}>
                                      {store.name} - {store.city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gold-category">Категория</Label>
                              <Select
                                value={goldFormData.category_id?.toString() || "none"}
                                onValueChange={(value) =>
                                  setGoldFormData({
                                    ...goldFormData,
                                    category_id: value === "none" ? null : Number(value),
                                    subcategory_id: null,
                                  })
                                }
                              >
                                <SelectTrigger id="gold-category">
                                  <SelectValue placeholder="Изберете категория..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Без категория</SelectItem>
                                  {goldCategories
                                    .filter((category) => !category.parent_id)
                                    .map((category) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {goldFormData.category_id &&
                              goldCategories.some((cat) => cat.parent_id === goldFormData.category_id) && (
                                <div className="space-y-2">
                                  <Label htmlFor="gold-subcategory">Подкатегория</Label>
                                  <Select
                                    value={goldFormData.subcategory_id?.toString() || "none"}
                                    onValueChange={(value) =>
                                      setGoldFormData({
                                        ...goldFormData,
                                        subcategory_id: value === "none" ? null : Number(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger id="gold-subcategory">
                                      <SelectValue placeholder="Изберете подкатегория..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Без подкатегория</SelectItem>
                                      {goldCategories
                                        .filter((cat) => cat.parent_id === goldFormData.category_id)
                                        .map((category) => (
                                          <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            <div className="space-y-2">
                              <Label htmlFor="gold-promotions">Промоция (€)</Label>
                              <Input
                                id="gold-promotions"
                                type="number"
                                step="0.01"
                                placeholder="Напр. 50.00"
                                value={goldFormData.promotions ?? ""}
                                onChange={(e) =>
                                  setGoldFormData({
                                    ...goldFormData,
                                    promotions: e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gold-description">Описание</Label>
                            <Textarea
                              id="gold-description"
                              rows={3}
                              value={goldFormData.description || ""}
                              onChange={(e) => setGoldFormData({ ...goldFormData, description: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gold-notes">Бележки</Label>
                            <Textarea
                              id="gold-notes"
                              rows={2}
                              value={goldFormData.notes || ""}
                              onChange={(e) => setGoldFormData({ ...goldFormData, notes: e.target.value })}
                            />
                          </div>

                          {/* Image Uploads */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Снимки</Label>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setGoldFormData({
                                    ...goldFormData,
                                    images: [...goldFormData.images, ""],
                                  })
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Добави слот
                              </Button>
                            </div>
                            {goldFormData.images.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Няма добавени снимки. Натиснете "Добави слот" за да добавите.
                              </p>
                            )}
                            <div className="space-y-2">
                              {goldFormData.images.map((img, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                  <div className="flex-1">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          setUploadingGoldImages({ ...uploadingGoldImages, [index]: true })
                                          try {
                                            const url = await handleImageUpload(file)
                                            const newImages = [...goldFormData.images]
                                            newImages[index] = url
                                            setGoldFormData({ ...goldFormData, images: newImages })
                                            toast({
                                              title: "Успех",
                                              description: `Снимка ${index + 1} е качена успешно`,
                                            })
                                          } catch (error) {
                                            toast({
                                              title: "Грешка",
                                              description: "Неуспешно качване на снимката",
                                              variant: "destructive",
                                            })
                                          } finally {
                                            setUploadingGoldImages({ ...uploadingGoldImages, [index]: false })
                                          }
                                        }
                                      }}
                                    />
                                    {uploadingGoldImages[index] && (
                                      <p className="text-xs text-muted-foreground mt-1">Качване...</p>
                                    )}
                                    {img && (
                                      <img
                                        src={img || "/placeholder.svg"}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded mt-2"
                                      />
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => {
                                      const newImages = goldFormData.images.filter((_, i) => i !== index)
                                      setGoldFormData({ ...goldFormData, images: newImages })
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SEO Section */}
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">SEO Настройки</h4>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="gold-seo-title">SEO Заглавие</Label>
                                <Input
                                  id="gold-seo-title"
                                  value={goldFormData.seo_title || ""}
                                  onChange={(e) =>
                                    setGoldFormData({ ...goldFormData, seo_title: e.target.value })
                                  }
                                  placeholder="Заглавие за търсачките (до 60 символа)"
                                  maxLength={60}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {(goldFormData.seo_title || "").length}/60 символа
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gold-seo-description">SEO Описание</Label>
                                <Textarea
                                  id="gold-seo-description"
                                  rows={2}
                                  value={goldFormData.seo_description || ""}
                                  onChange={(e) =>
                                    setGoldFormData({ ...goldFormData, seo_description: e.target.value })
                                  }
                                  placeholder="Описание за търсачките (до 160 символа)"
                                  maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {(goldFormData.seo_description || "").length}/160 символа
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gold-seo-keywords">SEO Ключови думи</Label>
                                <Input
                                  id="gold-seo-keywords"
                                  value={goldFormData.seo_keywords || ""}
                                  onChange={(e) =>
                                    setGoldFormData({ ...goldFormData, seo_keywords: e.target.value })
                                  }
                                  placeholder="Ключови думи (разд��лени със запетая)"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setGoldDialogOpen(false)
                                resetGoldForm()
                              }}
                            >
                              Отказ
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Запазване..." : editingGold ? "Обнови" : "Добави"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Live Gold Price Panel */}
                  {liveGoldPrice && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-600" />
                          Актуални цени на златото (EUR)
                        </h3>
                        <div className="flex items-center gap-2">
                          {liveGoldPrice.change !== 0 && (
                            <span className={`flex items-center text-sm font-medium ${liveGoldPrice.change > 0 ? "text-green-600" : "text-red-600"}`}>
                              {liveGoldPrice.change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                              {liveGoldPrice.change_percent.toFixed(2)}%
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Източник: {liveGoldPrice.source === "goldapi.io" ? "GoldAPI.io" : "Резервни данни"}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { karat: 24, price: liveGoldPrice.prices.price_gram_24k, label: "24К (99.9%)" },
                          { karat: 22, price: liveGoldPrice.prices.price_gram_22k, label: "22К (91.6%)" },
                          { karat: 21, price: liveGoldPrice.prices.price_gram_21k, label: "21К (87.5%)" },
                          { karat: 18, price: liveGoldPrice.prices.price_gram_18k, label: "18К (75%)" },
                          { karat: 14, price: liveGoldPrice.prices.price_gram_14k, label: "14К (58.3%)" },
                        ].map((item) => (
                          <div key={item.karat} className="bg-white dark:bg-zinc-900 p-3 rounded-md border border-yellow-200 dark:border-yellow-700">
                            <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                              {item.price.toFixed(2)} €/гр
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2 text-xs h-7"
                              onClick={() => applyLiveGoldPrice(item.karat)}
                            >
                              Приложи
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Актуална глобална цена: <strong className="text-foreground">{globalGoldPricePerGram.toFixed(2)} €/гр</strong>
                        </span>
                        <span>
                          Последна актуализация: {new Date(liveGoldPrice.timestamp).toLocaleString("bg-BG")}
                        </span>
                      </div>
                    </div>
                  )}

                  {gold.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавено злато. Натиснете "Добави злато" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Тип</TableHead>
                            <TableHead>Тегло (гр)</TableHead>
                            <TableHead>Цена/гр (€)</TableHead>
                            <TableHead>Обща сума (€)</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gold.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.gold_type}</TableCell>
                              <TableCell>{Number(item.weight_grams).toFixed(2)}</TableCell>
                              <TableCell>
                                {Number(item.price_per_gram).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                {Number(item.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="capitalize">{item.status}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditGold(item)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingGoldId(item.id)
                                      setDeleteGoldDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Gold Confirmation Dialog */}
              <AlertDialog open={deleteGoldDialogOpen} onOpenChange={setDeleteGoldDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на златен продукт</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете този златен продукт? Това действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingGoldId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteGold}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Global Gold Price Modal */}
              <Dialog open={goldPriceDialogOpen} onOpenChange={setGoldPriceDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Задаване на глобална цена на грам злато</DialogTitle>
                    <DialogDescription>
                      Въведете цената в EUR или заредете актуалните цени от интернет.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Live Price Fetch Button */}
                    <div className="space-y-2">
                      <Label>Актуални цени от интернет</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={fetchLiveGoldPrice}
                        disabled={liveGoldPriceLoading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${liveGoldPriceLoading ? "animate-spin" : ""}`} />
                        {liveGoldPriceLoading ? "Зареждане..." : "Зареди актуални цени"}
                      </Button>
                    </div>

                    {/* Live Price Options */}
                    {liveGoldPrice && (
                      <div className="space-y-2">
                        <Label>Изберете карат</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { karat: 24, price: liveGoldPrice.prices.price_gram_24k },
                            { karat: 22, price: liveGoldPrice.prices.price_gram_22k },
                            { karat: 21, price: liveGoldPrice.prices.price_gram_21k },
                            { karat: 18, price: liveGoldPrice.prices.price_gram_18k },
                            { karat: 14, price: liveGoldPrice.prices.price_gram_14k },
                          ].map((item) => (
                            <Button
                              key={item.karat}
                              type="button"
                              variant={globalGoldPricePerGram === Number(item.price.toFixed(2)) ? "default" : "outline"}
                              size="sm"
                              onClick={() => setGlobalGoldPricePerGram(Number(item.price.toFixed(2)))}
                              className="flex flex-col h-auto py-2"
                            >
                              <span className="text-xs font-bold">{item.karat}К</span>
                              <span className="text-xs">{item.price.toFixed(2)}€</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Input */}
                    <div className="space-y-2">
                      <Label htmlFor="global-gold-price">Цена за грам (€)</Label>
                      <Input
                        id="global-gold-price"
                        type="number"
                        step="0.01"
                        value={globalGoldPricePerGram}
                        onChange={(e) => setGlobalGoldPricePerGram(Number.parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setGoldPriceDialogOpen(false)} disabled={isSubmitting}>
                      Отказ
                    </Button>
                    <Button onClick={handleSaveGlobalGoldPrice} disabled={isSubmitting}>
                      {isSubmitting ? "Запазване..." : "Запази"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="gold-categories">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    Управление на категории злато
                  </CardTitle>
                  <Dialog open={goldCategoryDialogOpen} onOpenChange={setGoldCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetGoldCategoryForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави категория
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingGoldCategory ? "Редактирай категория" : "Добави нова категория злато"}
                        </DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за категорията. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGoldCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="gold-category-name">Име на категория</Label>
                          <Input
                            id="gold-category-name"
                            value={goldCategoryFormData.name}
                            onChange={(e) => setGoldCategoryFormData({ ...goldCategoryFormData, name: e.target.value })}
                            placeholder="Напр. Пръстени"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gold-category-parent">Главна категория (опционално)</Label>
                          <select
                            id="gold-category-parent"
                            value={goldCategoryFormData.parent_id || ""}
                            onChange={(e) =>
                              setGoldCategoryFormData({
                                ...goldCategoryFormData,
                                parent_id: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Без главна категория (основна)</option>
                            {goldCategories
                              .filter((c) => !c.parent_id && c.id !== editingGoldCategory?.id)
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Оставете празно за да създадете основна категория, или изберете главна категория за да
                            създа��ете подкатегория.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gold-category-order">Ред на показване</Label>
                          <Input
                            id="gold-category-order"
                            type="number"
                            value={goldCategoryFormData.display_order}
                            onChange={(e) =>
                              setGoldCategoryFormData({
                                ...goldCategoryFormData,
                                display_order: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            min={0}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="gold-category-active"
                            checked={goldCategoryFormData.is_active}
                            onCheckedChange={(checked) =>
                              setGoldCategoryFormData({ ...goldCategoryFormData, is_active: checked })
                            }
                          />
                          <Label htmlFor="gold-category-active">Активна</Label>
                        </div>

                        {!goldCategoryFormData.parent_id && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-3">Настройки за начална страница</h4>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="gold-category-homepage"
                                  checked={goldCategoryFormData.show_on_homepage}
                                  onCheckedChange={(checked) =>
                                    setGoldCategoryFormData({ ...goldCategoryFormData, show_on_homepage: checked })
                                  }
                                />
                                <Label htmlFor="gold-category-homepage">Показвай на началната страница</Label>
                              </div>

                              {goldCategoryFormData.show_on_homepage && (
                                <div className="space-y-2">
                                  <Label htmlFor="gold-category-homepage-order">
                                    Ред на показване (начална страница)
                                  </Label>
                                  <Input
                                    id="gold-category-homepage-order"
                                    type="number"
                                    value={goldCategoryFormData.homepage_order}
                                    onChange={(e) =>
                                      setGoldCategoryFormData({
                                        ...goldCategoryFormData,
                                        homepage_order: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    min={0}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4 space-y-2">
                          <Label htmlFor="gold-category-homepage-image">Снимка на категорията</Label>
                          {goldCategoryFormData.homepage_image && (
                            <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={goldCategoryFormData.homepage_image || "/placeholder.svg"}
                                alt="Снимка на категорията"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <Input
                            id="gold-category-homepage-image-file"
                            type="file"
                            accept="image/*"
                            disabled={uploadingCategoryFormImage === "gold"}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                setUploadingCategoryFormImage("gold")
                                const url = await handleImageUpload(file)
                                setGoldCategoryFormData((prev) => ({ ...prev, homepage_image: url }))
                              } catch (error) {
                                console.error("Error uploading gold category image:", error)
                                toast({
                                  title: "Грешка",
                                  description: "Неуспешно качване на изображението",
                                  variant: "destructive",
                                })
                              } finally {
                                setUploadingCategoryFormImage(null)
                              }
                            }}
                          />
                          {uploadingCategoryFormImage === "gold" && (
                            <p className="text-xs text-muted-foreground">Качване...</p>
                          )}
                          <Input
                            id="gold-category-homepage-image"
                            value={goldCategoryFormData.homepage_image}
                            onChange={(e) =>
                              setGoldCategoryFormData({
                                ...goldCategoryFormData,
                                homepage_image: e.target.value,
                              })
                            }
                            placeholder="или поставете URL: https://example.com/image.jpg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Качете снимка от компютъра или поставете URL. Оставете празно за снимка по подразбиране.
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setGoldCategoryDialogOpen(false)
                              setEditingGoldCategory(null)
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Запазване..." : editingGoldCategory ? "Обнови" : "Добави"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {goldCategories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени категории злато. Натиснете "Добави категория" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Главна категория</TableHead>
                            <TableHead>Ред</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {goldCategories
                            .sort((a, b) => {
                              // Main categories first (no parent)
                              if (!a.parent_id && b.parent_id) return -1
                              if (a.parent_id && !b.parent_id) return 1
                              // Then sort by parent_id
                              if (a.parent_id !== b.parent_id) return (a.parent_id || 0) - (b.parent_id || 0)
                              // Then by display_order
                              return a.display_order - b.display_order
                            })
                            .map((category) => (
                              <TableRow key={category.id} className={category.parent_id ? "bg-gray-50" : ""}>
                                <TableCell className="font-medium">
                                  {category.parent_id && <span className="text-gray-400 mr-2">└</span>}
                                  {category.name}
                                </TableCell>
                                <TableCell>
                                  {category.parent_name || (
                                    <span className="text-muted-foreground text-sm">Основна</span>
                                  )}
                                </TableCell>
                                <TableCell>{category.display_order}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      category.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {category.is_active ? "��ктивна" : "Неактивна"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingGoldCategory(category)
                                        setGoldCategoryFormData({
                                          name: category.name,
                                          display_order: category.display_order,
                                          is_active: category.is_active,
                                          parent_id: category.parent_id,
                                          show_on_homepage: category.show_on_homepage || false,
                                          homepage_image: category.homepage_image || "",
                                          homepage_order: category.homepage_order || 0,
                                        })
                                        setGoldCategoryDialogOpen(true)
                                      }}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        setDeletingGoldCategory(category)
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Delete Confirmation for Gold Category */}
              <AlertDialog
                open={!!deletingGoldCategory}
                onOpenChange={(open) => !open && setDeletingGoldCategory(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Това действие ще изтрие категорията "{deletingGoldCategory?.name}". Всички златни продукти,
                      свързани с тази категория, ще бъдат премахнати или ще загубят своята категория. Това действие не
                      може да бъде отменено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingGoldCategory(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteGoldCategory}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            {/* Silver Tab */}
            <TabsContent value="silver">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Coins className="w-6 h-6" />
                    Управление на сребро
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSilverPriceDialogOpen(true)}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Цена: {globalSilverPricePerGram > 0 ? `${globalSilverPricePerGram.toFixed(2)} €/гр` : "Не е зададена"}
                    </Button>
                    <Dialog open={silverDialogOpen} onOpenChange={setSilverDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetSilverForm}>
                          <Plus className="w-4 h-4 mr-2" />
                          Добави сребро
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingSilver ? "Редактирай сребърен продукт" : "Добави нов сребърен продукт"}
                          </DialogTitle>
                          <DialogDescription>
                            Попълнете информацията за сребърния продукт. Полетата с * са задължителни.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSilverSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="silver-type">Тип сребро *</Label>
                              <Input
                                id="silver-type"
                                type="text"
                                required
                                placeholder="Въведете тип сребро"
                                value={silverFormData.silver_type}
                                onChange={(e) => setSilverFormData({ ...silverFormData, silver_type: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-weight">Тегло (гр) *</Label>
                              <Input
                                id="silver-weight"
                                type="number"
                                step="0.01"
                                required
                                value={silverFormData.weight_grams}
                                onChange={(e) =>
                                  setSilverFormData({ ...silverFormData, weight_grams: Number.parseFloat(e.target.value) })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-purity">Чистота (%) *</Label>
                              <Input
                                id="silver-purity"
                                type="number"
                                required
                                value={silverFormData.purity_percentage}
                                onChange={(e) =>
                                  setSilverFormData({
                                    ...silverFormData,
                                    purity_percentage: Number.parseInt(e.target.value),
                                  })
                                }
                                placeholder="Напр. 925, 900"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-price-per-gram">Цена за грам (€) *</Label>
                              <Input
                                id="silver-price-per-gram"
                                type="number"
                                step="0.01"
                                required
                                value={editingSilver ? silverFormData.price_per_gram : globalSilverPricePerGram}
                                onChange={(e) =>
                                  setSilverFormData({
                                    ...silverFormData,
                                    price_per_gram: Number.parseFloat(e.target.value),
                                  })
                                }
                                disabled={!editingSilver && globalSilverPricePerGram > 0}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-total-amount">Обща сума (€) *</Label>
                              <Input
                                id="silver-total-amount"
                                type="number"
                                step="0.01"
                                required
                                value={(silverFormData.weight_grams * (editingSilver ? silverFormData.price_per_gram : globalSilverPricePerGram)).toFixed(2)}
                                onChange={(e) =>
                                  setSilverFormData({ ...silverFormData, total_amount: Number.parseFloat(e.target.value) })
                                }
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-currency">Валута</Label>
                              <Select
                                value={silverFormData.currency}
                                onValueChange={(value) => setSilverFormData({ ...silverFormData, currency: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="BGN">BGN</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-status">Статус *</Label>
                              <Select
                                value={silverFormData.status}
                                onValueChange={(value) => setSilverFormData({ ...silverFormData, status: value })}
                              >
                                <SelectTrigger id="silver-status">
                                  <SelectValue placeholder="Изберете статус..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Наличен</SelectItem>
                                  <SelectItem value="sold">Продаден</SelectItem>
                                  <SelectItem value="reserved">Резервиран</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-store">Магазин</Label>
                              <Select
                                value={silverFormData.store_id?.toString() || "none"}
                                onValueChange={(value) =>
                                  setSilverFormData({
                                    ...silverFormData,
                                    store_id: value === "none" ? null : Number(value),
                                  })
                                }
                              >
                                <SelectTrigger id="silver-store">
                                  <SelectValue placeholder="��зберете магазин" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Без магазин</SelectItem>
                                  {stores.map((store) => (
                                    <SelectItem key={store.id} value={store.id.toString()}>
                                      {store.name} - {store.city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="silver-category">Категория</Label>
                              <Select
                                value={silverFormData.category_id?.toString() || "none"}
                                onValueChange={(value) =>
                                  setSilverFormData({
                                    ...silverFormData,
                                    category_id: value === "none" ? null : Number(value),
                                    subcategory_id: null,
                                  })
                                }
                              >
                                <SelectTrigger id="silver-category">
                                  <SelectValue placeholder="Изберете категория..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Без категория</SelectItem>
                                  {silverCategories
                                    .filter((category) => !category.parent_id)
                                    .map((category) => (
                                      <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {silverFormData.category_id &&
                              silverCategories.some((cat) => cat.parent_id === silverFormData.category_id) && (
                                <div className="space-y-2">
                                  <Label htmlFor="silver-subcategory">Подкатегория</Label>
                                  <Select
                                    value={silverFormData.subcategory_id?.toString() || "none"}
                                    onValueChange={(value) =>
                                      setSilverFormData({
                                        ...silverFormData,
                                        subcategory_id: value === "none" ? null : Number(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger id="silver-subcategory">
                                      <SelectValue placeholder="Изберете подкатегория..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Без подкатегория</SelectItem>
                                      {silverCategories
                                        .filter((cat) => cat.parent_id === silverFormData.category_id)
                                        .map((category) => (
                                          <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            <div className="space-y-2">
                              <Label htmlFor="silver-promotions">Промоция (€)</Label>
                              <Input
                                id="silver-promotions"
                                type="number"
                                step="0.01"
                                placeholder="Напр. 50.00"
                                value={silverFormData.promotions ?? ""}
                                onChange={(e) =>
                                  setSilverFormData({
                                    ...silverFormData,
                                    promotions: e.target.value === "" ? null : Number.parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="silver-description">Описание</Label>
                            <Textarea
                              id="silver-description"
                              rows={3}
                              value={silverFormData.description || ""}
                              onChange={(e) => setSilverFormData({ ...silverFormData, description: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="silver-notes">Бележки</Label>
                            <Textarea
                              id="silver-notes"
                              rows={2}
                              value={silverFormData.notes || ""}
                              onChange={(e) => setSilverFormData({ ...silverFormData, notes: e.target.value })}
                            />
                          </div>

                          {/* Image Uploads */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Снимки</Label>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSilverFormData({
                                    ...silverFormData,
                                    images: [...silverFormData.images, ""],
                                  })
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Добави слот
                              </Button>
                            </div>
                            {silverFormData.images.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                Няма добавени снимки. Натиснете &quot;Добави слот&quot; за да добавите.
                              </p>
                            )}
                            <div className="space-y-2">
                              {silverFormData.images.map((img, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                  <div className="flex-1">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          setUploadingSilverImages({ ...uploadingSilverImages, [index]: true })
                                          try {
                                            const url = await handleImageUpload(file)
                                            const newImages = [...silverFormData.images]
                                            newImages[index] = url
                                            setSilverFormData({ ...silverFormData, images: newImages })
                                            toast({
                                              title: "Успех",
                                              description: `Снимка ${index + 1} е качена успешно`,
                                            })
                                          } catch (error) {
                                            toast({
                                              title: "Грешка",
                                              description: "Неуспешно качване на снимката",
                                              variant: "destructive",
                                            })
                                          } finally {
                                            setUploadingSilverImages({ ...uploadingSilverImages, [index]: false })
                                          }
                                        }
                                      }}
                                    />
                                    {uploadingSilverImages[index] && (
                                      <p className="text-xs text-muted-foreground mt-1">Качване...</p>
                                    )}
                                    {img && (
                                      <img
                                        src={img || "/placeholder.svg"}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded mt-2"
                                      />
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => {
                                      const newImages = silverFormData.images.filter((_, i) => i !== index)
                                      setSilverFormData({ ...silverFormData, images: newImages })
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SEO Section */}
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">SEO Настройки</h4>
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="silver-seo-title">SEO Заглавие</Label>
                                <Input
                                  id="silver-seo-title"
                                  value={silverFormData.seo_title || ""}
                                  onChange={(e) =>
                                    setSilverFormData({ ...silverFormData, seo_title: e.target.value })
                                  }
                                  placeholder="Заглавие за търсачките (до 60 символа)"
                                  maxLength={60}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {(silverFormData.seo_title || "").length}/60 символа
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="silver-seo-description">SEO Описание</Label>
                                <Textarea
                                  id="silver-seo-description"
                                  rows={2}
                                  value={silverFormData.seo_description || ""}
                                  onChange={(e) =>
                                    setSilverFormData({ ...silverFormData, seo_description: e.target.value })
                                  }
                                  placeholder="Описание за търсачките (до 160 символа)"
                                  maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {(silverFormData.seo_description || "").length}/160 символа
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="silver-seo-keywords">SEO Ключови думи</Label>
                                <Input
                                  id="silver-seo-keywords"
                                  value={silverFormData.seo_keywords || ""}
                                  onChange={(e) =>
                                    setSilverFormData({ ...silverFormData, seo_keywords: e.target.value })
                                  }
                                  placeholder="Ключови думи (разделени със запетая)"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSilverDialogOpen(false)
                                resetSilverForm()
                              }}
                            >
                              Отказ
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Запазване..." : editingSilver ? "Обнови" : "Добави"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {silver.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавено сребро. Натиснете &quot;Добави сребро&quot; за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Тип</TableHead>
                            <TableHead>Тегло (гр)</TableHead>
                            <TableHead>Цена/гр (€)</TableHead>
                            <TableHead>Обща сума (€)</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {silver.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.silver_type}</TableCell>
                              <TableCell>{Number(item.weight_grams).toFixed(2)}</TableCell>
                              <TableCell>
                                {Number(item.price_per_gram).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                {Number(item.total_amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="capitalize">{item.status}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditSilver(item)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingSilverId(item.id)
                                      setDeleteSilverDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Silver Confirmation Dialog */}
              <AlertDialog open={deleteSilverDialogOpen} onOpenChange={setDeleteSilverDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на сребърен продукт</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете този сребърен продукт? Това действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingSilverId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSilver}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Global Silver Price Modal */}
              <Dialog open={silverPriceDialogOpen} onOpenChange={setSilverPriceDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Задаване на глобална цена на грам сребро</DialogTitle>
                    <DialogDescription>
                      Въведете цената в EUR. Тази цена ще се използва за всички нови сребърни продукти.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Manual Input */}
                    <div className="space-y-2">
                      <Label htmlFor="global-silver-price">Цена за грам (€)</Label>
                      <Input
                        id="global-silver-price"
                        type="number"
                        step="0.01"
                        value={globalSilverPricePerGram}
                        onChange={(e) => setGlobalSilverPricePerGram(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Можете също да зададете цени от страницата &quot;Цени метали&quot;.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setSilverPriceDialogOpen(false)} disabled={isSubmitting}>
                      Отказ
                    </Button>
                    <Button onClick={handleSaveGlobalSilverPrice} disabled={isSubmitting}>
                      {isSubmitting ? "Запазване..." : "Запази"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Silver Categories Tab */}
            <TabsContent value="silver-categories">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    Управление на категории сребро
                  </CardTitle>
                  <Dialog open={silverCategoryDialogOpen} onOpenChange={setSilverCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetSilverCategoryForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави категория
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSilverCategory ? "Редактирай категория" : "Добави нова категория сребро"}
                        </DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за категорията. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSilverCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="silver-category-name">Име на категория</Label>
                          <Input
                            id="silver-category-name"
                            value={silverCategoryFormData.name}
                            onChange={(e) => setSilverCategoryFormData({ ...silverCategoryFormData, name: e.target.value })}
                            placeholder="Напр. Пръстени"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="silver-category-parent">Главна категория (опционално)</Label>
                          <select
                            id="silver-category-parent"
                            value={silverCategoryFormData.parent_id || ""}
                            onChange={(e) =>
                              setSilverCategoryFormData({
                                ...silverCategoryFormData,
                                parent_id: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Без главна категория (основна)</option>
                            {silverCategories
                              .filter((c) => !c.parent_id && c.id !== editingSilverCategory?.id)
                              .map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Оставете празно за да създадете основна категория, или изберете главна категория за да
                            създадете подкатегория.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="silver-category-order">Ред на показв��не</Label>
                          <Input
                            id="silver-category-order"
                            type="number"
                            value={silverCategoryFormData.display_order}
                            onChange={(e) =>
                              setSilverCategoryFormData({
                                ...silverCategoryFormData,
                                display_order: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            min={0}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="silver-category-active"
                            checked={silverCategoryFormData.is_active}
                            onCheckedChange={(checked) =>
                              setSilverCategoryFormData({ ...silverCategoryFormData, is_active: checked })
                            }
                          />
                          <Label htmlFor="silver-category-active">Активна</Label>
                        </div>

                        {!silverCategoryFormData.parent_id && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-3">Настройки за начална страница</h4>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="silver-category-homepage"
                                  checked={silverCategoryFormData.show_on_homepage}
                                  onCheckedChange={(checked) =>
                                    setSilverCategoryFormData({ ...silverCategoryFormData, show_on_homepage: checked })
                                  }
                                />
                                <Label htmlFor="silver-category-homepage">Показвай на началната страница</Label>
                              </div>

                              {silverCategoryFormData.show_on_homepage && (
                                <div className="space-y-2">
                                  <Label htmlFor="silver-category-homepage-order">
                                    Ред на показване (начална страница)
                                  </Label>
                                  <Input
                                    id="silver-category-homepage-order"
                                    type="number"
                                    value={silverCategoryFormData.homepage_order}
                                    onChange={(e) =>
                                      setSilverCategoryFormData({
                                        ...silverCategoryFormData,
                                        homepage_order: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    min={0}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4 space-y-2">
                          <Label htmlFor="silver-category-homepage-image">Снимка на категорията</Label>
                          {silverCategoryFormData.homepage_image && (
                            <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={silverCategoryFormData.homepage_image || "/placeholder.svg"}
                                alt="Снимка на категорията"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <Input
                            id="silver-category-homepage-image-file"
                            type="file"
                            accept="image/*"
                            disabled={uploadingCategoryFormImage === "silver"}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                setUploadingCategoryFormImage("silver")
                                const url = await handleImageUpload(file)
                                setSilverCategoryFormData((prev) => ({ ...prev, homepage_image: url }))
                              } catch (error) {
                                console.error("Error uploading silver category image:", error)
                                toast({
                                  title: "Грешка",
                                  description: "Неуспешно качване на изображението",
                                  variant: "destructive",
                                })
                              } finally {
                                setUploadingCategoryFormImage(null)
                              }
                            }}
                          />
                          {uploadingCategoryFormImage === "silver" && (
                            <p className="text-xs text-muted-foreground">Качване...</p>
                          )}
                          <Input
                            id="silver-category-homepage-image"
                            value={silverCategoryFormData.homepage_image}
                            onChange={(e) =>
                              setSilverCategoryFormData({
                                ...silverCategoryFormData,
                                homepage_image: e.target.value,
                              })
                            }
                            placeholder="или поставете URL: https://example.com/image.jpg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Качете снимка от компютъра или поставете URL. Оставете празно за снимка по подразбиране.
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSilverCategoryDialogOpen(false)
                              setEditingSilverCategory(null)
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Запазване..." : editingSilverCategory ? "Обнови" : "Добави"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {silverCategories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени категории сребро. Натиснете &quot;Добави категория&quot; за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Главна категория</TableHead>
                            <TableHead>Ред</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {silverCategories
                            .sort((a, b) => {
                              // Main categories first (no parent)
                              if (!a.parent_id && b.parent_id) return -1
                              if (a.parent_id && !b.parent_id) return 1
                              // Then sort by parent_id
                              if (a.parent_id !== b.parent_id) return (a.parent_id || 0) - (b.parent_id || 0)
                              // Then by display_order
                              return a.display_order - b.display_order
                            })
                            .map((category) => (
                              <TableRow key={category.id} className={category.parent_id ? "bg-gray-50" : ""}>
                                <TableCell className="font-medium">
                                  {category.parent_id && <span className="text-gray-400 mr-2">└</span>}
                                  {category.name}
                                </TableCell>
                                <TableCell>
                                  {category.parent_name || (
                                    <span className="text-muted-foreground text-sm">Основна</span>
                                  )}
                                </TableCell>
                                <TableCell>{category.display_order}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      category.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {category.is_active ? "Активна" : "Неактивна"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingSilverCategory(category)
                                        setSilverCategoryFormData({
                                          name: category.name,
                                          display_order: category.display_order,
                                          is_active: category.is_active,
                                          parent_id: category.parent_id,
                                          show_on_homepage: category.show_on_homepage || false,
                                          homepage_image: category.homepage_image || "",
                                          homepage_order: category.homepage_order || 0,
                                        })
                                        setSilverCategoryDialogOpen(true)
                                      }}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        setDeletingSilverCategory(category)
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Delete Confirmation for Silver Category */}
              <AlertDialog
                open={!!deletingSilverCategory}
                onOpenChange={(open) => !open && setDeletingSilverCategory(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Това действие ще изтрие категорията &quot;{deletingSilverCategory?.name}&quot;. Всички сребърни продукти,
                      свързани с тази категория, ще бъдат премахнати или ще загубят своята категория. Това действие не
                      може да бъде отменено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingSilverCategory(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSilverCategory}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            {/* Metal Prices Tab for Gold/Silver Calculator */}
            <TabsContent value="metal-prices">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Цени злато и сребро (изкупуване)
                  </CardTitle>
                  <Button onClick={fetchMetalPrices} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Обнови
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    Тези цени се показват на страницата за изкупуване на злато и сребро и се използват в калкулатора.
                  </p>
                  
                  {metalPricesLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане...</div>
                  ) : metalPrices.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма налични цени. Моля изпълнете SQL скрипта за създаване на таблицата.
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Gold Prices */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-500" />
                          Злато
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Продукт</TableHead>
                              <TableHead>Цена за грам (EUR)</TableHead>
                              <TableHead>Последна промяна</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {metalPrices
                              .filter(p => p.metal_type === "gold")
                              .map((price) => (
                                <TableRow key={price.id}>
                                  <TableCell className="font-medium">{price.purity_label}</TableCell>
                                  <TableCell>
                                    {editingMetalPriceId === price.id ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editingMetalPriceValue}
                                          onChange={(e) => setEditingMetalPriceValue(e.target.value)}
                                          className="w-28"
                                        />
                                        <span>€</span>
                                      </div>
                                    ) : (
                                      <span className="font-semibold text-yellow-600">{Number(price.price_per_gram).toFixed(2)} €</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">
                                    {new Date(price.updated_at).toLocaleString("bg-BG")}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {editingMetalPriceId === price.id ? (
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleUpdateMetalPrice(price.id, parseFloat(editingMetalPriceValue))}
                                        >
                                          Запази
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setEditingMetalPriceId(null)
                                            setEditingMetalPriceValue("")
                                          }}
                                        >
                                          Отказ
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingMetalPriceId(price.id)
                                          setEditingMetalPriceValue(price.price_per_gram.toString())
                                        }}
                                      >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Промени
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Silver Prices */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Coins className="w-5 h-5 text-gray-400" />
                          Сребро
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Продукт</TableHead>
                              <TableHead>Цена за грам (EUR)</TableHead>
                              <TableHead>Последна промяна</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {metalPrices
                              .filter(p => p.metal_type === "silver")
                              .map((price) => (
                                <TableRow key={price.id}>
                                  <TableCell className="font-medium">{price.purity_label}</TableCell>
                                  <TableCell>
                                    {editingMetalPriceId === price.id ? (
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editingMetalPriceValue}
                                          onChange={(e) => setEditingMetalPriceValue(e.target.value)}
                                          className="w-28"
                                        />
                                        <span>€</span>
                                      </div>
                                    ) : (
                                      <span className="font-semibold text-gray-500">{Number(price.price_per_gram).toFixed(2)} €</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm">
                                    {new Date(price.updated_at).toLocaleString("bg-BG")}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {editingMetalPriceId === price.id ? (
                                      <div className="flex items-center justify-end gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleUpdateMetalPrice(price.id, parseFloat(editingMetalPriceValue))}
                                        >
                                          Запази
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setEditingMetalPriceId(null)
                                            setEditingMetalPriceValue("")
                                          }}
                                        >
                                          Отказ
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingMetalPriceId(price.id)
                                          setEditingMetalPriceValue(price.price_per_gram.toString())
                                        }}
                                      >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Промени
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Управление на клиенти
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Няма регистрирани клиенти.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Имейл</TableHead>
                            <TableHead>Име</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Брой поръчки</TableHead>
                            <TableHead>Общо похарчено</TableHead>
                            <TableHead>Дата на регистрация</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{(user.first_name || "") + " " + (user.last_name || "")}</TableCell>
                              <TableCell>{user.phone || "-"}</TableCell>
                              <TableCell>{user.order_count}</TableCell>
                              <TableCell>{user.total_spent.toLocaleString()} €</TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString("bg-BG")}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeletingUserId(user.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete User Confirmation Dialog */}
              <AlertDialog open={!!deletingUserId} onOpenChange={(open) => !open && setDeletingUserId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на клиент</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете този клиент? Това действие ще изтрие и всички негови поръчки и не може да бъде отменено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingUserId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteUser(deletingUserId!)}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Управление на поръчки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Няма регистрирани поръчки.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Клиент</TableHead>
                            <TableHead>Имейл</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Адрес</TableHead>
                            <TableHead>Обща сума</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Дейст��ия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {order.user_first_name} {order.user_last_name}
                                  </span>
                                  {!order.user_id && (
                                    <span className="text-xs text-orange-600 font-medium">Гост</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{order.user_email}</TableCell>
                              <TableCell className="text-sm">{order.phone || "-"}</TableCell>
                              <TableCell className="text-sm max-w-[150px] truncate" title={`${order.shipping_address}, ${order.shipping_city}`}>
                                {order.shipping_city}
                              </TableCell>
                              <TableCell>{order.total_amount.toLocaleString()} €</TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(newStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                                >
                                  <SelectTrigger className="capitalize">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">В изчакване</SelectItem>
                                    <SelectItem value="processing">Обработва се</SelectItem>
                                    <SelectItem value="shipped">Изпратена</SelectItem>
                                    <SelectItem value="delivered">Доставена</SelectItem>
                                    <SelectItem value="cancelled">Отказана</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{new Date(order.created_at).toLocaleString("bg-BG")}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => setViewingOrder(order)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => setDeletingOrderId(order.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Details Dialog */}
              <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Детайли на поръчка #{viewingOrder?.id}</DialogTitle>
                  </DialogHeader>
                  {viewingOrder && (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">Клиент</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Име:</span>
                            <p className="font-medium">{viewingOrder.user_first_name} {viewingOrder.user_last_name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Имейл:</span>
                            <p className="font-medium">{viewingOrder.user_email}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Телефон:</span>
                            <p className="font-medium">{viewingOrder.phone || "-"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Тип:</span>
                            <p className="font-medium">{viewingOrder.user_id ? "Регистриран" : "Гост"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">Доставка</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Метод:</span>
                            <p className="font-medium">
                              {viewingOrder.delivery_method === "econt" ? "Еконт офис" : 
                               viewingOrder.delivery_method === "pickup" ? "Вземане от магазин" : 
                               viewingOrder.delivery_method === "address" ? "До адрес" : 
                               viewingOrder.delivery_method || "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Цена доставка:</span>
                            <p className="font-medium">{viewingOrder.delivery_cost ? `${Number(viewingOrder.delivery_cost).toFixed(2)} €` : "Безплатна"}</p>
                          </div>
                          {viewingOrder.econt_city && (
                            <>
                              <div>
                                <span className="text-muted-foreground">Еконт град:</span>
                                <p className="font-medium">{viewingOrder.econt_city}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Еконт офис:</span>
                                <p className="font-medium">{viewingOrder.econt_office_name || "-"}</p>
                              </div>
                              {viewingOrder.econt_office_address && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Адрес на офис:</span>
                                  <p className="font-medium">{viewingOrder.econt_office_address}</p>
                                </div>
                              )}
                            </>
                          )}
                          {viewingOrder.store_name && (
                            <>
                              <div>
                                <span className="text-muted-foreground">Магазин:</span>
                                <p className="font-medium">{viewingOrder.store_name}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Адрес магазин:</span>
                                <p className="font-medium">{viewingOrder.store_address || "-"}</p>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-muted-foreground">Адрес:</span>
                            <p className="font-medium">{viewingOrder.shipping_address || "-"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Град:</span>
                            <p className="font-medium">{viewingOrder.shipping_city || "-"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Държава:</span>
                            <p className="font-medium">{viewingOrder.country || "България"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">Плащане</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Метод:</span>
                            <p className="font-medium">
                              {viewingOrder.payment_method === "cod" ? "Наложен платеж" : 
                               viewingOrder.payment_method === "card" ? "Онлайн с карта" : 
                               viewingOrder.payment_method === "bank" ? "Банков превод" : 
                               viewingOrder.payment_method || "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Обща сума:</span>
                            <p className="font-medium text-lg">{Number(viewingOrder.total_amount).toFixed(2)} €</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">Продукти</h3>
                        <div className="space-y-3">
                          {viewingOrder.items?.filter(item => item.id).map((item, index) => {
                            // Determine the product URL based on product_type
                            const getProductUrl = () => {
                              switch (item.product_type) {
                                case "equipment":
                                  return `/equipment/${item.product_id}`
                                case "car":
                                case "cars":
                                  return `/cars/${item.product_id}`
                                case "gold":
                                  return `/gold/${item.product_id}`
                                default:
                                  return `/equipment/${item.product_id}`
                              }
                            }
                            
                            const hasPromo = item.has_promotion && item.original_price && Number(item.original_price) > Number(item.price)
                            
                            return (
                              <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                {item.product_image && (
                                  <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{item.product_name}</p>
                                    <Link 
                                      href={getProductUrl()} 
                                      target="_blank"
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Виж в сайта"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {hasPromo ? (
                                      <span>
                                        {item.quantity} x{" "}
                                        <span className="line-through text-gray-400 mr-1">
                                          {Number(item.original_price || 0).toFixed(2)} €
                                        </span>
                                        <span className="text-red-600 font-medium">
                                          {Number(item.price || 0).toFixed(2)} €
                                        </span>
                                        <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                          Промоция
                                        </span>
                                      </span>
                                    ) : (
                                      <span>{item.quantity} x {Number(item.price || 0).toFixed(2)} €</span>
                                    )}
                                  </div>
                                </div>
                                <p className="font-medium">{(item.quantity * Number(item.price || 0)).toFixed(2)} €</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Notes */}
                      {viewingOrder.notes && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-3">Бележки</h3>
                          <p className="text-sm whitespace-pre-wrap">{viewingOrder.notes}</p>
                        </div>
                      )}

                      {/* Order Meta */}
                      <div className="text-sm text-muted-foreground">
                        <p>Създадена: {new Date(viewingOrder.created_at).toLocaleString("bg-BG")}</p>
                        {viewingOrder.updated_at && (
                          <p>Обновена: {new Date(viewingOrder.updated_at).toLocaleString("bg-BG")}</p>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Delete Order Confirmation Dialog */}
              <AlertDialog open={!!deletingOrderId} onOpenChange={(open) => !open && setDeletingOrderId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на поръчка</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете тази поръчка? Това действие не може да бъде отменено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingOrderId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteOrder(deletingOrderId!)}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Управление на абонаменти
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Няма абонати.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Имейл</TableHead>
                            <TableHead>Дата на абонамент</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {messages.map((message) => (
                            <TableRow key={message.id}>
                              <TableCell className="font-medium">{message.id}</TableCell>
                              <TableCell>{message.email}</TableCell>
                              <TableCell>{new Date(message.subscribed_at).toLocaleDateString("bg-BG")}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    message.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {message.is_active ? "Активен" : "Неактивен"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(message.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stores">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Управление на магазини
                  </CardTitle>
                  <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetStoreForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави магазин
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingStore ? "Редактирай магазин" : "Добави нов магазин"}</DialogTitle>
                        <DialogDescription>Попълнете информацията за магазина.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleStoreSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="store-name">Име *</Label>
                            <Input
                              id="store-name"
                              required
                              value={storeFormData.name}
                              onChange={(e) => setStoreFormData({ ...storeFormData, name: e.target.value })}
                              placeholder="Напр. AutoComplex Шумен"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-address">Адрес *</Label>
                            <Input
                              id="store-address"
                              required
                              value={storeFormData.address}
                              onChange={(e) => setStoreFormData({ ...storeFormData, address: e.target.value })}
                              placeholder="Напр. бул. Васил Левски 5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-city">Град *</Label>
                            <Input
                              id="store-city"
                              required
                              value={storeFormData.city}
                              onChange={(e) => setStoreFormData({ ...storeFormData, city: e.target.value })}
                              placeholder="Напр. Шумен"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-neighborhood">Квартал/Район</Label>
                            <Input
                              id="store-neighborhood"
                              value={storeFormData.neighborhood || ""}
                              onChange={(e) => setStoreFormData({ ...storeFormData, neighborhood: e.target.value })}
                              placeholder="Напр. Център"
                            />
                          </div>
                          
                          {/* Weekly Hours Section */}
                          <div className="col-span-2 space-y-4 border rounded-lg p-4 bg-muted/30">
                            <Label className="text-base font-semibold">Работно време по дни</Label>
                            {!storeFormData.is_24_7 && storeFormData.weekly_hours && (
                              <div className="grid gap-3">
                                {[
                                  { key: 'monday', label: 'Понеделник' },
                                  { key: 'tuesday', label: 'Вторник' },
                                  { key: 'wednesday', label: 'Сряда' },
                                  { key: 'thursday', label: 'Четвъртък' },
                                  { key: 'friday', label: 'Петък' },
                                  { key: 'saturday', label: 'Събота' },
                                  { key: 'sunday', label: 'Неделя' },
                                ].map(({ key, label }) => {
                                  const dayKey = key as keyof typeof storeFormData.weekly_hours
                                  const dayHours = storeFormData.weekly_hours![dayKey]
                                  return (
                                    <div key={key} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                                      <span className="w-24 text-sm font-medium">{label}</span>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={!dayHours.closed}
                                          onCheckedChange={(checked) => {
                                            setStoreFormData({
                                              ...storeFormData,
                                              weekly_hours: {
                                                ...storeFormData.weekly_hours!,
                                                [dayKey]: { ...dayHours, closed: !checked }
                                              }
                                            })
                                          }}
                                        />
                                        <span className="text-xs text-muted-foreground w-14">{dayHours.closed ? 'Затворено' : 'Отворено'}</span>
                                      </div>
                                      {!dayHours.closed && (
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="time"
                                            value={dayHours.open}
                                            onChange={(e) => {
                                              setStoreFormData({
                                                ...storeFormData,
                                                weekly_hours: {
                                                  ...storeFormData.weekly_hours!,
                                                  [dayKey]: { ...dayHours, open: e.target.value }
                                                }
                                              })
                                            }}
                                            className="w-28"
                                          />
                                          <span className="text-sm">-</span>
                                          <Input
                                            type="time"
                                            value={dayHours.close}
                                            onChange={(e) => {
                                              setStoreFormData({
                                                ...storeFormData,
                                                weekly_hours: {
                                                  ...storeFormData.weekly_hours!,
                                                  [dayKey]: { ...dayHours, close: e.target.value }
                                                }
                                              })
                                            }}
                                            className="w-28"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                            {storeFormData.is_24_7 && (
                              <p className="text-sm text-muted-foreground">Магазинът работи денонощно</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="store-phone">Телефон</Label>
                            <Input
                              id="store-phone"
                              value={storeFormData.phone || ""}
                              onChange={(e) => setStoreFormData({ ...storeFormData, phone: e.target.value })}
                              placeholder="Напр. +359 888 123 456"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="store-google-maps">Google Maps линк</Label>
                            <Input
                              id="store-google-maps"
                              value={storeFormData.google_maps_url || ""}
                              onChange={(e) => setStoreFormData({ ...storeFormData, google_maps_url: e.target.value })}
                              placeholder="Напр. https://maps.google.com/?q=..."
                            />
                            <p className="text-xs text-muted-foreground">
                              Копирайте линка от Google Maps за локацията на магазина
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-rating">Рейтинг (1-5)</Label>
                            <Input
                              id="store-rating"
                              type="number"
                              min="1"
                              max="5"
                              step="0.1"
                              value={storeFormData.rating}
                              onChange={(e) =>
                                setStoreFormData({ ...storeFormData, rating: Number.parseFloat(e.target.value) })
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2 col-span-2 mt-2">
                            <Switch
                              id="store-is-24-7"
                              checked={storeFormData.is_24_7}
                              onCheckedChange={(checked) => setStoreFormData({ ...storeFormData, is_24_7: checked })}
                            />
                            <Label htmlFor="store-is-24-7">Денонощно</Label>
                          </div>
                        </div>

                        {/* Image Upload for Store */}
                        <div className="space-y-2">
                          <Label htmlFor="store-image">Лого/Снимка</Label>
                          <Input
                            id="store-image"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setUploadingImage(true) // Reuse general uploading state
                                try {
                                  const url = await handleImageUpload(file)
                                  setStoreFormData({ ...storeFormData, image_url: url })
                                  toast({
                                    title: "Успех",
                                    description: "Снимката е качена успешно",
                                  })
                                } catch (error) {
                                  toast({
                                    title: "Грешка",
                                    description: "Неуспешно качване на снимката",
                                    variant: "destructive",
                                  })
                                } finally {
                                  setUploadingImage(false)
                                }
                              }
                            }}
                          />
                          {uploadingImage && <p className="text-sm text-muted-foreground">Качване...</p>}
                          {storeFormData.image_url && (
                            <div className="mt-2">
                              <img
                                src={storeFormData.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="store-latitude">Ширина (Latitude)</Label>
                            <Input
                              id="store-latitude"
                              type="number"
                              step="any"
                              value={storeFormData.latitude ?? ""}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  latitude: e.target.value === "" ? null : Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-longitude">Дължина (Longitude)</Label>
                            <Input
                              id="store-longitude"
                              type="number"
                              step="any"
                              value={storeFormData.longitude ?? ""}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  longitude: e.target.value === "" ? null : Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Google Maps Preview */}
                        {storeFormData.google_maps_url && (
                          <div className="space-y-2">
                            <Label>Google Maps Preview</Label>
                            <div className="rounded-lg overflow-hidden border">
                              <iframe
                                src={storeFormData.google_maps_url.includes("embed") 
                                  ? storeFormData.google_maps_url 
                                  : `https://www.google.com/maps?q=${encodeURIComponent(storeFormData.address + ", " + storeFormData.city)}&output=embed`}
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            </div>
                            <a 
                              href={storeFormData.google_maps_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Отвори в Google Maps
                            </a>
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setStoreDialogOpen(false)
                              resetStoreForm()
                            }}
                          >
                            Отказ
                          </Button>
                          <Button type="submit">{editingStore ? "Обнови" : "Добави"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {stores.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Няма добавени магазини. Натиснете "Добави магазин" за да започнете.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Адрес</TableHead>
                            <TableHead>Град</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Работно време</TableHead>
                            <TableHead>Карта</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stores.map((store) => (
                            <TableRow key={store.id}>
                              <TableCell className="font-medium">{store.name}</TableCell>
                              <TableCell>{store.address}</TableCell>
                              <TableCell>{store.city}</TableCell>
                              <TableCell>{store.phone || "-"}</TableCell>
                              <TableCell>{store.working_hours}</TableCell>
                              <TableCell>
                                {store.google_maps_url ? (
                                  <a 
                                    href={store.google_maps_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    Виж
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    store.is_24_7 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {store.is_24_7 ? "24/7" : "Стандартно"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditStore(store)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setDeletingStoreId(store.id)
                                      setDeleteStoreDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delete Confirmation for Store */}
              <AlertDialog open={!!deletingStoreId} onOpenChange={(open) => !open && setDeletingStoreId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Сигурни ли сте?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Това действие ще изтрие магазина. Това действие не може да бъде отменено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingStoreId(null)}>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteStore(deletingStoreId!)}>Изтрий</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Управление на контактни съобщения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contactMessages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">Няма получени съобщения.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Име</TableHead>
                            <TableHead>Имейл</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Относно</TableHead>
                            <TableHead>Съобщение</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contactMessages.map((message) => (
                            <TableRow key={message.id} className={message.is_read ? "" : "bg-blue-50"}>
                              <TableCell className="font-medium">
                                {message.first_name} {message.last_name}
                              </TableCell>
                              <TableCell>{message.email}</TableCell>
                              <TableCell>{message.phone || "-"}</TableCell>
                              <TableCell>{message.subject || "-"}</TableCell>
                              <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                              <TableCell>{new Date(message.created_at).toLocaleString("bg-BG")}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    message.is_read ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {message.is_read ? "Прочетено" : "Непрочетено"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {!message.is_read && (
                                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(message.id)}>
                                      Маркирай като прочетено
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteContactMessage(message.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="remington-settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    Настройки на Remington секция
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="remington-title">Заглавие</Label>
                      <Input
                        id="remington-title"
                        value={remingtonSettings.title}
                        onChange={(e) => setRemingtonSettings({ ...remingtonSettings, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remington-image">Снимка</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="remington-image"
                          type="file"
                          accept="image/*"
                          onChange={handleRemingtonImageChange}
                        />
                      </div>
                      {remingtonImagePreview && (
                        <div className="mt-2">
                          <img
                            src={remingtonImagePreview || "/placeholder.svg"}
                            alt="Remington Preview"
                            className="max-w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remington-button-link">URL за бутон</Label>
                      <Input
                        id="remington-button-link"
                        placeholder="/link-to-remington"
                        value={remingtonSettings.button_link}
                        onChange={(e) => setRemingtonSettings({ ...remingtonSettings, button_link: e.target.value })}
                      />
                    </div>

                    <Button onClick={saveRemingtonSettings} className="w-full">
                      Запази промените
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Delivery Settings Tab */}
            <TabsContent value="delivery-settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Настройки на доставка с Еконт
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {deliverySettingsLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане на настройките...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="free_delivery_threshold">Б��зплатна доставка при поръчка над (EUR)</Label>
                        <Input
                          id="free_delivery_threshold"
                          type="number"
                          step="0.01"
                          min="0"
                          value={deliverySettings.free_delivery_threshold}
                          onChange={(e) => setDeliverySettings({ ...deliverySettings, free_delivery_threshold: Number(e.target.value) })}
                          placeholder="100"
                        />
                        <p className="text-sm text-muted-foreground">
                          Ако общата сума на поръчката надвишава тази стойност, доставката ще бъде безплатна
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="econt_office_price">Цена до офис на Еконт (EUR)</Label>
                        <Input
                          id="econt_office_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={deliverySettings.econt_office_price}
                          onChange={(e) => setDeliverySettings({ ...deliverySettings, econt_office_price: Number(e.target.value) })}
                          placeholder="1.79"
                        />
                        <p className="text-sm text-muted-foreground">
                          Цена за доставка до офис на Еконт (без инкасо)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="econt_address_price">Цена до адрес (EUR)</Label>
                        <Input
                          id="econt_address_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={deliverySettings.econt_address_price}
                          onChange={(e) => setDeliverySettings({ ...deliverySettings, econt_address_price: Number(e.target.value) })}
                          placeholder="2.68"
                        />
                        <p className="text-sm text-muted-foreground">
                          Цена за доставка до адрес (без инкасо)
                        </p>
                      </div>

                      <Button onClick={saveDeliverySettings} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Запазване..." : "Запази промените"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Homepage Visibility Tab */}
            <TabsContent value="homepage-visibility">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    Видимост на секциите на началната страница
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sectionVisibilityLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане на настройките...</div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Изберете кои секции да се показват на началната страница
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Coins className="w-5 h-5 text-yellow-600" />
                            <div>
                              <Label htmlFor="gold-visibility" className="font-medium">Злато</Label>
                              <p className="text-sm text-muted-foreground">Секция със златни изделия</p>
                            </div>
                          </div>
                          <Switch
                            id="gold-visibility"
                            checked={sectionVisibility.gold}
                            onCheckedChange={(checked) => setSectionVisibility({ ...sectionVisibility, gold: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <MonitorSmartphone className="w-5 h-5 text-blue-600" />
                            <div>
                              <Label htmlFor="equipment-visibility" className="font-medium">Техника</Label>
                              <p className="text-sm text-muted-foreground">Секция с електроника и техника</p>
                            </div>
                          </div>
                          <Switch
                            id="equipment-visibility"
                            checked={sectionVisibility.equipment}
                            onCheckedChange={(checked) => setSectionVisibility({ ...sectionVisibility, equipment: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CarIcon className="w-5 h-5 text-green-600" />
                            <div>
                              <Label htmlFor="cars-visibility" className="font-medium">Авто</Label>
                              <p className="text-sm text-muted-foreground">Секция с автомобили</p>
                            </div>
                          </div>
                          <Switch
                            id="cars-visibility"
                            checked={sectionVisibility.cars}
                            onCheckedChange={(checked) => setSectionVisibility({ ...sectionVisibility, cars: checked })}
                          />
                        </div>
                      </div>

                      <Button onClick={saveSectionVisibility} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Запазване..." : "Запази промените"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Homepage Category Images Tab */}
            <TabsContent value="homepage-category-images">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Изображения на категориите (Злато / Сребро)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryRootImagesLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане на изображенията...</div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Качете изображения за двете основни категории, които се показват в секция
                        &quot;Категории&quot; на началната страница.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(["gold", "silver"] as const).map((metal) => (
                          <div key={metal} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                            <Label className="font-medium">{metal === "gold" ? "Злато" : "Сребро"}</Label>
                            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-200">
                              {categoryRootImages[metal] ? (
                                <Image
                                  src={categoryRootImages[metal] || "/placeholder.svg"}
                                  alt={metal === "gold" ? "Злато" : "Сребро"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                  Няма изображение
                                </div>
                              )}
                            </div>
                            <Input
                              type="file"
                              accept="image/*"
                              disabled={uploadingCategoryRootImage === metal}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleCategoryRootImageUpload(metal, file)
                              }}
                            />
                            {uploadingCategoryRootImage === metal && (
                              <p className="text-sm text-muted-foreground">Качване...</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={saveCategoryRootImages}
                        disabled={isSubmitting || uploadingCategoryRootImage !== null}
                        className="w-full"
                      >
                        {isSubmitting ? "Запазване..." : "Запази промените"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Settings Tab */}
            <TabsContent value="seo-settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Search className="w-6 h-6" />
                    SEO Настройки на началната страница
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {seoLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Зареждане на SEO настройки...</div>
                  ) : (
                    <div className="space-y-6">
                      {/* SEO Section Tabs */}
                      <div className="flex flex-wrap gap-2 border-b pb-4">
                        <Button
                          variant={seoActiveSection === "branding" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("branding")}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Лого и Брандинг
                        </Button>
                        <Button
                          variant={seoActiveSection === "basic" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("basic")}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Основни
                        </Button>
                        <Button
                          variant={seoActiveSection === "opengraph" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("opengraph")}
                        >
                          <Facebook className="w-4 h-4 mr-2" />
                          Open Graph
                        </Button>
                        <Button
                          variant={seoActiveSection === "twitter" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("twitter")}
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter Card
                        </Button>
                        <Button
                          variant={seoActiveSection === "technical" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("technical")}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Технически
                        </Button>
                        <Button
                          variant={seoActiveSection === "verification" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("verification")}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Верификация
                        </Button>
                        <Button
                          variant={seoActiveSection === "analytics" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSeoActiveSection("analytics")}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Аналитика
                        </Button>
                      </div>

                      {/* Branding Section */}
                      {seoActiveSection === "branding" && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold">Лого и Брандинг</h3>
                          
                          {/* Logo Upload */}
                          <div className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-medium">Лого на сайта</h4>
                            <p className="text-sm text-muted-foreground">
                              Логото ще се показва в хедъра и футъра на сайта
                            </p>
                            
                            <div className="space-y-2">
                              <Label>Качи ново лого</Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSeoImageUpload(e, "logo_url")}
                              />
                            </div>
                            
                            {seoSettings.logo_url && (
                              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Текущо ��ого:</p>
                                <div className="flex items-center gap-4">
                                  <div className="bg-white p-2 rounded border">
                                    <img
                                      src={seoSettings.logo_url}
                                      alt={seoSettings.logo_alt || "Logo Preview"}
                                      className="max-h-16 object-contain"
                                    />
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {seoSettings.logo_url}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="logo-url-input">Или въведете URL</Label>
                              <Input
                                id="logo-url-input"
                                value={seoSettings.logo_url || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, logo_url: e.target.value })}
                                placeholder="/kesh-logo.png"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="logo-alt">Alt текст на логото</Label>
                                <Input
                                  id="logo-alt"
                                  value={seoSettings.logo_alt || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, logo_alt: e.target.value })}
                                  placeholder="КЕШ Logo"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="logo-width">Ширина (px)</Label>
                                <Input
                                  id="logo-width"
                                  type="number"
                                  value={seoSettings.logo_width || 110}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, logo_width: parseInt(e.target.value) || 110 })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="logo-height">Височина (px)</Label>
                                <Input
                                  id="logo-height"
                                  type="number"
                                  value={seoSettings.logo_height || 40}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, logo_height: parseInt(e.target.value) || 40 })}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Favicon Upload */}
                          <div className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-medium">Favicon</h4>
                            <p className="text-sm text-muted-foreground">
                              Favicon-ът се показва в таба на браузъра (препоръчително: 32x32 или 16x16 px)
                            </p>
                            
                            <div className="space-y-2">
                              <Label>Качи нов favicon</Label>
                              <Input
                                type="file"
                                accept="image/*,.ico,.svg"
                                onChange={(e) => handleSeoImageUpload(e, "favicon_url")}
                              />
                            </div>
                            
                            {seoSettings.favicon_url && (
                              <div className="mt-2 flex items-center gap-3">
                                <img
                                  src={seoSettings.favicon_url}
                                  alt="Favicon"
                                  className="w-8 h-8 object-contain border rounded"
                                />
                                <span className="text-sm text-muted-foreground">{seoSettings.favicon_url}</span>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="favicon-url-input">Или въ��едете URL</Label>
                              <Input
                                id="favicon-url-input"
                                value={seoSettings.favicon_url || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, favicon_url: e.target.value })}
                                placeholder="/icon.svg"
                              />
                            </div>
                          </div>
                          
                          {/* Apple Touch Icon */}
                          <div className="p-4 border rounded-lg space-y-4">
                            <h4 className="font-medium">Apple Touch Icon</h4>
                            <p className="text-sm text-muted-foreground">
                              Иконата за iOS устройства когато сайтът се добави към Home Screen (препоръчително: 180x180 px PNG)
                            </p>
                            
                            <div className="space-y-2">
                              <Label>Качи нова икона</Label>
                              <Input
                                type="file"
                                accept="image/png"
                                onChange={(e) => handleSeoImageUpload(e, "apple_touch_icon")}
                              />
                            </div>
                            
                            {seoSettings.apple_touch_icon && (
                              <div className="mt-2 flex items-center gap-3">
                                <img
                                  src={seoSettings.apple_touch_icon}
                                  alt="Apple Touch Icon"
                                  className="w-12 h-12 object-contain border rounded-lg"
                                />
                                <span className="text-sm text-muted-foreground">{seoSettings.apple_touch_icon}</span>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="apple-icon-url-input">Или въведете URL</Label>
                              <Input
                                id="apple-icon-url-input"
                                value={seoSettings.apple_touch_icon || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, apple_touch_icon: e.target.value })}
                                placeholder="/apple-icon.png"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Basic SEO Section */}
                      {seoActiveSection === "basic" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Основни SEO настройки</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="seo-site-name">Име на сайта</Label>
                              <Input
                                id="seo-site-name"
                                value={seoSettings.site_name || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, site_name: e.target.value })}
                                placeholder="КЕШ"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="seo-author">Автор</Label>
                              <Input
                                id="seo-author"
                                value={seoSettings.author || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, author: e.target.value })}
                                placeholder="КЕШ"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="seo-title">Заглавие на страницата (Title Tag)</Label>
                            <Input
                              id="seo-title"
                              value={seoSettings.title || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                              placeholder="КЕШ - Онлайн магазин за електроника, коли и злато"
                            />
                            <p className="text-xs text-muted-foreground">
                              Препоръчително: 50-60 символа. Текущо: {(seoSettings.title || "").length} символа
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="seo-description">Описание (Meta Description)</Label>
                            <Textarea
                              id="seo-description"
                              value={seoSettings.description || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                              placeholder="КЕШ е водещият онлайн магазин в България..."
                              rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                              Препоръчително: 150-160 символа. Текущо: {(seoSettings.description || "").length} символа
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="seo-keywords">Ключови думи (Keywords)</Label>
                            <Textarea
                              id="seo-keywords"
                              value={seoSettings.keywords || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                              placeholder="КЕШ, електроника, коли, злато..."
                              rows={2}
                            />
                            <p className="text-xs text-muted-foreground">
                              Разделете ключовите думи със запетая
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="seo-canonical">Каноничен URL</Label>
                            <Input
                              id="seo-canonical"
                              value={seoSettings.canonical_url || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, canonical_url: e.target.value })}
                              placeholder="https://kesh.bg"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="seo-robots">Robots</Label>
                              <Select
                                value={seoSettings.robots || "index, follow"}
                                onValueChange={(value) => setSeoSettings({ ...seoSettings, robots: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="index, follow">Index, Follow</SelectItem>
                                  <SelectItem value="index, nofollow">Index, NoFollow</SelectItem>
                                  <SelectItem value="noindex, follow">NoIndex, Follow</SelectItem>
                                  <SelectItem value="noindex, nofollow">NoIndex, NoFollow</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="seo-revisit">Revisit After</Label>
                              <Input
                                id="seo-revisit"
                                value={seoSettings.revisit_after || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, revisit_after: e.target.value })}
                                placeholder="7 days"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Open Graph Section */}
                      {seoActiveSection === "opengraph" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Open Graph (Facebook, LinkedIn)</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="og-type">OG Type</Label>
                              <Select
                                value={seoSettings.og_type || "website"}
                                onValueChange={(value) => setSeoSettings({ ...seoSettings, og_type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="website">Website</SelectItem>
                                  <SelectItem value="article">Article</SelectItem>
                                  <SelectItem value="product">Product</SelectItem>
                                  <SelectItem value="business.business">Business</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og-locale">OG Locale</Label>
                              <Input
                                id="og-locale"
                                value={seoSettings.og_locale || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, og_locale: e.target.value })}
                                placeholder="bg_BG"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og-title">OG Title</Label>
                            <Input
                              id="og-title"
                              value={seoSettings.og_title || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, og_title: e.target.value })}
                              placeholder="Оставете празно за да използвате основното заглавие"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og-description">OG Description</Label>
                            <Textarea
                              id="og-description"
                              value={seoSettings.og_description || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, og_description: e.target.value })}
                              placeholder="Оставете празно за да използвате основното описание"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og-site-name">OG Site Name</Label>
                            <Input
                              id="og-site-name"
                              value={seoSettings.og_site_name || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, og_site_name: e.target.value })}
                              placeholder="КЕШ"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="og-url">OG URL</Label>
                            <Input
                              id="og-url"
                              value={seoSettings.og_url || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, og_url: e.target.value })}
                              placeholder="https://kesh.bg"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>OG Image (1200x630 препоръчително)</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSeoImageUpload(e, "og_image")}
                            />
                            {seoSettings.og_image && (
                              <div className="mt-2">
                                <img
                                  src={seoSettings.og_image}
                                  alt="OG Preview"
                                  className="max-w-xs h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            <Input
                              value={seoSettings.og_image || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, og_image: e.target.value })}
                              placeholder="Или въведете URL на изображението"
                              className="mt-2"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="og-image-alt">OG Image Alt</Label>
                              <Input
                                id="og-image-alt"
                                value={seoSettings.og_image_alt || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, og_image_alt: e.target.value })}
                                placeholder="Описание на изображението"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og-image-width">Ширина</Label>
                              <Input
                                id="og-image-width"
                                type="number"
                                value={seoSettings.og_image_width || 1200}
                                onChange={(e) => setSeoSettings({ ...seoSettings, og_image_width: parseInt(e.target.value) || 1200 })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="og-image-height">Височина</Label>
                              <Input
                                id="og-image-height"
                                type="number"
                                value={seoSettings.og_image_height || 630}
                                onChange={(e) => setSeoSettings({ ...seoSettings, og_image_height: parseInt(e.target.value) || 630 })}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Twitter Card Section */}
                      {seoActiveSection === "twitter" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Twitter Card</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="twitter-card">Card Type</Label>
                              <Select
                                value={seoSettings.twitter_card || "summary_large_image"}
                                onValueChange={(value) => setSeoSettings({ ...seoSettings, twitter_card: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="summary">Summary</SelectItem>
                                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                                  <SelectItem value="app">App</SelectItem>
                                  <SelectItem value="player">Player</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="twitter-site">Twitter Site (@username)</Label>
                              <Input
                                id="twitter-site"
                                value={seoSettings.twitter_site || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, twitter_site: e.target.value })}
                                placeholder="@kesh_bg"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter-creator">Twitter Creator</Label>
                            <Input
                              id="twitter-creator"
                              value={seoSettings.twitter_creator || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, twitter_creator: e.target.value })}
                              placeholder="@creator_username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter-title">Twitter Title</Label>
                            <Input
                              id="twitter-title"
                              value={seoSettings.twitter_title || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, twitter_title: e.target.value })}
                              placeholder="Оставете празно за да използвате основното заглавие"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter-description">Twitter Description</Label>
                            <Textarea
                              id="twitter-description"
                              value={seoSettings.twitter_description || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, twitter_description: e.target.value })}
                              placeholder="Оставете празно за да използвате основното описание"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Twitter Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSeoImageUpload(e, "twitter_image")}
                            />
                            {seoSettings.twitter_image && (
                              <div className="mt-2">
                                <img
                                  src={seoSettings.twitter_image}
                                  alt="Twitter Preview"
                                  className="max-w-xs h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            <Input
                              value={seoSettings.twitter_image || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, twitter_image: e.target.value })}
                              placeholder="Или въведете URL на изображението"
                              className="mt-2"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter-image-alt">Twitter Image Alt</Label>
                            <Input
                              id="twitter-image-alt"
                              value={seoSettings.twitter_image_alt || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, twitter_image_alt: e.target.value })}
                              placeholder="Описание на изображението"
                            />
                          </div>
                        </div>
                      )}

                      {/* Technical Section */}
                      {seoActiveSection === "technical" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Технически настройки</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="theme-color">Theme Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="theme-color"
                                  type="color"
                                  value={seoSettings.theme_color || "#D4AF37"}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, theme_color: e.target.value })}
                                  className="w-16 h-10 p-1"
                                />
                                <Input
                                  value={seoSettings.theme_color || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, theme_color: e.target.value })}
                                  placeholder="#D4AF37"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ms-tile-color">MS Tile Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="ms-tile-color"
                                  type="color"
                                  value={seoSettings.ms_tile_color || "#ffffff"}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, ms_tile_color: e.target.value })}
                                  className="w-16 h-10 p-1"
                                />
                                <Input
                                  value={seoSettings.ms_tile_color || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, ms_tile_color: e.target.value })}
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="background-color">Background Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="background-color"
                                  type="color"
                                  value={seoSettings.background_color || "#ffffff"}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, background_color: e.target.value })}
                                  className="w-16 h-10 p-1"
                                />
                                <Input
                                  value={seoSettings.background_color || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, background_color: e.target.value })}
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Favicon</Label>
                              <Input
                                type="file"
                                accept="image/*,.ico,.svg"
                                onChange={(e) => handleSeoImageUpload(e, "favicon_url")}
                              />
                              {seoSettings.favicon_url && (
                                <div className="flex items-center gap-2 mt-2">
                                  <img
                                    src={seoSettings.favicon_url}
                                    alt="Favicon"
                                    className="w-8 h-8 object-contain"
                                  />
                                  <span className="text-sm text-muted-foreground">{seoSettings.favicon_url}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Apple Touch Icon</Label>
                              <Input
                                type="file"
                                accept="image/png"
                                onChange={(e) => handleSeoImageUpload(e, "apple_touch_icon")}
                              />
                              {seoSettings.apple_touch_icon && (
                                <div className="flex items-center gap-2 mt-2">
                                  <img
                                    src={seoSettings.apple_touch_icon}
                                    alt="Apple Icon"
                                    className="w-8 h-8 object-contain"
                                  />
                                  <span className="text-sm text-muted-foreground">{seoSettings.apple_touch_icon}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="googlebot">Googlebot</Label>
                              <Input
                                id="googlebot"
                                value={seoSettings.googlebot || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, googlebot: e.target.value })}
                                placeholder="index, follow"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bingbot">Bingbot</Label>
                              <Input
                                id="bingbot"
                                value={seoSettings.bingbot || ""}
                                onChange={(e) => setSeoSettings({ ...seoSettings, bingbot: e.target.value })}
                                placeholder="index, follow"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="rating">Rating</Label>
                              <Select
                                value={seoSettings.rating || "general"}
                                onValueChange={(value) => setSeoSettings({ ...seoSettings, rating: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="mature">Mature</SelectItem>
                                  <SelectItem value="restricted">Restricted</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="referrer">Referrer Policy</Label>
                              <Select
                                value={seoSettings.referrer || "origin-when-cross-origin"}
                                onValueChange={(value) => setSeoSettings({ ...seoSettings, referrer: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Изберете..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no-referrer">No Referrer</SelectItem>
                                  <SelectItem value="origin">Origin</SelectItem>
                                  <SelectItem value="origin-when-cross-origin">Origin When Cross-Origin</SelectItem>
                                  <SelectItem value="same-origin">Same Origin</SelectItem>
                                  <SelectItem value="strict-origin">Strict Origin</SelectItem>
                                  <SelectItem value="unsafe-url">Unsafe URL</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="custom-head">Custom Head Tags</Label>
                            <Textarea
                              id="custom-head"
                              value={seoSettings.custom_head_tags || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, custom_head_tags: e.target.value })}
                              placeholder={'<meta name="custom-tag" content="value">'}
                              rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                              Добавете допълнителни meta тагове в HTML формат
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Verification Section */}
                      {seoActiveSection === "verification" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Верификация на търсачки</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="google-verification">Google Site Verification</Label>
                            <Input
                              id="google-verification"
                              value={seoSettings.google_site_verification || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, google_site_verification: e.target.value })}
                              placeholder="Въведете кода за верификация от Google Search Console"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bing-verification">Bing Site Verification</Label>
                            <Input
                              id="bing-verification"
                              value={seoSettings.bing_site_verification || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, bing_site_verification: e.target.value })}
                              placeholder="Въведете кода за верификация от Bing Webmaster Tools"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="yandex-verification">Yandex Verification</Label>
                            <Input
                              id="yandex-verification"
                              value={seoSettings.yandex_verification || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, yandex_verification: e.target.value })}
                              placeholder="Въведете кода за верификация от Yandex Webmaster"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="facebook-verification">Facebook Domain Verification</Label>
                            <Input
                              id="facebook-verification"
                              value={seoSettings.facebook_domain_verification || ""}
                              onChange={(e) => setSeoSettings({ ...seoSettings, facebook_domain_verification: e.target.value })}
                              placeholder="Въведете кода за верификация от Facebook Business"
                            />
                          </div>
                        </div>
                      )}

                      {/* Analytics Section */}
                      {seoActiveSection === "analytics" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Аналитика и проследяване</h3>
                          
                          <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Google Analytics</h4>
                                <p className="text-sm text-muted-foreground">Включете Google Analytics проследяване</p>
                              </div>
                              <Switch
                                checked={seoSettings.enable_google_analytics || false}
                                onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, enable_google_analytics: checked })}
                              />
                            </div>
                            {seoSettings.enable_google_analytics && (
                              <div className="space-y-2">
                                <Label htmlFor="ga-id">Google Analytics ID</Label>
                                <Input
                                  id="ga-id"
                                  value={seoSettings.google_analytics_id || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, google_analytics_id: e.target.value })}
                                  placeholder="G-XXXXXXXXXX или UA-XXXXXXXX-X"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Google Tag Manager</h4>
                                <p className="text-sm text-muted-foreground">Включете Google Tag Manager</p>
                              </div>
                              <Switch
                                checked={seoSettings.enable_google_tag_manager || false}
                                onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, enable_google_tag_manager: checked })}
                              />
                            </div>
                            {seoSettings.enable_google_tag_manager && (
                              <div className="space-y-2">
                                <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                                <Input
                                  id="gtm-id"
                                  value={seoSettings.google_tag_manager_id || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, google_tag_manager_id: e.target.value })}
                                  placeholder="GTM-XXXXXXX"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Facebook Pixel</h4>
                                <p className="text-sm text-muted-foreground">Включете Facebook Pixel проследяване</p>
                              </div>
                              <Switch
                                checked={seoSettings.enable_facebook_pixel || false}
                                onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, enable_facebook_pixel: checked })}
                              />
                            </div>
                            {seoSettings.enable_facebook_pixel && (
                              <div className="space-y-2">
                                <Label htmlFor="fb-pixel-id">Facebook Pixel ID</Label>
                                <Input
                                  id="fb-pixel-id"
                                  value={seoSettings.facebook_pixel_id || ""}
                                  onChange={(e) => setSeoSettings({ ...seoSettings, facebook_pixel_id: e.target.value })}
                                  placeholder="XXXXXXXXXXXXXXXX"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="pt-4 border-t">
                        <Button onClick={saveHomepageSeo} disabled={seoSaving} className="w-full">
                          {seoSaving ? "Запазване..." : "Запази SEO настр��йките"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Workers Tab */}
            <TabsContent value="admin-workers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <UserCog className="w-6 h-6" />
                    Управление на потребители
                  </CardTitle>
                  <Dialog open={adminWorkerDialogOpen} onOpenChange={(open) => {
                    setAdminWorkerDialogOpen(open)
                    if (!open) {
                      setEditingAdminWorker(null)
                      resetAdminWorkerForm()
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingAdminWorker(null)
                        resetAdminWorkerForm()
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добави потребител
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingAdminWorker ? "Редактирай потребител" : "Добави нов потребител"}
                        </DialogTitle>
                        <DialogDescription>
                          Попълнете информацията за потребителя. Полетата с * са задължителни.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAdminWorkerSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="worker-username">Потребителско име *</Label>
                            <Input
                              id="worker-username"
                              value={adminWorkerFormData.username}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, username: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="worker-password">
                              {editingAdminWorker ? "Нова парола (оставете празно за да запазите)" : "Парола *"}
                            </Label>
                            <Input
                              id="worker-password"
                              type="password"
                              value={adminWorkerFormData.password}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, password: e.target.value })}
                              required={!editingAdminWorker}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="worker-first-name">Име</Label>
                            <Input
                              id="worker-first-name"
                              value={adminWorkerFormData.first_name}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, first_name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="worker-last-name">Фамилия</Label>
                            <Input
                              id="worker-last-name"
                              value={adminWorkerFormData.last_name}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, last_name: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="worker-email">Имейл</Label>
                            <Input
                              id="worker-email"
                              type="email"
                              value={adminWorkerFormData.email}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="worker-phone">Телефон</Label>
                            <Input
                              id="worker-phone"
                              value={adminWorkerFormData.phone}
                              onChange={(e) => setAdminWorkerFormData({ ...adminWorkerFormData, phone: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="worker-role">Роля</Label>
                            <Select
                              value={adminWorkerFormData.role}
                              onValueChange={(value: "admin" | "worker") => setAdminWorkerFormData({ ...adminWorkerFormData, role: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Администратор</SelectItem>
                                <SelectItem value="worker">Служител</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="worker-store">Офис</Label>
                            <Select
                              value={adminWorkerFormData.store_id?.toString() || "none"}
                              onValueChange={(value) => setAdminWorkerFormData({ 
                                ...adminWorkerFormData, 
                                store_id: value === "none" ? null : parseInt(value) 
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Изберете офис" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Без офис</SelectItem>
                                {stores.map((store) => (
                                  <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="worker-active"
                            checked={adminWorkerFormData.is_active}
                            onCheckedChange={(checked) => setAdminWorkerFormData({ ...adminWorkerFormData, is_active: checked })}
                          />
                          <Label htmlFor="worker-active">Активен</Label>
                        </div>

                        {/* Permissions section - only show for workers */}
                        {adminWorkerFormData.role === "worker" && (
                          <div className="space-y-3 border rounded-lg p-4">
                            <Label className="text-base font-semibold">Разрешени секции</Label>
                            <p className="text-sm text-muted-foreground">Изберете кои секции ще вижда този служител</p>
                            <div className="grid grid-cols-2 gap-2">
                              {allTabs.filter(tab => tab.id !== "admin-workers").map((tab) => (
                                <div key={tab.id} className="flex items-center space-x-2">
                                  <Switch
                                    id={`tab-${tab.id}`}
                                    checked={adminWorkerFormData.allowed_tabs.includes(tab.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setAdminWorkerFormData({
                                          ...adminWorkerFormData,
                                          allowed_tabs: [...adminWorkerFormData.allowed_tabs, tab.id]
                                        })
                                      } else {
                                        setAdminWorkerFormData({
                                          ...adminWorkerFormData,
                                          allowed_tabs: adminWorkerFormData.allowed_tabs.filter(t => t !== tab.id)
                                        })
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`tab-${tab.id}`} className="text-sm">{tab.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Gold-specific permissions - show for all roles when gold tab is enabled or for admins */}
                        {(adminWorkerFormData.role === "admin" || adminWorkerFormData.allowed_tabs.includes("gold")) && (
                          <div className="space-y-3 border rounded-lg p-4">
                            <Label className="text-base font-semibold">Настройки за Злато</Label>
                            <p className="text-sm text-muted-foreground">Допълнителни настройки за секция Злато</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Switch
                                id="hide-global-price"
                                checked={adminWorkerFormData.hide_global_price}
                                onCheckedChange={(checked) => {
                                  setAdminWorkerFormData({
                                    ...adminWorkerFormData,
                                    hide_global_price: checked
                                  })
                                }}
                              />
                              <Label htmlFor="hide-global-price" className="text-sm">Скрий бутон &quot;Глобална цена&quot;</Label>
                            </div>
                          </div>
                        )}

                        <DialogFooter>
                          <Button type="submit">
                            {editingAdminWorker ? "Запази промените" : "Добави потребител"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {adminWorkersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Потребител</TableHead>
                          <TableHead>Име</TableHead>
                          <TableHead>Имейл</TableHead>
                          <TableHead>Телефон</TableHead>
                          <TableHead>Роля</TableHead>
                          <TableHead>Офис</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminWorkers.map((worker) => (
                          <TableRow key={worker.id}>
                            <TableCell>{worker.id}</TableCell>
                            <TableCell className="font-medium">{worker.username}</TableCell>
                            <TableCell>
                              {worker.first_name || worker.last_name 
                                ? `${worker.first_name || ""} ${worker.last_name || ""}`.trim() 
                                : "-"}
                            </TableCell>
                            <TableCell>{worker.email || "-"}</TableCell>
                            <TableCell>{worker.phone || "-"}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                worker.role === "admin" 
                                  ? "bg-purple-100 text-purple-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                <Shield className="w-3 h-3" />
                                {worker.role === "admin" ? "Админ" : "Служител"}
                              </span>
                            </TableCell>
                            <TableCell>{worker.store_name || "-"}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                worker.is_active 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {worker.is_active ? "Активен" : "Неактивен"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openEditAdminWorker(worker)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => {
                                    setDeletingAdminWorkerId(worker.id)
                                    setDeleteAdminWorkerDialogOpen(true)
                                  }}
                                  disabled={worker.role === "admin" && adminWorkers.filter(w => w.role === "admin").length <= 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Delete Admin Worker Confirmation Dialog */}
              <AlertDialog open={deleteAdminWorkerDialogOpen} onOpenChange={setDeleteAdminWorkerDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Изтриване на потребител</AlertDialogTitle>
                    <AlertDialogDescription>
                      Сигурни ли сте, че искате да изтриете този потребител? Това действие е необратимо.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отказ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAdminWorker} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Изтрий
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TabsContent>

            {/* About Page Editor Tab */}
            <TabsContent value="about-page">
              <AboutPageEditor />
            </TabsContent>

            {/* FAQ Page Editor Tab */}
            <TabsContent value="faq-page">
              <FAQPageEditor />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
