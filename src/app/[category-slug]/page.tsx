"use client"
import React, { useState, useMemo } from 'react'
import { useProductsByCategorySlug } from '@/lib/hooks/useProducts'
import { ProductFilters } from '@/lib/services/products'
import { useBrands } from '@/lib/hooks/useBrands'
import { CategoryListingPageContent } from '@/components/products'
import { PAGINATION } from '@/lib/constant'

interface Props {
  params: { 'category-slug': string }
}

/**
 * Category Listing Page
 * Route: /{category-slug}
 * Ví dụ: /thuc-pham-chuc-nang, /duoc-my-pham/cham-soc-co-the
 */
export default function CategoryListingPage({ params }: Props) {
  const categorySlug = params['category-slug']
  
  const [filters, setFilters] = useState<ProductFilters>({ 
    page: PAGINATION.DEFAULT_PAGE, 
    page_size: PAGINATION.DEFAULT_PAGE_SIZE 
  })
  
  const { data: brands } = useBrands()
  
  // Lấy danh sách sản phẩm theo category slug
  const { 
    data, 
    isLoading: listingLoading, 
    error: listingError 
  } = useProductsByCategorySlug(
    categorySlug,
    (() => {
      const { category: _, ...filtersWithoutCategory } = filters
      return filtersWithoutCategory
    })()
  )
  
  // Category name lấy từ product đầu tiên trong response (nếu có)
  // Ưu tiên lấy từ category_info.category array (item cuối cùng là category hiện tại)
  const categoryName = useMemo(() => {
    if (data?.results && data.results.length > 0) {
      const firstProduct = data.results[0]
      
      // Ưu tiên lấy từ category_info.category array (item cuối cùng)
      if (firstProduct.category_info?.category && firstProduct.category_info.category.length > 0) {
        const lastCategory = firstProduct.category_info.category[firstProduct.category_info.category.length - 1]
        return lastCategory.name
      }
      
      // Fallback: lấy từ category.name
      if (firstProduct.category?.name) {
        return firstProduct.category.name
      }
    }
    // Fallback: extract từ slug (lấy phần cuối cùng)
    return categorySlug.split('/').pop()?.replace(/-/g, ' ') || null
  }, [data?.results, categorySlug])

  return (
    <CategoryListingPageContent
      categorySlug={categorySlug}
      products={data?.results || []}
      totalCount={data?.count || 0}
      loading={listingLoading}
      error={listingError}
      categoryName={categoryName}
      categories={undefined}
      brands={brands}
      filters={filters}
      onFiltersChange={setFilters}
    />
  )
}

