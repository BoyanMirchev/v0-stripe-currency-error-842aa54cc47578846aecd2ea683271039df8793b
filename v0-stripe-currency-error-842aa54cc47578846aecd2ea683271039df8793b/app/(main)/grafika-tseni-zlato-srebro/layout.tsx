import type React from "react"
import type { Metadata } from "next"

const title = "Графика на цените – злато, сребро и платина на живо"
const description =
  "Следете борсовите цени на злато, сребро и платина на живо в КЕШ. Интерактивни графики в EUR, различни периоди и мерни единици, актуални котировки и анализ на пазара."
const url = "https://v0-stripe-currency-error-842aa54cc4.vercel.app/grafika-tseni-zlato-srebro"

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "графика цени злато, цена на злато на живо, борсова цена злато, цена сребро, цена платина, котировки благородни метали, курс на злато, графика сребро, инвестиционно злато, КЕШ",
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url,
    title,
    description,
    siteName: "КЕШ",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function GrafikaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
