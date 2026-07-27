'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PAGINATION } from '@/lib/constant'
import { getListProductKey, Product, ProductFilters } from '@/lib/services/products'
import { pathnameToStorePath, parseVariantIdFromSearch, resolveStorePath } from '@/lib/store-path'
import { useProductByCategoryAndProductSlug } from './useProducts'
import { useStoreSearch } from './useStoreSearch'
import { useCategoryPageMeta } from './useCategoryPageMeta'
import {
  mapSearchFacetsToFilterGroups,
  sortOptionToStoreSearchSort,
  type StoreSearchParams,
} from '@/lib/services/search'

function mergeUniqueProducts(existing: Product[], incoming: Product[]): Product[] {
  if (incoming.length === 0) return existing
  const seen = new Set(existing.map(getListProductKey))
  const next = incoming.filter((item) => {
    const key = getListProductKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return next.length === 0 ? existing : [...existing, ...next]
}

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
    isPending: resolvingPath,
    error: resolveError,
  } = useQuery({
    queryKey: ['resolve-store-path', storePath],
    queryFn: () => resolveStorePath(storePath),
    staleTime: 60_000,
  })

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

  const inStockFilter = useMemo(() => {
    const raw = filters.in_stock as boolean | string | undefined
    if (raw === true || raw === 'true') return true
    if (raw === false || raw === 'false') return false
    return undefined
  }, [filters.in_stock])

  const brandFilter = useMemo(() => {
    if (filters.brand == null || filters.brand === '') return undefined
    return filters.brand
  }, [filters.brand])

  const priceRangeFilter = useMemo(() => {
    const raw = (filters as ProductFilters & { price_range?: string }).price_range
    return raw || undefined
  }, [filters])

  const currentPage = filters.page ?? PAGINATION.DEFAULT_PAGE

  const categorySearchParams = useMemo((): StoreSearchParams | undefined => {
    if (!isCategory || categoryId == null) return undefined
    return {
      q: '',
      category: categoryId,
      page: currentPage,
      page_size: filters.page_size ?? PAGINATION.DEFAULT_PAGE_SIZE,
      sort: searchSort,
      brand: brandFilter,
      price_range: priceRangeFilter,
      in_stock: inStockFilter,
      include_facets: true,
    }
  }, [
    isCategory,
    categoryId,
    currentPage,
    filters.page_size,
    searchSort,
    brandFilter,
    priceRangeFilter,
    inStockFilter,
  ])

  const listingSearch = useStoreSearch(categorySearchParams, {
    enabled: isCategory && categoryId != null && resolved?.over_limit !== true,
  })

  useEffect(() => {
    if (!isCategory || !listingSearch.data) return
    if (listingSearch.isPlaceholderData) return

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

  const categoryFacetsData = useMemo(() => {
    if (!isCategory || !resolved) return undefined
    const facetGroups = mapSearchFacetsToFilterGroups(listingSearch.data?.facets)
    return {
      categorySlug: categoryPath,
      categoryName: resolved.category_name || categoryPath,
      productCount: resolved.product_count ?? listingSearch.data?.meta.total ?? 0,
      hasSubcategories: resolved.has_subcategories ?? false,
      subcategories: resolved.subcategories ?? [],
      overLimit: resolved.over_limit ?? false,
      filters: facetGroups,
    }
  }, [isCategory, resolved, listingSearch.data, categoryPath])

  const isInitialListingLoad =
    listingSearch.isLoading && accumulatedProducts.length === 0 && !listingSearch.data

  const listing = {
    data: listingData,
    isLoading: isInitialListingLoad,
    isFetchingMore: currentPage > 1 && listingSearch.isFetching,
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
