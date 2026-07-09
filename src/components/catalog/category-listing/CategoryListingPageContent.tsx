'use client'

import { Product, ProductFilters, Subcategory, FilterGroup } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CategoryListingSkeleton } from '@/components/catalog/_shared/listing/CategoryListingSkeleton'
import { SubcategoriesHorizontalList } from '@/components/catalog/_shared/category/SubcategoriesHorizontalList'
import { useCategoryListingPage } from '@/components/catalog/category-listing/useCategoryListingPage'
import { CategoryListingSidebar } from '@/components/catalog/category-listing/parts/CategoryListingSidebar'
import { CategoryListingMobileFilters } from '@/components/catalog/category-listing/parts/CategoryListingMobileFilters'
import { CategoryProductGrid } from '@/components/catalog/category-listing/parts/CategoryProductGrid'

interface CategoryListingPageContentProps {
  categorySlug: string
  products: Product[]
  totalCount: number
  loading: boolean
  error: Error | null
  categoryName?: string | null
  subcategories?: Subcategory[]
  facetFilters?: FilterGroup[]
  filtersLoading?: boolean
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function CategoryListingPageContent({
  categorySlug,
  products,
  totalCount,
  loading,
  error,
  categoryName,
  subcategories = [],
  facetFilters,
  filtersLoading = false,
  filters,
  onFiltersChange,
}: CategoryListingPageContentProps) {
  const listing = useCategoryListingPage({
    categorySlug,
    products,
    categoryName,
    filters,
    onFiltersChange,
  })

  if (loading) {
    return <CategoryListingSkeleton />
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="mb-2 font-medium text-amber-800">Không thể tải danh sách sản phẩm</p>
          <p className="mb-4 text-sm text-amber-700">
            {error.message || 'Đã xảy ra lỗi khi kết nối với server. Vui lòng thử lại sau.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
          >
            Tải lại trang
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Breadcrumb items={listing.breadcrumbItems} />
      </div>

      {subcategories.length > 0 ? (
        <SubcategoriesHorizontalList
          subcategories={subcategories}
          currentCategorySlug={categorySlug}
        />
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row">
        <CategoryListingSidebar
          facetFilters={facetFilters}
          filtersLoading={filtersLoading}
          categoryFilters={listing.categoryFilters}
          onFiltersChange={listing.handleFiltersChange}
        />

        <CategoryListingMobileFilters
          open={listing.showMobileFilters}
          onClose={() => listing.setShowMobileFilters(false)}
          facetFilters={facetFilters}
          filtersLoading={filtersLoading}
          categoryFilters={listing.categoryFilters}
          onFiltersChange={listing.handleFiltersChange}
        />

        <CategoryProductGrid
          categorySlug={categorySlug}
          products={listing.sortedProducts}
          totalCount={totalCount}
          sortOption={listing.sortOption}
          viewMode={listing.viewMode}
          categoryFilters={listing.categoryFilters}
          filters={filters}
          facetFilters={facetFilters}
          onSortChange={listing.handleSortChange}
          onViewModeChange={listing.setViewMode}
          onFiltersChange={onFiltersChange}
          onHandleFiltersChange={listing.handleFiltersChange}
          onOpenMobileFilters={() => listing.setShowMobileFilters(true)}
        />
      </div>
    </Container>
  )
}
