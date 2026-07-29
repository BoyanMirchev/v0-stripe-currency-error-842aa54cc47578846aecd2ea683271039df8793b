import { Suspense } from "react"
import CheckoutChooseContent from "./checkout-choose-content"

export default function CheckoutChoosePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutChooseContent />
    </Suspense>
  )
}
