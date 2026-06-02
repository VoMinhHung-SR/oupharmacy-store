'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/cards/ProductCard'
import { Product, buildProductCardPayload, getListProductKey } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { ProductSortAndView, ProductListView } from '@/components/products'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'
import { Pagination } from '@/components/Pagination'
import { PRODUCT_LISTING } from '@/lib/constant'
import { SearchKeywordItem } from '@/lib/services/searchTerms'

type SortOption = 'bestselling' | 'price-low' | 'price-high'
type ViewMode = 'grid' | 'list'

interface SearchResultsContentProps {
  query: string
  products: Product[]
  totalCount: number
  loading: boolean
  error: Error | null
  page: number
  pageSize: number
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  onPageChange: (page: number) => void
  popularTerms?: SearchKeywordItem[]
}

export function SearchResultsContent({
  query,
  products,
  totalCount,
  loading,
  error,
  page,
  pageSize,
  sortOption,
  onSortChange,
  onPageChange,
  popularTerms = [],
}: SearchResultsContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const breadcrumbItems: CrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tìm kiếm', href: '/tim-kiem' },
    ...(query ? [{ label: `"${query}"` }] : []),
  ]

  if (!query.trim()) {
    return (
      <Container className="py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 text-center py-12">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Tìm kiếm sản phẩm</h1>
          <p className="text-gray-600 mb-6">Nhập từ khóa vào ô tìm kiếm ở trên để xem kết quả.</p>
          {popularTerms.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-500 w-full mb-2">Tìm kiếm phổ biến:</span>
              {popularTerms.map((item) => (
                <Link
                  key={item.id}
                  href={`/tim-kiem?q=${encodeURIComponent(item.keyword)}`}
                  className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium"
                >
                  {item.keyword}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container className="py-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-4 h-8 w-48 animate-pulse rounded bg-gray-200 mb-6" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 text-center text-gray-600">Đã xảy ra lỗi khi tải kết quả. Vui lòng thử lại.</div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mt-4">
        <ProductSortAndView
          sortOption={sortOption}
          viewMode={viewMode}
          onSortChange={onSortChange}
          onViewModeChange={setViewMode}
          productCount={totalCount}
        />
        <h2 className="text-lg text-gray-700 mb-4">
          Tìm kiếm theo: <span className="font-medium text-gray-900">Sản phẩm</span>
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-600">
          Không tìm thấy sản phẩm nào cho &quot;{query}&quot;. Thử từ khóa khác hoặc xem gợi ý bên dưới.
          {popularTerms.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {popularTerms.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/tim-kiem?q=${encodeURIComponent(item.keyword)}`}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                >
                  {item.keyword}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            return (
              <ProductCard
                key={getListProductKey(product)}
                product={buildProductCardPayload(product)}
              />
            )
          })}
        </div>
      ) : (
        <ProductListView products={products} />
      )}

      {products.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Container>
  )
}
