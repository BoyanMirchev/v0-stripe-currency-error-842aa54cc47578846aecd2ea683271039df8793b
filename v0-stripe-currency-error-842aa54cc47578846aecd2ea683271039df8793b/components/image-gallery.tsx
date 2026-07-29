"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "./image-lightbox"

interface ImageGalleryProps {
  images: string[]
  equipmentName: string
}

export function ImageGallery({ images, equipmentName }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Main Image - Full Width */}
        <div
          className="col-span-2 relative h-[400px] bg-muted rounded-lg overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={`${equipmentName} - основна снимка`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnail Gallery */}
        {images.slice(1, 5).map((img, index) => (
          <div
            key={index}
            className="relative h-[150px] bg-muted rounded-lg overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={img || "/placeholder.svg"}
              alt={`${equipmentName} - снимка ${index + 2}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <ImageLightbox images={images} initialIndex={selectedIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  )
}
