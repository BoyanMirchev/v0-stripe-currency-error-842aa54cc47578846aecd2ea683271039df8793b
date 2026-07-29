"use client"

import type React from "react"

import { Mail } from "lucide-react"
import { useState } from "react"

interface NewsletterFormProps {
  variant: "mobile" | "desktop"
}

export function NewsletterForm({ variant }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        setMessage({ type: "success", text: "Успешно се абонирахте за нашия бюлетин!" })
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Грешка при абонамента" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Грешка при свързването със сървъра" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isMobile = variant === "mobile"

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <input
            type="email"
            placeholder="Твоят E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={
              isMobile
                ? "w-full px-5 py-3.5 rounded-full text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 pr-14 shadow-lg border-2 border-white"
                : "w-full px-6 py-4 rounded-full text-base text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 pr-16 shadow-lg border-2 border-white"
            }
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={
              isMobile
                ? "absolute right-2 bg-gray-900 hover:bg-gray-800 text-yellow-400 p-2.5 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                : "absolute right-2 bg-gray-900 hover:bg-gray-800 text-yellow-400 p-3 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            }
            aria-label="Изпрати"
          >
            <Mail className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`mt-2 ${isMobile ? "text-xs" : "text-sm"} text-center font-medium ${
            message.type === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </>
  )
}
