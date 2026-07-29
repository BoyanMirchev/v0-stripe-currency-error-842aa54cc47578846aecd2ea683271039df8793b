"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, X } from "lucide-react"
import { useSiteSettings } from "@/contexts/site-settings-context"

export function AuthNavbar() {
  const { settings } = useSiteSettings()
  
  return (
    <nav className="bg-[#FFC107] text-gray-900 py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src={settings.logo_url || "/kesh-logo.png"} 
            alt={settings.logo_alt || "Кеш Logo"} 
            width={settings.logo_width || 110} 
            height={settings.logo_height || 40} 
            className="object-contain" 
          />
        </Link>

        <Link
          href="tel:+35954800800"
          className="flex items-center gap-3 text-xl font-bold hover:opacity-80 transition-opacity"
        >
          <Phone className="h-5 w-5" />
          <span className="hidden sm:inline">+359 54 800 800</span>
          <span className="sm:hidden">Обадете се</span>
        </Link>

        <Link href="/" className="hover:opacity-80 transition-opacity">
          <X className="h-7 w-7" />
        </Link>
      </div>
    </nav>
  )
}
