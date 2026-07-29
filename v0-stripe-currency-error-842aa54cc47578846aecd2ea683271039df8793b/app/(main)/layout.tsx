import type React from "react"
import { Footer } from "@/components/footer"
import { CookieConsentModal } from "@/components/cookie-consent-modal"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
      <CookieConsentModal />
    </>
  )
}
