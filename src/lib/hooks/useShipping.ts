import { useQuery } from '@tanstack/react-query'
import { getShippingMethods, getShippingMethod, ShippingMethod } from '../services/shipping'

export function useShippingMethods() {
  return useQuery<ShippingMethod[] | undefined, Error>({
    queryKey: ['shipping-methods'],
    queryFn: async () => {
      const response = await getShippingMethods()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

export function useShippingMethod(id: number) {
  return useQuery<ShippingMethod | undefined, Error>({
    queryKey: ['shipping-method', id],
    queryFn: async () => {
      const response = await getShippingMethod(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!id,
  })
}

