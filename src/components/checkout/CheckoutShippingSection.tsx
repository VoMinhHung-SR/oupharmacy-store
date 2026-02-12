'use client'

import React from 'react'
import type { ShippingMethod } from '@/lib/services/shipping'

interface CheckoutShippingSectionProps {
  methods: ShippingMethod[]
  selectedId: number | null
  onSelect: (id: number, method: ShippingMethod) => void
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
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Phương thức vận chuyển</h2>
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" aria-busy="true" />
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600">Không tải được danh sách vận chuyển. Vui lòng thử lại.</p>
      )}
      {!isLoading && !error && methods.length === 0 && (
        <p className="text-sm text-gray-600">Chưa có phương thức vận chuyển.</p>
      )}
      {!isLoading && methods.length > 0 && (
        <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức vận chuyển">
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
                name="shipping"
                value={method.id}
                checked={selectedId === method.id}
                onChange={() => onSelect(method.id, method)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="flex-1">
                <span className="font-medium">{method.name}</span>
              </span>
              <span className="font-medium">{method.price.toLocaleString('vi-VN')}₫</span>
            </label>
          ))}
        </div>
      )}
    </section>
  )
}
