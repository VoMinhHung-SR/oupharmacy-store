import { useQuery } from '@tanstack/react-query'
import { getBrands, getBrand, Brand } from '../services/brands'

export function useBrands() {
  return useQuery<Brand[] | undefined, Error>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await getBrands()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

export function useBrand(id: number) {
  return useQuery<Brand | undefined, Error>({
    queryKey: ['brand', id],
    queryFn: async () => {
      const response = await getBrand(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!id,
  })
}

