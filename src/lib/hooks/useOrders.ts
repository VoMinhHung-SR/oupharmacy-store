import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  Order,
  OrderListResponse,
  OrderListFilters,
} from '../services/orders'

export function useOrders(userId?: number, filters?: OrderListFilters) {
  return useQuery<Order[] | OrderListResponse | undefined, Error>({
    queryKey: ['orders', userId, filters],
    queryFn: async () => {
      const response = await getOrders(userId, filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!userId,
  })
}

export function useOrder(orderNumber: string) {
  return useQuery<Order | undefined, Error>({
    queryKey: ['order', orderNumber],
    queryFn: async () => {
      const response = await getOrder(orderNumber)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!orderNumber,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: Order) => {
      const response = await createOrder(order)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate orders query để refetch danh sách orders
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderNumber, status }: { orderNumber: string; status: Order['status'] }) => {
      const response = await updateOrderStatus(orderNumber, status)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate cả order detail và orders list
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderNumber] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const response = await cancelOrder(orderNumber)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (_, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderNumber] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

