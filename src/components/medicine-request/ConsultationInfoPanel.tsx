'use client'

import Link from 'next/link'
import { Button } from '@/components/Button'
import { ConsultationProcessBody } from '@/components/medicine-request/consultationContent'

function OrdersLink({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/tai-khoan/don-hang"
      className={`flex items-center justify-center gap-2 text-sm font-medium leading-none text-primary-700 ${className}`.trim()}
    >
      <svg
        className="block h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6M7 4h7l3 3v13a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
        />
      </svg>
      <span className="leading-none">Xem lại đơn hàng của tôi</span>
    </Link>
  )
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" size="lg" className="w-full text-base" disabled={isSubmitting}>
      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
    </Button>
  )
}

export function MedicineRequestMobileActions({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
      <SubmitButton isSubmitting={isSubmitting} />
      <div className="mt-3 flex justify-center">
        <OrdersLink />
      </div>
    </div>
  )
}

export function ConsultationInfoPanel({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <SubmitButton isSubmitting={isSubmitting} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Quy trình tư vấn tại OUPharmacy</h2>
        <ConsultationProcessBody />
      </div>

      <div className="flex items-center rounded-lg border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        <OrdersLink className="w-full justify-start" />
      </div>
    </aside>
  )
}
