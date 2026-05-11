import { apiGet, apiPost, apiPatch } from '../api'

export interface OrderItem {
  id?: number
  /**
   * FE legacy key (historically named as unit id), currently stores ProductVariant id
   * used for order creation as `product_variant`.
   */
  variant_unit_id: number
  /** Optional ProductVariantUnit id for APIs supporting explicit unit selection. */
  product_variant_unit_id?: number
  quantity: number
  price: number
  subtotal?: number
  name?: string
  image_url?: string
}

export interface Order {
  id?: number
  order_number?: string
  tracking_code?: string
  tracking_timeline?: Array<{ status: string; time?: string; note?: string }>
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

export interface OrderListFilters {
  page?: number
  page_size?: number
  status?: Order['status']
  ordering?: string
  search?: string
  order_number?: string
}

function buildOrderListQuery(filters?: OrderListFilters): string {
  if (!filters) return ''
  const p = new URLSearchParams()
  if (filters.page != null) p.set('page', String(filters.page))
  if (filters.page_size != null) p.set('page_size', String(filters.page_size))
  if (filters.status) p.set('status', filters.status)
  if (filters.ordering) p.set('ordering', filters.ordering)
  if (filters.search) p.set('search', filters.search)
  if (filters.order_number) p.set('order_number', filters.order_number)
  const s = p.toString()
  return s ? `?${s}` : ''
}

function normalizeOrderItem(raw: Record<string, unknown>): OrderItem {
  const vid = raw.variant_unit_id ?? raw.medicine_unit_id ?? raw.product_variant
  return {
    id: raw.id as number | undefined,
    variant_unit_id: Number(vid) || 0,
    product_variant_unit_id:
      raw.product_variant_unit !== undefined ? Number(raw.product_variant_unit) || undefined : undefined,
    quantity: Number(raw.quantity ?? 0) || 0,
    price: Number(raw.price ?? 0) || 0,
    subtotal: raw.subtotal !== undefined ? Number(raw.subtotal) : undefined,
    name: raw.name as string | undefined,
    image_url: raw.image_url as string | undefined,
  }
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  const items = Array.isArray(raw.items)
    ? (raw.items as Record<string, unknown>[]).map((i) => normalizeOrderItem(i))
    : []
  return {
    ...(raw as unknown as Order),
    items,
    tracking_code: (raw.tracking_code as string | undefined) || undefined,
    tracking_timeline: Array.isArray(raw.tracking_timeline)
      ? (raw.tracking_timeline as Array<{ status: string; time?: string; note?: string }>)
      : undefined,
  }
}

function serializeOrderForApi(order: Order): Record<string, unknown> {
  return {
    ...order,
    items: order.items.map((item) => ({
      id: item.id,
      product_variant: item.variant_unit_id,
      ...(item.product_variant_unit_id ? { product_variant_unit: item.product_variant_unit_id } : {}),
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      name: item.name,
      image_url: item.image_url,
    })),
  }
}

export async function getOrders(userId?: number, filters?: OrderListFilters) {
  const qs = buildOrderListQuery(filters)
  if (userId) {
    const res = await apiGet<Order[] | OrderListResponse | Record<string, unknown>[]>(
      `/orders/by-user/${userId}/${qs}`
    )
    if (res.data && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map((o) => normalizeOrder(o as Record<string, unknown>)),
      }
    }
    if (res.data && typeof res.data === 'object' && 'results' in res.data && Array.isArray((res.data as OrderListResponse).results)) {
      const list = res.data as OrderListResponse
      return {
        ...res,
        data: {
          ...list,
          results: list.results.map((o) => normalizeOrder(o as unknown as Record<string, unknown>)),
        },
      }
    }
    return res as ReturnType<typeof apiGet<Order[]>>
  }
  const res = await apiGet<OrderListResponse>(`/orders/${qs}`)
  if (res.data?.results) {
    return {
      ...res,
      data: {
        ...res.data,
        results: res.data.results.map((o) => normalizeOrder(o as unknown as Record<string, unknown>)),
      },
    }
  }
  return res
}

export async function getOrder(orderNumber: string) {
  const res = await apiGet<Order>(`/orders/${orderNumber}/`)
  if (res.data) {
    return {
      ...res,
      data: normalizeOrder(res.data as unknown as Record<string, unknown>),
    }
  }
  return res
}

/**
 * @deprecated Use cart-first checkout via `checkoutCart` in `src/lib/services/carts.ts`.
 * This endpoint is kept temporarily for backward compatibility.
 */
export async function createOrder(order: Order) {
  return apiPost<Order>('/orders/', serializeOrderForApi(order) as unknown as Order)
}

export async function updateOrderStatus(orderNumber: string, status: Order['status']) {
  return apiPatch<Order>(`/orders/${orderNumber}/update-status/`, { status })
}

export async function cancelOrder(orderNumber: string) {
  return apiPost<Order>(`/orders/${orderNumber}/cancel/`)
}
