'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPopularSearchTerms } from '@/lib/services/searchTerms'
import { recordSearch } from '@/lib/services/searchTerms'
import { sortOptionToStoreSearchSort } from '@/lib/services/search'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import { SearchResultsContent } from '@/components/catalog'
import { PAGINATION } from '@/lib/constant'
import type { SearchKeywordItem } from '@/lib/services/searchTerms'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [sortOption, setSortOption] = useState<SortOption>('bestselling')
  const [popularTerms, setPopularTerms] = useState<SearchKeywordItem[]>([])

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
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

  const { data, isLoading, error } = useStoreSearch(searchParamsApi, { enabled: !!q })

  useEffect(() => {
    if (!q) return
    recordSearch(q).then(() => {})
  }, [q])

  useEffect(() => {
    getPopularSearchTerms(20).then((res) => {
      if (res.data && Array.isArray(res.data)) setPopularTerms(res.data)
    })
  }, [])

  return (
    <SearchResultsContent
      query={q}
      products={data?.items ?? []}
      totalCount={data?.meta.total ?? 0}
      loading={isLoading}
      error={error}
      page={page}
      pageSize={PAGINATION.DEFAULT_PAGE_SIZE}
      sortOption={sortOption}
      onSortChange={(sort) => {
        setSortOption(sort)
        setPage(PAGINATION.DEFAULT_PAGE)
      }}
      onPageChange={setPage}
      popularTerms={popularTerms}
    />
  )
}
