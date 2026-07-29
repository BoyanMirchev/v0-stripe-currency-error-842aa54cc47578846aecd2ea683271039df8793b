"use client"

import { FaTiktok } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { NewsletterForm } from "@/components/newsletter-form"

interface StoreData {
  id: number
  name: string
  city: string
}

interface FooterSettings {
  logo_url: string
  logo_alt: string
}

const defaultSettings: FooterSettings = {
  logo_url: "/kesh-logo.png",
  logo_alt: "КЕШ Logo",
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Footer() {
  const { data: storesData } = useSWR<StoreData[]>("/api/stores", fetcher)
  const { data: settingsData } = useSWR<FooterSettings>("/api/site-settings", fetcher)

  const stores: StoreData[] = Array.isArray(storesData) ? storesData : []
  const settings: FooterSettings = {
    logo_url: settingsData?.logo_url || defaultSettings.logo_url,
    logo_alt: settingsData?.logo_alt || defaultSettings.logo_alt,
  }

  return (
    <>
      <div className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 text-gray-900 py-8 md:py-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Mobile Layout - Vertical stacked */}
          <div className="flex flex-col items-center text-center gap-4 md:hidden">
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <Image
                src={settings.logo_url || "/kesh-logo.png"}
                alt={settings.logo_alt || "Кеш Logo"}
                width={80}
                height={50}
                className="object-contain flex-shrink-0"
              />
              <h2 className="text-xl font-bold leading-tight text-gray-900">
                Абонирай се за нашите
                <br />
                специални оферти
              </h2>
            </div>

            {/* Email Input */}
            <div className="w-full max-w-sm">
              <NewsletterForm variant="mobile" />
            </div>

            {/* Privacy Text */}
            <div className="text-xs leading-relaxed px-2 text-gray-800">
              С абонамента се съгласявате предоставените от Вас лични данни да бъдат обработвани за целите и по начина
              посочени в{" "}
              <Link href="/privacy" className="underline hover:text-gray-900 font-medium">
                общите условия
              </Link>
              , включително, но не само, за да получавате информация за актуални промоции и други активности на
              Технополис.
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden md:flex items-center justify-between gap-8">
            {/* Left side - Title with icon */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Image src={settings.logo_url || "/kesh-logo.png"} alt={settings.logo_alt || "Кеш Logo"} width={110} height={70} className="object-contain" />
              <h2 className="text-2xl font-bold text-gray-900">
                Абонирайте се за нашите
                <br />
                специални оферти
              </h2>
            </div>

            {/* Center - Email input form */}
            <div className="flex-1 max-w-lg">
              <NewsletterForm variant="desktop" />
            </div>

            {/* Right side - Privacy text */}
            <div className="text-sm text-right max-w-md text-gray-800">
              С абонамента се съгласявате предоставените от Вас лични данни да бъдат обрабoтвани за целите и по начина
              посочени в{" "}
              <Link href="/privacy" className="underline hover:text-gray-900 font-medium">
                общите условия
              </Link>
              , включително, но не само, за да получавате информация за актуални промоции и други активности на
              Технополис.
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white relative">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* КЕШ Column */}
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">КЕШ</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>
                  <Link href="/about" className="hover:underline">
                    Компанията
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Общи условия
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:underline">
                    Политика за бисквитките
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Политика за защита на личните данни
                  </Link>
                </li>
              </ul>
            </div>

            {/* За клиента Column */}
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">За клиента</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>
                  <Link href="/advice" className="hover:underline">
                    Съвети
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:underline">
                    Марки
                  </Link>
                </li>
                <li>
                  <Link href="/transport" className="hover:underline">
                    Транспорт
                  </Link>
                </li>
                <li>
                  <Link href="/delivery-online" className="hover:underline">
                    Доставка при онлайн покупка
                  </Link>
                </li>
                <li>
                  <Link href="/delivery-store" className="hover:underline">
                    Доставка до врата при покупка от физическите магазини
                  </Link>
                </li>
                <li>
                  <Link href="/pickup" className="hover:underline">
                    Вземи от магазин
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:underline">
                    Връщане на поръчка
                  </Link>
                </li>
              </ul>
            </div>

            {/* Обща информация Column */}
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Обща информация</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>
                  <Link href="/track-order" className="hover:underline">
                    Проследи поръчка
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    Често задавани въпроси
                  </Link>
                </li>
                <li>
                  <Link href="/how-to-order" className="hover:underline">
                    Как да поръчам
                  </Link>
                </li>
                <li>
                  <Link href="/return-product" className="hover:underline">
                    Как да върна продукт?
                  </Link>
                </li>
              </ul>
            </div>

            {/* Магазини Column */}
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Магазини</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                {stores.slice(0, 8).map((store) => (
                  <li key={store.id}>
                    <Link href={`/stores/${store.id}/products`} className="hover:underline">
                      {store.name}
                    </Link>
                  </li>
                ))}
                {stores.length > 8 && (
                  <li>
                    <Link href="/stores" className="hover:underline text-[#c9a227] font-medium">
                      Виж всички магазини
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Контакти Column */}
            <div>
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Контакти</h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <li>
                  <Link href="/contact" className="hover:underline">
                    Контакти
                  </Link>
                </li>
                <li>
                  <Link href="/stores" className="hover:underline">
                    Всички магазини
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop Layout - Single row with 3 sections */}
          <div className="hidden md:flex items-center justify-between py-3">
            {/* Left - Payment Methods */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Image src="/images/visa-inc.png" alt="Visa" width={50} height={30} className="h-6 w-auto" />
              <Image src="/images/mastercard-logo.png" alt="Mastercard" width={50} height={30} className="h-6 w-auto" />
              <Image src="/images/maestro-logo.png" alt="Maestro" width={50} height={30} className="h-6 w-auto" />
              <Image src="/images/epay.svg" alt="ePay.bg" width={60} height={30} className="h-6 w-auto" />
              <Image src="/images/google-pay.png" alt="Google Pay" width={50} height={24} className="h-6 w-auto" />
              <Image src="/images/apple-pay-mark.png" alt="Apple Pay" width={50} height={24} className="h-6 w-auto" />
            </div>

            {/* Center - Copyright */}
            <div className="text-center text-xs text-gray-700 px-4">
              <p className="font-medium">© Кеш. Всички права запазени. Уеб дизайн и изработка Benext.bg</p>
              <p className="mt-1 text-gray-600">
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="/privacy" className="underline hover:text-gray-800">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline hover:text-gray-800">
                  Terms of Service
                </Link>{" "}
                apply.
              </p>
            </div>

            {/* Right - Social Media */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Image src="/images/facebook-icon.png" alt="Facebook" width={24} height={24} className="h-6 w-6 rounded-full hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                <Image src="/images/instagram-icon.jpeg" alt="Instagram" width={24} height={24} className="h-6 w-6 rounded hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="viber://chat?number=+359878123456" aria-label="Viber">
                <Image src="/images/viber-icon.png" alt="Viber" width={24} height={24} className="h-6 w-6 rounded hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
                <FaTiktok className="h-6 w-6 text-white hover:opacity-80 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-gray-200">
            {/* Payment Methods */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Image src="/images/visa-inc.png" alt="Visa" width={45} height={28} className="h-5 w-auto" />
              <Image src="/images/mastercard-logo.png" alt="Mastercard" width={45} height={28} className="h-5 w-auto" />
              <Image src="/images/maestro-logo.png" alt="Maestro" width={45} height={28} className="h-5 w-auto" />
              <Image src="/images/epay.svg" alt="ePay.bg" width={55} height={28} className="h-5 w-auto" />
              <Image src="/images/google-pay.png" alt="Google Pay" width={45} height={20} className="h-5 w-auto" />
              <Image src="/images/apple-pay-mark.png" alt="Apple Pay" width={45} height={20} className="h-5 w-auto" />
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Image src="/images/facebook-icon.png" alt="Facebook" width={24} height={24} className="h-6 w-6 rounded-full hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
                <Image src="/images/instagram-icon.jpeg" alt="Instagram" width={24} height={24} className="h-6 w-6 rounded hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="viber://chat?number=+359878123456" aria-label="Viber">
                <Image src="/images/viber-icon.png" alt="Viber" width={24} height={24} className="h-6 w-6 rounded hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://tiktok.com" target="_blank" aria-label="TikTok">
                <FaTiktok className="h-6 w-6 text-white hover:opacity-80 transition-opacity" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-700">
              <p className="font-medium">© Кеш. Всички права запазени. Уеб дизайн и изработка Benext.bg</p>
              <p className="mt-1 text-gray-600">
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="/privacy" className="underline hover:text-gray-800">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline hover:text-gray-800">
                  Terms of Service
                </Link>{" "}
                apply.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
