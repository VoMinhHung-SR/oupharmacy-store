'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PAGINATION } from '@/lib/constant'
import { mergeUniqueProducts, Product, ProductFilters } from '@/lib/services/products'
import { pathnameToStorePath, parseVariantIdFromSearch, resolveStorePath } from '@/lib/store-path'
import { useProductByCategoryAndProductSlug } from './useProducts'
import { useStoreSearch } from './useStoreSearch'
import { useCategoryPageMeta } from './useCategoryPageMeta'
import {
  sortOptionToStoreSearchSort,
  type StoreSearchParams,
} from '@/lib/services/search'
import { usePreservedSearchFacets } from './usePreservedSearchFacets'
import { pickFacetSearchParams } from '@/lib/listing/facetSearchParams'
import { getListingRequestUiFlags } from '@/lib/listing/getListingRequestUiFlags'

/**
 * Store path page: resolve routing, then category browse via search-first
 * (GET /search/?category=) with facets from the same response.
 *
 * Network (category): resolve-path + search — ≤2 GETs for listing+facets.
 */
export function useStorePage() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const storePath = useMemo(() => pathnameToStorePath(pathname), [pathname])
  const variantId = parseVariantIdFromSearch(searchParams)

  const {
    data: resolved,
    isPending: resolvePending,
    isFetching: resolveFetching,
    error: resolveError,
  } = useQuery({
    queryKey: ['resolve-store-path', storePath],
    queryFn: () => resolveStorePath(storePath),
    staleTime: 60_000,
  })

  // Keep skeleton until the first resolve payload exists (avoids not_found/empty flash).
  const resolvingPath = resolvePending || (!resolved && resolveFetching)

  const page = resolved?.page ?? 'not_found'
  const isCategory = page === 'category'
  const isProduct = page === 'product'
  const categoryPath = resolved?.category_path ?? ''
  const categoryId = resolved?.category_id ?? null
  const productSlug = resolved?.product_slug ?? ''
  const effectiveVariantId = variantId ?? resolved?.default_variant_id ?? undefined

  const [filters, setFilters] = useState<ProductFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    page_size: PAGINATION.DEFAULT_PAGE_SIZE,
  })
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])

  useEffect(() => {
    setFilters({
      page: PAGINATION.DEFAULT_PAGE,
      page_size: PAGINATION.DEFAULT_PAGE_SIZE,
    })
    setAccumulatedProducts([])
  }, [categoryId])

  const searchSort = useMemo(() => {
    if (filters.price_sort === 'asc' || filters.ordering === 'price_value') {
      return sortOptionToStoreSearchSort('price-low')
    }
    if (filters.price_sort === 'desc' || filters.ordering === '-price_value') {
      return sortOptionToStoreSearchSort('price-high')
    }
    return sortOptionToStoreSearchSort('bestselling')
  }, [filters.price_sort, filters.ordering])

  const facetParams = useMemo(() => pickFacetSearchParams(filters), [filters])
  const currentPage = filters.page ?? PAGINATION.DEFAULT_PAGE

  const categorySearchParams = useMemo((): StoreSearchParams | undefined => {
    if (!isCategory || categoryId == null) return undefined
    return {
      q: '',
      category: categoryId,
      page: currentPage,
      page_size: filters.page_size ?? PAGINATION.DEFAULT_PAGE_SIZE,
      sort: searchSort,
      brand: facetParams.brand,
      price_range: facetParams.price_range,
      in_stock: facetParams.in_stock,
      include_facets: true,
    }
  }, [
    isCategory,
    categoryId,
    currentPage,
    filters.page_size,
    searchSort,
    facetParams,
  ])

  const listingSearch = useStoreSearch(categorySearchParams, {
    enabled: isCategory && categoryId != null && resolved?.over_limit !== true,
  })

  useEffect(() => {
    if (!isCategory || !listingSearch.data || listingSearch.isPlaceholderData) return

    const items = listingSearch.data.items ?? []
    if (currentPage <= 1) {
      setAccumulatedProducts(items)
      return
    }
    setAccumulatedProducts((prev) => mergeUniqueProducts(prev, items))
  }, [
    isCategory,
    listingSearch.data,
    listingSearch.dataUpdatedAt,
    listingSearch.isPlaceholderData,
    currentPage,
  ])

  const listingData = useMemo(() => {
    if (!isCategory || !resolved) return undefined
    const search = listingSearch.data
    const total = search?.meta.total ?? resolved.product_count ?? 0
    return {
      categorySlug: categoryPath,
      categoryName: resolved.category_name || categoryPath,
      productCount: resolved.product_count ?? total,
      hasSubcategories: resolved.has_subcategories ?? (resolved.subcategories?.length ?? 0) > 0,
      subcategories: resolved.subcategories ?? [],
      overLimit: resolved.over_limit ?? false,
      count: total,
      results: accumulatedProducts,
    }
  }, [isCategory, resolved, listingSearch.data, categoryPath, accumulatedProducts])

  const hasActiveFacetFilters =
    facetParams.brand != null ||
    facetParams.price_range != null ||
    facetParams.in_stock != null

  const preservedFacetFilters = usePreservedSearchFacets(listingSearch.data?.facets, {
    scopeKey: categoryId,
    hasActiveFacetFilters,
    isPlaceholderData: listingSearch.isPlaceholderData,
    dataUpdatedAt: listingSearch.dataUpdatedAt,
  })

  const categoryFacetsData = useMemo(() => {
    if (!listingData) return undefined
    return {
      categorySlug: listingData.categorySlug,
      categoryName: listingData.categoryName,
      productCount: listingData.productCount,
      hasSubcategories: listingData.hasSubcategories,
      subcategories: listingData.subcategories,
      overLimit: listingData.overLimit,
      filters: preservedFacetFilters,
    }
  }, [listingData, preservedFacetFilters])

  const { isInitialLoad, isRefreshing, isFetchingMore } = getListingRequestUiFlags({
    page: currentPage,
    productCount: accumulatedProducts.length,
    hasData: !!listingSearch.data,
    isLoading: listingSearch.isLoading,
    isFetching: listingSearch.isFetching,
    isPlaceholderData: listingSearch.isPlaceholderData,
    enabled: isCategory,
  })

  const listing = {
    data: listingData,
    isLoading: isInitialLoad,
    isFetchingMore,
    isRefreshing,
    error: listingSearch.error,
  }

  const categoryFacets = {
    data: categoryFacetsData,
    isLoading: listingSearch.isLoading && !listingSearch.data,
  }

  const detail = useProductByCategoryAndProductSlug(
    isProduct ? categoryPath : undefined,
    isProduct ? productSlug : undefined,
    isProduct ? effectiveVariantId : undefined
  )

  const meta = useCategoryPageMeta({
    categorySlug: categoryPath || storePath,
    productsData: listing.data,
    filtersData: categoryFacets.data,
    listingError: listing.error,
    listingLoading: listing.isLoading,
  })

  return {
    storePath,
    resolvingPath,
    resolveError,
    page,
    isCategory,
    isProduct,
    categoryPath,
    productSlug,
    variantId: effectiveVariantId,
    filters,
    setFilters,
    listing,
    detail,
    categoryFacets,
    meta,
  }
}
