'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ProductCard } from '@/components/cards/ProductCard'
import {
  Product,
  ProductFilters,
  FilterGroup,
  buildProductCardPayload,
  getListProductKey,
} from '@/lib/services/products'
import { Container } from '@/components/Container'
import { ProductSortAndView } from '@/components/catalog/_shared/listing/ProductSortAndView'
import { LoadMoreProductsButton } from '@/components/catalog/_shared/listing/LoadMoreProductsButton'
import { SearchResultsSkeleton } from '@/components/catalog/search/SearchResultsSkeleton'
import Breadcrumb, { CrumbItem } from '@/components/Breadcrumb'
import { SearchKeywordItem } from '@/lib/services/searchTerms'
import { CategoryListingSidebar } from '@/components/catalog/category-listing/parts/CategoryListingSidebar'
import { CategoryListingMobileFilters } from '@/components/catalog/category-listing/parts/CategoryListingMobileFilters'
import {
  ActiveFilters,
  countActiveFacetFilters,
  stripFacetFilters,
} from '@/components/catalog/_shared/filters/ActiveFilters'
import { BackdropLoading } from '@/components/BackdropLoading'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

interface SearchResultsContentProps {
  query: string
  products: Product[]
  totalCount: number
  loading: boolean
  /** Filter/sort refetch — keep prior grid, show backdrop until settled. */
  isRefreshing?: boolean
  isFetchingMore?: boolean
  filtersLoading?: boolean
  error: Error | null
  sortOption: SortOption
  facetFilters?: FilterGroup[]
  activeFilters: ProductFilters
  onSortChange: (sort: SortOption) => void
  onFiltersChange: (filters: ProductFilters) => void
  onLoadMore: () => void
  popularTerms?: SearchKeywordItem[]
}

export function SearchResultsContent({
  query,
  products,
  totalCount,
  loading,
  isRefreshing = false,
  isFetchingMore = false,
  filtersLoading = false,
  error,
  sortOption,
  facetFilters,
  activeFilters,
  onSortChange,
  onFiltersChange,
  onLoadMore,
  popularTerms = [],
}: SearchResultsContentProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const breadcrumbItems: CrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tìm kiếm', href: '/tim-kiem' },
    ...(query ? [{ label: `"${query}"` }] : []),
  ]

  const remainingCount = Math.max(0, totalCount - products.length)
  const hasMore = remainingCount > 0 && products.length > 0
  const activeFacetCount = countActiveFacetFilters(activeFilters)

  if (!query.trim()) {
    return (
      <Container className="py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="py-12 text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">Tìm kiếm sản phẩm</h1>
          <p className="mb-6 text-gray-600">Nhập từ khóa vào ô tìm kiếm ở trên để xem kết quả.</p>
          {popularTerms.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              <span className="mb-2 w-full text-sm text-gray-500">Tìm kiếm phổ biến:</span>
              {popularTerms.map((item) => (
                <Link
                  key={item.id}
                  href={`/tim-kiem?q=${encodeURIComponent(item.keyword)}`}
                  className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
                >
                  {item.keyword}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    )
  }

  if (loading) {
    return <SearchResultsSkeleton breadcrumbItems={breadcrumbItems} />
  }

  if (error) {
    return (
      <Container className="py-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 text-center text-gray-600">
          Đã xảy ra lỗi khi tải kết quả. Vui lòng thử lại.
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <CategoryListingSidebar
          facetFilters={facetFilters}
          filtersLoading={filtersLoading}
          categoryFilters={activeFilters}
          onFiltersChange={onFiltersChange}
        />

        <CategoryListingMobileFilters
          open={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          facetFilters={facetFilters}
          filtersLoading={filtersLoading}
          categoryFilters={activeFilters}
          onFiltersChange={onFiltersChange}
        />

        <main className="min-w-0 flex-1">
          <ProductSortAndView
            sortOption={sortOption}
            onSortChange={onSortChange}
            productCount={totalCount}
            onOpenFilters={() => setShowMobileFilters(true)}
            activeFacetCount={activeFacetCount}
            notice={
              <p className="text-xs leading-relaxed text-gray-400">
                <b>Lưu ý: </b>Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
              </p>
            }
          />

          {facetFilters && facetFilters.length > 0 ? (
            <ActiveFilters
              activeFilters={activeFilters}
              filterGroups={facetFilters}
              onRemoveFilter={(filterKey) => {
                const next = { ...activeFilters }
                delete next[filterKey as keyof ProductFilters]
                onFiltersChange(next)
              }}
              onClearAll={() => onFiltersChange(stripFacetFilters(activeFilters))}
            />
          ) : null}

          {products.length === 0 && !isRefreshing ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="mb-2 text-gray-600">
                Không tìm thấy sản phẩm nào cho &quot;{query}&quot;.
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Thử từ khóa khác, bỏ bớt bộ lọc, hoặc xem gợi ý bên dưới.
              </p>
              {popularTerms.length > 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {popularTerms.slice(0, 6).map((item) => (
                    <Link
                      key={item.id}
                      href={`/tim-kiem?q=${encodeURIComponent(item.keyword)}`}
                      className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      {item.keyword}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={getListProductKey(product)}
                  product={buildProductCardPayload(product)}
                />
              ))}
            </div>
          )}

          {hasMore && !isRefreshing ? (
            <LoadMoreProductsButton
              remainingCount={remainingCount}
              onLoadMore={onLoadMore}
              loading={isFetchingMore}
            />
          ) : null}
        </main>
      </div>

      <BackdropLoading
        isOpen={isRefreshing}
        loadingText="Đang lọc sản phẩm…"
        lockScroll={false}
        opacity={0.45}
        size="md"
      />
    </Container>
  )
}
