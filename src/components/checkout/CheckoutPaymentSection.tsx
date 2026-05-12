'use client'

import Link from 'next/link'
import React from 'react'
import { CreditCardIcon, ChevronLeftIcon, SpinnerIcon } from '@/components/icons'
import type { PaymentMethod } from '@/lib/services/payment'

interface CheckoutPaymentSectionProps {
  methods: PaymentMethod[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
  error: Error | null
}

export function CheckoutPaymentSection({
  methods,
  selectedId,
  onSelect,
  isLoading,
  error,
}: CheckoutPaymentSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
        <CreditCardIcon className="h-5 w-5 shrink-0 text-primary-600" />
        Phương thức thanh toán
      </h2>
      {isLoading && (
        <div className="flex justify-center py-8" aria-busy="true">
          <SpinnerIcon className="h-10 w-10 animate-spin text-primary-600" />
        </div>
      )}
      {error && <p className="text-sm text-red-600">Không tải được danh sách thanh toán. Vui lòng thử lại.</p>}
      {!isLoading && !error && methods.length === 0 && (
        <p className="text-sm text-gray-600">Chưa có phương thức thanh toán.</p>
      )}
      {!isLoading && methods.length > 0 && (
        <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức thanh toán">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                selectedId === method.id
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 text-gray-900 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedId === method.id}
                onChange={() => onSelect(method.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span>{method.name}</span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-4">
        <Link
          href="/gio-hang"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-primary-700"
        >
          <ChevronLeftIcon className="h-4 w-4 shrink-0" />
          Quay lại giỏ hàng
        </Link>
      </div>
    </section>
  )
}
