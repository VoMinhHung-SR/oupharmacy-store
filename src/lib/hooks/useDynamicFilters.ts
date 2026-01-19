import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getDynamicFilters } from '../services/dynamicFilters'
import { DynamicFiltersResponse } from '../services/products'

interface UseDynamicFiltersOptions {
  include_variants?: boolean
  include_counts?: boolean
}

/**
 * Hook to fetch dynamic filters for a category
 * Provides caching, error handling, and loading states
 * @param categorySlug - The category slug to fetch filters for
 * @param options - Optional parameters (include_variants, include_counts)
 * @param enabled - Whether the query should run (default: true)
 */
export function useDynamicFilters(
  categorySlug: string | undefined,
  options?: UseDynamicFiltersOptions,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['dynamic-filters', categorySlug, options?.include_variants, options?.include_counts],
    queryFn: async () => {
      if (!categorySlug) {
        throw new Error('Category slug is required')
      }
      const response = await getDynamicFilters(categorySlug, options)
      if (response.error) {
        throw new Error(`Failed to load filters: ${response.error}`)
      }
      return response.data
    },
    enabled: !!categorySlug && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - filters don't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes - cache for longer
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
