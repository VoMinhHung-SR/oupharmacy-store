import { useQuery } from '@tanstack/react-query'
import { getDynamicFilters } from '../services/dynamicFilters'

export function useDynamicFilters(
  categorySlug: string | undefined,
  options?: {
    include_variants?: boolean
    include_counts?: boolean
  },
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['dynamic-filters', categorySlug, options],
    queryFn: async () => {
      if (!categorySlug) {
        throw new Error('Category slug is required')
      }
      const response = await getDynamicFilters(categorySlug, options)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!categorySlug && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
