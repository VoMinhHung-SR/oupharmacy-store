'use client'
import React, { useState, useMemo } from 'react'
import { ProductCard } from '@/components/cards/ProductCard'
import { ProductFilters, Product } from '@/lib/services/products'
import { Container } from '@/components/Container'
import { ProductFiltersSidebar, ProductSortAndView, ProductListView } from '@/components/products'
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
  categories?: any[]
  brands?: any[]
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
  categories,
  brands,
  filters,
  onFiltersChange,
}: CategoryListingPageContentProps) {
  const [sortOption, setSortOption] = useState<SortOption>(PRODUCT_LISTING.DEFAULT_SORT)
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Prepare filters (loại bỏ category vì đã có trong slug)
  const { category: _, ...filtersWithoutCategory } = filters
  const categoryFilters = useMemo(() => {
    return filtersWithoutCategory
  }, [filtersWithoutCategory])

  // Apply sorting
  const sortedProducts = useMemo(() => {
    if (!products.length) return products
    
    if (categoryFilters.ordering) {
      return products
    }
    
    // Fallback: sort trên client chỉ khi không có server-side sorting
    const sorted = [...products]
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price_value - b.price_value)
      case 'price-high':
        return sorted.sort((a, b) => b.price_value - a.price_value)
      case 'bestselling':
      default:
        return sorted.sort((a, b) => b.in_stock - a.in_stock)
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

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1 space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
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
        <Breadcrumb 
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: categoryName || `Danh mục: ${categorySlug}` }
          ]}
        />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:flex flex-shrink-0" style={{ width: `${SIDEBAR.WIDTH}px` }}>
          <div className="sticky w-full" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
            <ProductFiltersSidebar
              filters={categoryFilters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              brands={brands}
            />
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
              <ProductFiltersSidebar
                filters={categoryFilters}
                onFiltersChange={handleFiltersChange}
                categories={categories}
                brands={brands}
              />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                const categoryArray = product.category_info?.category
                const productCategorySlug = categoryArray && categoryArray.length > 0 
                  ? categoryArray.map(cat => cat.slug).join('/')
                  : product.category_info?.categorySlug || categorySlug
                
                const productMedicineSlug = product.medicine?.slug || 
                  (product.medicine?.name 
                    ? product.medicine.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    : undefined)
                
                const productName = product.medicine?.name || 
                  product.medicine?.web_name || 
                  'Sản phẩm'
                
                const priceDisplay = product.price_display || PRICE_CONSULT
              
                const productImageUrl = product.image_url || (product.images && product.images.length > 0 ? product.images[0] : undefined)
                
                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id.toString(),
                      name: productName,
                      price_display: priceDisplay,
                      price: product.price_value || 0,
                      image_url: productImageUrl,
                      packaging: product.package_size || undefined,
                      medicine_unit_id: product.id,
                      category_slug: productCategorySlug,
                      medicine_slug: productMedicineSlug,
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

