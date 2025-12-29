"use client"
import React, { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import { Product, ProductListResponse } from '@/lib/services/products'
import { ProductDetailPageContent } from '@/components/products'
import { CategoryListingPageContent } from '@/components/products'
import { useBrands } from '@/lib/hooks/useBrands'
import { ProductFilters } from '@/lib/services/products'
import { PAGINATION } from '@/lib/constant'

interface Props {
  params: { 
    'category-slug': string
    slug: string[]
  }
}

/**
 * Route xử lý 2+ segments (nested paths)
 * Route: /[category-slug]/[...slug]
 * 
 * Route này xử lý tất cả paths có 2+ segments (không giới hạn số segments):
 * - Category listing: /thuc-pham-chuc-nang/lam-dep (2 segments)
 * - Product detail: /thuc-pham-chuc-nang/spA (2 segments)
 * - Category listing: /thuc-pham-chuc-nang/lam-dep/toc (3 segments)
 * - Product detail: /thuc-pham-chuc-nang/lam-dep/toc/spA (3 segments)
 * - Product detail: /thuc-pham-chuc-nang/lam-dep/toc/hair-volume-vien-uong-duong-toc-102 (4+ segments)
 * 
 * Backend API tự động detect từ response:
 * - Nếu response có 'results' array → ProductListResponse (category listing)
 * - Nếu response là single object → Product (product detail)
 * 
 * Path có 1 segment được xử lý bởi:
 * - [category-slug]/page.tsx (1 segment - category listing)
 */
export default function NestedPathPage({ params }: Props) {
  const pathname = usePathname()
  
  // Lấy full path từ URL (bỏ dấu / đầu tiên)
  const fullPath = pathname.startsWith('/') ? pathname.slice(1) : pathname
  
  const parts = fullPath.split('/')
  
  // Route này xử lý paths có 2+ segments
  const isValidPath = parts.length >= 2
  const [filters, setFilters] = useState<ProductFilters>({ 
    page: PAGINATION.DEFAULT_PAGE, 
    page_size: PAGINATION.DEFAULT_PAGE_SIZE 
  })
  
  const { data: brands } = useBrands()
  
  // Gọi API với full path, backend sẽ tự động detect category listing hay product detail
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['nested-path', fullPath, filters],
    queryFn: async () => {
      if (!isValidPath) {
        throw new Error('Invalid path')
      }
      
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
      }
      
      const queryString = params.toString()
      const path = `/${fullPath}${queryString ? `?${queryString}` : ''}`
      
      // Gọi API - backend tự động detect và trả về Product hoặc ProductListResponse
      const response = await apiGet<Product | ProductListResponse>(path)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: isValidPath,
  })
  
  // Kiểm tra response type từ API:
  // - Có 'results' array → ProductListResponse (category listing)
  // - Không có 'results' → Product (product detail)
  const isProductList = apiResponse && 'results' in apiResponse
  const productList = isProductList ? (apiResponse as ProductListResponse) : null
  const product = !isProductList ? (apiResponse as Product | undefined) : undefined
  
  // Parse để lấy category path và medicine slug (cho product detail)
  const parsedCategoryPath = isValidPath ? parts.slice(0, -1).join('/') : undefined
  const parsedMedicineSlug = isValidPath ? parts[parts.length - 1] : undefined
  
  // Category name cho listing page
  const categoryName = useMemo(() => {
    if (productList?.results && productList.results.length > 0) {
      const firstProduct = productList.results[0]
      if (firstProduct.category_info?.category && firstProduct.category_info.category.length > 0) {
        const lastCategory = firstProduct.category_info.category[firstProduct.category_info.category.length - 1]
        return lastCategory.name
      }
      if (firstProduct.category?.name) {
        return firstProduct.category.name
      }
    }
    return fullPath.split('/').pop()?.replace(/-/g, ' ') || null
  }, [productList?.results, fullPath])
  
  if (!isValidPath) {
    return null
  }
  
  // Render category listing nếu là ProductListResponse
  if (isProductList && productList) {
    return (
      <CategoryListingPageContent
        categorySlug={fullPath}
        products={productList.results || []}
        totalCount={productList.count || 0}
        loading={isLoading}
        error={error as Error | null}
        categoryName={categoryName}
        categories={undefined}
        brands={brands}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  }
  
  // Render product detail nếu là Product
  return (
    <ProductDetailPageContent
      product={product}
      categorySlug={parsedCategoryPath!}
      medicineSlug={parsedMedicineSlug!}
      loading={isLoading}
      error={error as Error | null}
    />
  )
}



