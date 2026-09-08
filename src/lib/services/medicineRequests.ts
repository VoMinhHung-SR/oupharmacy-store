import { apiGet, apiPost, type ApiResponse } from '@/lib/api'
import type { SelectedMedicine } from '@/components/medicine-request/types'

export const MEDICINE_REQUESTS_PATH = '/medicine-requests/'

export type MedicineRequestStatus = 'PENDING' | 'IN_PROGRESS' | 'CONTACTED' | 'CLOSED'

export type MedicineRequestItem = {
  product_id: number
  product_name: string
  quantity: number
}

export type MedicineRequestLead = {
  id: number
  full_name: string
  phone: string
  email?: string
  note?: string
  items_json?: MedicineRequestItem[]
  item_count: number
  status: MedicineRequestStatus
  prescription_image_url?: string | null
  created_date: string
  updated_date?: string
  notification_id?: number | null
}

export type CreateMedicineRequestInput = {
  fullName: string
  phone: string
  email?: string
  note?: string
  items: SelectedMedicine[]
  prescriptionImage?: File | null
}

const MAX_PRESCRIPTION_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])

export function validatePrescriptionImage(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Ảnh đơn chỉ chấp nhận JPEG, PNG, WEBP hoặc GIF.'
  }
  if (file.size > MAX_PRESCRIPTION_BYTES) {
    return 'Ảnh đơn không được vượt quá 5MB.'
  }
  return null
}

export async function createMedicineRequest(
  input: CreateMedicineRequestInput
): Promise<ApiResponse<MedicineRequestLead>> {
  const form = new FormData()
  form.append('full_name', input.fullName.trim())
  form.append('phone', input.phone.trim())
  if (input.email?.trim()) form.append('email', input.email.trim())
  if (input.note?.trim()) form.append('note', input.note.trim())
  form.append(
    'items_json',
    JSON.stringify(
      input.items.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
      }))
    )
  )
  if (input.prescriptionImage) {
    form.append('prescription_image', input.prescriptionImage)
  }
  return apiPost<MedicineRequestLead>(MEDICINE_REQUESTS_PATH, form)
}

export async function listMedicineRequests(): Promise<ApiResponse<MedicineRequestLead[]>> {
  return apiGet<MedicineRequestLead[]>(MEDICINE_REQUESTS_PATH)
}

export async function getMedicineRequest(
  id: number
): Promise<ApiResponse<MedicineRequestLead>> {
  return apiGet<MedicineRequestLead>(`${MEDICINE_REQUESTS_PATH}${id}/`)
}
