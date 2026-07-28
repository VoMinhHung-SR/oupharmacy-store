'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { recordSearch } from '@/lib/services/searchTerms'
import { sortOptionToStoreSearchSort } from '@/lib/services/search'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import { usePreservedSearchFacets } from '@/lib/hooks/usePreservedSearchFacets'
import { usePopularSearchTerms } from '@/lib/hooks/usePopularSearchTerms'
import { SearchResultsContent } from '@/components/catalog'
import { PAGINATION } from '@/lib/constant'
import { mergeUniqueProducts, type Product, type ProductFilters } from '@/lib/services/products'
import { pickFacetSearchParams } from '@/lib/listing/facetSearchParams'
import { getListingRequestUiFlags } from '@/lib/listing/getListingRequestUiFlags'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [sortOption, setSortOption] = useState<SortOption>('bestselling')
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({})
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])
  const { data: popularTerms = [] } = usePopularSearchTerms(20)

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
    setAccumulatedProducts([])
    setActiveFilters({})
  }, [q])

  const facetParams = useMemo(() => pickFacetSearchParams(activeFilters), [activeFilters])

  const searchParamsApi = useMemo(
    () =>
      q
        ? {
            q,
            page,
            page_size: PAGINATION.DEFAULT_PAGE_SIZE,
            sort: sortOptionToStoreSearchSort(sortOption),
            brand: facetParams.brand,
            price_range: facetParams.price_range,
            in_stock: facetParams.in_stock,
            include_facets: true,
          }
        : undefined,
    [q, page, sortOption, facetParams]
  )

  const { data, isLoading, isFetching, isPlaceholderData, dataUpdatedAt, error } = useStoreSearch(
    searchParamsApi,
    { enabled: !!q }
  )

  useEffect(() => {
    if (!data || isPlaceholderData) return
    const items = data.items ?? []
    if (page <= 1) {
      setAccumulatedProducts(items)
      return
    }
    setAccumulatedProducts((prev) => mergeUniqueProducts(prev, items))
  }, [data, dataUpdatedAt, isPlaceholderData, page])

  useEffect(() => {
    if (!q) return
    void recordSearch(q)
  }, [q])

  const hasActiveFacetFilters =
    facetParams.brand != null ||
    facetParams.price_range != null ||
    facetParams.in_stock != null

  const facetFilters = usePreservedSearchFacets(data?.facets, {
    scopeKey: q,
    hasActiveFacetFilters,
    isPlaceholderData,
    dataUpdatedAt,
  })

  const { isInitialLoad, isRefreshing, isFetchingMore } = getListingRequestUiFlags({
    page,
    productCount: accumulatedProducts.length,
    hasData: !!data,
    isLoading,
    isFetching,
    isPlaceholderData,
    enabled: !!q,
  })

  const handleFiltersChange = (next: ProductFilters) => {
    const { category: _c, page: _p, page_size: _ps, ordering: _o, price_sort: _psort, ...rest } =
      next
    setActiveFilters(rest)
    setPage(PAGINATION.DEFAULT_PAGE)
  }

  return (
    <SearchResultsContent
      query={q}
      products={accumulatedProducts}
      totalCount={data?.meta.total ?? 0}
      loading={isInitialLoad}
      isRefreshing={isRefreshing}
      isFetchingMore={isFetchingMore}
      filtersLoading={isLoading && !data}
      error={error}
      sortOption={sortOption}
      facetFilters={facetFilters}
      activeFilters={activeFilters}
      onSortChange={(sort) => {
        setSortOption(sort)
        setPage(PAGINATION.DEFAULT_PAGE)
      }}
      onFiltersChange={handleFiltersChange}
      onLoadMore={() => setPage((p) => p + 1)}
      popularTerms={popularTerms}
    />
  )
}
