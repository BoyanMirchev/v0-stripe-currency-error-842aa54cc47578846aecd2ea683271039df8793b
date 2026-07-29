import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeight(grams: number | string): string {
  const weight = Number(grams)
  if (isNaN(weight)) return "0g"
  
  // Remove unnecessary decimal places
  // If it's a whole number, show without decimals
  // If it has meaningful decimals, show them
  const formatted = weight % 1 === 0 ? weight.toString() : weight.toFixed(2).replace(/\.?0+$/, '')
  
  return `${formatted}g`
}
