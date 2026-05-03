import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCartItem,
  applyVoucher,
  checkoutCart,
  getCurrentCart,
  recalculateCart,
  removeCartItem,
  removeVoucher,
  selectShippingMethod,
  updateCartItem,
  type AddCartItemPayload,
  type ApplyVoucherPayload,
  type Cart,
  type CartMutationBase,
  type CheckoutCartPayload,
  type RemoveCartItemPayload,
  type RemoveVoucherPayload,
  type SelectShippingPayload,
  type UpdateCartItemPayload,
} from '../services/carts'

export const CART_QUERY_KEY = ['cart', 'current'] as const

async function fetchLatestVersion(): Promise<number> {
  const latest = await getCurrentCart()
  if (latest.error || !latest.data) {
    throw new Error(latest.error || 'Không thể làm mới giỏ hàng')
  }
  return latest.data.version
}

async function executeWithVersionRetry<TPayload extends { expected_version: number }, TResponse>(
  action: (payload: TPayload) => Promise<{ data?: TResponse; error?: string; status?: number }>,
  payload: TPayload
): Promise<TResponse> {
  const first = await action(payload)
  if (!first.error && first.data !== undefined) {
    return first.data
  }

  if (first.status === 409) {
    const latestVersion = await fetchLatestVersion()
    const retried = await action({ ...payload, expected_version: latestVersion })
    if (!retried.error && retried.data !== undefined) {
      return retried.data
    }
    throw new Error(retried.error || 'Giỏ hàng vừa thay đổi, vui lòng thử lại')
  }

  throw new Error(first.error || 'Thao tác giỏ hàng thất bại')
}

export function useCurrentCart(enabled: boolean = true) {
  return useQuery<Cart | undefined, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await getCurrentCart()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled,
  })
}

export function useAddCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AddCartItemPayload) => executeWithVersionRetry(addCartItem, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateCartItemPayload) => executeWithVersionRetry(updateCartItem, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: RemoveCartItemPayload) => executeWithVersionRetry(removeCartItem, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useSelectShippingMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SelectShippingPayload) =>
      executeWithVersionRetry(selectShippingMethod, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useApplyVoucher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ApplyVoucherPayload) => executeWithVersionRetry(applyVoucher, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useRemoveVoucher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: RemoveVoucherPayload) => executeWithVersionRetry(removeVoucher, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useRecalculateCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CartMutationBase) => executeWithVersionRetry(recalculateCart, payload),
    onSuccess: (cart) => {
      queryClient.setQueryData(CART_QUERY_KEY, cart)
    },
  })
}

export function useCheckoutCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CheckoutCartPayload) =>
      executeWithVersionRetry(checkoutCart, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}
