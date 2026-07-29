"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Suspense, useEffect } from "react"
import { useCart } from "@/lib/cart-context"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { clearCart } = useCart()

  // Clear cart when success page loads (payment was successful)
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Success Banner - matching checkout steps style */}
        <div className="relative overflow-hidden">
          {/* SVG background for triangular sections */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            {/* Black section */}
            <polygon
              points="0,0 280,0 240,100 0,100"
              fill="#111827"
            />
            {/* Red section */}
            <polygon
              points="280,0 530,0 490,100 240,100"
              fill="#dc2626"
            />
            {/* Yellow/Gold section */}
            <polygon
              points="530,0 780,0 740,100 490,100"
              fill="#eab308"
            />
            {/* Green section - success color */}
            <polygon
              points="780,0 1000,0 1000,100 740,100"
              fill="#16a34a"
            />
          </svg>

          <div className="container mx-auto px-4 relative z-10 py-5">
            <div className="relative max-w-5xl mx-auto">
              {/* Steps container with line through middle of dots */}
              <div className="relative flex justify-between items-start">
                {/* Horizontal line */}
                <div className="absolute top-[22px] left-[44px] right-0 flex items-center">
                  <div className="flex-1 h-[1px] bg-green-500/60" />
                </div>

                {/* Step 1 - ПРОДУКТИ И ДОСТАВКА (completed) */}
                <div className="flex flex-col items-start relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-white/90 tracking-wider">
                      ПРОДУКТИ И ДОСТАВКА
                    </span>
                  </div>
                </div>

                {/* Step 2 - ДАННИ И ПРЕГЛЕД (completed) */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-white/90 tracking-wider">
                      ДАННИ И ПРЕГЛЕД
                    </span>
                  </div>
                </div>

                {/* Step 3 - УСПЕШНА ЗАЯВКА (current - success) */}
                <div className="flex flex-col items-end relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white tracking-wider">
                      УСПЕШНА ЗАЯВКА
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Заявката е приета успешно!
              </h1>
              <p className="text-gray-600 mb-4">
                Благодарим Ви за поръчката!
              </p>
              {orderId && (
                <div className="bg-[#f8f9fb] border-2 border-dashed border-[#dc2626]/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Номер на поръчка</p>
                  <p className="text-2xl font-bold text-[#dc2626]">#{orderId}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Запазете този номер, за да проследите поръчката си в{" "}
                    <Link href="/track-order" className="text-[#dc2626] hover:underline font-medium">
                      Проследи поръчка
                    </Link>
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-6" />

              {/* How to Track Your Order Section */}
              <div className="text-left mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Как да проследите поръчката си</h2>
                
                {/* Guest Tracking */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ако сте гост</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Запазете номера на поръчката си. В долната част на сайта, в секция{" "}
                        <span className="font-medium text-gray-900">&quot;Обща информация&quot;</span>, ще намерите линк{" "}
                        <Link href="/track-order" className="text-[#dc2626] hover:underline font-medium">
                          &quot;Проследи поръчка&quot;
                        </Link>
                        . Въведете номера на поръчката и ще видите статуса ѝ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Holder Tracking */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#dc2626] text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ако имате акаунт</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Влезте в{" "}
                        <Link href="/account" className="text-[#dc2626] hover:underline font-medium">
                          профила си
                        </Link>
                        , за да видите всички Ваши поръчки и техния статус. Ако сте направили поръчката с акаунт, тя вече е записана в историята Ви.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#dc2626] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Зареждане...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
