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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-900">Danh sách sản phẩm</h1>
        {productCount !== undefined && (
          <span className="text-sm text-gray-500">({productCount} sản phẩm)</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Sort options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">Sắp xếp theo:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
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
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
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
            className={`p-2 rounded-lg transition-colors ${
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

