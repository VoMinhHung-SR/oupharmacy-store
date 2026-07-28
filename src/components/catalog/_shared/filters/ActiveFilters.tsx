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

export function isActiveFacetEntry(key: string, value: unknown): boolean {
  if (NON_FACET_FILTER_KEYS.has(key)) return false
  if (value === undefined || value === null || value === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

export function countActiveFacetFilters(filters: ProductFilters): number {
  return Object.entries(filters).filter(([key, value]) => isActiveFacetEntry(key, value)).length
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
  const optionLabels = useMemo(() => {
    const options: Record<string, Record<string | number, string>> = {}
    filterGroups.forEach((group) => {
      options[group.id] = {}
      group.options.forEach((option) => {
        options[group.id][option.value] = option.label
      })
    })
    return options
  }, [filterGroups])

  const activeFilterEntries = useMemo(
    () => Object.entries(activeFilters).filter(([key, value]) => isActiveFacetEntry(key, value)),
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

  const chipCount = activeFilterEntries.length

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
      <span className="text-sm font-medium text-gray-800">Lọc theo ({chipCount})</span>
      {activeFilterEntries.map(([key, value]) => {
        const displayValue = getFilterDisplayValue(key, value)

        return (
          <span
            key={key}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 sm:text-sm"
          >
            <span className="min-w-0 truncate" title={displayValue}>
              {displayValue}
            </span>
            <button
              type="button"
              onClick={() => onRemoveFilter(key)}
              className="ml-0.5 shrink-0 rounded-full p-0.5 text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`Xóa bộ lọc ${displayValue}`}
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        )
      })}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto text-sm font-medium text-primary-600 focus:outline-none focus-visible:underline"
      >
        Xóa tất cả
      </button>
    </div>
  )
}
