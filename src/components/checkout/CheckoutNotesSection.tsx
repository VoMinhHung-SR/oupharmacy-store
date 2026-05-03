'use client'

import React from 'react'

interface CheckoutNotesSectionProps {
  value: string
  onChange: (notes: string) => void
}

export function CheckoutNotesSection({ value, onChange }: CheckoutNotesSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-2 font-semibold text-gray-900">Ghi chú đơn hàng</h2>
      <p className="mb-3 text-sm text-gray-500">Tùy chọn — ví dụ giờ giao hàng, hướng dẫn liên hệ.</p>
      <textarea
        id="checkout-notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </section>
  )
}
