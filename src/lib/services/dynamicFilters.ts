import { apiGet, ApiResponse } from '../api'
import { DynamicFiltersResponse } from './products'

export async function getDynamicFilters(
  categorySlug: string,
  options?: {
    include_variants?: boolean
    include_counts?: boolean
  }
): Promise<ApiResponse<DynamicFiltersResponse>> {
  const params = new URLSearchParams()
  
  // Only append defined options to avoid unnecessary params
  if (options?.include_variants !== undefined) {
    params.append('include_variants', String(options.include_variants))
  }
  if (options?.include_counts !== undefined) {
    params.append('include_counts', String(options.include_counts))
  }
  
  const queryString = params.toString()
  const path = `/dynamic-filters/${categorySlug}${queryString ? `?${queryString}` : ''}`
  
  return apiGet<DynamicFiltersResponse>(path)
}
