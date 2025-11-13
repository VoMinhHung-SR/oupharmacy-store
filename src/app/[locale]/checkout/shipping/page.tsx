import Link from 'next/link'
import React from 'react'

export default function CheckoutShippingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Vận chuyển</h1>
      <div className="space-y-3">
        <label className="flex items-center gap-3 rounded border p-3">
          <input type="radio" name="shipping" defaultChecked />
          <span>Giao nhanh (2-4h) - 25.000₫</span>
        </label>
        <label className="flex items-center gap-3 rounded border p-3">
          <input type="radio" name="shipping" />
          <span>Giao tiêu chuẩn (1-2 ngày) - 15.000₫</span>
        </label>
        <div className="pt-2">
          <Link href="/checkout/payment" className="inline-block rounded bg-primary-600 px-4 py-2 font-semibold text-white">Tiếp tục</Link>
        </div>
      </div>
    </div>
  )
}


