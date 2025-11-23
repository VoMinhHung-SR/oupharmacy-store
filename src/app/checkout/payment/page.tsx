import Link from 'next/link'
import React from 'react'

export default function CheckoutPaymentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
      <div className="space-y-3">
        <label className="flex items-center gap-3 rounded border p-3">
          <input type="radio" name="payment" defaultChecked />
          <span>Thanh toán khi nhận hàng (COD)</span>
        </label>
        <label className="flex items-center gap-3 rounded border p-3">
          <input type="radio" name="payment" />
          <span>Ví/Momo (placeholder)</span>
        </label>
        <div className="pt-2">
          <Link href="/" className="inline-block rounded bg-primary-600 px-4 py-2 font-semibold text-white">Đặt hàng</Link>
        </div>
      </div>
    </div>
  )
}


