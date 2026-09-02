import { apiDelete, apiGet, apiPatch, apiPost } from '../api'
import type { ShippingMethod } from './shipping'

export interface CartItem {
  id: number
  product_variant: number
  product_variant_unit?: number | null
  quantity: number
  unit_price_snapshot: number
  list_price_snapshot?: number | null
  /** Derived per line from BE (list − sale) × qty — informational. */
  catalog_savings?: number | string | null
  name?: string | null
  packing?: string | null
  unit_options?: {
    id: number
    unit_name: string
    is_default?: boolean
    price_value?: number
  }[]
  image_url?: string | null
  created_date?: string
  updated_date?: string
}

export interface Cart {
  id: number
  user_id: number | null
  guest_session_id?: string | null
  status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED'
  items: CartItem[]
  shipping_method?: ShippingMethod | null
  subtotal: number
  shipping_fee: number
  discount_amount: number
  shipping_discount_amount: number
  /** Sum of catalog (list − sale) × qty — informational, already in subtotal (P2). */
  catalog_direct_savings_total?: number
  total: number
  version: number
  order_voucher_code?: string | null
  shipping_voucher_code?: string | null
  /** BE: line subtotal meets free-shipping promo (≥ threshold in store_constants) */
  free_shipping_applied?: boolean
  checkout_order?: number | null
  created_date?: string
  updated_date?: string
}

export interface CartMutationBase {
  expected_version: number
}

export interface AddCartItemPayload extends CartMutationBase {
  product_variant_id: number
  product_variant_unit_id?: number
  quantity: number
}

export interface UpdateCartItemPayload extends CartMutationBase {
  item_id: number
  quantity?: number
  product_variant_unit_id?: number
}

export interface RemoveCartItemPayload extends CartMutationBase {
  item_id: number
}

export interface SelectShippingPayload extends CartMutationBase {
  shipping_method_id: number
}

export interface ApplyVoucherPayload extends CartMutationBase {
  order_voucher_code?: string
  shipping_voucher_code?: string
}

export interface RemoveVoucherPayload extends CartMutationBase {
  target?: 'order' | 'shipping' | 'all'
}

export interface CartVoucherOffer {
  code: string
  description?: string | null
  type: 'FIXED' | 'PERCENT'
  value: string
  scope: 'ORDER_DISCOUNT' | 'SHIPPING_DISCOUNT'
  estimated_discount: string
  end_at?: string | null
  is_applied: boolean
  is_eligible: boolean
  ineligible_reason?: string | null
}

export interface CartEligibleVouchersResponse {
  order_vouchers: CartVoucherOffer[]
  order_vouchers_unavailable?: CartVoucherOffer[]
  shipping_vouchers: CartVoucherOffer[]
  shipping_vouchers_unavailable?: CartVoucherOffer[]
  best_order_voucher_code: string | null
  best_shipping_voucher_code: string | null
  applied_order_voucher_code: string | null
  applied_shipping_voucher_code: string | null
  evaluated_at?: string
}

import type { CheckoutDeliveryPayload } from '../validations/checkout'

export interface CheckoutCartPayload extends CartMutationBase {
  payment_method_id: number
  /**
   * Legacy: one pre-formatted string. Prefer `delivery` so the backend validates and formats storage.
   * Send at least one of `shipping_address` or `delivery`.
   */
  shipping_address?: string
  delivery?: CheckoutDeliveryPayload
  notes?: string
  /** When set, only these server cart line ids are purchased; cart stays active if lines remain. */
  cart_item_ids?: number[]
  /** Best-effort campaign attribution (D-10); invalid ids ignored by BE. */
  campaign_id?: number
}

export async function getCurrentCart() {
  return apiGet<Cart>('/carts/current/')
}

export async function addCartItem(payload: AddCartItemPayload) {
  return apiPost<Cart>('/carts/items/', payload)
}

export async function updateCartItem(payload: UpdateCartItemPayload) {
  return apiPatch<Cart>(`/carts/items/${payload.item_id}/`, {
    ...(payload.quantity != null ? { quantity: payload.quantity } : {}),
    ...(payload.product_variant_unit_id != null ? { product_variant_unit_id: payload.product_variant_unit_id } : {}),
    expected_version: payload.expected_version,
  })
}

export async function removeCartItem(payload: RemoveCartItemPayload) {
  return apiDelete<Cart>(`/carts/items/${payload.item_id}/?expected_version=${payload.expected_version}`)
}

export async function selectShippingMethod(payload: SelectShippingPayload) {
  return apiPost<Cart>('/carts/select-shipping/', payload)
}

export async function applyVoucher(payload: ApplyVoucherPayload) {
  return apiPost<Cart>('/carts/apply-voucher/', payload)
}

export async function getEligibleCartVouchers(cartItemIds?: number[]) {
  const path =
    cartItemIds && cartItemIds.length > 0
      ? `/carts/eligible-vouchers/?cart_item_ids=${cartItemIds.join(',')}`
      : '/carts/eligible-vouchers/'
  return apiGet<CartEligibleVouchersResponse>(path)
}

export async function removeVoucher(payload: RemoveVoucherPayload) {
  return apiPost<Cart>('/carts/remove-voucher/', payload)
}

export async function recalculateCart(payload: CartMutationBase) {
  return apiPost<Cart>('/carts/recalculate/', payload)
}

export async function checkoutCart(payload: CheckoutCartPayload) {
  return apiPost<Record<string, unknown>>('/carts/checkout/', payload)
}

export async function mergeGuestCart() {
  return apiPost<Cart>('/carts/merge-guest/', {})
}
