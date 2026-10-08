'use client'

import dynamic from 'next/dynamic'
import { Product, ProductFilters, Subcategory, FilterGroup } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CategoryListingSkeleton } from '@/components/catalog/_shared/listing/CategoryListingSkeleton'
import { SubcategoriesHorizontalList } from '@/components/catalog/_shared/category/SubcategoriesHorizontalList'
import { useCategoryListingPage } from '@/components/catalog/category-listing/useCategoryListingPage'
import { CategoryProductGrid } from '@/components/catalog/category-listing/parts/CategoryProductGrid'
import { PAGE_Y } from '@/lib/layout/pageLayout'
import { SIDEBAR } from '@/lib/constant'

const CategoryListingSidebar = dynamic(
  () =>
    import('@/components/catalog/category-listing/parts/CategoryListingSidebar').then((m) => ({
      default: m.CategoryListingSidebar,
    })),
  {
    loading: () => (
      <aside className="hidden flex-shrink-0 lg:flex" style={{ width: `${SIDEBAR.WIDTH}px` }}>
        <div
          className="w-full space-y-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          style={{ width: `${SIDEBAR.WIDTH}px` }}
          aria-hidden
        >
          <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-24 animate-pulse rounded bg-gray-50" />
          <div className="h-24 animate-pulse rounded bg-gray-50" />
        </div>
      </aside>
    ),
  }
)

const CategoryListingMobileFilters = dynamic(
  () =>
    import('@/components/catalog/category-listing/parts/CategoryListingMobileFilters').then(
      (m) => ({ default: m.CategoryListingMobileFilters })
    ),
  { ssr: false, loading: () => null }
)

interface CategoryListingPageContentProps {
  categorySlug: string
  products: Product[]
  totalCount: number
  loading: boolean
  isRefreshing?: boolean
  isFetchingMore?: boolean
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
  isRefreshing = false,
  isFetchingMore = false,
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
      <Container className={PAGE_Y}>
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
    <Container className={PAGE_Y}>
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

        {listing.showMobileFilters ? (
          <CategoryListingMobileFilters
            open={listing.showMobileFilters}
            onClose={() => listing.setShowMobileFilters(false)}
            facetFilters={facetFilters}
            filtersLoading={filtersLoading}
            categoryFilters={listing.categoryFilters}
            onFiltersChange={listing.handleFiltersChange}
          />
        ) : null}

        <CategoryProductGrid
          categorySlug={categorySlug}
          products={listing.sortedProducts}
          totalCount={totalCount}
          sortOption={listing.sortOption}
          categoryFilters={listing.categoryFilters}
          filters={filters}
          facetFilters={facetFilters}
          isRefreshing={isRefreshing}
          isFetchingMore={isFetchingMore}
          onSortChange={listing.handleSortChange}
          onFiltersChange={onFiltersChange}
          onHandleFiltersChange={listing.handleFiltersChange}
          onOpenMobileFilters={() => listing.setShowMobileFilters(true)}
        />
      </div>
    </Container>
  )
}
