import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import {
  findMatchingVariantCombination,
  findProductById,
  getProductVariantSelectionSummary,
  hasProductVariants,
  normalizeVariantSelection,
  serializeVariantSelection,
  type ProductVariantSelection,
} from '@/data/products'

type CartItem = {
  productId: number
  quantity: number
  variantSelection?: ProductVariantSelection
  variantKey?: string
}

const CART_STORAGE_KEY = 'atelier-cart-items'
const BASE_CART_ITEM_KEY = 'base'

function toStoredVariantSelection(
  productId: number,
  variantSelection: ProductVariantSelection | undefined,
) {
  const product = findProductById(productId)

  if (!product || !hasProductVariants(product) || !variantSelection) {
    return undefined
  }

  const normalizedSelection = normalizeVariantSelection(variantSelection)

  if (!findMatchingVariantCombination(product, normalizedSelection)) {
    return undefined
  }

  return normalizedSelection
}

function toVariantKey(selection: ProductVariantSelection | undefined) {
  if (!selection) {
    return undefined
  }

  return serializeVariantSelection(selection)
}

function createItemKey(productId: number, variantKey?: string) {
  return `${productId}::${variantKey ?? BASE_CART_ITEM_KEY}`
}

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

    return parsedValue.flatMap((item): CartItem[] => {
      if (typeof item !== 'object' || item === null) {
        return []
      }

      const { productId, quantity, variantSelection } = item as Partial<CartItem>

      if (
        typeof productId !== 'number' ||
        !Number.isInteger(productId) ||
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return []
      }

      const product = findProductById(productId)

      if (!product) {
        return []
      }

      const normalizedSelection = toStoredVariantSelection(productId, variantSelection)

      return [
        {
          productId,
          quantity,
          variantSelection: normalizedSelection,
          variantKey: toVariantKey(normalizedSelection),
        },
      ]
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
        const product = findProductById(item.productId)

        if (!product) {
          return null
        }

        const variantSelection = item.variantSelection
        const variantSummary = variantSelection
          ? getProductVariantSelectionSummary(product, variantSelection)
          : []

        return {
          ...item,
          itemKey: createItemKey(item.productId, item.variantKey),
          product,
          variantSummary,
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

  function addItem(productId: number, variantSelection?: ProductVariantSelection) {
    const product = findProductById(productId)

    if (!product) {
      return false
    }

    const normalizedSelection = toStoredVariantSelection(productId, variantSelection)

    if (hasProductVariants(product) && !normalizedSelection) {
      return false
    }

    const variantKey = toVariantKey(normalizedSelection)

    const existingItem = items.value.find(
      (item) => item.productId === productId && item.variantKey === variantKey,
    )

    if (existingItem) {
      existingItem.quantity += 1
      return true
    }

    items.value.push({
      productId,
      quantity: 1,
      variantSelection: normalizedSelection,
      variantKey,
    })

    return true
  }

  function incrementItem(itemKey: string) {
    const existingItem = items.value.find(
      (item) => createItemKey(item.productId, item.variantKey) === itemKey,
    )

    if (!existingItem) {
      return
    }

    existingItem.quantity += 1
  }

  function decrementItem(itemKey: string) {
    const existingItem = items.value.find(
      (item) => createItemKey(item.productId, item.variantKey) === itemKey,
    )

    if (!existingItem) {
      return
    }

    if (existingItem.quantity === 1) {
      removeItem(itemKey)
      return
    }

    existingItem.quantity -= 1
  }

  function removeItem(itemKey: string) {
    items.value = items.value.filter(
      (item) => createItemKey(item.productId, item.variantKey) !== itemKey,
    )
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
