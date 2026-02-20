import { apiGet, apiPost, apiPatch } from '../api'

export interface OrderItem {
  id?: number
  medicine_unit_id: number
  quantity: number
  price: number
  subtotal?: number
  name?: string
  image_url?: string
}

export interface Order {
  id?: number
  order_number?: string
  user_id?: number
  user?: any
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'
  notes?: string
  shipping_method: number
  payment_method: number
  shipping_address: string
  created_date?: string
  updated_date?: string
}

export interface OrderListResponse {
  count: number
  next?: string
  previous?: string
  results: Order[]
}

export async function getOrders(userId?: number) {
  if (userId) {
    return apiGet<Order[]>(`/orders/by-user/${userId}/`)
  }
  return apiGet<OrderListResponse>('/orders/')
}

export async function getOrder(orderNumber: string) {
  return apiGet<Order>(`/orders/${orderNumber}/`)
}

export async function createOrder(order: Order) {
  return apiPost<Order>('/orders/', order)
}

export async function updateOrderStatus(orderNumber: string, status: Order['status']) {
  return apiPatch<Order>(`/orders/${orderNumber}/update-status/`, { status })
}

export async function cancelOrder(orderNumber: string) {
  return apiPost<Order>(`/orders/${orderNumber}/cancel/`)
}

