'use client'

import React, { useMemo } from 'react'
import type { ShippingMethod } from '@/lib/services/shipping'
import {
  formatShippingEta,
  pickPreferredShippingMethod,
  shouldShowShippingMethodChoice,
} from '@/lib/utils/shippingCheckout'
import { SpinnerIcon } from '@/components/icons'

interface CheckoutShippingSectionProps {
  methods: ShippingMethod[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
  error: Error | null
  qualifiesFreeShipping?: boolean
}

export function CheckoutShippingSection({
  methods,
  selectedId,
  onSelect,
  isLoading,
  error,
  qualifiesFreeShipping = false,
}: CheckoutShippingSectionProps) {
  const showChoice = useMemo(
    () => shouldShowShippingMethodChoice(methods, qualifiesFreeShipping),
    [methods, qualifiesFreeShipping]
  )

  const selectedMethod =
    methods.find((m) => m.id === selectedId) ?? pickPreferredShippingMethod(methods)

  const priceLabel = (method: ShippingMethod) =>
    qualifiesFreeShipping ? 'Miễn phí' : `${Number(method.price).toLocaleString('vi-VN')}₫`

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
      {!isLoading && methods.length > 0 && !showChoice && selectedMethod && (
        <div className="rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3">
          <p className="text-sm font-medium text-slate-900">{selectedMethod.name}</p>
          <p className="mt-1 text-sm font-semibold text-primary-600">{priceLabel(selectedMethod)}</p>
          {formatShippingEta(selectedMethod) ? (
            <p className="mt-1 text-xs text-slate-600">{formatShippingEta(selectedMethod)}</p>
          ) : null}
          {qualifiesFreeShipping ? (
            <p className="mt-2 text-xs text-slate-500">Đơn đạt mức miễn phí vận chuyển — ưu tiên giao nhanh cho bạn.</p>
          ) : null}
        </div>
      )}
      {!isLoading && methods.length > 0 && showChoice && (
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
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{method.name}</span>
                {formatShippingEta(method) ? (
                  <span className="mt-0.5 block text-xs text-slate-500">{formatShippingEta(method)}</span>
                ) : null}
              </span>
              <span className="shrink-0 font-semibold text-slate-900">{priceLabel(method)}</span>
            </label>
          ))}
        </div>
      )}
    </section>
  )
}
