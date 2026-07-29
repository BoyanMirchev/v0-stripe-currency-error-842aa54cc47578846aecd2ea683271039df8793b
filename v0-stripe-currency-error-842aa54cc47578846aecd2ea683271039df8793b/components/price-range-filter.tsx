"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import { useMemo } from "react"

interface PriceRangeFilterProps {
  /** Lower bound of the available range */
  min: number
  /** Upper bound of the available range */
  max: number
  /** Current selected [min, max] value */
  value: number[]
  /** Called with the new [min, max] value */
  onChange: (value: number[]) => void
  /** Heading label */
  label?: string
  /** Accent color of the track and thumbs */
  color?: "red" | "blue"
  /** Formats each end value for display. Defaults to EUR formatting. */
  formatValue?: (value: number) => string
}

const formatEUR = (value: number) =>
  `${value.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`

const COLOR_CLASSES = {
  red: {
    track: "bg-red-600/40",
    range: "bg-red-600",
    thumb: "bg-red-600 focus-visible:ring-red-600/30",
  },
  blue: {
    track: "bg-blue-600/40",
    range: "bg-blue-600",
    thumb: "bg-blue-600 focus-visible:ring-blue-600/30",
  },
} as const

export function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  label = "Цена",
  color = "red",
  formatValue = formatEUR,
}: PriceRangeFilterProps) {
  const colors = COLOR_CLASSES[color]
  // Clamp the incoming value to the available bounds so the slider renders correctly
  const clamped = useMemo(() => {
    const lo = Number.isFinite(value?.[0]) ? Math.max(min, Math.min(value[0], max)) : min
    const hiRaw = Number.isFinite(value?.[1]) ? value[1] : max
    const hi = Math.min(max, Math.max(hiRaw, lo))
    return [lo, hi]
  }, [value, min, max])

  const step = useMemo(() => {
    const span = max - min
    if (span <= 0) return 1
    return Math.max(0.01, Math.round((span / 100) * 100) / 100)
  }, [min, max])

  return (
    <div className="py-4">
      <h3 className="text-2xl font-light text-foreground mb-8">{label}</h3>

      <div className="px-4">
        <SliderPrimitive.Root
          min={min}
          max={max}
          step={step}
          value={clamped}
          minStepsBetweenThumbs={0}
          onValueChange={onChange}
          className="relative flex w-full touch-none select-none items-center"
          aria-label={label}
        >
          <SliderPrimitive.Track className={`relative h-0.5 w-full grow rounded-full ${colors.track}`}>
            <SliderPrimitive.Range className={`absolute h-full rounded-full ${colors.range}`} />
          </SliderPrimitive.Track>
          {clamped.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className={`block size-7 cursor-grab rounded-full shadow-sm outline-none transition-[box-shadow] focus-visible:ring-4 active:cursor-grabbing ${colors.thumb}`}
            />
          ))}
        </SliderPrimitive.Root>
      </div>

      <div className="mt-5 flex items-center justify-between px-1 text-lg text-foreground">
        <span>{formatValue(clamped[0])}</span>
        <span>{formatValue(clamped[1])}</span>
      </div>
    </div>
  )
}
