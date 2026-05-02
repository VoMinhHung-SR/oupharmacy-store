'use client'

import React, { useState } from 'react'

interface CheckoutVoucherSectionProps {
  onApplyVoucher: (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => Promise<void>
  onRemoveVoucher: (target: 'order' | 'shipping' | 'all') => Promise<void>
  isApplying: boolean
  orderVoucherCode?: string
  shippingVoucherCode?: string
}

export function CheckoutVoucherSection({
  onApplyVoucher,
  onRemoveVoucher,
  isApplying,
  orderVoucherCode,
  shippingVoucherCode,
}: CheckoutVoucherSectionProps) {
  const [orderCode, setOrderCode] = useState('')
  const [shippingCode, setShippingCode] = useState('')

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Mã giảm giá</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="order-voucher" className="block text-sm font-medium text-gray-700 mb-1">
            Mã giảm giá đơn hàng
          </label>
          <div className="flex gap-2">
            <input
              id="order-voucher"
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="Nhập mã giảm giá đơn"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              disabled={isApplying}
              onClick={() => onApplyVoucher({ order_voucher_code: orderCode.trim() })}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </div>
          {orderVoucherCode && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-green-700">Đang áp dụng: {orderVoucherCode}</span>
              <button
                type="button"
                disabled={isApplying}
                onClick={() => onRemoveVoucher('order')}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="shipping-voucher" className="block text-sm font-medium text-gray-700 mb-1">
            Mã giảm phí vận chuyển
          </label>
          <div className="flex gap-2">
            <input
              id="shipping-voucher"
              type="text"
              value={shippingCode}
              onChange={(e) => setShippingCode(e.target.value)}
              placeholder="Nhập mã giảm ship"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              disabled={isApplying}
              onClick={() => onApplyVoucher({ shipping_voucher_code: shippingCode.trim() })}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </div>
          {shippingVoucherCode && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-green-700">Đang áp dụng: {shippingVoucherCode}</span>
              <button
                type="button"
                disabled={isApplying}
                onClick={() => onRemoveVoucher('shipping')}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
