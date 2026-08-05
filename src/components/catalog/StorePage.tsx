'use client'

import React from 'react'
import { useStorePage } from '@/lib/hooks/useStorePage'
import { CategoryListingPageContent } from '@/components/catalog/category-listing/CategoryListingPageContent'
import { ProductDetailPageContent } from '@/components/catalog/product-detail/ProductDetailPageContent'
import { OverLimitMessage } from '@/components/catalog/_shared/category/OverLimitMessage'
import { CategoryListingSkeleton } from '@/components/catalog/_shared/listing/CategoryListingSkeleton'
import { NotFoundContent } from '@/components/NotFoundContent'
import { ProductDetailPageSkeleton } from '@/components/catalog/product-detail/ProductDetailPageSkeleton'
import { pendingShellWhileResolving } from '@/lib/store-path/loading-hint'

type StorePageProps = {
  minSegments?: number
}

/**
 * Catalog route shell.
 * - While resolve is in flight: in-page skeleton from nav intent (not full-screen backdrop).
 * - After resolve: correct page; listing/detail use their own loading / isRefreshing.
 */
export function StorePage({ minSegments = 1 }: StorePageProps) {
  const {
    storePath,
    navIntent,
    resolvingPath,
    previousResolvedWhileNavigating,
    page,
    isCategory,
    isProduct,
    categoryPath,
    productSlug,
    filters,
    setFilters,
    listing,
    detail,
    categoryFacets,
    meta,
  } = useStorePage()

  const segmentCount = storePath ? storePath.split('/').filter(Boolean).length : 0
  if (segmentCount < minSegments) {
    return null
  }

  if (resolvingPath) {
    const shell = pendingShellWhileResolving(storePath, {
      intent: navIntent,
      previous: previousResolvedWhileNavigating,
    })
    return shell === 'product' ? <ProductDetailPageSkeleton /> : <CategoryListingSkeleton />
  }

  if (isProduct && productSlug) {
    // Avoid empty “not found” flash for one frame before the detail query starts fetching.
    const detailLoading =
      !detail.data && (detail.isPending || detail.isLoading || detail.isFetching)
    return (
      <ProductDetailPageContent
        product={detail.data}
        categorySlug={categoryPath}
        productSlug={productSlug}
        loading={detailLoading}
        error={detail.error}
      />
    )
  }

  if (page === 'not_found') {
    return <NotFoundContent />
  }

  if (
    isCategory &&
    meta.isOverLimit &&
    !listing.isLoading &&
    !categoryFacets.isLoading &&
    (listing.data || categoryFacets.data) &&
    (meta.subcategories.length > 0 || meta.productCount > 0)
  ) {
    return (
      <OverLimitMessage
        categoryName={meta.categoryName || categoryPath}
        productCount={meta.productCount}
        subcategories={meta.subcategories}
        categorySlug={categoryPath}
      />
    )
  }

  if (isCategory) {
    return (
      <CategoryListingPageContent
        categorySlug={categoryPath}
        products={listing.data?.results || []}
        totalCount={listing.data?.count || 0}
        loading={listing.isLoading || (categoryFacets.isLoading && !listing.data)}
        isRefreshing={listing.isRefreshing}
        isFetchingMore={listing.isFetchingMore}
        error={listing.error}
        categoryName={meta.categoryName}
        subcategories={meta.subcategories}
        facetFilters={categoryFacets.data?.filters ?? undefined}
        filtersLoading={categoryFacets.isLoading}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  }

  return <NotFoundContent />
}
