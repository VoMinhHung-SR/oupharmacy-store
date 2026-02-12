'use client'

import React from 'react'

export interface CartItemForSummary {
  id: string
  name: string
  qty: number
  price: number
}

interface CheckoutOrderSummaryProps {
  items: CartItemForSummary[]
  subtotal: number
  shippingFee: number
  total: number
  hasShippingSelected: boolean
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  hasShippingSelected,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="w-full min-w-0 rounded-lg border border-gray-200 bg-white p-5 h-fit md:sticky md:top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-gray-700">x{item.qty}</div>
            </div>
            <div className="text-right font-medium text-gray-900 shrink-0">
              {(item.price * item.qty).toLocaleString('vi-VN')}₫
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="text-gray-900">{subtotal.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">
            {hasShippingSelected ? `${shippingFee.toLocaleString('vi-VN')}₫` : 'Chọn phương thức'}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Tổng cộng</span>
          <span className="text-lg font-semibold text-primary-700">{total.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>
    </div>
  )
}
