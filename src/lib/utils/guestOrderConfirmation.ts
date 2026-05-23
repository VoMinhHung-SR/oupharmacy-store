import type { Order } from '@/lib/services/orders'
import { normalizeOrderFromCheckout } from '@/lib/services/orders'

const GUEST_ORDER_CONFIRM_KEY = 'oupharmacy_guest_order_confirm'
const TTL_MS = 24 * 60 * 60 * 1000

type StoredGuestOrder = {
  orderNumber: string
  order: Order
  savedAt: number
}

export function saveGuestOrderConfirmation(raw: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const order = normalizeOrderFromCheckout(raw)
  const orderNumber = String(order.order_number ?? order.id ?? '')
  if (!orderNumber) return
  const payload: StoredGuestOrder = {
    orderNumber,
    order,
    savedAt: Date.now(),
  }
  try {
    sessionStorage.setItem(GUEST_ORDER_CONFIRM_KEY, JSON.stringify(payload))
  } catch {}
}

export function loadGuestOrderConfirmation(orderNumber: string): Order | null {
  if (typeof window === 'undefined' || !orderNumber) return null
  try {
    const raw = sessionStorage.getItem(GUEST_ORDER_CONFIRM_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredGuestOrder
    if (!parsed?.order || parsed.orderNumber !== orderNumber) return null
    if (Date.now() - parsed.savedAt > TTL_MS) {
      sessionStorage.removeItem(GUEST_ORDER_CONFIRM_KEY)
      return null
    }
    return parsed.order
  } catch {
    return null
  }
}

export function clearGuestOrderConfirmation(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GUEST_ORDER_CONFIRM_KEY)
  } catch {}
}
