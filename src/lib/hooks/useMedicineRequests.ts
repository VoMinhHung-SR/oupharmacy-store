import { useQuery } from '@tanstack/react-query'
import {
  getMedicineRequest,
  listMedicineRequests,
  type MedicineRequestLead,
} from '@/lib/services/medicineRequests'

export function useMedicineRequests(enabled: boolean) {
  return useQuery<MedicineRequestLead[], Error>({
    queryKey: ['medicine-requests'],
    queryFn: async () => {
      const res = await listMedicineRequests()
      if (res.error) throw new Error(res.error)
      return res.data || []
    },
    enabled,
  })
}

export function useMedicineRequest(id: number | null, enabled: boolean) {
  return useQuery<MedicineRequestLead | undefined, Error>({
    queryKey: ['medicine-request', id],
    queryFn: async () => {
      if (!id) return undefined
      const res = await getMedicineRequest(id)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    enabled: enabled && !!id,
  })
}
