'use client'

import { SearchFacetsSidebar } from '@/components/catalog/_shared/filters/SearchFacetsSidebar'
import { CloseIcon } from '@/components/icons'
import { ProductFilters, FilterGroup } from '@/lib/services/products'
import { SIDEBAR } from '@/lib/constant'

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
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        style={{ zIndex: SIDEBAR.Z_INDEX_OVERLAY }}
        onClick={onClose}
      />
      <aside
        className="fixed left-0 top-0 h-full overflow-y-auto bg-white p-4 shadow-xl lg:hidden"
        style={{ width: `${SIDEBAR.MOBILE_WIDTH}px`, zIndex: SIDEBAR.Z_INDEX_SIDEBAR }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <CloseIcon />
          </button>
        </div>
        {filtersLoading || facetFilters === undefined ? (
          <div className="space-y-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h2>
            <p className="text-sm text-gray-500">Đang tải bộ lọc...</p>
          </div>
        ) : (
          <SearchFacetsSidebar
            filters={facetFilters}
            activeFilters={categoryFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </aside>
    </>
  )
}
