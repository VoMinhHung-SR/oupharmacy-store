import Link from 'next/link'
import React from 'react'

export default function CheckoutIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Thanh toán</h1>
      <div className="rounded-lg border p-6 text-sm text-gray-600">
        Chọn bước: <Link href="/checkout/information" className="text-primary-700">Thông tin</Link> → Vận chuyển → Thanh toán
      </div>
    </div>
  )
}


