export default function GoldLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Зареждане на детайли за златото...</p>
      </div>
    </div>
  )
}
