import { Layers, ChevronRight } from "lucide-react"

interface InstallmentPaymentProps {
  price: number
  currency?: string
  currencySymbol?: string
  months?: number
  className?: string
}

export function InstallmentPayment({
  price,
  currency = "лв",
  currencySymbol = "€",
  months = 36,
  className = "",
}: InstallmentPaymentProps) {
  const monthlyPayment = (price / months).toFixed(2)
  const eurPayment = (Number.parseFloat(monthlyPayment) * 0.51).toFixed(2)

  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      {/* Left section with icon and text */}
      <div className="flex items-center gap-3 flex-1">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#e60200" }}
        >
          <Layers className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900">Купи на разсрочено</div>
          <div className="text-sm font-semibold" style={{ color: "#e60200" }}>
            от {monthlyPayment} {currency} / {eurPayment}
            {currencySymbol}
          </div>
        </div>
      </div>

      <button className="flex-shrink-0 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  )
}
