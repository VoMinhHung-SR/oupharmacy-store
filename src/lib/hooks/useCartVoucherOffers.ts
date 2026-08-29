import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getEligibleCartVouchers,
  type CartEligibleVouchersResponse,
} from '../services/carts'
import { CART_QUERY_KEY, useApplyVoucher, useCurrentCart } from './useCarts'

export const CART_ELIGIBLE_VOUCHERS_QUERY_KEY = ['cart', 'eligible-vouchers'] as const

export function useEligibleCartVouchers(enabled = true, cartItemIds?: number[]) {
  const { data: cart } = useCurrentCart(enabled)
  const itemKey = cartItemIds?.join(',') ?? 'all'
  return useQuery<CartEligibleVouchersResponse | undefined, Error>({
    queryKey: [...CART_ELIGIBLE_VOUCHERS_QUERY_KEY, cart?.version, itemKey],
    queryFn: async () => {
      const response = await getEligibleCartVouchers(cartItemIds)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: enabled && Boolean(cart?.version) && Boolean(cart?.items?.length),
    staleTime: 15_000,
    retry: 1,
  })
}

/** Silently upgrades cart to the best eligible order voucher when cart context changes. */
export function useAutoApplyBestCartVoucher(enabled = true) {
  const { data: cart } = useCurrentCart(enabled)
  const { data: offers } = useEligibleCartVouchers(enabled)
  const applyMutation = useApplyVoucher()
  const busyRef = useRef(false)
  const lastAttemptKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || !cart?.items?.length || !offers || busyRef.current) return

    const bestCode = offers.best_order_voucher_code
    if (!bestCode) return

    const appliedCode = offers.applied_order_voucher_code
    const bestOffer = offers.order_vouchers.find((row) => row.code === bestCode)
    const appliedOffer = appliedCode
      ? offers.order_vouchers.find((row) => row.code === appliedCode)
      : null
    const bestDiscount = Number(bestOffer?.estimated_discount ?? 0)
    const appliedDiscount = appliedOffer
      ? Number(appliedOffer.estimated_discount)
      : Number(cart.discount_amount ?? 0)

    if (appliedCode === bestCode) return
    if (appliedCode && appliedDiscount >= bestDiscount) return

    const attemptKey = `${cart.version}:${bestCode}`
    if (lastAttemptKeyRef.current === attemptKey) return

    busyRef.current = true
    lastAttemptKeyRef.current = attemptKey
    void applyMutation
      .mutateAsync({
        expected_version: cart.version,
        order_voucher_code: bestCode,
      })
      .catch(() => {
        lastAttemptKeyRef.current = null
      })
      .finally(() => {
        busyRef.current = false
      })
  }, [applyMutation, cart, enabled, offers])
}

export function invalidateEligibleCartVouchers(queryClient: {
  invalidateQueries: (opts: { queryKey: readonly string[] }) => void
}) {
  queryClient.invalidateQueries({ queryKey: CART_ELIGIBLE_VOUCHERS_QUERY_KEY })
}

export { CART_QUERY_KEY }
