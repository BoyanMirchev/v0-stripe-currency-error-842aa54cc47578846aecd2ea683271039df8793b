"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export function FloatingActionButton() {
  const isMobile = useIsMobile()

  // Return null on initial render to avoid hydration mismatch
  if (isMobile === undefined) {
    return null
  }

  return null
}
