'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { useMedicineRequests } from '@/lib/hooks/useMedicineRequests'
import {
  formatMedicineRequestDate,
  MEDICINE_REQUEST_STATUS_MAP,
} from '@/lib/utils/medicineRequestStatus'

export default function MedicineRequestsListPage() {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const { data, isLoading, error } = useMedicineRequests(isAuthenticated)

  useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/don-thuoc')
    }
  }, [isAuthenticated, loading, openModal, isOpen])

  if (!isAuthenticated) return null

  const leads = data || []

  return (
    <AccountPageShell>
      <div className="space-y-4">
        <AccountPageHeader
          title="Yêu cầu mua thuốc"
          subtitle="Theo dõi các yêu cầu tư vấn đã gửi từ trang Cần mua thuốc."
        />

        <div className="flex justify-end">
          <Link
            href="/dat-thuoc"
            className="text-sm font-medium text-primary-700 hover:underline"
          >
            Gửi yêu cầu mới
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Đang tải...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        ) : null}

        {!isLoading && !error && leads.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">Bạn chưa có yêu cầu mua thuốc nào.</p>
            <Link
              href="/dat-thuoc"
              className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline"
            >
              Đi tới Cần mua thuốc
            </Link>
          </div>
        ) : null}

        {!isLoading && leads.length > 0 ? (
          <ul className="space-y-3">
            {leads.map((lead) => {
              const status = MEDICINE_REQUEST_STATUS_MAP[lead.status] || MEDICINE_REQUEST_STATUS_MAP.PENDING
              return (
                <li key={lead.id}>
                  <Link
                    href={`/tai-khoan/don-thuoc/${lead.id}`}
                    className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Yêu cầu #{lead.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatMedicineRequestDate(lead.created_date)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span>SĐT: {lead.phone}</span>
                      <span>{lead.item_count} sản phẩm</span>
                      {lead.prescription_image_url ? <span>Có ảnh đơn</span> : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </AccountPageShell>
  )
}
