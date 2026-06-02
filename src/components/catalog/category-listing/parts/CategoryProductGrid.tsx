'use client'

import { ProductCard } from '@/components/cards/ProductCard'
import {
  Product,
  ProductFilters,
  FilterGroup,
  buildProductCardPayload,
  getListProductKey,
} from '@/lib/services/products'
import { ProductSortAndView } from '@/components/catalog/_shared/listing/ProductSortAndView'
import { ProductListView } from '@/components/catalog/_shared/listing/ProductListView'
import { ActiveFilters } from '@/components/catalog/_shared/filters/ActiveFilters'
import { FilterIcon } from '@/components/icons'
import { Pagination } from '@/components/Pagination'
import { PAGINATION } from '@/lib/constant'
import { CategorySortOption, CategoryViewMode } from '@/components/catalog/category-listing/useCategoryListingPage'

interface CategoryProductGridProps {
  categorySlug: string
  products: Product[]
  totalCount: number
  sortOption: CategorySortOption
  viewMode: CategoryViewMode
  categoryFilters: Omit<ProductFilters, 'category'>
  filters: ProductFilters
  dynamicFilters?: FilterGroup[]
  onSortChange: (sort: CategorySortOption) => void
  onViewModeChange: (mode: CategoryViewMode) => void
  onFiltersChange: (filters: ProductFilters) => void
  onHandleFiltersChange: (filters: ProductFilters) => void
  onOpenMobileFilters: () => void
}

export function CategoryProductGrid({
  categorySlug,
  products,
  totalCount,
  sortOption,
  viewMode,
  categoryFilters,
  filters,
  dynamicFilters,
  onSortChange,
  onViewModeChange,
  onFiltersChange,
  onHandleFiltersChange,
  onOpenMobileFilters,
}: CategoryProductGridProps) {
  return (
    <main className="min-w-0 flex-1">
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <FilterIcon />
          <span>Bộ lọc</span>
        </button>
      </div>

      <ProductSortAndView
        sortOption={sortOption}
        viewMode={viewMode}
        onSortChange={onSortChange}
        onViewModeChange={onViewModeChange}
        productCount={totalCount}
      />

      {dynamicFilters && dynamicFilters.length > 0 ? (
        <ActiveFilters
          activeFilters={categoryFilters}
          filterGroups={dynamicFilters}
          onRemoveFilter={(filterKey) => {
            const newFilters = { ...filters }
            delete newFilters[filterKey as keyof ProductFilters]
            onFiltersChange(newFilters)
          }}
          onClearAll={() => onHandleFiltersChange({})}
        />
      ) : null}

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p>
          <strong>Lưu ý:</strong> Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="mb-2 text-gray-600">Không tìm thấy sản phẩm nào trong danh mục này</p>
          <p className="text-sm text-gray-500">Vui lòng thử lại sau hoặc chọn danh mục khác</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={getListProductKey(product)}
              product={buildProductCardPayload(product, categorySlug)}
            />
          ))}
        </div>
      ) : (
        <ProductListView products={products} currentCategorySlug={categorySlug} />
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
