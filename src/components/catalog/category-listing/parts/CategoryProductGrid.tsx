'use client'

import { useMemo } from 'react'
import { ProductCard } from '@/components/cards/ProductCard'
import {
  Product,
  ProductFilters,
  FilterGroup,
  buildProductCardPayload,
  getListProductKey,
} from '@/lib/services/products'
import { ProductSortAndView } from '@/components/catalog/_shared/listing/ProductSortAndView'
import {
  ActiveFilters,
  NON_FACET_FILTER_KEYS,
  stripFacetFilters,
} from '@/components/catalog/_shared/filters/ActiveFilters'
import { Pagination } from '@/components/Pagination'
import { PAGINATION } from '@/lib/constant'
import { CategorySortOption } from '@/components/catalog/category-listing/useCategoryListingPage'

interface CategoryProductGridProps {
  categorySlug: string
  products: Product[]
  totalCount: number
  sortOption: CategorySortOption
  categoryFilters: Omit<ProductFilters, 'category'>
  filters: ProductFilters
  facetFilters?: FilterGroup[]
  onSortChange: (sort: CategorySortOption) => void
  onFiltersChange: (filters: ProductFilters) => void
  onHandleFiltersChange: (filters: ProductFilters) => void
  onOpenMobileFilters: () => void
}

export function CategoryProductGrid({
  categorySlug,
  products,
  totalCount,
  sortOption,
  categoryFilters,
  filters,
  facetFilters,
  onSortChange,
  onFiltersChange,
  onHandleFiltersChange,
  onOpenMobileFilters,
}: CategoryProductGridProps) {
  const activeFacetCount = useMemo(() => {
    return Object.entries(categoryFilters).filter(([key, value]) => {
      if (NON_FACET_FILTER_KEYS.has(key)) return false
      if (value === undefined || value === null || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }).length
  }, [categoryFilters])

  return (
    <main className="min-w-0 flex-1">
      <ProductSortAndView
        sortOption={sortOption}
        onSortChange={onSortChange}
        productCount={totalCount}
        onOpenFilters={onOpenMobileFilters}
        activeFacetCount={activeFacetCount}
        notice={
          <p className="text-xs leading-relaxed text-gray-400">
            Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
          </p>
        }
      />

      {facetFilters && facetFilters.length > 0 ? (
        <ActiveFilters
          activeFilters={categoryFilters}
          filterGroups={facetFilters}
          onRemoveFilter={(filterKey) => {
            const newFilters = { ...filters }
            delete newFilters[filterKey as keyof ProductFilters]
            onFiltersChange(newFilters)
          }}
          onClearAll={() => onHandleFiltersChange(stripFacetFilters(filters))}
        />
      ) : null}

      {products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="mb-2 text-gray-600">Không tìm thấy sản phẩm nào trong danh mục này</p>
          <p className="text-sm text-gray-500">Vui lòng thử lại sau hoặc chọn danh mục khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={getListProductKey(product)}
              product={buildProductCardPayload(product, categorySlug)}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={categoryFilters.page || PAGINATION.DEFAULT_PAGE}
        totalPages={Math.ceil(totalCount / (filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE))}
        onPageChange={(page) => onFiltersChange({ ...categoryFilters, page } as ProductFilters)}
        buttonClassName="text-gray-600"
      />
    </main>
  )
}
