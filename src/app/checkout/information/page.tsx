import Link from 'next/link'
import React from 'react'

export default function CheckoutInformationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Thông tin khách hàng</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <form className="space-y-3">
          <input placeholder="Họ và tên" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          <input placeholder="Số điện thoại" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          <input placeholder="Email" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          <input placeholder="Địa chỉ" className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          <Link href="/checkout/shipping" className="inline-block rounded bg-primary-600 px-4 py-2 font-semibold text-white">Tiếp tục</Link>
        </form>
        <div className="rounded border p-4 text-sm text-gray-600">Tóm tắt đơn hàng (placeholder)</div>
      </div>
    </div>
  )
}


