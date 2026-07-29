"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface ProductReviewsProps {
  productId: number
  productType: "equipment" | "gold" | "cars"
}

interface Review {
  id: number
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export function ProductReviews({ productId, productType }: ProductReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [userName, setUserName] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId, productType])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&productType=${productType}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Моля изберете оценка",
        description: "Трябва да изберете оценка от 1 до 5 звезди.",
        variant: "destructive",
      })
      return
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: "Моля въведете ревю",
        description: "Ревюто трябва да е поне 10 символа.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productType,
          userName: userName.trim() || "Anonymous",
          rating,
          comment: reviewText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReviews([data.review, ...reviews])
        toast({
          title: "Успешно добавено!",
          description: "Вашето ревю беше добавено успешно.",
        })
        // Reset form
        setRating(0)
        setReviewText("")
        setUserName("")
        setShowAddReview(false)
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      console.error("[v0] Error submitting review:", error)
      toast({
        title: "Грешка",
        description: "Не успяхме да добавим ревюто. Моля опитайте отново.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div className="bg-white py-6 mb-6">
      <div className="py-4 md:py-6 px-6 bg-gradient-to-r from-[#eaecef] to-[#f9f9f9] shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f]">Ревюта</h2>
      </div>

      <div className="px-6">
        {!showAddReview ? (
          <button
            onClick={() => setShowAddReview(true)}
            className="px-6 py-3 border-2 border-[#0066cc] text-[#0066cc] rounded-lg font-medium hover:bg-[#0066cc] hover:text-white transition-all"
          >
            Добави ревю
          </button>
        ) : (
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Име (незадължително)</label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Вашето име"
                className="w-full max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                    <Star
                      size={32}
                      fill={star <= rating ? "#FFC107" : "none"}
                      stroke={star <= rating ? "#FFC107" : "#9e9e9e"}
                      className="transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Вашето ревю</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Споделете вашето мнение за продукта..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="bg-[#0066cc] hover:bg-[#0055b3] text-white px-6 py-2"
              >
                {isSubmitting ? "Публикуване..." : "Публикувай"}
              </Button>
              <Button
                onClick={() => {
                  setShowAddReview(false)
                  setRating(0)
                  setReviewText("")
                  setUserName("")
                }}
                variant="outline"
                className="px-6 py-2"
                disabled={isSubmitting}
              >
                Отказ
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Зареждане на ревюта...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Все още няма ревюта за този продукт.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#1d1d1f]">{review.user_name}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= review.rating ? "#FFC107" : "none"}
                            stroke={star <= review.rating ? "#FFC107" : "#9e9e9e"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
