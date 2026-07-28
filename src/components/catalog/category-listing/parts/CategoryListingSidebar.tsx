import { SearchFacetsSidebar } from '@/components/catalog/_shared/filters/SearchFacetsSidebar'
import { ProductFilters, FilterGroup } from '@/lib/services/products'
import { SIDEBAR } from '@/lib/constant'

interface CategoryListingSidebarProps {
  facetFilters?: FilterGroup[]
  filtersLoading: boolean
  categoryFilters: Omit<ProductFilters, 'category'>
  onFiltersChange: (filters: ProductFilters) => void
}

export function CategoryListingSidebar({
  facetFilters,
  filtersLoading,
  categoryFilters,
  onFiltersChange,
}: CategoryListingSidebarProps) {
  return (
    <aside className="hidden flex-shrink-0 lg:flex" style={{ width: `${SIDEBAR.WIDTH}px` }}>
      <div className="sticky w-full" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
        {filtersLoading || facetFilters === undefined ? (
          <div
            className="space-y-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ width: `${SIDEBAR.WIDTH}px` }}
          >
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-gray-900">Bộ lọc nâng cao</h2>
            </div>
            <p className="text-sm text-gray-500">Đang tải bộ lọc...</p>
          </div>
        ) : (
          <SearchFacetsSidebar
            filters={facetFilters}
            activeFilters={categoryFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>
    </aside>
  )
}
