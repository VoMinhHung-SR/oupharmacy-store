'use client'
import React, { useState, useMemo } from 'react'
import { ProductCard } from '@/components/cards/ProductCard'
import { ProductFilters, Product } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { ProductSortAndView, ProductListView } from '@/components/products'
import { DynamicFiltersSidebar } from './DynamicFiltersSidebar'
import { SubcategoriesHorizontalList } from './SubcategoriesHorizontalList'
import { ActiveFilters } from './ActiveFilters'
import { Subcategory, FilterGroup } from '@/lib/services/products'
import { PAGINATION, PRICE_CONSULT, PRODUCT_LISTING, SIDEBAR } from '@/lib/constant'
import { FilterIcon, CloseIcon } from '@/components/icons'
import { Pagination } from '@/components/Pagination'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'

type SortOption = 'bestselling' | 'price-low' | 'price-high'
type ViewMode = 'grid' | 'list'

interface CategoryListingPageContentProps {
  categorySlug: string
  products: Product[]
  totalCount: number
  loading: boolean
  error: Error | null
  categoryName?: string | null
  subcategories?: Subcategory[]
  dynamicFilters?: FilterGroup[]
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
  dynamicFilters,
  filtersLoading = false,
  filters,
  onFiltersChange,
}: CategoryListingPageContentProps) {
  const [sortOption, setSortOption] = useState<SortOption>(PRODUCT_LISTING.DEFAULT_SORT)
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Extract the last category name from the full path (remove " > Parent" prefix)
  // Or get it directly from first product's category info
  const lastCategoryName = useMemo(() => {
    // Priority 1: Get from first product's category info, matching categorySlug level
    if (products.length > 0 && products[0].category_info?.category) {
      const categoryArray = products[0].category_info.category
      const slugParts = categorySlug.split('/')
      
      // Get the category at the correct level (matching slug depth)
      const targetLevel = slugParts.length - 1
      if (categoryArray.length > targetLevel) {
        const lastCategory = categoryArray[targetLevel]
        if (lastCategory?.name) {
          return lastCategory.name
        }
      }
    }
    
    // Priority 2: Extract from categoryName if it has " > " separator
    if (categoryName) {
      const parts = categoryName.split(' > ')
      return parts[parts.length - 1]
    }
    
    return null
  }, [products, categoryName, categorySlug])

  // Prepare filters (loại bỏ category vì đã có trong slug)
  const categoryFilters = useMemo(() => {
    const { category: _, ...rest } = filters
    return rest
  }, [filters])

  // Apply sorting - only client-side if server doesn't provide ordering
  const sortedProducts = useMemo(() => {
    if (!products.length) return products
    
    // If server provides ordering, use products as-is
    if (categoryFilters.ordering) {
      return products
    }
    
    // Client-side fallback sorting
    const sorted = [...products]
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price_value || 0) - (b.price_value || 0))
      case 'price-high':
        return sorted.sort((a, b) => (b.price_value || 0) - (a.price_value || 0))
      case 'bestselling':
      default:
        return sorted.sort((a, b) => (b.in_stock || 0) - (a.in_stock || 0))
    }
  }, [products, sortOption, categoryFilters.ordering])

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
    const newFilters: Omit<ProductFilters, 'category'> = { ...categoryFilters }
    
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
    
    onFiltersChange(newFilters as ProductFilters)
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    // Loại bỏ category từ filters vì đã có trong slug
    const { category: _, ...filtersWithoutCategory } = newFilters
    const updatedFilters: ProductFilters = { 
      ...filtersWithoutCategory, 
      page: PAGINATION.DEFAULT_PAGE, 
      page_size: filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE 
    } as ProductFilters
    onFiltersChange(updatedFilters)
  }

  // Build breadcrumbs from category_array in product data
  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Trang chủ', href: '/' }
    ]
    
    // Get category_array from first product (all products have same category path)
    let categoryArray: Array<{ name: string; slug: string }> = []
    
    if (products.length > 0 && products[0].category_info?.category) {
      categoryArray = products[0].category_info.category
    }
    
    // If we have category_array from API, use it but only the levels that match categorySlug
    if (categoryArray.length > 0) {
      // Build the path from categorySlug to determine how many levels we should display
      const slugParts = categorySlug.split('/')
      
      // Only include category items up to the number of slug parts
      const relevantCategories = categoryArray.slice(0, slugParts.length)
      
      let accumulatedPath = ''
      relevantCategories.forEach((cat, index) => {
        accumulatedPath += index === 0 ? cat.slug : `/${cat.slug}`
        const isLast = index === relevantCategories.length - 1
        
        if (!isLast) {
          items.push({ label: cat.name, href: `/${accumulatedPath}` })
        } else {
          items.push({ label: cat.name })
        }
      })
    } else {
      // Fallback: build from slug parts if no category_array available
      const slugParts = categorySlug.split('/')
      let accumulatedPath = ''
      
      slugParts.forEach((slugPart, index) => {
        accumulatedPath += index === 0 ? slugPart : `/${slugPart}`
        const isLast = index === slugParts.length - 1
        const label = slugPart.replace(/-/g, ' ')
        
        if (!isLast) {
          items.push({ label, href: `/${accumulatedPath}` })
        } else {
          items.push({ label })
        }
      })
    }
    
    return items
  }, [categorySlug, products])

  if (loading) {
    return (
      <Container className="py-4">
        {/* Breadcrumb skeleton */}
        <div className="mb-4">
          <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: `${SIDEBAR.WIDTH}px` }}>
            <div className="sticky w-full space-y-4 rounded-lg border border-gray-200 bg-white p-4" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Main content skeleton */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Mobile Filter Button skeleton */}
            <div className="lg:hidden">
              <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
            </div>

            {/* Sort and View skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>

            {/* Notice skeleton */}
            <div className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />

            {/* Products skeleton - Grid view (default) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                  <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-amber-800 font-medium mb-2">Không thể tải danh sách sản phẩm</p>
          <p className="text-sm text-amber-700 mb-4">
            {error.message || 'Đã xảy ra lỗi khi kết nối với server. Vui lòng thử lại sau.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
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
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Category Name */}
      {lastCategoryName && (
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {lastCategoryName}
        </h1>
      )}

      {/* Subcategories Horizontal List */}
      {subcategories && subcategories.length > 0 && (
        <SubcategoriesHorizontalList
          subcategories={subcategories}
          currentCategorySlug={categorySlug}
        />
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        {/* Always show filter sidebar (except when overLimit, which is handled in page.tsx) */}
        <aside className="hidden lg:flex flex-shrink-0" style={{ width: `${SIDEBAR.WIDTH}px` }}>
          <div className="sticky w-full" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
            {filtersLoading || dynamicFilters === undefined ? (
              <div className="space-y-4 bg-white rounded-lg p-4" style={{ width: `${SIDEBAR.WIDTH}px` }}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc nâng cao</h2>
                <p className="text-sm text-gray-500">Đang tải bộ lọc...</p>
              </div>
            ) : (
              <DynamicFiltersSidebar
                filters={dynamicFilters || []}
                activeFilters={categoryFilters}
                onFiltersChange={handleFiltersChange}
              />
            )}
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
              style={{ zIndex: SIDEBAR.Z_INDEX_OVERLAY }}
              onClick={() => setShowMobileFilters(false)}
            />
            <aside 
              className="fixed left-0 top-0 h-full bg-white overflow-y-auto p-4 lg:hidden shadow-xl"
              style={{ width: `${SIDEBAR.MOBILE_WIDTH}px`, zIndex: SIDEBAR.Z_INDEX_SIDEBAR }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <CloseIcon />
                </button>
              </div>
              {filtersLoading || dynamicFilters === undefined ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc nâng cao</h2>
                  <p className="text-sm text-gray-500">Đang tải bộ lọc...</p>
                </div>
              ) : (
                <DynamicFiltersSidebar
                  filters={dynamicFilters || []}
                  activeFilters={categoryFilters}
                  onFiltersChange={handleFiltersChange}
                />
              )}
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filter Button - Always show (except when overLimit, which is handled in page.tsx) */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <FilterIcon />
              <span>Bộ lọc</span>
            </button>
          </div>

          <ProductSortAndView
            sortOption={sortOption}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            productCount={totalCount}
          />

          {/* Active Filters */}
          {dynamicFilters && dynamicFilters.length > 0 && (
            <ActiveFilters
              activeFilters={categoryFilters}
              filterGroups={dynamicFilters}
              onRemoveFilter={(filterKey) => {
                const newFilters = { ...filters }
                delete newFilters[filterKey as keyof ProductFilters]
                onFiltersChange(newFilters)
              }}
              onClearAll={() => handleFiltersChange({})}
            />
          )}

          {/* Notice */}
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>
              <strong>Lưu ý:</strong> Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
            </p>
          </div>

          {/* Products */}
          {sortedProducts.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-600 mb-2">Không tìm thấy sản phẩm nào trong danh mục này</p>
              <p className="text-sm text-gray-500">Vui lòng thử lại sau hoặc chọn danh mục khác</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => {
                // Sử dụng category slug từ product data (category_info.categorySlug hoặc build từ category array)
                // Điều này đảm bảo product link sử dụng đúng category path của sản phẩm
                const productCategorySlug = product.category_info?.categorySlug ||
                  (product.category_info?.category && product.category_info.category.length > 0
                    ? product.category_info.category.map(cat => cat.slug).join('/')
                    : categorySlug)
                
                const productMedicineSlug = product.medicine?.slug || 
                  (product.medicine?.name 
                    ? product.medicine.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    : undefined)
                
                const productName = product.medicine?.name || 
                  product.medicine?.web_name || 
                  'Sản phẩm'
                
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

          {/* Pagination */}
          <Pagination
            currentPage={categoryFilters.page || PAGINATION.DEFAULT_PAGE}
            totalPages={Math.ceil(totalCount / (filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE))}
            onPageChange={(page) => onFiltersChange({ ...categoryFilters, page } as ProductFilters)}
            buttonClassName="text-gray-600"
          />
        </main>
      </div>
    </Container>
  )
}