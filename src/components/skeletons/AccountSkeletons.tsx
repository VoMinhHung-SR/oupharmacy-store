import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'

/** Account hub menu grid while auth resolves. */
export function AccountHubSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải tài khoản">
      <div className="space-y-2">
        <SkeletonPulse className="h-7 w-40" />
        <SkeletonPulse className="h-4 w-56 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <SkeletonPulse className="h-10 w-10 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonPulse className="h-4 w-2/3" />
              <SkeletonPulse className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Orders list table/cards first load. */
export function OrdersListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="space-y-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
      aria-busy="true"
      aria-label="Đang tải danh sách đơn hàng"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonPulse className="h-4 w-40 max-w-full" />
            <SkeletonPulse className="h-3 w-28" />
            <SkeletonPulse className="h-3 w-48 max-w-full sm:hidden" />
          </div>
          <div className="flex items-center gap-3 sm:shrink-0">
            <SkeletonPulse className="h-6 w-24 rounded-full" />
            <SkeletonPulse className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Order detail / confirmation content skeleton. */
export function OrderDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải đơn hàng">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SkeletonPulse className="h-6 w-40" />
          <SkeletonPulse className="h-6 w-28 rounded-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonPulse className="h-3 w-24" />
              <SkeletonPulse className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <SkeletonPulse className="mb-2 h-5 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 border-t border-gray-100 pt-3">
            <SkeletonPulse className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonPulse className="h-4 w-4/5" />
              <SkeletonPulse className="h-3 w-1/2" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <SkeletonPulse className="mb-3 h-5 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <SkeletonPulse className="h-3.5 w-28" />
              <SkeletonPulse className="h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Generic centered form page (register, etc.). */
export function FormPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-4xl space-y-6 px-4 py-8"
      aria-busy="true"
      aria-label="Đang tải biểu mẫu"
    >
      <div className="space-y-2 text-center">
        <SkeletonPulse className="mx-auto h-7 w-48" />
        <SkeletonPulse className="mx-auto h-4 w-64 max-w-full" />
      </div>
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonPulse className="h-3.5 w-24" />
            <SkeletonPulse className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <SkeletonPulse className="mt-2 h-11 w-full rounded-xl sm:ml-auto sm:w-40" />
      </div>
    </div>
  )
}

/** Over-limit category chooser. */
export function OverLimitCategorySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SkeletonPulse className="mb-6 h-4 w-40 sm:w-56" />
        <div className="mb-8 space-y-3">
          <SkeletonPulse className="h-8 w-48 sm:h-10 sm:w-64" />
          <SkeletonPulse className="h-4 w-72 max-w-full sm:w-96" />
        </div>
        <div className="mb-4">
          <SkeletonPulse className="mb-6 h-7 w-44" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4"
            >
              <SkeletonPulse className="mb-3 h-12 w-12 rounded-lg" />
              <SkeletonPulse className="mb-2 h-4 w-16" />
              <SkeletonPulse className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
