'use client'

import React, { useState, useMemo } from 'react'
import { FilterGroup, FilterOption, ProductFilters } from '@/lib/services/products'
import { CheckIcon, ChevronDownIcon, FilterIcon, SearchIcon } from '@/components/icons'
import { SIDEBAR } from '@/lib/constant'

interface SearchFacetsSidebarProps {
  filters: FilterGroup[]
  activeFilters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  /** Fill parent width (mobile drawer); default keeps desktop column width. */
  compact?: boolean
}

function FacetsSidebarHeader() {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5">
      <FilterIcon className="h-4 w-4 text-primary-600" />
      <h2 className="text-base font-semibold text-gray-900">Bộ lọc nâng cao</h2>
    </div>
  )
}

export function SearchFacetsSidebar({
  filters,
  activeFilters,
  onFiltersChange,
  compact = false,
}: SearchFacetsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>({})
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})

  const handleFilterToggle = (
    filterId: string,
    optionValue: string | number,
    isMultiple: boolean
  ) => {
    const newFilters: ProductFilters = { ...activeFilters }
    const bag = newFilters as Record<string, string | number | boolean | undefined>

    if (isMultiple) {
      const currentValue = bag[filterId]
      let currentValues: string[] = []
      if (typeof currentValue === 'string') {
        currentValues = currentValue.split(',').filter(Boolean)
      } else if (typeof currentValue === 'number') {
        currentValues = [String(currentValue)]
      }
      const valueStr = String(optionValue)
      const index = currentValues.indexOf(valueStr)

      if (index > -1) {
        currentValues.splice(index, 1)
      } else {
        currentValues.push(valueStr)
      }

      if (currentValues.length > 0) {
        bag[filterId] = currentValues.join(',')
      } else {
        delete bag[filterId]
      }
    } else if (bag[filterId] === optionValue || String(bag[filterId]) === String(optionValue)) {
      delete bag[filterId]
    } else {
      bag[filterId] = optionValue
    }

    onFiltersChange(newFilters)
  }

  const isFilterActive = (filterId: string, optionValue: string | number): boolean => {
    const value = activeFilters[filterId as keyof ProductFilters]
    if (value === undefined || value === null || value === '') return false

    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').includes(String(optionValue))
    }

    return value === optionValue || String(value) === String(optionValue)
  }

  const getActiveFiltersCount = (filterId: string): number => {
    const value = activeFilters[filterId as keyof ProductFilters]
    if (value === undefined || value === null || value === '') return 0

    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').filter(Boolean).length
    }

    return 1
  }

  const shellClass = compact
    ? 'w-full min-w-0 bg-white'
    : 'w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'
  const shellStyle = compact ? undefined : { width: `${SIDEBAR.WIDTH}px` }

  if (!filters || filters.length === 0) {
    return (
      <div className={shellClass} style={shellStyle}>
        {!compact ? <FacetsSidebarHeader /> : null}
        <p className="px-4 py-6 text-sm text-gray-500">Không có bộ lọc khả dụng</p>
      </div>
    )
  }

  return (
    <div className={shellClass} style={shellStyle}>
      {!compact ? <FacetsSidebarHeader /> : null}

      <div className={compact ? 'space-y-1' : 'divide-y divide-gray-100'}>
        {filters.map((filterGroup) => (
          <FilterGroupItem
            key={filterGroup.id}
            filterGroup={filterGroup}
            expanded={expandedSections[filterGroup.id] ?? true}
            showMore={showMoreStates[filterGroup.id] ?? false}
            searchQuery={searchQueries[filterGroup.id] || ''}
            onToggleSection={() =>
              setExpandedSections((prev) => ({
                ...prev,
                [filterGroup.id]: !(prev[filterGroup.id] ?? true),
              }))
            }
            onToggleShowMore={() =>
              setShowMoreStates((prev) => ({
                ...prev,
                [filterGroup.id]: !prev[filterGroup.id],
              }))
            }
            onSearchChange={(query) =>
              setSearchQueries((prev) => ({ ...prev, [filterGroup.id]: query }))
            }
            onFilterToggle={handleFilterToggle}
            isFilterActive={isFilterActive}
            getActiveFiltersCount={getActiveFiltersCount}
          />
        ))}
      </div>
    </div>
  )
}

interface FilterGroupItemProps {
  filterGroup: FilterGroup
  expanded: boolean
  showMore: boolean
  searchQuery: string
  onToggleSection: () => void
  onToggleShowMore: () => void
  onSearchChange: (query: string) => void
  onFilterToggle: (filterId: string, optionValue: string | number, isMultiple: boolean) => void
  isFilterActive: (filterId: string, optionValue: string | number) => boolean
  getActiveFiltersCount: (filterId: string) => number
}

function FilterGroupItem({
  filterGroup,
  expanded,
  showMore,
  searchQuery,
  onToggleSection,
  onToggleShowMore,
  onSearchChange,
  onFilterToggle,
  isFilterActive,
  getActiveFiltersCount,
}: FilterGroupItemProps) {
  const maxVisible = filterGroup.maxVisible || 8
  const isMultiple = filterGroup.type === 'multiple'
  const isRange = filterGroup.type === 'range' || filterGroup.id === 'price_range'
  const showSearch =
    (isMultiple || filterGroup.id === 'brand') && filterGroup.options.length > maxVisible

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return filterGroup.options
    return filterGroup.options.filter((option) => option.label.toLowerCase().includes(query))
  }, [filterGroup.options, searchQuery])

  const visibleOptions = showMore ? filteredOptions : filteredOptions.slice(0, maxVisible)
  const hasMore = filteredOptions.length > maxVisible
  const activeCount = getActiveFiltersCount(filterGroup.id)

  return (
    <div className="px-4 py-3.5">
      <button
        type="button"
        onClick={onToggleSection}
        className="mb-0 flex w-full items-center justify-between gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{filterGroup.label}</h3>
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-50 px-1.5 text-[11px] font-semibold text-primary-700">
              {activeCount}
            </span>
          ) : null}
        </div>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" rotated={expanded} />
      </button>

      {expanded ? (
        <div className="mt-3 space-y-2.5">
          {showSearch ? (
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm theo tên"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <SearchIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          ) : null}

          {isRange ? (
            <div className="space-y-2">
              {visibleOptions.map((option) => {
                const isActive = isFilterActive(filterGroup.id, option.value)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onFilterToggle(filterGroup.id, option.value, false)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      isActive
                        ? 'border-primary-500 bg-primary-50 font-medium text-primary-800'
                        : 'border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{option.label}</span>
                      {option.count !== undefined ? (
                        <span className={`text-xs ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                          ({option.count})
                        </span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <ul className="space-y-1">
              {visibleOptions.map((option) => (
                <FacetOptionRow
                  key={option.id}
                  option={option}
                  multiple={isMultiple}
                  active={isFilterActive(filterGroup.id, option.value)}
                  onToggle={() => onFilterToggle(filterGroup.id, option.value, isMultiple)}
                />
              ))}
            </ul>
          )}

          {hasMore ? (
            <button
              type="button"
              onClick={onToggleShowMore}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 focus:outline-none focus-visible:underline"
            >
              {showMore ? 'Thu gọn' : `Xem thêm (${filteredOptions.length - maxVisible})`}
              <ChevronDownIcon className="h-3.5 w-3.5" rotated={showMore} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function FacetOptionRow({
  option,
  multiple,
  active,
  onToggle,
}: {
  option: FilterOption
  multiple: boolean
  active: boolean
  onToggle: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
            multiple ? 'rounded' : 'rounded-full'
          } ${
            active
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-gray-300 bg-white'
          }`}
          aria-hidden
        >
          {active ? (
            multiple ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )
          ) : null}
        </span>
        <span className={`min-w-0 flex-1 text-sm ${active ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
          {option.label}
        </span>
        {option.count !== undefined ? (
          <span className="shrink-0 text-xs text-gray-400">({option.count})</span>
        ) : null}
      </button>
    </li>
  )
}
