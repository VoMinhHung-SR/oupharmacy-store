'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/cards/ProductCard'
import { Product, ProductFilters } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { ProductSortAndView, ProductListView } from '@/components/products'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'
import { Pagination } from '@/components/Pagination'
import { PAGINATION, PRODUCT_LISTING, PRICE_CONSULT } from '@/lib/constant'
import { SearchKeywordItem } from '@/lib/services/searchTerms'

type SortOption = 'bestselling' | 'price-low' | 'price-high'
type ViewMode = 'grid' | 'list'

interface SearchResultsContentProps {
  query: string
  products: Product[]
  totalCount: number
  loading: boolean
  error: Error | null
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  popularTerms?: SearchKeywordItem[]
}

export function SearchResultsContent({
  query,
  products,
  totalCount,
  loading,
  error,
  filters,
  onFiltersChange,
  popularTerms = [],
}: SearchResultsContentProps) {
  const [sortOption, setSortOption] = useState<SortOption>(PRODUCT_LISTING.DEFAULT_SORT)
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)

  const sortedProducts = useMemo(() => {
    if (!products.length) return products
    if (filters.ordering) return products
    const sorted = [...products]
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price_value || 0) - (b.price_value || 0))
      case 'price-high':
        return sorted.sort((a, b) => (b.price_value || 0) - (a.price_value || 0))
      default:
        return sorted
    }
  }, [products, sortOption, filters.ordering])

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
    const newFilters = { ...filters }
    if (sort === 'price-low') {
      newFilters.price_sort = 'asc'
      newFilters.ordering = 'price_value'
    } else if (sort === 'price-high') {
      newFilters.price_sort = 'desc'
      newFilters.ordering = '-price_value'
    } else {
      delete newFilters.price_sort
      delete newFilters.ordering
    }
    newFilters.page = PAGINATION.DEFAULT_PAGE
    onFiltersChange(newFilters)
  }

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page })
  }

  const currentPage = filters.page ?? PAGINATION.DEFAULT_PAGE
  const pageSize = filters.page_size ?? PAGINATION.DEFAULT_PAGE_SIZE
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
          onSortChange={handleSortChange}
          onViewModeChange={setViewMode}
          productCount={totalCount}
        />
        <h2 className="text-lg text-gray-700 mb-4">
          Tìm kiếm theo: <span className="font-medium text-gray-900">Sản phẩm</span>
        </h2>
      </div>

      {sortedProducts.length === 0 ? (
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
          {sortedProducts.map((product) => {
            const productCategorySlug = product.category_info?.categorySlug ||
              (product.category_info?.category?.length
                ? product.category_info.category.map((cat) => cat.slug).join('/')
                : '')
            const productMedicineSlug = product.medicine?.slug ||
              (product.medicine?.name
                ? product.medicine.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                : undefined)
            const productName = product.medicine?.name || product.medicine?.web_name || 'Sản phẩm'
            const priceDisplay = product.price_display || PRICE_CONSULT
            const productImageUrl = product.image_url || product.images?.[0]
            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id.toString(),
                  name: productName,
                  price_display: priceDisplay,
                  price: product.price_value || 0,
                  image_url: productImageUrl,
                  packaging: product.package_size,
                  medicine_unit_id: product.id,
                  category_slug: productCategorySlug,
                  medicine_slug: productMedicineSlug,
                  in_stock: product.in_stock,
                }}
              />
            )
          })}
        </div>
      ) : (
        <ProductListView products={sortedProducts} />
      )}

      {sortedProducts.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Container>
  )
}
