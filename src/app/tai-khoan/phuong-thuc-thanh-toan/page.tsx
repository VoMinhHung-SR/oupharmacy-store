'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { CreditCardIcon } from '@/components/icons'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { usePaymentMethods } from '@/lib/hooks/usePayment'

export default function PaymentMethodsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const { data, isLoading, error } = usePaymentMethods()
  const methods = Array.isArray(data) ? data.filter((method) => method.active) : []

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/phuong-thuc-thanh-toan')
    }
  }, [isAuthenticated, authLoading, openModal, isOpen])

  if (!isAuthenticated) return null

  return (
    <AccountPageShell>
      <div className="space-y-6">
        <AccountPageHeader
          title="Phương thức thanh toán"
          subtitle="Các phương thức cửa hàng hỗ trợ khi đặt hàng. Chọn lúc thanh toán."
        />

        {isLoading ? (
          <p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Đang tải phương thức thanh toán…
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </p>
        ) : null}

        {!isLoading && !error && methods.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center sm:p-8">
            <CreditCardIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="text-gray-600">Chưa có phương thức thanh toán.</p>
          </div>
        ) : null}

        {!isLoading && methods.length > 0 ? (
          <ul className="space-y-3">
            {methods.map((method) => (
              <li
                key={method.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5"
              >
                <CreditCardIcon className="h-8 w-8 shrink-0 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-600">Áp dụng khi thanh toán đơn hàng</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </AccountPageShell>
  )
}
