'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useOrder } from '@/lib/hooks/useOrders'
import Breadcrumb from '@/components/Breadcrumb'

export default function CheckoutXacNhanDonHangPage() {
  const searchParams = useSearchParams()
  const orderIdParam = searchParams.get('order_id')
  const orderId = orderIdParam ? parseInt(orderIdParam, 10) : 0
  const { data: order, isLoading, error } = useOrder(orderId)

  if (!orderIdParam || Number.isNaN(orderId)) {
    return (
      <div className="space-y-6 py-8 px-4">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xác nhận đơn hàng' }]} />
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">Link xác nhận không hợp lệ hoặc đã hết hạn.</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tai-khoan/don-hang"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Xem đơn hàng
            </Link>
            <Link
              href="/"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" aria-busy="true" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-6 py-8 px-4">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xác nhận đơn hàng' }]} />
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">
            Đơn hàng không tồn tại hoặc bạn không có quyền xem.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/tai-khoan/don-hang"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Xem đơn hàng
            </Link>
            <Link
              href="/"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const items = order.items ?? []

  return (
    <div className="space-y-6 py-8 px-4">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Xác nhận đơn hàng' },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Đặt hàng thành công</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn:{' '}
          <span className="font-medium text-gray-900">
            {order.order_number ?? `#${order.id}`}
          </span>
        </p>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Chi tiết đơn hàng</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="pb-2 pr-4">Sản phẩm</th>
                  <th className="pb-2 pr-4 text-right">SL</th>
                  <th className="pb-2 pr-4 text-right">Đơn giá</th>
                  <th className="pb-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: { medicine_unit_id?: number; quantity?: number; price?: number; subtotal?: number; name?: string }, idx: number) => {
                  const qty = item.quantity ?? 0
                  const price = item.price ?? 0
                  const subtotal = item.subtotal ?? qty * price
                  return (
                    <tr key={item.medicine_unit_id ?? idx} className="border-b">
                      <td className="py-2 pr-4">{item.name || `Sản phẩm #${item.medicine_unit_id}`}</td>
                      <td className="py-2 pr-4 text-right">{qty}</td>
                      <td className="py-2 pr-4 text-right">{price.toLocaleString('vi-VN')}₫</td>
                      <td className="py-2 text-right">{subtotal.toLocaleString('vi-VN')}₫</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span>{order.subtotal?.toLocaleString('vi-VN') ?? 0}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{order.shipping_fee?.toLocaleString('vi-VN') ?? 0}₫</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-primary-700">{order.total?.toLocaleString('vi-VN') ?? 0}₫</span>
            </div>
          </div>
          {order.shipping_address && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</h3>
              <p className="text-gray-600 text-sm">{order.shipping_address}</p>
            </div>
          )}
          <div className="pt-4">
            <span className="text-sm text-gray-600">Trạng thái: </span>
            <span className="text-sm font-medium">{order.status ?? 'PENDING'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/tai-khoan/don-hang"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Xem đơn hàng
          </Link>
          <Link
            href="/"
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
