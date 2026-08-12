import type React from "react"
import type { Metadata } from "next"

const title = "Изкупуване на злато и сребро – цени и калкулатор"
const description =
  "Изкупуване на злато и сребро в КЕШ – актуални изкупни цени на грам по проби (375, 585, 750, 917, 999) и онлайн калкулатор. Продайте бижута, монети и кюлчета изгодно."
const url = "https://v0-stripe-currency-error-842aa54cc4.vercel.app/izkupuvane-zlato-i-srebro"

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "изкупуване на злато, изкупуване на сребро, цена на златото, цена на среброто, изкупни цени злато, калкулатор злато, продажба на злато, злато на грам, сребро на грам, КЕШ",
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

export default function IzkupuvaneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
