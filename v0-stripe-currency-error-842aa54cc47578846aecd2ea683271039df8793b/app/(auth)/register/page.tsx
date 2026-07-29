"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Shield, ShoppingBag, History, Bell, Heart, Percent } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeNewsletter, setAgreeNewsletter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      toast({
        title: "Грешка",
        description: "Моля, приемете общите условия",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Грешка",
        description: "Паролите не съвпадат",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Грешка",
        description: "Паролата трябва да е минимум 6 символа",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
    })

    setIsLoading(false)

    if (result.success) {
      setRegisterSuccess(true)
      toast({
        title: "Успешна регистрация!",
        description: "Вашият акаунт е създаден успешно.",
      })
    } else {
      toast({
        title: "Грешка",
        description: result.error || "Грешка при регистрация",
        variant: "destructive",
      })
    }
  }

  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white w-full max-w-md p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Успешна регистрация!</h2>
            <p className="text-gray-600 mb-8">
              Вашият акаунт е създаден успешно. Добре дошли в КЕШ!
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/profile")}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Преглед на акаунта
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full h-12 border-gray-300 hover:bg-gray-50"
              >
                Към началната страница
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Hero Section */}
      <div className="text-center px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-4xl font-bold text-white">КЕШ ID</h1>
        </div>
        <p className="text-gray-300 max-w-xl mx-auto text-lg">
          Създайте безплатен и защитен профил в КЕШ,
          <br />
          управлявайте покупките си лесно с достъп до първокласни услуги.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="bg-white w-full max-w-2xl flex flex-col md:flex-row">
          {/* Left - Registration Form */}
          <div className="flex-1 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-red-600">Регистрация в КЕШ ID</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-gray-500 mb-2">
                    Име
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm text-gray-500 mb-2">
                    Фамилия
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-500 mb-2">
                  Телефон
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-500 mb-2">
                  Имейл
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm text-gray-500 mb-2">
                  Парола
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-500 mb-2">
                  Повторете паролата
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-0 border-b border-gray-300 pb-2 focus:border-red-600 focus:outline-none focus:ring-0 bg-transparent"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  Съгласен/на съм личните ми данни да бъдат обработвани, за да получа услугата КЕШ ID в съответствие с{" "}
                  <Link href="/terms" className="underline hover:text-red-600">
                    Общите условия за дистанционни продажби
                  </Link>{" "}
                  и{" "}
                  <Link href="/privacy" className="underline hover:text-red-600">
                    Политиката на поверителност
                  </Link>
                </label>
              </div>

              {/* Newsletter Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={agreeNewsletter}
                  onChange={(e) => setAgreeNewsletter(e.target.checked)}
                  className="mt-1 w-5 h-5 border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600 leading-relaxed">
                  Желая да получавам специални оферти и новини от КЕШ
                </label>
              </div>

              {/* Links */}
              <div className="flex justify-between items-center pt-2">
                <Link href="/login" className="text-sm text-gray-600 hover:text-red-600">
                  Вече имате акаунт?
                </Link>
                <Link href="/login" className="text-sm text-gray-600 hover:text-red-600">
                  Вход
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-base rounded-full"
              >
                {isLoading ? "Зареждане..." : "Регистрация"}
              </Button>
            </form>
          </div>

          {/* Right - Decorative Chart */}
          <div className="hidden md:flex md:w-64 items-end justify-center p-8 relative">
            {/* Decorative chart line */}
            <svg viewBox="0 0 200 150" className="w-full h-32 text-amber-500">
              <path
                d="M0,100 L20,80 L40,90 L60,60 L80,70 L100,40 L120,50 L140,30 L160,45 L180,20 L200,35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Why Register Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Защо да се регистрирате?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            КЕШ ID е безплатна услуга, с която можете да управлявате покупките си и да получавате ексклузивни оферти. С платформата КЕШ ID вземате по-добри решения.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#2d1f4e] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12 uppercase tracking-wide">Функции</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Управлявайте покупките си</h3>
              <p className="text-gray-400 text-sm">
                Получете личен защитен профил и следете всичките си покупки.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <History className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">История на поръчките</h3>
              <p className="text-gray-400 text-sm">
                Проверявайте всички минали поръчки и с лекота поръчвайте повторно.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <Percent className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Персонализирани отстъпки</h3>
              <p className="text-gray-400 text-sm">
                Получавайте персонализирани отстъпки и специални оферти.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <Bell className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Ценови известия</h3>
              <p className="text-gray-400 text-sm">
                Получавайте известия, когато цените достигнат Вашите очаквания.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <Heart className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Любими продукти</h3>
              <p className="text-gray-400 text-sm">
                Добавяйте продукти към любими и ги намирайте бързо при следваща покупка.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Сигурност</h3>
              <p className="text-gray-400 text-sm">
                Вашите данни са защитени с най-новите технологии за сигурност.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
