'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { usePaymentMethods } from '@/lib/hooks/usePayment'
import { useShippingMethod } from '@/lib/hooks/useShipping'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import type { Order } from '@/lib/services/orders'
import { toastError } from '@/lib/utils/toast'
import Breadcrumb from '@/components/Breadcrumb'

export default function CheckoutThanhToanPage() {
  const router = useRouter()
  const {
    information,
    shippingMethodId,
    selectedShippingMethod,
    paymentMethodId,
    setPaymentMethodId,
    clear: clearCheckout,
  } = useCheckout()
  const { items, total, clear: clearCart } = useCart()
  const { data: paymentMethodsData, isLoading: methodsLoading, error: methodsError } = usePaymentMethods()
  const { data: fallbackShippingMethod } = useShippingMethod(
    selectedShippingMethod == null && shippingMethodId != null ? shippingMethodId : 0
  )
  const createOrderMutation = useCreateOrder()

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData.filter((m) => m.active) : []
  const shippingFee = selectedShippingMethod?.price ?? fallbackShippingMethod?.price ?? 0
  const orderTotal = total + shippingFee

  useEffect(() => {
    if (!information) {
      router.replace('/don-hang/thong-tin')
      return
    }
    if (shippingMethodId == null) {
      router.replace('/don-hang/van-chuyen')
    }
  }, [information, shippingMethodId, router])

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/gio-hang')
    }
  }, [items.length, router])

  const handlePlaceOrder = async () => {
    if (paymentMethodId == null) {
      toastError('Vui lòng chọn phương thức thanh toán')
      return
    }
    if (!information || selectedShippingMethod == null) {
      toastError('Thiếu thông tin đơn hàng. Vui lòng quay lại bước trước.')
      return
    }
    if (items.length === 0) {
      router.replace('/gio-hang')
      return
    }

    const payload: Order = {
      items: items.map((i) => ({
        medicine_unit_id: i.medicine_unit_id,
        quantity: i.qty,
        price: i.price,
      })),
      subtotal: total,
      shipping_fee: shippingFee,
      total: orderTotal,
      shipping_method: shippingMethodId!,
      payment_method: paymentMethodId,
      shipping_address: information.address,
      status: 'PENDING',
    }

    try {
      const created = await createOrderMutation.mutateAsync(payload)
      const orderId = created?.id
      clearCart()
      clearCheckout()
      router.push(orderId != null ? `/don-hang/xac-nhan-don-hang?order_id=${orderId}` : '/don-hang/xac-nhan-don-hang')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.'
      toastError(message)
    }
  }

  const isSubmitting = createOrderMutation.isPending
  const canSubmit = !methodsLoading && paymentMethods.length > 0 && !isSubmitting

  if (items.length === 0 || !information || shippingMethodId == null) {
    return null
  }

  return (
    <div className="space-y-6 py-8 px-4">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Thông tin', href: '/don-hang/thong-tin' },
          { label: 'Vận chuyển', href: '/don-hang/van-chuyen' },
          { label: 'Thanh toán' },
        ]}
      />

      <h1 className="text-2xl font-semibold text-gray-900">Phương thức thanh toán</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-lg border bg-white p-6">
          {methodsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" aria-busy="true" />
            </div>
          )}
          {methodsError && (
            <p className="text-sm text-red-600">
              Không tải được danh sách thanh toán. Vui lòng thử lại.
            </p>
          )}
          {!methodsLoading && !methodsError && paymentMethods.length === 0 && (
            <p className="text-sm text-gray-600">Chưa có phương thức thanh toán.</p>
          )}
          {!methodsLoading && paymentMethods.length > 0 && (
            <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức thanh toán">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    paymentMethodId === method.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethodId === method.id}
                    onChange={() => setPaymentMethodId(method.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Link
              href="/don-hang/van-chuyen"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Quay lại
            </Link>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!canSubmit}
              aria-busy={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Đặt hàng'
              )}
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">x{item.qty}</div>
                </div>
                <div className="text-right font-medium">
                  {(item.price * item.qty).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span>{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-lg font-semibold">{orderTotal.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
