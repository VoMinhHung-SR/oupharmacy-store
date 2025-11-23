import { apiGet } from '../api'

export interface ShippingMethod {
  id: number
  name: string
  price: number
  estimated_days?: number
  active: boolean
  created_date: string
  updated_date: string
}

export async function getShippingMethods() {
  return apiGet<ShippingMethod[]>('/shipping-methods/')
}

export async function getShippingMethod(id: number) {
  return apiGet<ShippingMethod>(`/shipping-methods/${id}/`)
}

