'use client'

import React from 'react'
import type { ShippingMethod } from '@/lib/services/shipping'
import { SpinnerIcon } from '@/components/icons'

interface CheckoutShippingSectionProps {
  methods: ShippingMethod[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
  error: Error | null
}

export function CheckoutShippingSection({
  methods,
  selectedId,
  onSelect,
  isLoading,
  error,
}: CheckoutShippingSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="mb-4 text-base font-bold text-slate-900">Phương thức vận chuyển</h2>
      {isLoading && (
        <div className="flex justify-center py-8" aria-busy="true">
          <SpinnerIcon className="h-10 w-10 animate-spin text-primary-600" />
        </div>
      )}
      {error && <p className="text-sm text-red-600">Không tải được danh sách vận chuyển. Vui lòng thử lại.</p>}
      {!isLoading && !error && methods.length === 0 && (
        <p className="text-sm text-slate-600">Chưa có phương thức vận chuyển.</p>
      )}
      {!isLoading && methods.length > 0 && (
        <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức vận chuyển">
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
                name="shipping"
                value={method.id}
                checked={selectedId === method.id}
                onChange={() => onSelect(method.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="flex-1 font-medium">{method.name}</span>
              <span className="font-semibold text-slate-900">{method.price.toLocaleString('vi-VN')}₫</span>
            </label>
          ))}
        </div>
      )}
    </section>
  )
}
