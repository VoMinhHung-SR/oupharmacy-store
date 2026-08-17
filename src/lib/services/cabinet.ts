import { apiDelete, apiGet, apiPatch, apiPost, type ApiResponse } from '@/lib/api'

export type ExpirationStatus = 'EXPIRED' | 'EXPIRING_SOON' | 'EXPIRING' | 'SAFE'
export type InventoryStatus = 'IN_STOCK' | 'OUT_OF_STOCK'

export type Cabinet = {
  id: number
  name: string
  created_date: string
  updated_date: string
}

export type CabinetItem = {
  id: number
  cabinet: number
  product_variant_id: number
  product_variant_unit_id: number
  quantity: number
  expiration_date: string
  expiration_status: ExpirationStatus
  days_until_expiry: number
  inventory_status: InventoryStatus
  product_name: string | null
  packing: string | null
  unit_name: string | null
  image_url: string | null
  created_date: string
  updated_date: string
}

export type CabinetOverview = {
  cabinet: Cabinet
  counts: {
    total: number
    expired: number
    expiring_soon: number
    expiring: number
    in_stock: number
    out_of_stock: number
  }
  expired: CabinetItem[]
  expiring_soon: CabinetItem[]
}

export type CreateCabinetItemPayload = {
  cabinet: number
  product_variant_id: number
  product_variant_unit_id: number
  quantity: number
  expiration_date: string
}

export function listCabinets() {
  return apiGet<Cabinet[]>('/cabinets/')
}

export function createCabinet(name: string) {
  return apiPost<Cabinet>('/cabinets/', { name })
}

export function updateCabinet(id: number, name: string) {
  return apiPatch<Cabinet>(`/cabinets/${id}/`, { name })
}

export function deleteCabinet(id: number) {
  return apiDelete<void>(`/cabinets/${id}/`)
}

export function getCabinetOverview(id: number) {
  return apiGet<CabinetOverview>(`/cabinets/${id}/overview/`)
}

export function listCabinetItems(cabinetId: number, expirationStatus?: ExpirationStatus) {
  const qs = new URLSearchParams({ cabinet: String(cabinetId) })
  if (expirationStatus) qs.set('expiration_status', expirationStatus)
  return apiGet<CabinetItem[]>(`/cabinet-items/?${qs.toString()}`)
}

export function createCabinetItem(payload: CreateCabinetItemPayload) {
  return apiPost<CabinetItem>('/cabinet-items/', payload)
}

export function updateCabinetItem(
  id: number,
  payload: Partial<Pick<CabinetItem, 'quantity' | 'expiration_date'>>
) {
  return apiPatch<CabinetItem>(`/cabinet-items/${id}/`, payload)
}

export function deleteCabinetItem(id: number) {
  return apiDelete<void>(`/cabinet-items/${id}/`)
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.error || response.data === undefined) {
    throw new Error(response.error || 'Request failed')
  }
  return response.data
}
