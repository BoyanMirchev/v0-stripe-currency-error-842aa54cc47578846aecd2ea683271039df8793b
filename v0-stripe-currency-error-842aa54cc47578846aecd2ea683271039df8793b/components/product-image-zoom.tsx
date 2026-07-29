"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImageZoomProps {
  src: string
  alt: string
  fallbackIcon?: React.ReactNode
  images?: string[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

export function ProductImageZoom({ 
  src, 
  alt, 
  fallbackIcon,
  images = [],
  currentIndex = 0,
  onIndexChange
}: ProductImageZoomProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(currentIndex)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastTouchDistance = useRef<number | null>(null)
  const lastTouchPosition = useRef<{ x: number; y: number } | null>(null)
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null)

  // Use images array if provided, otherwise use single src
  const allImages = images.length > 0 ? images : [src]
  const currentImage = allImages[lightboxIndex] || src

  // Sync lightbox index with external currentIndex
  useEffect(() => {
    setLightboxIndex(currentIndex)
  }, [currentIndex])

  // Reset zoom when changing images
  useEffect(() => {
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }, [lightboxIndex])

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true)
    setLightboxIndex(currentIndex)
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
    setZoomLevel(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const goToPrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    const newIndex = (lightboxIndex - 1 + allImages.length) % allImages.length
    setLightboxIndex(newIndex)
    onIndexChange?.(newIndex)
  }, [lightboxIndex, allImages.length, onIndexChange])

  const goToNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    const newIndex = (lightboxIndex + 1) % allImages.length
    setLightboxIndex(newIndex)
    onIndexChange?.(newIndex)
  }, [lightboxIndex, allImages.length, onIndexChange])

  const zoomIn = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }, [])

  const zoomOut = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext, zoomIn, zoomOut])

  // Touch handlers for pinch-to-zoom and pan
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      lastTouchDistance.current = distance
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      lastTouchPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      setIsDragging(true)
    }
  }, [zoomLevel])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current) {
      e.preventDefault()
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const delta = distance / lastTouchDistance.current
      setZoomLevel(prev => Math.min(Math.max(prev * delta, 1), 4))
      lastTouchDistance.current = distance
    } else if (e.touches.length === 1 && isDragging && lastTouchPosition.current && zoomLevel > 1) {
      const deltaX = e.touches[0].clientX - lastTouchPosition.current.x
      const deltaY = e.touches[0].clientY - lastTouchPosition.current.y
      
      const maxOffset = ((zoomLevel - 1) / zoomLevel) * 50
      setPosition(prev => ({
        x: Math.min(Math.max(prev.x + deltaX * 0.5, -maxOffset), maxOffset),
        y: Math.min(Math.max(prev.y + deltaY * 0.5, -maxOffset), maxOffset),
      }))
      
      lastTouchPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
  }, [isDragging, zoomLevel])

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null
    lastTouchPosition.current = null
    setIsDragging(false)
    if (zoomLevel <= 1.1) {
      setZoomLevel(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [zoomLevel])

  // Mouse drag handlers for panning when zoomed
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault()
      setIsDragging(true)
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
    }
  }, [zoomLevel])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && lastMousePosition.current && zoomLevel > 1) {
      const deltaX = e.clientX - lastMousePosition.current.x
      const deltaY = e.clientY - lastMousePosition.current.y
      
      const maxOffset = ((zoomLevel - 1) / zoomLevel) * 50
      setPosition(prev => ({
        x: Math.min(Math.max(prev.x + deltaX * 0.3, -maxOffset), maxOffset),
        y: Math.min(Math.max(prev.y + deltaY * 0.3, -maxOffset), maxOffset),
      }))
      
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
    }
  }, [isDragging, zoomLevel])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    lastMousePosition.current = null
  }, [])

  const handleDoubleClick = useCallback(() => {
    if (zoomLevel > 1) {
      setZoomLevel(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setZoomLevel(2.5)
    }
  }, [zoomLevel])

  if (!src) {
    return (
      <div className="h-full flex items-center justify-center">
        {fallbackIcon}
      </div>
    )
  }

  return (
    <>
      {/* Main Image - Click to open lightbox */}
      <div 
        className="h-full w-full relative cursor-pointer group"
        onClick={openLightbox}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-contain p-4 lg:p-8"
          priority
        />
        {/* Click hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
            <ZoomIn className="w-4 h-4" />
            <span>Кликнете за увеличение</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#2d2d2d] flex flex-col"
          onClick={closeLightbox}
        >
          {/* Close button - top right */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center text-[#c9a227] hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-10 h-10" strokeWidth={1.5} />
          </button>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Left navigation arrow */}
            {allImages.length > 1 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 z-50 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
              </button>
            )}

            {/* Image container */}
            <div
              className="relative w-full h-full max-w-4xl max-h-[80vh] mx-16 touch-none select-none"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <Image
                src={currentImage}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-contain transition-transform duration-100"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x}%, ${position.y}%)`,
                }}
                priority
                draggable={false}
              />
            </div>

            {/* Right navigation arrow */}
            {allImages.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 z-50 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Bottom controls - Zoom buttons */}
          <div className="flex items-center justify-center gap-4 pb-8">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                zoomLevel <= 1 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Zoom out"
            >
              <ZoomOut className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 4}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                zoomLevel >= 4 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-8 h-8" strokeWidth={1.5} />
            </button>
          </div>

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-8 left-4 text-white/60 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
