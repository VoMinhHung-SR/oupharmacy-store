import { Container } from '@/components/Container'
import Breadcrumb, { type CrumbItem } from '@/components/Breadcrumb'
import { FacetsSidebarSkeleton } from '@/components/skeletons/FacetsSidebarSkeleton'
import { ListingToolbarSkeleton } from '@/components/skeletons/ListingToolbarSkeleton'
import { ProductGridSkeleton } from '@/components/skeletons/ProductGridSkeleton'
import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

export type ProductListingSkeletonVariant = 'category' | 'search'

interface ProductListingSkeletonProps {
  variant?: ProductListingSkeletonVariant
  /** Search may pass real crumbs; category uses pulse. */
  breadcrumbItems?: CrumbItem[]
  cardCount?: number
}

/** First-load skeleton for category listing and `/tim-kiem`. */
export function ProductListingSkeleton({
  variant = 'category',
  breadcrumbItems,
  cardCount = 8,
}: ProductListingSkeletonProps) {
  const isCategory = variant === 'category'

  return (
    <Container className="py-4">
      {breadcrumbItems ? (
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      ) : (
        <div className="mb-4">
          <SkeletonPulse className="h-4 w-40 sm:w-56" />
        </div>
      )}

      {isCategory ? (
        <div className="mb-6 flex items-center gap-2">
          <SkeletonPulse className="hidden h-10 w-10 shrink-0 rounded-full sm:block" />
          <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-11 w-28 shrink-0 rounded-lg sm:w-36" />
            ))}
          </div>
          <SkeletonPulse className="hidden h-10 w-10 shrink-0 rounded-full sm:block" />
        </div>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row">
        <FacetsSidebarSkeleton />

        <main className="min-w-0 flex-1 space-y-3">
          <ListingToolbarSkeleton showMobileFilter />

          <ProductGridSkeleton count={cardCount} columns="listing" />

          <div className="flex flex-col items-center gap-1 pt-4">
            <SkeletonPulse className="h-5 w-5 rounded" />
            <SkeletonPulse className="h-4 w-40" />
          </div>
        </main>
      </div>
    </Container>
  )
}

/** @deprecated Prefer `ProductListingSkeleton` with `variant="category"`. */
export function CategoryListingSkeleton() {
  return <ProductListingSkeleton variant="category" />
}

/** @deprecated Prefer `ProductListingSkeleton` with `variant="search"`. */
export function SearchResultsSkeleton({ breadcrumbItems }: { breadcrumbItems: CrumbItem[] }) {
  return <ProductListingSkeleton variant="search" breadcrumbItems={breadcrumbItems} />
}
