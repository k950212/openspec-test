import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { findCouponByCode, type CouponDefinition } from '@/data/coupons'
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

type StoredCartState = {
  items: CartItem[]
  couponCode?: string
}

export type CartCouponFeedback = {
  type: 'idle' | 'success' | 'error' | 'info'
  message: string
}

const CART_STORAGE_KEY = 'atelier-cart-state'
const BASE_CART_ITEM_KEY = 'base'
const DEFAULT_SHIPPING_FEE = 12

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

function sanitizeStoredItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as CartItem[]
  }

  return value.flatMap((item): CartItem[] => {
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
}

function loadStoredCartState() {
  if (typeof window === 'undefined') {
    return {
      items: [] as CartItem[],
      couponCode: '',
    }
  }

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!rawValue) {
    return {
      items: [] as CartItem[],
      couponCode: '',
    }
  }

  try {
    const parsedValue = JSON.parse(rawValue) as StoredCartState | CartItem[]

    if (Array.isArray(parsedValue)) {
      return {
        items: sanitizeStoredItems(parsedValue),
        couponCode: '',
      }
    }

    return {
      items: sanitizeStoredItems(parsedValue.items),
      couponCode:
        typeof parsedValue.couponCode === 'string' ? parsedValue.couponCode.trim().toUpperCase() : '',
    }
  } catch {
    return {
      items: [] as CartItem[],
      couponCode: '',
    }
  }
}

function createCouponFeedback(
  type: CartCouponFeedback['type'],
  message: string,
): CartCouponFeedback {
  return { type, message }
}

export const useCartStore = defineStore('cart', () => {
  const storedState = loadStoredCartState()
  const items = ref<CartItem[]>(storedState.items)
  const couponInput = ref(storedState.couponCode)
  const appliedCouponCode = ref(storedState.couponCode)
  const couponFeedback = ref<CartCouponFeedback>(createCouponFeedback('idle', ''))

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

  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))

  const subtotal = computed(() =>
    detailedItems.value.reduce((total, item) => total + item.lineTotal, 0),
  )

  const shippingBase = computed(() => (detailedItems.value.length > 0 ? DEFAULT_SHIPPING_FEE : 0))

  const appliedCoupon = computed<CouponDefinition | null>(() => {
    if (appliedCouponCode.value.trim().length === 0) {
      return null
    }

    return findCouponByCode(appliedCouponCode.value)
  })

  const couponDiscount = computed(() => {
    if (!appliedCoupon.value || shippingBase.value === 0) {
      return 0
    }

    if (
      appliedCoupon.value.type === 'free-shipping' &&
      subtotal.value > appliedCoupon.value.minimumSubtotalExclusive
    ) {
      return shippingBase.value
    }

    return 0
  })

  const shipping = computed(() => Math.max(shippingBase.value - couponDiscount.value, 0))

  const total = computed(() => subtotal.value + shipping.value)

  const hasActiveCoupon = computed(() => appliedCoupon.value !== null && couponDiscount.value > 0)

  function validateCouponCode(rawCode: string) {
    const normalizedCode = rawCode.trim().toUpperCase()

    if (normalizedCode.length === 0) {
      return {
        coupon: null,
        feedback: createCouponFeedback('error', '請先輸入 coupon code。'),
      }
    }

    const coupon = findCouponByCode(normalizedCode)

    if (!coupon) {
      return {
        coupon: null,
        feedback: createCouponFeedback('error', '找不到這組 coupon code，請重新確認。'),
      }
    }

    if (detailedItems.value.length === 0) {
      return {
        coupon,
        feedback: createCouponFeedback('error', '購物車目前是空的，無法套用 coupon。'),
      }
    }

    if (subtotal.value <= coupon.minimumSubtotalExclusive) {
      return {
        coupon,
        feedback: createCouponFeedback(
          'error',
          `此 coupon 需在商品小計超過 $${coupon.minimumSubtotalExclusive} 後才能使用。`,
        ),
      }
    }

    return {
      coupon,
      feedback: createCouponFeedback('success', `已套用 ${coupon.code}，本次訂單享免運優惠。`),
    }
  }

  function setCouponInput(value: string) {
    couponInput.value = value.trim().toUpperCase()
  }

  function applyCoupon(rawCode = couponInput.value) {
    const normalizedCode = rawCode.trim().toUpperCase()
    couponInput.value = normalizedCode

    const result = validateCouponCode(normalizedCode)

    if (!result.coupon || result.feedback.type === 'error') {
      appliedCouponCode.value = ''
      couponFeedback.value = result.feedback
      return false
    }

    appliedCouponCode.value = result.coupon.code
    couponFeedback.value = result.feedback
    return true
  }

  function removeCoupon(feedbackMessage = '已移除 coupon。') {
    appliedCouponCode.value = ''
    couponInput.value = ''
    couponFeedback.value = createCouponFeedback('info', feedbackMessage)
  }

  function revalidateCoupon() {
    if (appliedCouponCode.value.trim().length === 0) {
      if (detailedItems.value.length === 0) {
        couponInput.value = ''
      }

      return
    }

    const normalizedCode = appliedCouponCode.value.trim().toUpperCase()
    const result = validateCouponCode(normalizedCode)

    if (!result.coupon || result.feedback.type === 'error') {
      appliedCouponCode.value = ''
      couponFeedback.value =
        detailedItems.value.length === 0
          ? createCouponFeedback('info', '購物車已清空，coupon 已自動移除。')
          : createCouponFeedback('info', '購物車內容已變更，coupon 已不再符合使用條件。')
      return
    }

    couponInput.value = normalizedCode
    couponFeedback.value = result.feedback
  }

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

  if (typeof window !== 'undefined') {
    watch(
      [items, appliedCouponCode],
      ([nextItems, nextCouponCode]) => {
        const nextState: StoredCartState = {
          items: nextItems,
          couponCode: nextCouponCode.trim().toUpperCase(),
        }

        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextState))
      },
      { deep: true, immediate: true },
    )
  }

  watch(
    subtotal,
    () => {
      revalidateCoupon()
    },
    { immediate: true },
  )

  return {
    items,
    detailedItems,
    itemCount,
    subtotal,
    shippingBase,
    shipping,
    couponInput,
    appliedCoupon,
    couponDiscount,
    couponFeedback,
    total,
    hasActiveCoupon,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    setCouponInput,
    applyCoupon,
    removeCoupon,
    revalidateCoupon,
  }
})
