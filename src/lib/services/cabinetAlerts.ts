import { apiGet, apiPost, type ApiResponse } from '@/lib/api'

export type CabinetAlertKind = 'EXPIRED' | 'EXPIRING_SOON'

export type CabinetAlert = {
  id: number
  cabinet_item_id: number | null
  kind: CabinetAlertKind
  title: string
  body: string
  is_read: boolean
  read_at: string | null
  created_date: string
  updated_date: string
}

export function listCabinetAlerts(unreadOnly = false) {
  const path = unreadOnly ? '/cabinet-alerts/?unread=1' : '/cabinet-alerts/'
  return apiGet<CabinetAlert[]>(path)
}

export function markCabinetAlertRead(id: number) {
  return apiPost<CabinetAlert>(`/cabinet-alerts/${id}/mark-read/`, {})
}

export function markAllCabinetAlertsRead() {
  return apiPost<{ updated: number }>('/cabinet-alerts/mark-all-read/', {})
}

export function unwrapAlert<T>(response: ApiResponse<T>): T {
  if (response.error || response.data === undefined) {
    throw new Error(response.error || 'Request failed')
  }
  return response.data
}
