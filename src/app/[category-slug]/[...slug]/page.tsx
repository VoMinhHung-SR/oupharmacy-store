"use client"
import React, { useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import { Product, ProductListResponse, CategoryProductsResponse } from '@/lib/services/products'
import { ProductDetailPageContent } from '@/components/products'
import { CategoryListingPageContent } from '@/components/products'
import { useDynamicFilters } from '@/lib/hooks/useDynamicFilters'
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
  
  const fullPath = pathname.startsWith('/') ? pathname.slice(1) : pathname
  
  const parts = fullPath.split('/')
  
  const isValidPath = parts.length >= 2
  const [filters, setFilters] = useState<ProductFilters>({ 
    page: PAGINATION.DEFAULT_PAGE, 
    page_size: PAGINATION.DEFAULT_PAGE_SIZE 
  })
  
  const queryClient = useQueryClient()
  
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
      
      const response = await apiGet<Product | ProductListResponse>(path)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: isValidPath,
  })
  
  // Kiểm tra response type từ API:
  // - Có 'results' array → ProductListResponse hoặc CategoryProductsResponse (category listing)
  // - Không có 'results' → Product (product detail)
  const isProductList = apiResponse && 'results' in apiResponse
  const productList = isProductList ? (apiResponse as ProductListResponse | CategoryProductsResponse) : null
  const product = !isProductList && apiResponse ? (apiResponse as Product) : undefined
  
  const isCategoryProductsResponse = (list: ProductListResponse | CategoryProductsResponse | null): list is CategoryProductsResponse => {
    return list !== null && 'categoryName' in list
  }
  
  const shouldRenderProductDetailSkeleton = useMemo(() => {
    if (!isLoading || apiResponse) return false
    
    const cachedData = queryClient.getQueryData<Product | ProductListResponse>(['nested-path', fullPath, filters])
    if (cachedData) {
      return !('results' in cachedData)
    }
    
    if (parts.length > 3) {
      return true
    }
    
    return false
  }, [isLoading, apiResponse, fullPath, filters, queryClient, parts.length])
  
  // Fetch dynamic filters chỉ khi là category listing (không phải product detail)
  // Logic: đối với tất cả /domain../{categorySlug}/ đều trả về filter
  // except: /{categorySlug}/productDetail là không có bộ lọc
  // Fetch khi: đã xác định là category listing HOẶC đang loading (trừ khi heuristic cho thấy là product detail)
  const shouldFetchFilters = isProductList === true || (isLoading && !shouldRenderProductDetailSkeleton)
  const { 
    data: filtersData,
    isLoading: filtersLoading 
  } = useDynamicFilters(
    shouldFetchFilters ? fullPath : undefined,
    { 
      include_variants: true, 
      include_counts: true
    },
    shouldFetchFilters // Chỉ fetch khi là category listing
  )
  
  const parsedCategoryPath = isValidPath ? parts.slice(0, -1).join('/') : undefined
  const parsedMedicineSlug = isValidPath ? parts[parts.length - 1] : undefined
  
  const categoryName = useMemo(() => {
    // Priority 1: From productList API response (check if it's CategoryProductsResponse)
    if (isCategoryProductsResponse(productList) && productList.categoryName) {
      return productList.categoryName
    }
    
    // Priority 2: From filters API response
    if (filtersData?.categoryName) {
      return filtersData.categoryName
    }
    
    // Priority 3: From product data
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
    
    // Priority 4: Fallback to slug formatting
    return fullPath.split('/').pop()?.replace(/-/g, ' ') || null
  }, [productList, filtersData?.categoryName, fullPath])
  
  // Subcategories from API response (prioritize productList)
  const subcategories = useMemo(() => {
    if (isCategoryProductsResponse(productList) && Array.isArray(productList.subcategories)) {
      return productList.subcategories
    }
    return Array.isArray(filtersData?.subcategories) ? filtersData.subcategories : []
  }, [productList, filtersData?.subcategories])
  
  if (!isValidPath) {
    return null
  }
  
  // Khi loading và chưa có data, render skeleton dựa trên cached data hoặc heuristic
  if (isLoading && !apiResponse) {
    if (shouldRenderProductDetailSkeleton) {
      // Render product detail skeleton
      return (
        <ProductDetailPageContent
          product={undefined}
          categorySlug={parsedCategoryPath!}
          medicineSlug={parsedMedicineSlug!}
          loading={true}
          error={null}
        />
      )
    } else {
      // Render category listing skeleton
      return (
        <CategoryListingPageContent
          categorySlug={fullPath}
          products={[]}
          totalCount={0}
          loading={true}
          error={null}
          categoryName={null}
          subcategories={[]}
          dynamicFilters={filtersData?.filters}
          filtersLoading={filtersLoading}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )
    }
  }
  
  // Render category listing nếu là ProductListResponse
  if (isProductList && productList) {
    return (
      <CategoryListingPageContent
        categorySlug={fullPath}
        products={productList.results || []}
        totalCount={productList.count || 0}
        loading={isLoading || filtersLoading}
        error={error as Error | null}
        categoryName={categoryName}
        subcategories={subcategories}
        dynamicFilters={filtersData?.filters}
        filtersLoading={filtersLoading}
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
