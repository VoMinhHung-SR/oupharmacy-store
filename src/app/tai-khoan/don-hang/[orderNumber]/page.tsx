'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrder, useCancelOrder } from '@/lib/hooks/useOrders'
import Link from 'next/link'
import { useLoginModal } from '@/contexts/LoginModalContext'
import Image from 'next/image'
import { ImagePlaceholderIcon } from '@/components/icons'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'

interface Props {
  params: { orderNumber: string }
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Đang chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
}

const trackingFlow = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED']

export default function OrderDetailPage({ params }: Props) {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const orderNumber = params.orderNumber
  const { data: order, isLoading, error } = useOrder(orderNumber)
  const cancelOrderMutation = useCancelOrder()
  const trackingCode = (order as any)?.tracking_code as string | undefined
  const trackingTimeline = ((order as any)?.tracking_timeline || []) as Array<{
    status: string
    time?: string
    note?: string
  }>
  const shouldShowTracking = !!trackingCode || trackingTimeline.length > 0
  const canCancelOrder = order?.status === 'PENDING'

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'PENDING') return
    const confirmed = typeof window !== 'undefined' && window.confirm('Bạn có chắc muốn hủy đơn hàng này?')
    if (!confirmed) return
    try {
      await cancelOrderMutation.mutateAsync(orderNumber)
      toastSuccess('Đã hủy đơn hàng thành công.')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Hủy đơn hàng thất bại. Vui lòng thử lại.')
    }
  }

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!loading && !isAuthenticated && !isOpen) {
      openModal(`/tai-khoan/don-hang/${params.orderNumber}`)
    }
  }, [isAuthenticated, loading, openModal, isOpen, params.orderNumber])

  if (!isAuthenticated) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getTrackingSteps = () => {
    const currentStatus = order?.status || 'PENDING'
    const currentIndex = trackingFlow.indexOf(currentStatus)
    return trackingFlow.map((status, index) => {
      const timelineNode = trackingTimeline.find((item) => item.status === status)
      const done = currentIndex >= index
      const isCurrent = currentStatus === status
      return {
        status,
        done,
        isCurrent,
        label: statusMap[status]?.label || status,
        time: timelineNode?.time,
        note: timelineNode?.note,
      }
    })
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <AccountPageShell>
      <div className="space-y-6">
        <AccountPageHeader
          title="Chi tiết đơn hàng"
          subtitle={`Mã đơn: ${order?.order_number ?? (order?.id != null ? `#${order.id}` : orderNumber)}`}
          backHref="/tai-khoan/don-hang"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 mb-6">
              Có lỗi xảy ra khi tải thông tin đơn hàng: {error.message}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tai-khoan/don-hang"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Về danh sách đơn
              </Link>
              <Link
                href="/"
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}

        {/* Not found / empty state */}
        {!isLoading && !error && !order && orderNumber && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-6">
              Mã đơn không tồn tại hoặc bạn không có quyền xem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tai-khoan/don-hang"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Về danh sách đơn
              </Link>
              <Link
                href="/"
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}

        {/* Order Details */}
        {!isLoading && !error && order && (
    <div id="printable-order" className="space-y-6">
            {/* Order Info Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h2>
                <div className="flex items-center gap-2">{getStatusBadge(order.status)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {order.order_number || `#${order.id}`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatDate(order.created_date)}
                  </span>
                </div>
                {order.updated_date && (
                  <div>
                    <span className="text-gray-600">Cập nhật lần cuối:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatDate(order.updated_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking */}
            {shouldShowTracking && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Theo dõi vận chuyển</h2>
                {trackingCode && (
                  <p className="text-sm text-gray-700 mb-4">
                    Mã vận đơn: <span className="font-semibold text-gray-900">{trackingCode}</span>
                  </p>
                )}
                <ol className="space-y-3">
                  {getTrackingSteps().map((step) => (
                    <li key={step.status} className="flex items-start gap-3">
                      <span
                        className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                          step.done ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <div>
                        <p className={`text-sm ${step.isCurrent ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {step.label}
                        </p>
                        {step.time && <p className="text-xs text-gray-500">{formatDate(step.time)}</p>}
                        {step.note && <p className="text-xs text-gray-500">{step.note}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Shipping Address */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</h2>
              <p className="text-gray-700">{order.shipping_address || 'Chưa có thông tin'}</p>
            </div>

            {/* Order Items */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name || 'Sản phẩm'}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImagePlaceholderIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {item.name || `Sản phẩm #${item.variant_unit_id}`}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {(item.subtotal || item.price * item.quantity)?.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Không có sản phẩm nào</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{order.subtotal?.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">{order.shipping_fee?.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-primary-700">{order.total?.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Ghi chú</h2>
                <p className="text-gray-700 text-sm">{order.notes}</p>
              </div>
            )}

            {/* Bottom actions */}
            <div className="no-print rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  In đơn hàng
                </button>
                {canCancelOrder && (
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancelOrderMutation.isPending ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                  </button>
                )}
                <Link
                  href="/tai-khoan/don-hang"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Về danh sách đơn
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>
    <style jsx global>{`
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-order,
        #printable-order * {
          visibility: visible;
        }
        #printable-order {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          max-width: 100%;
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `}</style>
    </AccountPageShell>
  )
}
