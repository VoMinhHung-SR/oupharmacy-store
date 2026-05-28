'use client'

import React from 'react'
import { useStorePage } from '@/lib/hooks/useStorePage'
import { CategoryListingPageContent } from '@/components/products/CategoryListingPageContent'
import { ProductDetailPageContent } from '@/components/products/ProductDetailPageContent'
import { OverLimitMessage } from '@/components/products/OverLimitMessage'
import { NotFoundContent } from '@/components/NotFoundContent'

type StorePageProps = {
  minSegments?: number
}

export function StorePage({ minSegments = 1 }: StorePageProps) {
  const {
    storePath,
    resolving,
    page,
    isCategory,
    isProduct,
    categoryPath,
    productSlug,
    filters,
    setFilters,
    listing,
    detail,
    dynamicFilters,
    meta,
  } = useStorePage()

  const segmentCount = storePath ? storePath.split('/').filter(Boolean).length : 0
  if (segmentCount < minSegments) {
    return null
  }

  if (resolving) {
    return (
      <CategoryListingPageContent
        categorySlug={storePath}
        products={[]}
        totalCount={0}
        loading
        error={null}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  }

  if (isProduct && productSlug) {
    return (
      <ProductDetailPageContent
        product={detail.data}
        categorySlug={categoryPath}
        productSlug={productSlug}
        loading={detail.isLoading}
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
    !dynamicFilters.isLoading &&
    (listing.data || dynamicFilters.data) &&
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
        loading={listing.isLoading || dynamicFilters.isLoading}
        error={listing.error}
        categoryName={meta.categoryName}
        subcategories={meta.subcategories}
        dynamicFilters={dynamicFilters.data?.filters ?? undefined}
        filtersLoading={dynamicFilters.isLoading}
        filters={filters}
        onFiltersChange={setFilters}
      />
    )
  }

  return <NotFoundContent />
}
