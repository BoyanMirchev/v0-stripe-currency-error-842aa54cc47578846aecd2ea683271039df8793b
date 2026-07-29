"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { Check } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/profile"
  const { login } = useAuth()
  const { toast } = useToast()
  const { settings } = useSiteSettings()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Успешен вход!",
        description: "Добре дошли обратно!",
      })
      router.push(redirectUrl)
    } else {
      toast({
        title: "Грешка",
        description: result.error || "Грешка при вход",
        variant: "destructive",
      })
    }
  }

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
        <div className="w-full max-w-4xl bg-white flex flex-col lg:flex-row">
          {/* Left side - Login form */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Вход в КЕШ акаунт</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-red-600 font-medium">
                  Имейл
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Забравена парола
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-[#1a1a2e] hover:text-gray-700 font-medium hover:underline"
                >
                  Регистрация
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Зареждане..." : "Вход"}
              </Button>
            </form>
          </div>

          {/* Right side - Benefits */}
          <div className="flex-1 p-8 lg:p-12 bg-gray-50 border-l border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
              Защо да регистрирате безплатен профил в КЕШ?
            </h2>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Цялата история на покупките Ви събрана на едно място</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Общ поглед върху инвестициите Ви в ценни метали</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Бързи и лесни повторни поръчки</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Възможност ръчно да добавяте продукти към портфолиото</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Иновативни и полезни инвестиционни инструменти</span>
              </li>
            </ul>

            {/* Decorative chart line */}
            <div className="mt-8 pt-4">
              <svg viewBox="0 0 300 80" className="w-full h-20 text-amber-500">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points="0,60 30,45 60,55 90,30 120,40 150,25 180,35 210,20 240,30 270,15 300,25"
                />
              </svg>
            </div>
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
