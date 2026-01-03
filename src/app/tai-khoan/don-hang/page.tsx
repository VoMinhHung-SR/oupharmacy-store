'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/lib/hooks/useOrders'
import { Container } from '@/components/Container'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { ArrowLeftIcon, OrderIcon } from '@/components/icons'

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Đang chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

export default function OrdersListPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const { data: ordersData, isLoading, error } = useOrders(user?.id)

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!loading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/don-hang')
    }
  }, [isAuthenticated, loading, openModal, isOpen])

  if (!isAuthenticated) {
    return null
  }

  // Extract orders from response
  const orders = Array.isArray(ordersData) 
    ? ordersData 
    : (ordersData as any)?.results || []

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <Container className="py-6">
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/tai-khoan"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Đơn hàng của tôi</h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-red-800">
              Có lỗi xảy ra khi tải danh sách đơn hàng: {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <OrderIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
                    <th className="p-4 font-semibold text-gray-900">Mã đơn hàng</th>
                    <th className="p-4 font-semibold text-gray-900">Ngày đặt</th>
                    <th className="p-4 font-semibold text-gray-900">Tổng tiền</th>
                    <th className="p-4 font-semibold text-gray-900">Trạng thái</th>
                    <th className="p-4 font-semibold text-gray-900 text-right">Thao tác</th>
            </tr>
          </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          {order.order_number || `#${order.id}`}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {formatDate(order.created_date)}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">
                          {order.total?.toLocaleString('vi-VN')}₫
                        </span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/tai-khoan/don-hang/${order.id}`}
                          className="text-primary-700 hover:text-primary-800 font-medium transition-colors"
                        >
                          Chi tiết
                        </Link>
                      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
        )}
      </div>
    </Container>
  )
}
