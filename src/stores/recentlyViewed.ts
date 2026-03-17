import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { products } from '@/data/products'

const RECENTLY_VIEWED_STORAGE_KEY = 'atelier-recently-viewed-products'

function loadStoredProductIds() {
  if (typeof window === 'undefined') {
    return [] as number[]
  }

  const rawValue = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)

  if (!rawValue) {
    return [] as number[]
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as number[]
    }

    return parsedValue.filter(
      (productId): productId is number =>
        typeof productId === 'number' &&
        Number.isInteger(productId) &&
        products.some((product) => product.id === productId),
    )
  } catch {
    return [] as number[]
  }
}

export const useRecentlyViewedStore = defineStore('recently-viewed', () => {
  const productIds = ref<number[]>(loadStoredProductIds())

  if (typeof window !== 'undefined') {
    watch(productIds, (nextProductIds) => {
      window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(nextProductIds))
    })
  }

  const viewedProducts = computed(() =>
    productIds.value
      .map((productId) => products.find((product) => product.id === productId) ?? null)
      .filter((product): product is NonNullable<typeof product> => product !== null),
  )

  function recordProductView(productId: number) {
    if (!products.some((product) => product.id === productId)) {
      return
    }

    productIds.value = [productId, ...productIds.value.filter((id) => id !== productId)]
  }

  return {
    productIds,
    viewedProducts,
    recordProductView,
  }
})
