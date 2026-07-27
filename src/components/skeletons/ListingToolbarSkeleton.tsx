import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

interface ListingToolbarSkeletonProps {
  /** Show mobile filter pill (category listing only). */
  showMobileFilter?: boolean
}

export function ListingToolbarSkeleton({ showMobileFilter = false }: ListingToolbarSkeletonProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="space-y-1.5">
        <SkeletonPulse className="h-5 w-48 sm:h-6 sm:w-56" />
        <SkeletonPulse className="h-3 w-64 max-w-full sm:w-80" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showMobileFilter ? <SkeletonPulse className="h-8 w-16 rounded-full lg:hidden" /> : null}
        <SkeletonPulse className="hidden h-4 w-20 sm:block" />
        <SkeletonPulse className="h-8 w-[4.5rem] rounded-full" />
        <SkeletonPulse className="h-8 w-[4.5rem] rounded-full" />
        <SkeletonPulse className="h-8 w-[4.5rem] rounded-full" />
      </div>
    </div>
  )
}
