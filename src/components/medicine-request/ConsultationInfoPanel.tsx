'use client'

import { FileTextIcon } from '@/components/icons'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { ConsultationProcessBody } from '@/components/medicine-request/consultationContent'

function RequestsLink({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/tai-khoan/don-thuoc"
      className={`flex items-center justify-center gap-2 text-sm font-medium leading-none text-primary-700 ${className}`.trim()}
    >
      <FileTextIcon className="block h-5 w-5 shrink-0" strokeWidth={1.8} />
      <span className="leading-none">Xem lại yêu cầu mua thuốc</span>
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
        <RequestsLink />
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
        <RequestsLink className="w-full justify-start" />
      </div>
    </aside>
  )
}
