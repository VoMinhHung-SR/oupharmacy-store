import { Container } from '@/components/Container'
import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

/** PDP first-load placeholder — mirrors gallery + policies + info + sticky bar. */
export function ProductDetailPageSkeleton() {
  return (
    <Container className="pb-28 md:pb-32" aria-busy="true" aria-label="Đang tải sản phẩm">
      <div className="py-4">
        <SkeletonPulse className="h-4 w-48 max-w-full sm:w-72" />
      </div>

      <div className="space-y-4 rounded-lg bg-white p-3 sm:space-y-6 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <SkeletonPulse className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonPulse
                  key={i}
                  className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16 md:h-20 md:w-20"
                />
              ))}
            </div>
            {/* ProductDetailPoliciesBox — 3 cols */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex min-w-0 items-start gap-1 sm:gap-1.5">
                  <SkeletonPulse className="mt-px h-5 w-5 shrink-0 rounded sm:h-6 sm:w-6" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <SkeletonPulse className="h-2.5 w-full" />
                    <SkeletonPulse className="h-2.5 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-4 sm:space-y-5">
            <SkeletonPulse className="h-4 w-28" />
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-full sm:h-8 sm:w-11/12" />
              <SkeletonPulse className="h-5 w-2/3 sm:w-1/2" />
            </div>
            <SkeletonPulse className="h-4 w-40 sm:w-48" />
            <SkeletonPulse className="h-9 w-36 rounded-lg sm:h-10 sm:w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-9 w-16 rounded-full sm:w-20" />
              ))}
            </div>
            <div className="space-y-3 border-t border-gray-100 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-4 w-full" />
              ))}
            </div>
            <SkeletonPulse className="hidden h-12 w-full rounded-xl md:block" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-lg bg-white p-4 sm:p-6">
        <SkeletonPulse className="h-6 w-40" />
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-5/6" />
        <SkeletonPulse className="hidden h-4 w-4/5 sm:block" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white py-3 md:hidden">
        <Container className="flex items-center gap-2.5 sm:gap-3">
          <SkeletonPulse className="h-11 w-11 shrink-0 rounded-lg sm:h-12 sm:w-12" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonPulse className="h-3 w-3/4" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
          <SkeletonPulse className="h-10 w-24 shrink-0 rounded-xl sm:w-28" />
        </Container>
      </div>
    </Container>
  )
}
