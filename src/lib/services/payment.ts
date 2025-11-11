import { apiGet } from '../api'

export interface PaymentMethod {
  id: number
  name: string
  code: string
  active: boolean
  created_date: string
  updated_date: string
}

export async function getPaymentMethods() {
  return apiGet<PaymentMethod[]>('/payment-methods/')
}

export async function getPaymentMethod(id: number) {
  return apiGet<PaymentMethod>(`/payment-methods/${id}/`)
}

