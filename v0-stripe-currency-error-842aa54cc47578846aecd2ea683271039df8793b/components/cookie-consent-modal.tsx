"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8">
        <p className="text-gray-700 leading-relaxed mb-6">
          КЕШ използва бисквитки, за да гарантира функционалността на уебсайта и да подобри потребителската удовлетвореност. Събраните от бисквитките данни ни помагат да осигурим най-голяма удовлетвореност за Вас, да поддържаме профила Ви защитен и да персонализираме рекламното съдържание. Можете да разберете повече в{" "}
          <Link 
            href="/cookies" 
            className="text-[#0071ce] hover:text-[#005ba3] hover:underline font-medium"
          >
            Политика за бисквитките
          </Link>
          .
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAcceptAll}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 text-gray-900 font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Приемане на всички
          </button>
          

        </div>
      </div>
    </div>
  )
}
