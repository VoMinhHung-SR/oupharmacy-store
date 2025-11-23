import Link from 'next/link'
import React from 'react'

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Tài khoản</h1>
      <ul className="list-disc pl-5 text-sm">
        <li><Link href="/account/orders" className="text-primary-700">Đơn hàng của tôi</Link></li>
        <li><Link href="/account/profile" className="text-primary-700">Hồ sơ cá nhân (placeholder)</Link></li>
      </ul>
    </div>
  )
}


