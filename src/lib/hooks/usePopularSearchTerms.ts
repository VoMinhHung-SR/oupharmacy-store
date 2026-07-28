'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getPopularSearchTerms,
  type SearchKeywordItem,
} from '@/lib/services/searchTerms'

export function usePopularSearchTerms(limit = 20) {
  return useQuery<SearchKeywordItem[]>({
    queryKey: ['popular-search-terms', limit],
    queryFn: async () => {
      const res = await getPopularSearchTerms(limit)
      return Array.isArray(res.data) ? res.data : []
    },
    staleTime: 5 * 60_000,
  })
}
