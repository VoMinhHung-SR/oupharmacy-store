'use client'

import React from 'react'
import { CreditCardIcon, SpinnerIcon } from '@/components/icons'
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
    <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
        <CreditCardIcon className="h-5 w-5 shrink-0 text-primary-600" />
        Chọn phương thức thanh toán
      </h2>
      {isLoading && (
        <div className="flex justify-center py-8" aria-busy="true">
          <SpinnerIcon className="h-10 w-10 animate-spin text-primary-600" />
        </div>
      )}
      {error && <p className="text-sm text-red-600">Không tải được danh sách thanh toán. Vui lòng thử lại.</p>}
      {!isLoading && !error && methods.length === 0 && (
        <p className="text-sm text-slate-600">Chưa có phương thức thanh toán.</p>
      )}
      {!isLoading && methods.length > 0 && (
        <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức thanh toán">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                selectedId === method.id
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-slate-200 text-slate-900 hover:border-slate-300'
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
    </section>
  )
}
