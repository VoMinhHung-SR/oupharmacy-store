import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, createOrder, updateOrderStatus, Order, OrderListResponse } from '../services/orders'

export function useOrders(userId?: number) {
  return useQuery<Order[] | OrderListResponse | undefined, Error>({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const response = await getOrders(userId)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: true,
  })
}

export function useOrder(id: number) {
  return useQuery<Order | undefined, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await getOrder(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!id,
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
    mutationFn: async ({ orderId, status }: { orderId: number; status: Order['status'] }) => {
      const response = await updateOrderStatus(orderId, status)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate cả order detail và orders list
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

