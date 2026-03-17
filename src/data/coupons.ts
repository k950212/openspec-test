export type CouponDefinition = {
  code: string
  label: string
  type: 'free-shipping'
  minimumSubtotalExclusive: number
}

export const coupons: CouponDefinition[] = [
  {
    code: 'FREESHIP100',
    label: '滿額免運',
    type: 'free-shipping',
    minimumSubtotalExclusive: 100,
  },
]

export function findCouponByCode(code: string) {
  const normalizedCode = code.trim().toUpperCase()

  if (normalizedCode.length === 0) {
    return null
  }

  return coupons.find((coupon) => coupon.code === normalizedCode) ?? null
}
