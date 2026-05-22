import type { ShippingMethod } from '@/lib/services/shipping'

/** Prefer fast delivery when free shipping applies */
export function pickPreferredShippingMethod(methods: ShippingMethod[]): ShippingMethod | null {
  const active = methods.filter((m) => m.active)
  if (active.length === 0) return null

  const fastByName = active.find(
    (m) => /giao nhanh|giao hỏa tốc|hỏa tốc|nhanh|express/i.test(m.name) && !/tiết kiệm|economy|tiêu chuẩn/i.test(m.name)
  )
  if (fastByName) return fastByName

  const notEconomy = active.filter((m) => !/tiết kiệm|economy/i.test(m.name))
  const pool = notEconomy.length > 0 ? notEconomy : active

  return pool.reduce((best, m) => {
    const days = m.estimated_days ?? 99
    const bestDays = best.estimated_days ?? 99
    return days < bestDays ? m : best
  })
}

/** Show radio list only when options differ in price (before free-shipping promo). */
export function shouldShowShippingMethodChoice(
  methods: ShippingMethod[],
  qualifiesFreeShipping: boolean
): boolean {
  if (methods.length <= 1) return false
  if (qualifiesFreeShipping) return false
  const prices = new Set(methods.map((m) => Number(m.price)))
  return prices.size > 1
}

export function formatShippingEta(method: ShippingMethod): string | null {
  const days = method.estimated_days
  if (days == null || days <= 0) return null
  if (days === 1) return 'Dự kiến giao trong 24 giờ'
  return `Dự kiến giao trong ${days} ngày`
}
