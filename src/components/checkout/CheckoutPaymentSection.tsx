'use client'

import Link from 'next/link'
import React from 'react'
import type { PaymentMethod } from '@/lib/services/payment'
import { SpinnerIcon } from '@/components/icons'

interface CheckoutPaymentSectionProps {
  methods: PaymentMethod[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
  error: Error | null
  isSubmitting: boolean
  canSubmit: boolean
  onPlaceOrder: () => void
}

export function CheckoutPaymentSection({
  methods,
  selectedId,
  onSelect,
  isLoading,
  error,
  isSubmitting,
  canSubmit,
  onPlaceOrder,
}: CheckoutPaymentSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" aria-busy="true" />
        </div>
      )}
      {error && (
        <p className="text-red-600">Không tải được danh sách thanh toán. Vui lòng thử lại.</p>
      )}
      {!isLoading && !error && methods.length === 0 && (
        <p className="text-gray-600">Chưa có phương thức thanh toán.</p>
      )}
      {!isLoading && methods.length > 0 && (
        <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức thanh toán">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`flex text-sm items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                selectedId === method.id
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-900'
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

      <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/gio-hang"
          className="inline-flex items-center justify-center text-sm px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Quay lại giỏ hàng
        </Link>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 min-w-[140px] px-8 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="animate-spin h-5 w-5 text-white shrink-0" />
              Đang xử lý...
            </>
          ) : (
            'Đặt hàng'
          )}
        </button>
      </div>
    </section>
  )
}
