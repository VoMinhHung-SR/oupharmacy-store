'use client'

import { useMemo, useState } from 'react'
import { Product, ProductFilters } from '@/lib/services/products'
import { PAGINATION, PRODUCT_LISTING } from '@/lib/constant'

export type CategorySortOption = 'bestselling' | 'price-low' | 'price-high'
export type CategoryViewMode = 'grid' | 'list'

interface UseCategoryListingPageParams {
  categorySlug: string
  products: Product[]
  categoryName?: string | null
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function useCategoryListingPage({
  categorySlug,
  products,
  categoryName,
  filters,
  onFiltersChange,
}: UseCategoryListingPageParams) {
  const [sortOption, setSortOption] = useState<CategorySortOption>(PRODUCT_LISTING.DEFAULT_SORT)
  const [viewMode, setViewMode] = useState<CategoryViewMode>(PRODUCT_LISTING.DEFAULT_VIEW_MODE)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const categoryFilters = useMemo(() => {
    const { category: _, ...rest } = filters
    return rest
  }, [filters])

  // Search-first: sort is applied on the server via GET /search/?sort=
  const sortedProducts = products

  const handleSortChange = (sort: CategorySortOption) => {
    setSortOption(sort)
    const newFilters: Omit<ProductFilters, 'category'> = { ...categoryFilters }

    if (sort === 'price-low') {
      newFilters.price_sort = 'asc'
      newFilters.ordering = 'price_value'
    } else if (sort === 'price-high') {
      newFilters.price_sort = 'desc'
      newFilters.ordering = '-price_value'
    } else {
      delete newFilters.price_sort
      delete newFilters.ordering
    }

    onFiltersChange(newFilters as ProductFilters)
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    const { category: _, ...filtersWithoutCategory } = newFilters
    const updatedFilters: ProductFilters = {
      ...filtersWithoutCategory,
      page: PAGINATION.DEFAULT_PAGE,
      page_size: filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE,
    } as ProductFilters
    onFiltersChange(updatedFilters)
  }

  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [{ label: 'Trang chủ', href: '/' }]

    let categoryArray: Array<{ name: string; slug: string }> = []

    if (products.length > 0 && products[0].category_info?.category) {
      categoryArray = products[0].category_info.category
    }

    if (categoryArray.length > 0) {
      const slugParts = categorySlug.split('/')
      const relevantCategories = categoryArray.slice(0, slugParts.length)

      let accumulatedPath = ''
      relevantCategories.forEach((cat, index) => {
        accumulatedPath += index === 0 ? cat.slug : `/${cat.slug}`
        const isLast = index === relevantCategories.length - 1

        if (!isLast) {
          items.push({ label: cat.name, href: `/${accumulatedPath}` })
        } else {
          items.push({ label: cat.name })
        }
      })
    } else {
      const slugParts = categorySlug.split('/')
      let accumulatedPath = ''

      slugParts.forEach((slugPart, index) => {
        accumulatedPath += index === 0 ? slugPart : `/${slugPart}`
        const isLast = index === slugParts.length - 1
        const label = slugPart.replace(/-/g, ' ')

        if (!isLast) {
          items.push({ label, href: `/${accumulatedPath}` })
        } else {
          items.push({ label })
        }
      })
    }

    return items
  }, [categorySlug, products])

  return {
    sortOption,
    viewMode,
    setViewMode,
    showMobileFilters,
    setShowMobileFilters,
    categoryFilters,
    sortedProducts,
    handleSortChange,
    handleFiltersChange,
    breadcrumbItems,
  }
}
