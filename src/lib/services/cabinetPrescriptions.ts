import { apiGet } from '@/lib/api'
import { unwrap } from '@/lib/services/cabinet'

export type CabinetPrescriptionLine = {
  id: number
  prescribing_id: number
  prescribed_at: string | null
  diagnosis_label: string | null
  quantity: number
  uses: string
  product_variant_id: number | null
  product_variant_unit_id: number | null
  item_name: string | null
  unit_name: string | null
  packing: string | null
  image_url: string | null
  variant_available: boolean
}

export async function listCabinetPrescriptionLines() {
  return unwrap(await apiGet<CabinetPrescriptionLine[]>('/cabinet-prescription-lines/'))
}
