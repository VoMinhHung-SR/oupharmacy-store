import { useQuery } from '@tanstack/react-query'
import { getPaymentMethods, getPaymentMethod, PaymentMethod } from '../services/payment'

export function usePaymentMethods() {
  return useQuery<PaymentMethod[] | undefined, Error>({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await getPaymentMethods()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

export function usePaymentMethod(id: number) {
  return useQuery<PaymentMethod | undefined, Error>({
    queryKey: ['payment-method', id],
    queryFn: async () => {
      const response = await getPaymentMethod(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!id,
  })
}

