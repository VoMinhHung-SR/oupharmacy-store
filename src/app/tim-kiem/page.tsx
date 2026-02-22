'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/lib/hooks/useProducts'
import { getPopularSearchTerms } from '@/lib/services/searchTerms'
import { recordSearch } from '@/lib/services/searchTerms'
import { ProductFilters } from '@/lib/services/products'
import { SearchResultsContent } from '@/components/products'
import { PAGINATION } from '@/lib/constant'
import type { SearchKeywordItem } from '@/lib/services/searchTerms'

export default function TimKiemPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()

  const [filters, setFilters] = useState<ProductFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    page_size: PAGINATION.DEFAULT_PAGE_SIZE,
    ...(q ? { search: q } : {}),
  })
  const [popularTerms, setPopularTerms] = useState<SearchKeywordItem[]>([])

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: q || undefined,
      page: PAGINATION.DEFAULT_PAGE,
    }))
  }, [q])

  const shouldFetch = !!q.trim()
  const { data, isLoading, error } = useProducts(filters, { enabled: shouldFetch })

  useEffect(() => {
    if (!q) return
    recordSearch(q).then(() => {})
  }, [q])

  useEffect(() => {
    getPopularSearchTerms(20).then((res) => {
      if (res.data && Array.isArray(res.data)) setPopularTerms(res.data)
    })
  }, [])

  const products = data?.results ?? []
  const totalCount = data?.count ?? 0
  const loading = isLoading

  return (
    <SearchResultsContent
      query={q}
      products={products}
      totalCount={totalCount}
      loading={loading}
      error={error}
      filters={filters}
      onFiltersChange={setFilters}
      popularTerms={popularTerms}
    />
  )
}
