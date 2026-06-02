import { DynamicFiltersSidebar } from '@/components/catalog/_shared/filters/DynamicFiltersSidebar'
import { ProductFilters, FilterGroup } from '@/lib/services/products'
import { SIDEBAR } from '@/lib/constant'

interface CategoryListingSidebarProps {
  dynamicFilters?: FilterGroup[]
  filtersLoading: boolean
  categoryFilters: Omit<ProductFilters, 'category'>
  onFiltersChange: (filters: ProductFilters) => void
}

export function CategoryListingSidebar({
  dynamicFilters,
  filtersLoading,
  categoryFilters,
  onFiltersChange,
}: CategoryListingSidebarProps) {
  return (
    <aside className="hidden flex-shrink-0 lg:flex" style={{ width: `${SIDEBAR.WIDTH}px` }}>
      <div className="sticky w-full" style={{ top: `${SIDEBAR.STICKY_TOP}px` }}>
        {filtersLoading || dynamicFilters === undefined ? (
          <div className="space-y-4 rounded-lg bg-white p-4" style={{ width: `${SIDEBAR.WIDTH}px` }}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h2>
            <p className="text-sm text-gray-500">Đang tải bộ lọc...</p>
          </div>
        ) : (
          <DynamicFiltersSidebar
            filters={dynamicFilters}
            activeFilters={categoryFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>
    </aside>
  )
}
