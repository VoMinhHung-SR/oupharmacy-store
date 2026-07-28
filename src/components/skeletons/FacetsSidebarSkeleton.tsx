import { SIDEBAR } from '@/lib/constant'
import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

/** Desktop facets panel — matches listing sidebar chrome. */
export function FacetsSidebarSkeleton() {
  return (
    <aside
      className="hidden shrink-0 lg:block"
      style={{ width: `${SIDEBAR.WIDTH}px` }}
      aria-hidden
    >
      <div
        className="sticky space-y-4 rounded-xl border border-gray-200 bg-white p-4"
        style={{ top: `${SIDEBAR.STICKY_TOP}px` }}
      >
        <SkeletonPulse className="h-6 w-36" />
        {Array.from({ length: 3 }).map((_, group) => (
          <div key={group} className="space-y-2 border-t border-gray-100 pt-3">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-8 w-full rounded-lg" />
            {Array.from({ length: 4 }).map((_, row) => (
              <div key={row} className="flex items-center justify-between gap-2">
                <SkeletonPulse className="h-3.5 flex-1" />
                <SkeletonPulse className="h-3.5 w-8" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  )
}
