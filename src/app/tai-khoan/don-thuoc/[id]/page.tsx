'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { useMedicineRequest } from '@/lib/hooks/useMedicineRequests'
import {
  formatMedicineRequestDate,
  MEDICINE_REQUEST_STATUS_MAP,
} from '@/lib/utils/medicineRequestStatus'

export default function MedicineRequestDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const { data: lead, isLoading, error } = useMedicineRequest(
    Number.isFinite(id) ? id : null,
    isAuthenticated
  )

  useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal(`/tai-khoan/don-thuoc/${params?.id || ''}`)
    }
  }, [isAuthenticated, loading, openModal, isOpen, params?.id])

  if (!isAuthenticated) return null

  const status = lead
    ? MEDICINE_REQUEST_STATUS_MAP[lead.status] || MEDICINE_REQUEST_STATUS_MAP.PENDING
    : null

  return (
    <AccountPageShell>
      <div className="space-y-4">
        <AccountPageHeader
          title={lead ? `Yêu cầu #${lead.id}` : 'Chi tiết yêu cầu'}
          subtitle="Thông tin yêu cầu mua thuốc đã gửi."
          backHref="/tai-khoan/don-thuoc"
        />

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Đang tải...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
            <div className="mt-2">
              <Link href="/tai-khoan/don-thuoc" className="font-medium underline">
                Về danh sách
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && lead ? (
          <div className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  Gửi lúc {formatMedicineRequestDate(lead.created_date)}
                </p>
                {status ? (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                ) : null}
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Họ tên</dt>
                  <dd className="font-medium text-slate-900">{lead.full_name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Số điện thoại</dt>
                  <dd className="font-medium text-slate-900">{lead.phone}</dd>
                </div>
                {lead.email ? (
                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-slate-900">{lead.email}</dd>
                  </div>
                ) : null}
              </dl>
              {lead.note ? (
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Ghi chú</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{lead.note}</p>
                </div>
              ) : null}
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-slate-900">Sản phẩm đã chọn</h2>
              {(lead.items_json || []).length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">Không chọn sản phẩm catalog.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {(lead.items_json || []).map((item, index) => (
                    <li key={`${item.product_id}-${index}`} className="py-2 text-sm text-slate-700">
                      {item.product_name}
                      <span className="text-slate-500"> · sl {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {lead.prescription_image_url ? (
              <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-slate-900">Ảnh đơn thuốc</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead.prescription_image_url}
                  alt="Ảnh đơn thuốc"
                  className="mt-3 max-h-80 rounded-lg object-contain"
                />
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </AccountPageShell>
  )
}
