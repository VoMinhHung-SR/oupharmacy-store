"use client"
import React, { useState, useMemo } from 'react'
import { useProductsByCategorySlug } from '@/lib/hooks/useProducts'
import { useDynamicFilters } from '@/lib/hooks/useDynamicFilters'
import { ProductFilters } from '@/lib/services/products'
import { CategoryListingPageContent } from '@/components/products'
import { OverLimitMessage } from '@/components/products/OverLimitMessage'
import { PAGINATION } from '@/lib/constant'
import { NotFoundContent } from '@/components/NotFoundContent'

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
  
  // Prepare filters without category field
  const filtersWithoutCategory = useMemo(() => {
    const { category: _, ...rest } = filters
    return rest
  }, [filters])
  
  // Lấy danh sách sản phẩm theo category slug
  const { 
    data: productsData, 
    isLoading: listingLoading, 
    error: listingError 
  } = useProductsByCategorySlug(categorySlug, filtersWithoutCategory)
  
  // Get dynamic filters - always fetch to get subcategories even when overLimit
  // Note: When overLimit is true, dynamic-filters API still returns subcategories
  const { 
    data: filtersData,
    isLoading: filtersLoading 
  } = useDynamicFilters(
    categorySlug,
    { 
      include_variants: true, 
      include_counts: true
    },
    true // Always fetch to get subcategories
  )
  
  // Check if category is over limit from products data or filters data
  // Note: When overLimit is true, API may return empty results array but still have subcategories
  const isOverLimit = useMemo(() => {
    // Check productsData first (main source)
    if (productsData?.overLimit === true) {
      return true
    }
    // Fallback to filtersData if productsData not loaded yet
    if (filtersData?.overLimit === true) {
      return true
    }
    // Fallback: If productCount is large (>1000) and has subcategories but no products returned,
    // treat as overLimit (API might not return overLimit flag in some cases)
    if (productsData && productsData.productCount > 1000 && 
        productsData.hasSubcategories && 
        (!productsData.results || productsData.results.length === 0)) {
      return true
    }
    if (filtersData && filtersData.productCount > 1000 && 
        filtersData.hasSubcategories) {
      return true
    }
    return false
  }, [productsData, filtersData])
  
  // Category name with optimized fallback logic
  const categoryName = useMemo(() => {
    // Priority 1: From products API response
    if (productsData?.categoryName) {
      return productsData.categoryName
    }
    
    // Priority 2: From filters API response
    if (filtersData?.categoryName) {
      return filtersData.categoryName
    }
    
    // Priority 3: Extract from product data
    if (productsData?.results && productsData.results.length > 0) {
      const firstProduct = productsData.results[0]
      const lastCategory = firstProduct.category_info?.category?.slice(-1)[0]
      if (lastCategory?.name) {
        return lastCategory.name
      }
      if (firstProduct.category?.name) {
        return firstProduct.category.name
      }
    }
    
    // Priority 4: Fallback to slug formatting
    return categorySlug.split('/').pop()?.replace(/-/g, ' ') || null
  }, [productsData?.categoryName, productsData?.results, filtersData?.categoryName, categorySlug])
  
  // Subcategories from API response (prioritize productsData)
  const subcategories = useMemo(() => {
    return productsData?.subcategories || filtersData?.subcategories || []
  }, [productsData?.subcategories, filtersData?.subcategories])

  // Optimized 404 check
  const isNotFound = useMemo(() => {
    // Check error status
    if (listingError) {
      const status = (listingError as any)?.status || (listingError as any)?.response?.status
      if (status === 404) return true
      
      const errorMessage = String(listingError).toLowerCase()
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return true
      }
    }
    
    // Check if data is empty after loading completes
    if (!listingLoading && !productsData && !filtersData) {
      return true
    }
    
    return false
  }, [listingError, listingLoading, productsData, filtersData])

  // Hiển thị 404 nếu không tìm thấy
  if (isNotFound) {
    return <NotFoundContent />
  }

  // Handle over limit case - show subcategories grid only
  // Show OverLimitMessage if:
  // 1. isOverLimit is true AND
  // 2. We have either productsData or filtersData (for productCount and subcategories)
  // 3. Don't show during initial loading (wait for data)
  if (isOverLimit && !listingLoading && !filtersLoading && (productsData || filtersData)) {
    const productCount = productsData?.productCount || filtersData?.productCount || 0
    const overLimitSubcategories = productsData?.subcategories || filtersData?.subcategories || []
    
    // Only show OverLimitMessage if we have subcategories or productCount > 0
    if (overLimitSubcategories.length > 0 || productCount > 0) {
      return (
        <OverLimitMessage
          categoryName={categoryName || categorySlug}
          productCount={productCount}
          subcategories={overLimitSubcategories}
          categorySlug={categorySlug}
        />
      )
    }
  }

  // Normal case: render products with filters
  // Always pass dynamicFilters (even if empty array) so filter sidebar always shows
  // Filter sidebar will handle empty state internally
  return (
    <CategoryListingPageContent
      categorySlug={categorySlug}
      products={productsData?.results || []}
      totalCount={productsData?.count || 0}
      loading={listingLoading || filtersLoading}
      error={listingError}
      categoryName={categoryName}
      subcategories={subcategories}
      dynamicFilters={filtersData?.filters ?? undefined}
      filtersLoading={filtersLoading}
      filters={filters}
      onFiltersChange={setFilters}
    />
  )
}

