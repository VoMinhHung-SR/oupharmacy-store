'use client'
import React, { useState, useCallback, useMemo } from 'react'
import { FilterGroup, ProductFilters } from '@/lib/services/products'
import { ChevronDownIcon, SearchIcon } from '@/components/icons'
import { SIDEBAR } from '@/lib/constant'

interface DynamicFiltersSidebarProps {
  filters: FilterGroup[]
  activeFilters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function DynamicFiltersSidebar({
  filters,
  activeFilters,
  onFiltersChange,
}: DynamicFiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [showMoreStates, setShowMoreStates] = useState<Record<string, boolean>>({})
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({})

  const handleFilterToggle = useCallback((filterId: string, optionValue: string | number, isMultiple: boolean) => {
    const newFilters = { ...activeFilters }
    
    if (isMultiple) {
      // Multi-select: use comma-separated string
      const currentValue = newFilters[filterId as keyof ProductFilters] as string | undefined
      const currentValues = currentValue?.split(',').filter(Boolean) || []
      const valueStr = String(optionValue)
      const index = currentValues.indexOf(valueStr)
      
      if (index > -1) {
        currentValues.splice(index, 1)
      } else {
        currentValues.push(valueStr)
      }
      
      if (currentValues.length > 0) {
        newFilters[filterId as keyof ProductFilters] = currentValues.join(',') as any
      } else {
        delete newFilters[filterId as keyof ProductFilters]
      }
    } else {
      // Single select: toggle
      const currentValue = newFilters[filterId as keyof ProductFilters]
      if (currentValue === optionValue) {
        delete newFilters[filterId as keyof ProductFilters]
      } else {
        newFilters[filterId as keyof ProductFilters] = optionValue as any
      }
    }
    
    onFiltersChange(newFilters)
  }, [activeFilters, onFiltersChange])

  const isFilterActive = useCallback((filterId: string, optionValue: string | number): boolean => {
    const value = activeFilters[filterId as keyof ProductFilters]
    if (!value) return false
    
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').includes(String(optionValue))
    }
    
    return value === optionValue
  }, [activeFilters])

  const getActiveFiltersCount = useCallback((filterId: string): number => {
    const value = activeFilters[filterId as keyof ProductFilters]
    if (!value) return 0
    
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').length
    }
    
    return 1
  }, [activeFilters])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleShowMore = (filterId: string) => {
    setShowMoreStates((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }))
  }

  // Memoize filtered options to avoid recalculating on every render
  const getFilteredOptions = React.useCallback((filterGroup: FilterGroup): FilterGroup['options'] => {
    const searchQuery = searchQueries[filterGroup.id]?.toLowerCase() || ''
    if (!searchQuery) return filterGroup.options
    
    return filterGroup.options.filter(option =>
      option.label.toLowerCase().includes(searchQuery)
    )
  }, [searchQueries])

  // Always show filter sidebar container, even if no filters
  // Empty state will be handled by parent component
  if (!filters || filters.length === 0) {
    return (
      <div className="space-y-4 bg-white rounded-lg p-4" style={{ width: `${SIDEBAR.WIDTH}px` }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc nâng cao</h2>
        <p className="text-sm text-gray-500">Không có bộ lọc khả dụng</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4" style={{ width: `${SIDEBAR.WIDTH}px` }}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc nâng cao</h2>

      {filters.map((filterGroup) => {
        const isExpanded = expandedSections[filterGroup.id] ?? true
        const showMore = showMoreStates[filterGroup.id] ?? false
        const maxVisible = filterGroup.maxVisible || 5
        const filteredOptions = getFilteredOptions(filterGroup)
        const visibleOptions = useMemo(() => 
          showMore ? filteredOptions : filteredOptions.slice(0, maxVisible),
          [showMore, filteredOptions, maxVisible]
        )
        const hasMore = filteredOptions.length > maxVisible
        const activeCount = getActiveFiltersCount(filterGroup.id)
        const isMultiple = filterGroup.type === 'multiple'

        return (
          <div key={filterGroup.id} className="border-b border-gray-200 pb-4 last:border-0">
            <button
              onClick={() => toggleSection(filterGroup.id)}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{filterGroup.label}</h3>
                {activeCount > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <ChevronDownIcon 
                className="w-5 h-5 text-gray-500" 
                rotated={isExpanded}
              />
            </button>

            {isExpanded && (
              <div className="space-y-3">
                {/* Search input for text-based filters */}
                {filterGroup.type === 'multiple' && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm theo tên"
                      value={searchQueries[filterGroup.id] || ''}
                      onChange={(e) => setSearchQueries(prev => ({
                        ...prev,
                        [filterGroup.id]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <SearchIcon />
                    </div>
                  </div>
                )}

                {/* Filter Options */}
                <div className="space-y-2">
                  {filterGroup.type === 'range' ? (
                    // Price range buttons
                    visibleOptions.map((option, index) => {
                      const isActive = isFilterActive(filterGroup.id, option.value)
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleFilterToggle(filterGroup.id, option.value, false)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-primary-100 text-primary-700 border border-primary-500'
                              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {option.label}
                          {option.count !== undefined && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({option.count})
                            </span>
                          )}
                        </button>
                      )
                    })
                  ) : (
                    // Checkboxes or radio buttons
                    visibleOptions.map((option) => {
                      const isActive = isFilterActive(filterGroup.id, option.value)
                      return (
                        <label
                          key={option.id}
                          className="flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type={isMultiple ? 'checkbox' : 'radio'}
                              checked={isActive}
                              onChange={() => handleFilterToggle(
                                filterGroup.id,
                                option.value,
                                isMultiple
                              )}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-primary-600">
                              {option.label}
                            </span>
                          </div>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      )
                    })
                  )}
                </div>

                {/* Show More / Show Less */}
                {hasMore && (
                  <button
                    onClick={() => toggleShowMore(filterGroup.id)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {showMore ? 'Thu gọn' : `Xem thêm (${filteredOptions.length - maxVisible})`}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
