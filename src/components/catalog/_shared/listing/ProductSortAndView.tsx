'use client'

import React from 'react'
import { PRODUCT_FILTERS } from '@/lib/constant'
import { FilterIcon } from '@/components/icons'
import { SelectOptionPill } from '@/components/common/SelectOptionPill'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

interface ProductSortAndViewProps {
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  productCount?: number
  /** Mobile filter trigger (hidden from `lg`). */
  onOpenFilters?: () => void
  activeFacetCount?: number
  /** Low-contrast note under the title row. */
  notice?: React.ReactNode
}

const SORT_OPTIONS = PRODUCT_FILTERS.SORT_OPTIONS

export const ProductSortAndView: React.FC<ProductSortAndViewProps> = ({
  sortOption,
  onSortChange,
  productCount,
  onOpenFilters,
  activeFacetCount = 0,
  notice,
}) => {
  const hasActiveFacets = activeFacetCount > 0

  return (
    <div className="mb-3 flex flex-col gap-1.5">
      {/* Row 1: title … | Sắp xếp theo: [a] [b] [c] */}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h1 className="text-base font-semibold text-gray-900 sm:text-lg">Danh sách sản phẩm</h1>
          {productCount !== undefined ? (
            <span className="text-xs text-gray-500 sm:text-sm">({productCount} sản phẩm)</span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
          {onOpenFilters ? (
            <button
              type="button"
              onClick={onOpenFilters}
              className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 lg:hidden ${
                hasActiveFacets
                  ? 'border-primary-300 bg-primary-50 text-primary-800'
                  : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
              }`}
              aria-label={
                hasActiveFacets ? `Bộ lọc, ${activeFacetCount} đang chọn` : 'Mở bộ lọc'
              }
            >
              <FilterIcon className="h-4 w-4" />
              <span>Bộ lọc</span>
              {hasActiveFacets ? (
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
                  {activeFacetCount}
                </span>
              ) : null}
            </button>
          ) : null}

          <span className="shrink-0 text-sm text-gray-600 whitespace-nowrap">Sắp xếp theo:</span>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {SORT_OPTIONS.map((option) => (
              <SelectOptionPill
                key={option.value}
                label={option.label}
                selected={sortOption === option.value}
                onSelect={() => onSortChange(option.value)}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: notice under title */}
      {notice ? <div className="max-w-xl">{notice}</div> : null}
    </div>
  )
}
