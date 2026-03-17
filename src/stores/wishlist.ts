import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { products } from '@/data/products'

const WISHLIST_STORAGE_KEY = 'atelier-wishlist-items'

function loadStoredFavoriteIds() {
  if (typeof window === 'undefined') {
    return [] as number[]
  }

  const rawValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY)

  if (!rawValue) {
    return [] as number[]
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as number[]
    }

    return [...new Set(parsedValue)].filter(
      (productId): productId is number =>
        typeof productId === 'number' &&
        Number.isInteger(productId) &&
        products.some((product) => product.id === productId),
    )
  } catch {
    return [] as number[]
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const favoriteIds = ref<number[]>(loadStoredFavoriteIds())

  if (typeof window !== 'undefined') {
    watch(favoriteIds, (nextFavoriteIds) => {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextFavoriteIds))
    })
  }

  const favoritedProducts = computed(() =>
    favoriteIds.value
      .map((productId) => products.find((product) => product.id === productId) ?? null)
      .filter((product): product is NonNullable<typeof product> => product !== null),
  )

  function isFavorited(productId: number) {
    return favoriteIds.value.includes(productId)
  }

  function toggleFavorite(productId: number) {
    if (isFavorited(productId)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== productId)
      return false
    }

    favoriteIds.value = [...favoriteIds.value, productId]
    return true
  }

  function removeFavorite(productId: number) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== productId)
  }

  return {
    favoriteIds,
    favoritedProducts,
    isFavorited,
    toggleFavorite,
    removeFavorite,
  }
})
