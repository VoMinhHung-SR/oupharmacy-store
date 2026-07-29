import { Container } from '@/components/Container'
import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

/** PDP first-load placeholder (resolve-path + product detail fetch). */
export function ProductDetailPageSkeleton() {
  return (
    <Container className="pb-28 md:pb-32" aria-busy="true" aria-label="Đang tải sản phẩm">
      <div className="py-4">
        <SkeletonPulse className="h-4 w-48 sm:w-72" />
      </div>

      <div className="space-y-6 rounded-lg bg-white p-4 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <SkeletonPulse className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20" />
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <SkeletonPulse className="h-4 w-28" />
            <div className="space-y-2">
              <SkeletonPulse className="h-7 w-full sm:h-8 sm:w-3/4" />
              <SkeletonPulse className="h-5 w-2/3 sm:h-6 sm:w-1/2" />
            </div>
            <SkeletonPulse className="h-4 w-40 sm:w-48" />
            <SkeletonPulse className="h-9 w-36 rounded-lg sm:h-10 sm:w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-9 w-20 rounded-full" />
              ))}
            </div>
            <div className="space-y-3 border-t border-gray-100 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonPulse key={i} className="h-4 w-full" />
              ))}
            </div>
            <SkeletonPulse className="hidden h-14 w-full rounded-xl md:block" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-lg bg-white p-4 sm:p-6">
        <SkeletonPulse className="h-6 w-40" />
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-5/6" />
        <SkeletonPulse className="h-4 w-4/5" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white p-3 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <SkeletonPulse className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonPulse className="h-3 w-3/4" />
            <SkeletonPulse className="h-4 w-24" />
          </div>
          <SkeletonPulse className="h-10 w-28 shrink-0 rounded-xl" />
        </div>
      </div>
    </Container>
  )
}
