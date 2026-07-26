'use client'

import React from 'react'
import { PRODUCT_FILTERS } from '@/lib/constant'
import { GridIcon, ListIcon } from '@/components/icons'

type SortOption = 'bestselling' | 'price-low' | 'price-high'
type ViewMode = 'grid' | 'list'

interface ProductSortAndViewProps {
  sortOption: SortOption
  viewMode: ViewMode
  onSortChange: (sort: SortOption) => void
  onViewModeChange: (mode: ViewMode) => void
  productCount?: number
}

const SORT_OPTIONS = PRODUCT_FILTERS.SORT_OPTIONS

export const ProductSortAndView: React.FC<ProductSortAndViewProps> = ({
  sortOption,
  viewMode,
  onSortChange,
  onViewModeChange,
  productCount,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Danh sách sản phẩm</h1>
        {productCount !== undefined && (
          <span className="text-sm text-gray-500">({productCount} sản phẩm)</span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Sort options */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="hidden shrink-0 text-sm text-gray-700 whitespace-nowrap sm:inline">
            Sắp xếp theo:
          </span>
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 scrollbar-hide">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:px-3 ${
                  sortOption === option.value
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Grid view"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

