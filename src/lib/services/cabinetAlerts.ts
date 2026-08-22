import { apiGet, apiPost } from '@/lib/api'
import { unwrap } from '@/lib/services/cabinet'

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

export async function listCabinetAlerts(unreadOnly = false) {
  const path = unreadOnly ? '/cabinet-alerts/?unread=1' : '/cabinet-alerts/'
  return unwrap(await apiGet<CabinetAlert[]>(path))
}

export async function markCabinetAlertRead(id: number) {
  return unwrap(await apiPost<CabinetAlert>(`/cabinet-alerts/${id}/mark-read/`, {}))
}

export async function markAllCabinetAlertsRead() {
  return unwrap(await apiPost<{ updated: number }>('/cabinet-alerts/mark-all-read/', {}))
}
