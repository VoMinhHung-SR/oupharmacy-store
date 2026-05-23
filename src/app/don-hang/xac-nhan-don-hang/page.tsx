'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrder } from '@/lib/hooks/useOrders'
import { loadGuestOrderConfirmation } from '@/lib/utils/guestOrderConfirmation'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import { ShippingAddressDisplay } from '@/components/checkout/ShippingAddressDisplay'

export default function OrderConfirmationPage() {
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const orderNumberParam = searchParams.get('order_number')
  const orderIdParam = searchParams.get('order_id')
  const orderIdNum = orderIdParam != null && orderIdParam !== '' ? parseInt(orderIdParam, 10) : NaN
  const orderIdentifier = orderNumberParam ?? (Number.isNaN(orderIdNum) ? '' : String(orderIdParam))
  const guestOrder = useMemo(
    () => (!isAuthenticated && orderIdentifier ? loadGuestOrderConfirmation(orderIdentifier) : null),
    [isAuthenticated, orderIdentifier]
  )
  const { data: apiOrder, isLoading: apiLoading, error: apiError } = useOrder(orderIdentifier, {
    enabled: isAuthenticated,
  })
  const order = isAuthenticated ? apiOrder : guestOrder
  const isLoading = isAuthenticated ? apiLoading : false
  const error = isAuthenticated ? apiError : guestOrder ? undefined : new Error('guest_order_not_found')

  if (!orderIdentifier) {
    return (
      <Container className="space-y-6 py-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xác nhận đơn hàng' }]} />
        <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">Link xác nhận không hợp lệ hoặc đã hết hạn.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
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
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="flex min-h-[32vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" aria-busy="true" />
        </div>
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container className="space-y-6 py-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xác nhận đơn hàng' }]} />
        <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-600 mb-6">
            {isAuthenticated
              ? 'Đơn hàng không tồn tại hoặc bạn không có quyền xem.'
              : 'Không tìm thấy thông tin xác nhận trong phiên này. Vui lòng kiểm tra email/SMS hoặc đăng nhập để xem đơn sau khi có tài khoản.'}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            {isAuthenticated ? (
              <Link
                href="/tai-khoan/don-hang"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Xem đơn hàng
              </Link>
            ) : null}
            <Link
              href="/"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  const items = order.items ?? []
  const trackingHref = isAuthenticated
    ? order.order_number || order.id != null
      ? `/tai-khoan/don-hang/${order.order_number ?? order.id}`
      : '/tai-khoan/don-hang'
    : null
  const statusText: Record<string, string> = {
    PENDING: 'Đang chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  }
  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPING: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  const createdAtLabel = order.created_date
    ? new Date(order.created_date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'
  const formatVnd = (value?: number) => `${Math.round(Number(value ?? 0)).toLocaleString('vi-VN')}đ`

  return (
    <Container className="space-y-6 py-6 sm:py-8">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Xác nhận đơn hàng' },
        ]}
      />

      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white sm:mt-0.5">
              <span className="text-sm font-bold">✓</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Đặt hàng thành công</h1>
              <p className="mt-1 break-words text-gray-700">
                Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn:{' '}
                <span className="font-semibold text-gray-900">{order.order_number ?? `#${order.id}`}</span>
              </p>
            </div>
          </div>
        </div>

        {trackingHref ? (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <p className="text-sm text-blue-900 break-words">
              Bạn có thể theo dõi đơn hàng của mình tại đây:{' '}
              <Link href={trackingHref} className="font-semibold underline hover:text-blue-700">
                Theo dõi đơn hàng của bạn
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <p className="text-sm text-blue-900 break-words">
              Lưu mã đơn <span className="font-semibold">{order.order_number ?? order.id}</span> để tra cứu. Đăng nhập sau
              này để xem lịch sử đơn trong tài khoản.
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Mã đơn hàng</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{order.order_number ?? `#${order.id}`}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Thời gian đặt</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{createdAtLabel}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Trạng thái</p>
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                statusColor[order.status ?? 'PENDING'] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {statusText[order.status ?? 'PENDING'] ?? (order.status ?? 'PENDING')}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900">Chi tiết đơn hàng</h2>
          <div className="-mx-1 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="pb-3 pr-3 sm:pr-4">Sản phẩm</th>
                  <th className="whitespace-nowrap pb-3 px-2 text-right sm:pr-4">SL</th>
                  <th className="whitespace-nowrap pb-3 px-2 text-right sm:pr-4">Đơn giá</th>
                  <th className="whitespace-nowrap pb-3 pl-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: { variant_unit_id?: number; quantity?: number; price?: number; subtotal?: number; name?: string }, idx: number) => {
                  const qty = item.quantity ?? 0
                  const price = item.price ?? 0
                  const subtotal = item.subtotal ?? qty * price
                  return (
                    <tr key={item.variant_unit_id ?? idx} className="border-b">
                      <td className="max-w-[12rem] py-3 pr-3 font-medium text-gray-800 sm:max-w-none sm:pr-4">
                        <span className="line-clamp-2 sm:line-clamp-none">{item.name || `Sản phẩm #${item.variant_unit_id}`}</span>
                      </td>
                      <td className="whitespace-nowrap py-3 px-2 text-right text-gray-700 sm:pr-4">{qty}</td>
                      <td className="whitespace-nowrap py-3 px-2 text-right text-gray-700 sm:pr-4">{formatVnd(price)}</td>
                      <td className="whitespace-nowrap py-3 pl-2 text-right font-semibold text-gray-900">{formatVnd(subtotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 rounded-lg border border-blue-100 bg-blue-50/40 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-700">Tạm tính</span>
              <span className="shrink-0 font-medium text-gray-900">{formatVnd(order.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-700">Phí vận chuyển</span>
              <span className="shrink-0 font-medium text-gray-900">
                {Number(order.shipping_fee ?? 0) <= 0 ? 'Miễn phí' : formatVnd(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-2 text-base font-semibold text-gray-900">
              <span>Tổng cộng</span>
              <span className="shrink-0 text-primary-700">{formatVnd(order.total)}</span>
            </div>
          </div>
          {order.shipping_address && (
            <ShippingAddressDisplay
              shippingAddress={order.shipping_address}
              className="pt-4 border-t border-gray-200"
            />
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-4">
          <Link
            href="/"
            className="px-6 py-2 text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-left"
          >
            Tiếp tục mua sắm
          </Link>
          {trackingHref ? (
            <Link
              href={trackingHref}
              className="px-6 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-left"
            >
              Theo dõi đơn hàng
            </Link>
          ) : null}
        </div>
        </div>
      </div>
    </Container>
  )
}
