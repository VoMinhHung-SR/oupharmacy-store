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

function parsePromoPercent(raw: string | null): number | undefined {
  if (!raw) return undefined
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 10 || n > 35) return undefined
  return n
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const brandFromUrl = (searchParams.get('brand') || '').trim()
  const promoPercent = parsePromoPercent(searchParams.get('promo'))

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [sortOption, setSortOption] = useState<SortOption>('bestselling')
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({})
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])
  const { data: popularTerms = [] } = usePopularSearchTerms(20)

  const browseEnabled = Boolean(q) || Boolean(brandFromUrl)

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
    setAccumulatedProducts([])
    const nextFilters: ProductFilters = {}
    if (brandFromUrl) nextFilters.brand = brandFromUrl
    setActiveFilters(nextFilters)
  }, [q, brandFromUrl])

  const facetParams = useMemo(() => pickFacetSearchParams(activeFilters), [activeFilters])

  const searchParamsApi = useMemo(
    () =>
      browseEnabled
        ? {
            q: q || '',
            page,
            page_size: PAGINATION.DEFAULT_PAGE_SIZE,
            sort: sortOptionToStoreSearchSort(sortOption),
            category: facetParams.category,
            brand: facetParams.brand || brandFromUrl || undefined,
            origin_country: facetParams.origin_country,
            price_range: facetParams.price_range,
            in_stock: facetParams.in_stock,
            attrs: facetParams.attrs.length ? facetParams.attrs : undefined,
            include_facets: true,
          }
        : undefined,
    [browseEnabled, q, page, sortOption, facetParams, brandFromUrl]
  )

  const { data, isLoading, isFetching, isPlaceholderData, dataUpdatedAt, error } = useStoreSearch(
    searchParamsApi,
    { enabled: browseEnabled }
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
    facetParams.category != null ||
    facetParams.brand != null ||
    facetParams.origin_country != null ||
    facetParams.price_range != null ||
    facetParams.in_stock != null ||
    facetParams.attrs.length > 0

  const facetFilters = usePreservedSearchFacets(data?.facets, {
    scopeKey: `${q}|${brandFromUrl}`,
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
    enabled: browseEnabled,
  })

  const handleFiltersChange = (next: ProductFilters) => {
    const { page: _p, page_size: _ps, ordering: _o, price_sort: _psort, ...rest } = next
    setActiveFilters(rest)
    setPage(PAGINATION.DEFAULT_PAGE)
  }

  const displayQuery =
    q ||
    (brandFromUrl
      ? facetFilters
          ?.find((g) => g.id === 'brand')
          ?.options.find((o) => String(o.value) === brandFromUrl)?.label || 'Thương hiệu'
      : '')

  return (
    <SearchResultsContent
      query={displayQuery}
      brandCampaignPromo={promoPercent}
      allowEmptyQuery={Boolean(brandFromUrl)}
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
