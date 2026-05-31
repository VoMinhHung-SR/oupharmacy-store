'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  searchStoreProducts,
  type StoreSearchParams,
  type StoreSearchResponse,
} from '@/lib/services/search'
import { HEADER_SEARCH } from '@/lib/constant'

export function useStoreSearch(
  params: StoreSearchParams | undefined,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled !== false && !!params?.q?.trim()

  return useQuery<StoreSearchResponse | undefined, Error>({
    queryKey: ['store-search', params],
    queryFn: async () => {
      if (!params?.q?.trim()) {
        throw new Error('Search query is required')
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
