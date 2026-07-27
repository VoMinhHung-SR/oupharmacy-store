'use client'
import React, { useMemo } from 'react'
import { ProductFilters, FilterGroup } from '@/lib/services/products'
import { XIcon } from '@/components/icons'

/** Keys that are pagination/sort/search meta — never shown as facet chips. */
export const NON_FACET_FILTER_KEYS = new Set([
  'page',
  'page_size',
  'ordering',
  'price_sort',
  'category',
  'q',
])

export function stripFacetFilters(filters: ProductFilters): ProductFilters {
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(filters)) {
    if (NON_FACET_FILTER_KEYS.has(key)) {
      next[key] = value
    }
  }
  return next as ProductFilters
}

interface ActiveFiltersProps {
  activeFilters: ProductFilters
  filterGroups: FilterGroup[]
  onRemoveFilter: (filterKey: string) => void
  onClearAll: () => void
}

export function ActiveFilters({
  activeFilters,
  filterGroups,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const { filterLabels, optionLabels } = useMemo(() => {
    const labels: Record<string, string> = {}
    const options: Record<string, Record<string | number, string>> = {}

    filterGroups.forEach((group) => {
      labels[group.id] = group.label
      options[group.id] = {}
      group.options.forEach((option) => {
        options[group.id][option.value] = option.label
      })
    })

    return { filterLabels: labels, optionLabels: options }
  }, [filterGroups])

  const activeFilterEntries = useMemo(
    () =>
      Object.entries(activeFilters).filter(([key, value]) => {
        if (NON_FACET_FILTER_KEYS.has(key)) return false
        if (value === undefined || value === null || value === '') return false
        if (Array.isArray(value) && value.length === 0) return false
        return true
      }),
    [activeFilters]
  )

  if (activeFilterEntries.length === 0) {
    return null
  }

  const getFilterDisplayValue = (key: string, value: unknown): string => {
    if (typeof value === 'string' && value.includes(',')) {
      const values = value.split(',').filter(Boolean)
      return values.map((v) => optionLabels[key]?.[v] || v).join(', ')
    }

    const optionLabel = optionLabels[key]?.[value as string | number]
    return optionLabel || String(value)
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-700 sm:text-sm">Bộ lọc đang áp dụng:</span>
      {activeFilterEntries.map(([key, value]) => {
        const displayValue = getFilterDisplayValue(key, value)
        const filterLabel = filterLabels[key] || key

        return (
          <span
            key={key}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700 sm:text-sm"
          >
            <span className="min-w-0 truncate" title={`${filterLabel}: ${displayValue}`}>
              {filterLabel}: {displayValue}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFilter(key)}
              className="ml-1 shrink-0 hover:text-primary-900"
              aria-label={`Xóa bộ lọc ${filterLabel}`}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </span>
        )
      })}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-primary-600 underline hover:text-primary-700 sm:text-sm"
      >
        Xóa tất cả
      </button>
    </div>
  )
}
