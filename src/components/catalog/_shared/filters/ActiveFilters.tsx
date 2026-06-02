'use client'
import React, { useMemo } from 'react'
import { ProductFilters, FilterGroup } from '@/lib/services/products'
import { XIcon } from '@/components/icons'

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
  // Build filter labels map from filterGroups (memoized)
  const { filterLabels, optionLabels } = useMemo(() => {
    const labels: Record<string, string> = {}
    const options: Record<string, Record<string | number, string>> = {}
  
  filterGroups.forEach(group => {
      labels[group.id] = group.label
      options[group.id] = {}
    group.options.forEach(option => {
        options[group.id][option.value] = option.label
    })
  })
    
    return { filterLabels: labels, optionLabels: options }
  }, [filterGroups])

  // Get active filter entries (memoized)
  const activeFilterEntries = useMemo(() => 
    Object.entries(activeFilters).filter(
    ([key, value]) => 
      value !== undefined && 
      value !== null && 
      value !== '' && 
      key !== 'page' && 
      key !== 'page_size'
    ),
    [activeFilters]
  )
  
  if (activeFilterEntries.length === 0) {
    return null
  }

  const getFilterDisplayValue = (key: string, value: any): string => {
    // Handle comma-separated values (multi-select)
    if (typeof value === 'string' && value.includes(',')) {
      const values = value.split(',').filter(Boolean)
      const labels = values.map(v => {
        const optionLabel = optionLabels[key]?.[v]
        return optionLabel || v
      })
      return labels.join(', ')
    }
    
    // Handle single value
    const optionLabel = optionLabels[key]?.[value]
    return optionLabel || String(value)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
      {activeFilterEntries.map(([key, value]) => {
        const displayValue = getFilterDisplayValue(key, value)
        const filterLabel = filterLabels[key] || key
        
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
          >
            <span>{filterLabel}: {displayValue}</span>
            <button
              onClick={() => onRemoveFilter(key)}
              className="hover:text-primary-900 ml-1"
              aria-label={`Remove ${filterLabel} filter`}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </span>
        )
      })}
      <button
        onClick={onClearAll}
        className="text-sm text-primary-600 hover:text-primary-700 underline"
      >
        Xóa tất cả
      </button>
    </div>
  )
}
