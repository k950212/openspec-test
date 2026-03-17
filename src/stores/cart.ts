import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { products } from '@/data/products'

type CartItem = {
  productId: number
  quantity: number
}

const CART_STORAGE_KEY = 'atelier-cart-items'

function loadStoredItems() {
  if (typeof window === 'undefined') {
    return [] as CartItem[]
  }

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!rawValue) {
    return [] as CartItem[]
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as CartItem[]
    }

    return parsedValue.filter((item): item is CartItem => {
      if (typeof item !== 'object' || item === null) {
        return false
      }

      const { productId, quantity } = item as Partial<CartItem>

      return (
        typeof productId === 'number' &&
        Number.isInteger(productId) &&
        products.some((product) => product.id === productId) &&
        typeof quantity === 'number' &&
        Number.isInteger(quantity) &&
        quantity > 0
      )
    })
  } catch {
    return [] as CartItem[]
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadStoredItems())

  if (typeof window !== 'undefined') {
    watch(
      items,
      (nextItems) => {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems))
      },
      { deep: true },
    )
  }

  const detailedItems = computed(() =>
    items.value
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)

        if (!product) {
          return null
        }

        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  )

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  const subtotal = computed(() =>
    detailedItems.value.reduce((total, item) => total + item.lineTotal, 0),
  )

  function addItem(productId: number) {
    const existingItem = items.value.find((item) => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    items.value.push({ productId, quantity: 1 })
  }

  function incrementItem(productId: number) {
    addItem(productId)
  }

  function decrementItem(productId: number) {
    const existingItem = items.value.find((item) => item.productId === productId)

    if (!existingItem) {
      return
    }

    if (existingItem.quantity === 1) {
      removeItem(productId)
      return
    }

    existingItem.quantity -= 1
  }

  function removeItem(productId: number) {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    detailedItems,
    itemCount,
    subtotal,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  }
})
