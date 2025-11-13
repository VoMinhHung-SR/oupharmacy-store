import Link from 'next/link'
import React from 'react'

export default function OrdersListPage() {
  const orders = [
    { id: 'DH001', date: '2025-10-01', total: 350000, status: 'Đang xử lý' },
    { id: 'DH002', date: '2025-10-15', total: 220000, status: 'Đã giao' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Đơn hàng</h1>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Tổng</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.date}</td>
                <td className="p-3">{o.total.toLocaleString('vi-VN')}₫</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-right"><Link href={`/account/orders/${o.id}`} className="text-primary-700">Chi tiết</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


