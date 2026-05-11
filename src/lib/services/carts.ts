import { apiDelete, apiGet, apiPatch, apiPost } from '../api'
import type { ShippingMethod } from './shipping'

export interface CartItem {
  id: number
  product_variant: number
  product_variant_unit?: number | null
  quantity: number
  unit_price_snapshot: number
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
  user_id: number
  status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED'
  items: CartItem[]
  shipping_method?: ShippingMethod | null
  subtotal: number
  shipping_fee: number
  discount_amount: number
  shipping_discount_amount: number
  total: number
  version: number
  order_voucher_code?: string | null
  shipping_voucher_code?: string | null
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

export interface CheckoutCartPayload extends CartMutationBase {
  payment_method_id: number
  shipping_address: string
  notes?: string
  /** When set, only these server cart line ids are purchased; cart stays active if lines remain. */
  cart_item_ids?: number[]
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

export async function removeVoucher(payload: RemoveVoucherPayload) {
  return apiPost<Cart>('/carts/remove-voucher/', payload)
}

export async function recalculateCart(payload: CartMutationBase) {
  return apiPost<Cart>('/carts/recalculate/', payload)
}

export async function checkoutCart(payload: CheckoutCartPayload) {
  return apiPost<Record<string, unknown>>('/carts/checkout/', payload)
}
