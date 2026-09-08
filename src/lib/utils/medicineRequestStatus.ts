import type { MedicineRequestStatus } from '@/lib/services/medicineRequests'

export const MEDICINE_REQUEST_STATUS_MAP: Record<
  MedicineRequestStatus,
  { label: string; color: string }
> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  CONTACTED: { label: 'Đã liên hệ', color: 'bg-purple-100 text-purple-800' },
  CLOSED: { label: 'Đã đóng', color: 'bg-slate-100 text-slate-700' },
}

export function formatMedicineRequestDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
