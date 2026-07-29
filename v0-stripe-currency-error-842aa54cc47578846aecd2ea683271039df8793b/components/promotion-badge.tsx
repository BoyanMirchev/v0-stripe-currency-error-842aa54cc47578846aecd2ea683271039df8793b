export function PromotionBadge({
  originalPrice,
  discount,
}: { originalPrice: number; discount: number | null | undefined }) {
  if (!discount || discount <= 0) return null

  const discountInEUR = Number(discount).toFixed(2)

  return (
    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
      -{discountInEUR}€
    </div>
  )
}
