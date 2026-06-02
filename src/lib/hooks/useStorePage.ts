'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PAGINATION } from '@/lib/constant'
import { ProductFilters } from '@/lib/services/products'
import { pathnameToStorePath, parseVariantIdFromSearch, resolveStorePath } from '@/lib/store-path'
import { useProductsByCategorySlug, useProductByCategoryAndProductSlug } from './useProducts'
import { useDynamicFilters } from './useDynamicFilters'
import { useCategoryPageMeta } from './useCategoryPageMeta'

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
  const productSlug = resolved?.product_slug ?? ''
  const effectiveVariantId = variantId ?? resolved?.default_variant_id ?? undefined

  const [filters, setFilters] = useState<ProductFilters>({
    page: PAGINATION.DEFAULT_PAGE,
    page_size: PAGINATION.DEFAULT_PAGE_SIZE,
  })

  const listingFilters = useMemo(() => {
    const { category: _, ...rest } = filters
    return rest
  }, [filters])

  const listing = useProductsByCategorySlug(isCategory ? categoryPath : undefined, listingFilters)

  const detail = useProductByCategoryAndProductSlug(
    isProduct ? categoryPath : undefined,
    isProduct ? productSlug : undefined,
    isProduct ? effectiveVariantId : undefined
  )

  const dynamicFilters = useDynamicFilters(
    isCategory ? categoryPath : undefined,
    { include_variants: true, include_counts: true },
    isCategory
  )

  const meta = useCategoryPageMeta({
    categorySlug: categoryPath || storePath,
    productsData: listing.data,
    filtersData: dynamicFilters.data,
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
    dynamicFilters,
    meta,
  }
}
