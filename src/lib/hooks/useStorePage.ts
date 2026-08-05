'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PAGINATION } from '@/lib/constant'
import { mergeUniqueProducts, Product, ProductFilters } from '@/lib/services/products'
import { pathnameToStorePath, parseVariantIdFromSearch, resolveStorePath } from '@/lib/store-path'
import type { ResolvedStorePath } from '@/lib/store-path'
import { clearStoreNavIntent, peekStoreNavIntent } from '@/lib/store-path/nav-intent'
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

/** Last aligned resolve — survives soft nav for pending-shell hints. */
let lastAlignedResolvedStorePath: ResolvedStorePath | null = null

function resolvedPathKey(resolved: ResolvedStorePath): string {
  if (resolved.page === 'product' && resolved.product_slug) {
    return [resolved.category_path, resolved.product_slug].filter(Boolean).join('/')
  }
  if (resolved.page === 'category') {
    return resolved.category_path || ''
  }
  return ''
}

/**
 * Store path page: resolve routing, then category browse via search-first
 * (GET /search/?category=) with facets from the same response.
 *
 * UI: resolve decides page type; listing/detail use in-page skeletons / grid
 * refresh — no full-screen route backdrop.
 */
export function useStorePage() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const storePath = useMemo(() => pathnameToStorePath(pathname), [pathname])
  const variantId = parseVariantIdFromSearch(searchParams)
  const navIntent = peekStoreNavIntent(storePath)

  const {
    data: resolved,
    isPlaceholderData,
    error: resolveError,
  } = useQuery({
    queryKey: ['resolve-store-path', storePath],
    queryFn: () => resolveStorePath(storePath),
    staleTime: 60_000,
  })

  const resolveAligned =
    Boolean(resolved) && resolvedPathKey(resolved as ResolvedStorePath) === storePath

  const liveResolved =
    resolveAligned && !isPlaceholderData ? (resolved as ResolvedStorePath) : undefined

  const resolvingPath = !liveResolved && !resolveError

  useEffect(() => {
    if (liveResolved) {
      lastAlignedResolvedStorePath = liveResolved
      clearStoreNavIntent()
    }
  }, [liveResolved])

  const page = liveResolved?.page ?? 'not_found'
  const isCategory = page === 'category'
  const isProduct = page === 'product'
  const categoryPath = liveResolved?.category_path ?? ''
  const categoryId = liveResolved?.category_id ?? null
  const productSlug = liveResolved?.product_slug ?? ''
  const effectiveVariantId = variantId ?? liveResolved?.default_variant_id ?? undefined

  const [filters, setFilters] = useState<ProductFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    page_size: PAGINATION.DEFAULT_PAGE_SIZE,
  })
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])
  const [productsForCategoryId, setProductsForCategoryId] = useState<number | null>(null)

  useEffect(() => {
    setFilters({
      page: PAGINATION.DEFAULT_PAGE,
      page_size: PAGINATION.DEFAULT_PAGE_SIZE,
    })
    setAccumulatedProducts([])
    setProductsForCategoryId(null)
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
      origin_country: facetParams.origin_country,
      price_range: facetParams.price_range,
      in_stock: facetParams.in_stock,
      attrs: facetParams.attrs.length ? facetParams.attrs : undefined,
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
    enabled: isCategory && categoryId != null && liveResolved?.over_limit !== true,
  })

  useEffect(() => {
    if (!isCategory || categoryId == null || !listingSearch.data || listingSearch.isPlaceholderData) {
      return
    }

    const items = listingSearch.data.items ?? []
    if (currentPage <= 1) {
      setAccumulatedProducts(items)
    } else {
      setAccumulatedProducts((prev) => mergeUniqueProducts(prev, items))
    }
    setProductsForCategoryId(categoryId)
  }, [
    isCategory,
    categoryId,
    listingSearch.data,
    listingSearch.dataUpdatedAt,
    listingSearch.isPlaceholderData,
    currentPage,
  ])

  const productsMatchCategory =
    categoryId != null && productsForCategoryId === categoryId

  const listingData = useMemo(() => {
    if (!isCategory || !liveResolved) return undefined
    const search = listingSearch.data
    const total = search?.meta.total ?? liveResolved.product_count ?? 0
    return {
      categorySlug: categoryPath,
      categoryName: liveResolved.category_name || categoryPath,
      productCount: liveResolved.product_count ?? total,
      hasSubcategories:
        liveResolved.has_subcategories ?? (liveResolved.subcategories?.length ?? 0) > 0,
      subcategories: liveResolved.subcategories ?? [],
      overLimit: liveResolved.over_limit ?? false,
      count: total,
      results: productsMatchCategory ? accumulatedProducts : [],
    }
  }, [
    isCategory,
    liveResolved,
    listingSearch.data,
    categoryPath,
    accumulatedProducts,
    productsMatchCategory,
  ])

  const hasActiveFacetFilters =
    facetParams.brand != null ||
    facetParams.origin_country != null ||
    facetParams.price_range != null ||
    facetParams.in_stock != null ||
    facetParams.attrs.length > 0

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

  const listingEnabled = isCategory && categoryId != null && liveResolved?.over_limit !== true
  const listingAwaitingMatchedProducts =
    listingEnabled && !productsMatchCategory && !listingSearch.error

  const { isInitialLoad, isRefreshing, isFetchingMore } = getListingRequestUiFlags({
    page: currentPage,
    productCount: productsMatchCategory ? accumulatedProducts.length : 0,
    hasData: !!listingSearch.data && productsMatchCategory,
    isLoading: listingSearch.isLoading || listingAwaitingMatchedProducts,
    isFetching: listingSearch.isFetching || listingAwaitingMatchedProducts,
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
    isLoading: (listingSearch.isLoading && !listingSearch.data) || listingAwaitingMatchedProducts,
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
    navIntent,
    resolvingPath,
    previousResolvedWhileNavigating: resolvingPath
      ? lastAlignedResolvedStorePath
      : undefined,
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
