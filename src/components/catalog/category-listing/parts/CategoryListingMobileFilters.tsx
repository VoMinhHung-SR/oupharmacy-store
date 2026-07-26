'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { SearchFacetsSidebar } from '@/components/catalog/_shared/filters/SearchFacetsSidebar'
import { OfferSheet } from '@/components/sheets'
import { ProductFilters, FilterGroup } from '@/lib/services/products'

const NON_FACET_FILTER_KEYS = new Set([
  'page',
  'page_size',
  'ordering',
  'price_sort',
  'category',
  'q',
])

function stripFacetFilters(
  filters: Omit<ProductFilters, 'category'>
): Omit<ProductFilters, 'category'> {
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(filters)) {
    if (NON_FACET_FILTER_KEYS.has(key)) {
      next[key] = value
    }
  }
  return next as Omit<ProductFilters, 'category'>
}

function countFacetFilters(filters: Omit<ProductFilters, 'category'>): number {
  return Object.entries(filters).filter(([key, value]) => {
    if (NON_FACET_FILTER_KEYS.has(key)) return false
    if (value === undefined || value === null || value === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }).length
}

interface CategoryListingMobileFiltersProps {
  open: boolean
  onClose: () => void
  facetFilters?: FilterGroup[]
  filtersLoading: boolean
  categoryFilters: Omit<ProductFilters, 'category'>
  onFiltersChange: (filters: ProductFilters) => void
}

export function CategoryListingMobileFilters({
  open,
  onClose,
  facetFilters,
  filtersLoading,
  categoryFilters,
  onFiltersChange,
}: CategoryListingMobileFiltersProps) {
  const titleId = useId()
  const [draftFilters, setDraftFilters] = useState(categoryFilters)

  useEffect(() => {
    if (open) {
      setDraftFilters(categoryFilters)
    }
  }, [open, categoryFilters])

  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      if (mq.matches) onClose()
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [open, onClose])

  const draftFacetCount = useMemo(() => countFacetFilters(draftFilters), [draftFilters])

  const handleApply = () => {
    onFiltersChange(draftFilters as ProductFilters)
    onClose()
  }

  const handleClear = () => {
    setDraftFilters(stripFacetFilters(draftFilters))
  }

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Bộ lọc"
      placement="bottom"
      rootClassName="lg:hidden"
      panelClassName="max-w-none sm:max-w-lg"
      footer={
        <div className="flex gap-2 border-t border-slate-100 p-3 sm:p-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={draftFacetCount === 0}
            className="h-11 flex-1 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Xóa lọc
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-11 flex-[1.4] rounded-xl bg-primary-600 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Áp dụng{draftFacetCount > 0 ? ` (${draftFacetCount})` : ''}
          </button>
        </div>
      }
      >
      <div className="px-4 pb-2 pt-1 sm:px-5">
        {filtersLoading || facetFilters === undefined ? (
          <p className="py-8 text-center text-sm text-gray-500">Đang tải bộ lọc...</p>
        ) : (
          <SearchFacetsSidebar
            filters={facetFilters}
            activeFilters={draftFilters}
            onFiltersChange={(next) => {
              const { category: _category, ...rest } = next
              setDraftFilters(rest)
            }}
            compact
          />
        )}
      </div>
    </OfferSheet>
  )
}
