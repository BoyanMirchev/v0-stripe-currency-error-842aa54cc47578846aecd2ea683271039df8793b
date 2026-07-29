"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"

interface PromotionalCard {
  id: number
  position: number
  image_url: string
  link_url: string
}

// Extract a YouTube video id from the various URL formats.
function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

export function PromotionalCardsClient({ cards }: { cards: PromotionalCard[] }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  if (cards.length === 0) {
    return null
  }

  return (
    <section className="w-full py-8 bg-[#eaebee]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const videoId = getYouTubeId(card.link_url)
            const thumbnail = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : card.image_url || "/placeholder.svg"

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => videoId && setActiveVideoId(videoId)}
                disabled={!videoId}
                aria-label={`Гледай видео ${card.position}`}
                className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-all h-96 flex flex-col group relative text-left disabled:cursor-default"
              >
                <div className="relative h-full w-full flex items-center justify-center bg-black">
                  {/* Plain img tag: YouTube thumbnail host isn't whitelisted for next/image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt={`Promotional Card ${card.position}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {videoId && (
                    <>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <span className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                        <Play className="w-7 h-7 ml-1 fill-current" />
                      </span>
                    </>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 transition-transform origin-left duration-300 scale-x-0 group-hover:scale-x-100" />
              </button>
            )
          })}
        </div>
      </div>

      {activeVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideoId(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoId(null)}
              aria-label="Затвори"
              className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
