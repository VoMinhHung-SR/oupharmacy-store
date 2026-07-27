'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPopularSearchTerms } from '@/lib/services/searchTerms'
import { recordSearch } from '@/lib/services/searchTerms'
import { sortOptionToStoreSearchSort } from '@/lib/services/search'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import { SearchResultsContent } from '@/components/catalog'
import { PAGINATION } from '@/lib/constant'
import { getListProductKey, type Product } from '@/lib/services/products'
import type { SearchKeywordItem } from '@/lib/services/searchTerms'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

function mergeUniqueProducts(existing: Product[], incoming: Product[]): Product[] {
  if (incoming.length === 0) return existing
  const seen = new Set(existing.map(getListProductKey))
  const next = incoming.filter((item) => {
    const key = getListProductKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return next.length === 0 ? existing : [...existing, ...next]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [sortOption, setSortOption] = useState<SortOption>('bestselling')
  const [popularTerms, setPopularTerms] = useState<SearchKeywordItem[]>([])
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
    setAccumulatedProducts([])
  }, [q])

  const searchParamsApi = useMemo(
    () =>
      q
        ? {
            q,
            page,
            page_size: PAGINATION.DEFAULT_PAGE_SIZE,
            sort: sortOptionToStoreSearchSort(sortOption),
            in_stock: true,
          }
        : undefined,
    [q, page, sortOption]
  )

  const { data, isLoading, isFetching, isPlaceholderData, dataUpdatedAt, error } = useStoreSearch(
    searchParamsApi,
    { enabled: !!q }
  )

  useEffect(() => {
    if (!data) return
    if (isPlaceholderData) return
    const items = data.items ?? []
    if (page <= 1) {
      setAccumulatedProducts(items)
      return
    }
    setAccumulatedProducts((prev) => mergeUniqueProducts(prev, items))
  }, [data, dataUpdatedAt, isPlaceholderData, page])

  useEffect(() => {
    if (!q) return
    recordSearch(q).then(() => {})
  }, [q])

  useEffect(() => {
    getPopularSearchTerms(20).then((res) => {
      if (res.data && Array.isArray(res.data)) setPopularTerms(res.data)
    })
  }, [])

  const isInitialLoad = isLoading && accumulatedProducts.length === 0 && !data
  const isFetchingMore = page > 1 && isFetching

  return (
    <SearchResultsContent
      query={q}
      products={accumulatedProducts}
      totalCount={data?.meta.total ?? 0}
      loading={isInitialLoad}
      isFetchingMore={isFetchingMore}
      error={error}
      page={page}
      pageSize={PAGINATION.DEFAULT_PAGE_SIZE}
      sortOption={sortOption}
      onSortChange={(sort) => {
        setSortOption(sort)
        setPage(PAGINATION.DEFAULT_PAGE)
      }}
      onLoadMore={() => setPage((p) => p + 1)}
      popularTerms={popularTerms}
    />
  )
}
