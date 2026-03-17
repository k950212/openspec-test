import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { products } from '@/data/products'

export type SavedReview = {
  id: string
  productId: number
  authorName: string
  authorEmail: string
  rating: number
  content: string
  submittedAt: string
}

const REVIEWS_STORAGE_KEY = 'atelier-product-reviews'

function isSavedReview(value: unknown): value is SavedReview {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<SavedReview>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.productId === 'number' &&
    Number.isInteger(candidate.productId) &&
    products.some((product) => product.id === candidate.productId) &&
    typeof candidate.authorName === 'string' &&
    typeof candidate.authorEmail === 'string' &&
    typeof candidate.rating === 'number' &&
    Number.isInteger(candidate.rating) &&
    candidate.rating >= 1 &&
    candidate.rating <= 5 &&
    typeof candidate.content === 'string' &&
    candidate.content.trim().length > 0 &&
    typeof candidate.submittedAt === 'string'
  )
}

function loadStoredReviews() {
  if (typeof window === 'undefined') {
    return [] as SavedReview[]
  }

  const rawValue = window.localStorage.getItem(REVIEWS_STORAGE_KEY)

  if (!rawValue) {
    return [] as SavedReview[]
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as SavedReview[]
    }

    return parsedValue.filter(isSavedReview)
  } catch {
    return [] as SavedReview[]
  }
}

export const useReviewStore = defineStore('reviews', () => {
  const reviews = ref<SavedReview[]>(loadStoredReviews())

if (typeof window !== 'undefined') {
  watch(
    reviews,
    (nextReviews) => {
      window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(nextReviews))
    },
    { deep: true },
  )
}

  const reviewCount = computed(() => reviews.value.length)

  function getReviewsForProduct(productId: number) {
    return reviews.value
      .filter((review) => review.productId === productId)
      .sort(
        (left, right) =>
          new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime(),
      )
  }

  function createReview(review: Omit<SavedReview, 'id' | 'submittedAt'>) {
    const nextContent = review.content.trim()
    const nextAuthorName = review.authorName.trim()
    const nextAuthorEmail = review.authorEmail.trim().toLowerCase()

    const nextReview: SavedReview = {
      id: `review-${review.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: review.productId,
      authorName: nextAuthorName,
      authorEmail: nextAuthorEmail,
      rating: review.rating,
      content: nextContent,
      submittedAt: new Date().toISOString(),
    }

    reviews.value.unshift(nextReview)
    return nextReview
  }

  return {
    reviews,
    reviewCount,
    getReviewsForProduct,
    upsertReview: createReview,
    createReview,
  }
})
