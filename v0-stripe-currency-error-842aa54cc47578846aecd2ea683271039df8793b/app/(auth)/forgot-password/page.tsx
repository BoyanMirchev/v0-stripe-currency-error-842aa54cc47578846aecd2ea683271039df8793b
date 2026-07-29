"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { Check, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const { settings } = useSiteSettings()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Грешка",
        description: "Паролите не съвпадат",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Грешка",
        description: "Паролата трябва да бъде поне 6 символа",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Грешка",
          description: data.error || "Грешка при промяна на паролата",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Паролата е променена!",
        description: "Вече можете да влезете с новата си парола.",
      })

      // Redirect to login
      window.location.href = "/login"
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна грешка. Моля, опитайте отново.",
        variant: "destructive",
      })
      setIsLoading(false)
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
          {/* Left side - Form */}
          <div className="flex-1 p-8 lg:p-12">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Обратно към вход</span>
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">
                Възстановяване на парола
              </h1>
            </div>

            <p className="text-gray-600 mb-6">
              Въведете имейла си и новата парола, която искате да използвате.
            </p>

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
                  placeholder="example@email.com"
                  className="h-12 border-0 border-b-2 border-gray-300 rounded-none focus:border-red-600 focus:ring-0 px-0 bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-red-600 font-medium">
                  Нова парола
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Минимум 6 символа"
                    className="h-12 border-0 border-b-2 border-gray-300 rounded-none focus:border-red-600 focus:ring-0 px-0 bg-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-red-600 font-medium">
                  Потвърди парола
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Повторете паролата"
                    className="h-12 border-0 border-b-2 border-gray-300 rounded-none focus:border-red-600 focus:ring-0 px-0 bg-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Запазване..." : "Запази нова парола"}
              </Button>
            </form>
          </div>

          {/* Right side - Info */}
          <div className="flex-1 p-8 lg:p-12 bg-gray-50 border-l border-gray-200">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
              Съвети за сигурна парола
            </h2>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Използвайте поне 8 символа</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Комбинирайте главни и малки букви</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Добавете цифри и специални символи</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Избягвайте лесни за отгатване думи</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Не използвайте една и съща парола за различни сайтове</span>
              </li>
            </ul>

            {/* Decorative lock icon */}
            <div className="mt-8 pt-4 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <Lock className="w-10 h-10 text-amber-500" />
              </div>
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
