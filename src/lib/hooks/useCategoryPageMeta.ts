'use client'

import { useMemo } from 'react'
import type {
  CategoryProductsResponse,
  CategoryBrowseMeta,
  Subcategory,
} from '@/lib/services/products'

function isCategoryProductsResponse(data: unknown): data is CategoryProductsResponse {
  return !!data && typeof data === 'object' && 'categoryName' in data
}

type UseCategoryPageMetaArgs = {
  categorySlug: string
  productsData?: CategoryProductsResponse
  filtersData?: CategoryBrowseMeta
  listingError: Error | null
  listingLoading: boolean
}

export function useCategoryPageMeta({
  categorySlug,
  productsData,
  filtersData,
  listingError,
  listingLoading,
}: UseCategoryPageMetaArgs) {
  const categoryName = useMemo(() => {
    if (productsData?.categoryName) {
      return productsData.categoryName
    }
    if (filtersData?.categoryName) {
      return filtersData.categoryName
    }
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
    return categorySlug.split('/').pop()?.replace(/-/g, ' ') || null
  }, [productsData?.categoryName, productsData?.results, filtersData?.categoryName, categorySlug])

  const subcategories = useMemo((): Subcategory[] => {
    return productsData?.subcategories || filtersData?.subcategories || []
  }, [productsData?.subcategories, filtersData?.subcategories])

  const isOverLimit = useMemo(() => {
    if (productsData?.overLimit === true) {
      return true
    }
    if (filtersData?.overLimit === true) {
      return true
    }
    if (
      productsData &&
      productsData.productCount > 1000 &&
      productsData.hasSubcategories &&
      (!productsData.results || productsData.results.length === 0)
    ) {
      return true
    }
    if (filtersData && filtersData.productCount > 1000 && filtersData.hasSubcategories) {
      return true
    }
    return false
  }, [productsData, filtersData])

  const isNotFound = useMemo(() => {
    if (listingError) {
      const status =
        (listingError as Error & { status?: number }).status ||
        (listingError as Error & { response?: { status?: number } }).response?.status
      if (status === 404) {
        return true
      }
      const errorMessage = String(listingError).toLowerCase()
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return true
      }
    }
    if (!listingLoading && !productsData && !filtersData) {
      return true
    }
    return false
  }, [listingError, listingLoading, productsData, filtersData])

  const productCount = productsData?.productCount ?? filtersData?.productCount ?? 0

  return {
    categoryName,
    subcategories,
    isOverLimit,
    isNotFound,
    productCount,
    isCategoryProductsResponse,
  }
}
