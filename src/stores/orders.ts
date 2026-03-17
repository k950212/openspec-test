import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type SavedOrderItem = {
  productId: number
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type SavedOrder = {
  id: string
  placedAt: string
  customerName: string
  phone: string
  email: string
  address: string
  items: SavedOrderItem[]
  subtotal: number
  shipping: number
  total: number
}

const ORDER_HISTORY_STORAGE_KEY = 'atelier-order-history'

function isSavedOrderItem(value: unknown): value is SavedOrderItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<SavedOrderItem>

  return (
    typeof candidate.productId === 'number' &&
    Number.isInteger(candidate.productId) &&
    typeof candidate.name === 'string' &&
    typeof candidate.quantity === 'number' &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0 &&
    typeof candidate.unitPrice === 'number' &&
    typeof candidate.lineTotal === 'number'
  )
}

function isSavedOrder(value: unknown): value is SavedOrder {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<SavedOrder>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.placedAt === 'string' &&
    typeof candidate.customerName === 'string' &&
    typeof candidate.phone === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.address === 'string' &&
    Array.isArray(candidate.items) &&
    candidate.items.every(isSavedOrderItem) &&
    typeof candidate.subtotal === 'number' &&
    typeof candidate.shipping === 'number' &&
    typeof candidate.total === 'number'
  )
}

function loadStoredOrders() {
  if (typeof window === 'undefined') {
    return [] as SavedOrder[]
  }

  const rawValue = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY)

  if (!rawValue) {
    return [] as SavedOrder[]
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return [] as SavedOrder[]
    }

    return parsedValue.filter(isSavedOrder)
  } catch {
    return [] as SavedOrder[]
  }
}

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<SavedOrder[]>(loadStoredOrders())

  if (typeof window !== 'undefined') {
    watch(
      orders,
      (nextOrders) => {
        window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(nextOrders))
      },
      { deep: true },
    )
  }

  const hasOrders = computed(() => orders.value.length > 0)

  function saveOrder(order: Omit<SavedOrder, 'id' | 'placedAt'>) {
    orders.value.unshift({
      ...order,
      id: `order-${Date.now()}`,
      placedAt: new Date().toISOString(),
    })
  }

  function findOrderById(orderId: string) {
    return orders.value.find((order) => order.id === orderId) ?? null
  }

  return {
    orders,
    hasOrders,
    saveOrder,
    findOrderById,
  }
})
