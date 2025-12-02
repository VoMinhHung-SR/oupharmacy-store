"use client"
import React, { useState, useMemo } from 'react'
import { ProductCard } from '@/components/cards/ProductCard'
import { useProducts } from '@/lib/hooks/useProducts'
import { ProductFilters } from '@/lib/services/products'
import { useCategories } from '@/lib/hooks/useCategories'
import { useBrands } from '@/lib/hooks/useBrands'
import { Container } from '@/components/Container'
import { ProductFiltersSidebar, ProductSortAndView, ProductListView } from '@/components/products'
import { PAGINATION, PRODUCT_LISTING, SIDEBAR } from '@/lib/constant'
import { FilterIcon, CloseIcon } from '@/components/icons'
import { Pagination } from '@/components/Pagination'

type SortOption = 'bestselling' | 'price-low' | 'price-high'
type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ 
    page: PAGINATION.DEFAULT_PAGE, 
    page_size: PAGINATION.DEFAULT_PAGE_SIZE 
  })
  const [sortOption, setSortOption] = useState<SortOption>(PRODUCT_LISTING.DEFAULT_SORT)
  const [viewMode, setViewMode] = useState<ViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const { data, isLoading, error } = useProducts(filters)
  const { data: categories } = useCategories()
  const { data: brands } = useBrands()

  const products = data?.results || []
  const loading = isLoading
  const totalPages = data ? Math.ceil(data.count / (filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE)) : 1

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const productList = data?.results || []
    if (!productList.length) return productList

    const sorted = [...productList]
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'bestselling':
      default:
        // Default sorting (bestselling could be based on in_stock or created_date)
        return sorted.sort((a, b) => b.in_stock - a.in_stock)
    }
  }, [data?.results, sortOption])

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
    const newFilters: ProductFilters = { ...filters }
    
    if (sort === 'price-low') {
      newFilters.price_sort = 'asc'
      newFilters.ordering = 'price'
    } else if (sort === 'price-high') {
      newFilters.price_sort = 'desc'
      newFilters.ordering = '-price'
    } else {
      delete newFilters.price_sort
      delete newFilters.ordering
    }
    
    setFilters(newFilters)
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters({ 
      ...newFilters, 
      page: PAGINATION.DEFAULT_PAGE, 
      page_size: filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE 
    })
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Lỗi khi tải sản phẩm: {error.message || 'Đã xảy ra lỗi'}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:flex flex-shrink-0" style={{ width: `${SIDEBAR.WIDTH}px` }}>
          <div className="sticky w-full" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
            <ProductFiltersSidebar
              filters={filters}
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
                filters={filters}
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
            productCount={data?.count}
          />

          {/* Notice */}
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>
              <strong>Lưu ý:</strong> Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
            </p>
          </div>

          {/* Products */}
          {sortedProducts.length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-gray-600">
              Không tìm thấy sản phẩm nào
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id.toString(),
                    name: product.medicine.name,
                    price: product.price,
                    image_url: product.image_url,
                    packaging: product.packaging,
                    medicine_unit_id: product.id,
                  }}
                />
              ))}
            </div>
          ) : (
            <ProductListView products={sortedProducts} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={filters.page || PAGINATION.DEFAULT_PAGE}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </main>
      </div>
    </Container>
  )
}


