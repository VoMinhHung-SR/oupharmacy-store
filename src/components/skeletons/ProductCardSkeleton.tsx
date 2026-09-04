import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

/** Mirrors `ProductCard` height structure (image, 2-line title, price, packaging, CTA). */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-2.5 sm:p-3">
      <SkeletonPulse className="mb-2 aspect-square w-full rounded-lg" />
      <SkeletonPulse className="mb-1 h-3.5 w-full" />
      <SkeletonPulse className="mb-2 h-3.5 w-3/4" />
      <SkeletonPulse className="mb-1 h-4 w-24" />
      <SkeletonPulse className="mb-2 h-3 w-20" />
      <SkeletonPulse className="mt-auto h-8 w-full rounded-lg" />
    </div>
  )
}
