import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

interface ProductGridSkeletonProps {
  count?: number
  /** Listing default: 2 / 3 / 4. Related: 2 / 3 / 6. */
  columns?: 'listing' | 'related'
}

export function ProductGridSkeleton({ count = 8, columns = 'listing' }: ProductGridSkeletonProps) {
  const gridClass =
    columns === 'related'
      ? 'grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6'
      : 'grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
