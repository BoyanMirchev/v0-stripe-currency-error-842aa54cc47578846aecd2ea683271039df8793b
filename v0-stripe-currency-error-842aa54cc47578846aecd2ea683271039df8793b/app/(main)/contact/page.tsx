"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail } from "lucide-react"
import { Header } from "@/components/header"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Contact Information Section */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-center mb-12">Как да ни намерите</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Office Location */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">KESH Bulgaria</h3>
              <p className="text-sm text-muted-foreground mb-2">Централен офис:</p>
              <p className="text-sm">София, ул. [Въведете вашия адрес]</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                МАГАЗИНИ В СТРАНАТА
              </Button>
            </div>

            {/* Phone Numbers */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Телефон за контакт</h3>
              <a href="tel:+359XXXXXXXXX" className="text-red-600 text-xl font-bold hover:underline">
                +359 XX XXX XXXX
              </a>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                Може да се свържете с нас на посочения телефон за всички въпроси и запитвания.
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">E-mail</h3>
              <a href="mailto:contact@kesh.bg" className="text-red-600 hover:underline break-all">
                contact@kesh.bg
              </a>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                Пишете ни за всякакви въпроси и ще отговорим възможно най-бързо.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Пишете ни</h2>

          {submitStatus === "success" && (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 text-center">
              Съобщението беше изпратено успешно! Ще се свържем с вас скоро.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 text-center">
              Възникна грешка при изпращането. Моля, опитайте отново.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row - Name, Last Name, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-base">
                  Име <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-base">
                  Фамилия <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base">
                  E-mail <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Second Row - Phone and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="text-base">
                  Телефон
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-base">
                  Тема
                </Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} className="mt-2" />
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-base">
                Съобщение <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className="mt-2 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-lg font-semibold rounded-md"
              >
                {isSubmitting ? "ИЗПРАЩА СЕ..." : "ИЗПРАТИ"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
