'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  mapSearchFacetsToFilterGroups,
  mergeFilterGroupsPreserveOptions,
  type StoreSearchFacets,
} from '@/lib/services/search'
import type { FilterGroup } from '@/lib/services/products'

type UsePreservedSearchFacetsOptions = {
  /** Reset base facets when query/category changes (e.g. q or categoryId). */
  scopeKey: string | number | null | undefined
  hasActiveFacetFilters: boolean
  isPlaceholderData?: boolean
  dataUpdatedAt?: number
}

/**
 * Freeze facet option lists from the last unfiltered response for the current
 * scope, then merge counts from filtered responses so options stay visible.
 */
export function usePreservedSearchFacets(
  facets: StoreSearchFacets | null | undefined,
  {
    scopeKey,
    hasActiveFacetFilters,
    isPlaceholderData = false,
    dataUpdatedAt,
  }: UsePreservedSearchFacetsOptions
): FilterGroup[] {
  const [baseFacetGroups, setBaseFacetGroups] = useState<FilterGroup[]>([])

  useEffect(() => {
    setBaseFacetGroups([])
  }, [scopeKey])

  useEffect(() => {
    if (!facets || isPlaceholderData) return
    if (hasActiveFacetFilters) return
    setBaseFacetGroups(mapSearchFacetsToFilterGroups(facets))
  }, [facets, dataUpdatedAt, isPlaceholderData, hasActiveFacetFilters])

  return useMemo(
    () =>
      mergeFilterGroupsPreserveOptions(
        baseFacetGroups,
        mapSearchFacetsToFilterGroups(facets)
      ),
    [baseFacetGroups, facets]
  )
}
