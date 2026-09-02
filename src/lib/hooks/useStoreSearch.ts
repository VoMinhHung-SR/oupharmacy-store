'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  searchStoreProducts,
  type StoreSearchParams,
  type StoreSearchResponse,
} from '@/lib/services/search'
import { HEADER_SEARCH } from '@/lib/constant'

/**
 * Store search / category / brand browse via GET /api/store/search/.
 * Enabled when `q` is non-empty, or `category` / `brand` is set.
 */
export function useStoreSearch(
  params: StoreSearchParams | undefined,
  options?: { enabled?: boolean }
) {
  const hasQuery = !!params?.q?.trim()
  const hasCategory = params?.category != null && params.category !== ''
  const hasBrand = params?.brand != null && String(params.brand).trim() !== ''
  const enabled =
    options?.enabled !== false && (!!params && (hasQuery || hasCategory || hasBrand))

  return useQuery<StoreSearchResponse | undefined, Error>({
    queryKey: ['store-search', params],
    queryFn: async () => {
      if (!params) {
        throw new Error('Search params are required')
      }
      const qOk = !!params.q?.trim()
      const catOk = params.category != null && params.category !== ''
      const brandOk = params.brand != null && String(params.brand).trim() !== ''
      if (!qOk && !catOk && !brandOk) {
        throw new Error('Search query, category, or brand is required')
      }
      const response = await searchStoreProducts(params)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled,
    staleTime: HEADER_SEARCH.SUGGEST_STALE_MS,
    placeholderData: keepPreviousData,
  })
}
