'use client'

import React from 'react'

interface CheckoutNotesSectionProps {
  value: string
  onChange: (notes: string) => void
}

export function CheckoutNotesSection({ value, onChange }: CheckoutNotesSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-6">
      <h2 className="mb-1 text-base font-bold text-slate-900">Ghi chú (không bắt buộc)</h2>
      <p className="mb-3 text-xs text-slate-500 sm:text-sm">Ví dụ giờ giao hàng, hướng dẫn liên hệ.</p>
      <textarea
        id="checkout-notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập ghi chú cho đơn hàng"
        rows={3}
        maxLength={2000}
        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </section>
  )
}
