import { Container } from '@/components/Container'
import { SkeletonPulse } from '@/components/skeletons/SkeletonPulse'
import { PAGE_Y } from '@/lib/layout/pageLayout'

/** Account hub menu grid while auth resolves — mirrors `/tai-khoan` card + responsive tiles. */
export function AccountHubSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5" aria-busy="true" aria-label="Đang tải tài khoản">
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
        <SkeletonPulse className="h-7 w-44 sm:h-8 sm:w-56" />
        <SkeletonPulse className="mt-2 h-4 w-40 max-w-full sm:w-52" />
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:gap-4 sm:p-5"
          >
            <SkeletonPulse className="h-11 w-11 shrink-0 rounded-lg sm:h-12 sm:w-12" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <SkeletonPulse className="h-5 w-3/4" />
              <SkeletonPulse className="h-3.5 w-full" />
            </div>
            <SkeletonPulse className="mt-1 hidden h-5 w-5 shrink-0 rounded sm:block" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Smart cabinet page while auth / Suspense — mirrors hero tabs + switcher + meds panel. */
export function CabinetWorkspaceSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5" aria-busy="true" aria-label="Đang tải tủ thuốc">
      <section className="overflow-hidden rounded-xl border border-primary-200/70 bg-gradient-to-br from-primary-600 to-primary-800 shadow-md shadow-primary-900/10">
        <div className="relative p-4 sm:p-5">
          <SkeletonPulse className="mb-3 h-4 w-24 bg-white/25" />
          <div className="flex items-start gap-3">
            <SkeletonPulse className="h-12 w-12 shrink-0 rounded-2xl bg-white/20" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonPulse className="h-3 w-28 bg-white/25" />
              <SkeletonPulse className="h-6 w-48 max-w-full bg-white/30 sm:h-7 sm:w-56" />
              <SkeletonPulse className="h-3.5 w-full max-w-sm bg-white/20" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 ${
                  i === 0 ? 'border-white bg-white' : 'border-white/25 bg-white/10'
                }`}
              >
                <SkeletonPulse
                  className={`h-4 w-4 rounded ${i === 0 ? 'bg-primary-200' : 'bg-white/30'}`}
                />
                <SkeletonPulse
                  className={`mt-2 h-3 w-full sm:h-3.5 ${i === 0 ? 'bg-primary-100' : 'bg-white/25'}`}
                />
                <SkeletonPulse
                  className={`mt-1 hidden h-2.5 w-4/5 sm:block ${i === 0 ? 'bg-primary-50' : 'bg-white/15'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SkeletonPulse className="h-3 w-20 sm:w-28" />
          <SkeletonPulse className="h-10 min-w-0 flex-1 rounded-lg" />
          <SkeletonPulse className="h-9 w-full rounded-lg sm:w-28" />
        </div>
      </section>

      <section className="space-y-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonPulse className="h-5 w-36 sm:h-6 sm:w-44" />
            <SkeletonPulse className="h-3.5 w-full max-w-xs" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SkeletonPulse className="h-8 w-24 rounded-lg sm:w-28" />
            <SkeletonPulse className="h-8 w-20 rounded-lg sm:w-24" />
            <SkeletonPulse className="hidden h-8 w-24 rounded-lg sm:block" />
          </div>
        </div>

        <div className="-mx-1 flex gap-2 overflow-hidden px-1 pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-8 w-20 shrink-0 rounded-full sm:w-24" />
          ))}
        </div>

        <CabinetMedsListSkeleton rows={3} />
      </section>
    </div>
  )
}

/** Meds / alert rows inside cabinet while data loads. */
export function CabinetMedsListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Đang tải danh sách thuốc">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:gap-4 sm:p-3.5"
        >
          <SkeletonPulse className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonPulse className="h-4 w-4/5" />
            <SkeletonPulse className="h-3 w-1/2" />
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <SkeletonPulse className="h-5 w-16 rounded-full" />
              <SkeletonPulse className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <SkeletonPulse className="hidden h-8 w-20 shrink-0 rounded-lg sm:block" />
        </div>
      ))}
    </div>
  )
}

/** Address book cards while MAIN addresses fetch. */
export function AddressBookSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải sổ địa chỉ">
      <div className="flex justify-end">
        <SkeletonPulse className="h-10 w-32 rounded-lg sm:w-36" />
      </div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
            <SkeletonPulse className="mb-3 ml-auto h-5 w-16 rounded-full" />
            <SkeletonPulse className="h-4 w-full" />
            <SkeletonPulse className="mt-2 h-4 w-5/6" />
            <SkeletonPulse className="mt-2 h-4 w-2/3" />
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
              <SkeletonPulse className="h-8 w-20 rounded-lg" />
              <SkeletonPulse className="h-8 w-24 rounded-lg" />
              <SkeletonPulse className="h-8 w-14 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Medicine-request list rows. */
export function MedicineRequestsListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="space-y-3" aria-busy="true" aria-label="Đang tải yêu cầu mua thuốc">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonPulse className="h-4 w-28 sm:w-36" />
              <SkeletonPulse className="h-3 w-24" />
            </div>
            <SkeletonPulse className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <SkeletonPulse className="h-3.5 w-28" />
            <SkeletonPulse className="h-3.5 w-24" />
            <SkeletonPulse className="hidden h-3.5 w-20 sm:block" />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Medicine-request detail cards. */
export function MedicineRequestDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Đang tải chi tiết yêu cầu">
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SkeletonPulse className="h-3.5 w-36" />
          <SkeletonPulse className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <SkeletonPulse className="h-3 w-16" />
              <SkeletonPulse className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <SkeletonPulse className="h-5 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-3 border-t border-slate-100 pt-3">
            <SkeletonPulse className="h-4 w-2/3" />
            <SkeletonPulse className="h-4 w-10" />
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
            <SkeletonPulse className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16" />
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
      className="w-full space-y-4 py-3 sm:space-y-5 sm:py-4"
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
    <Container className={PAGE_Y} aria-busy="true">
      <SkeletonPulse className="mb-6 h-4 w-40 sm:w-56" />
      <div className="mb-8 space-y-3">
        <SkeletonPulse className="h-8 w-48 sm:h-10 sm:w-64" />
        <SkeletonPulse className="h-4 w-72 max-w-full sm:w-96" />
      </div>
      <div className="mb-4">
        <SkeletonPulse className="mb-6 h-7 w-44" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
          >
            <SkeletonPulse className="mb-3 h-10 w-10 rounded-lg sm:h-12 sm:w-12" />
            <SkeletonPulse className="mb-2 h-4 w-16" />
            <SkeletonPulse className="h-3 w-12" />
          </div>
        ))}
      </div>
    </Container>
  )
}
