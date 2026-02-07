'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { useShippingMethods } from '@/lib/hooks/useShipping'
import { toastError } from '@/lib/utils/toast'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'

export default function CheckoutVanChuyenPage() {
  const router = useRouter()
  const { information, shippingMethodId, setShippingMethodId, setSelectedShippingMethod } = useCheckout()
  const { items, total } = useCart()
  const { data: shippingMethodsData, isLoading: methodsLoading, error: methodsError } = useShippingMethods()

  const methods = Array.isArray(shippingMethodsData) ? shippingMethodsData.filter((m) => m.active) : []
  const selectedMethod = methods.find((m) => m.id === shippingMethodId)
  const shippingFee = selectedMethod?.price ?? 0
  const orderTotal = total + shippingFee

  useEffect(() => {
    if (!information) {
      router.replace('/don-hang/thong-tin')
    }
  }, [information, router])

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/gio-hang')
    }
  }, [items.length, router])

  const handleContinue = () => {
    if (shippingMethodId == null) {
      toastError('Vui lòng chọn phương thức vận chuyển')
      return
    }
    router.push('/don-hang/thanh-toan')
  }

  if (items.length === 0 || !information) {
    return null
  }

  return (
    <Container className="space-y-6 py-8">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Thông tin', href: '/don-hang/thong-tin' },
          { label: 'Vận chuyển' },
        ]}
      />

      <h1 className="text-2xl font-semibold text-gray-900">Phương thức vận chuyển</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          {methodsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" aria-busy="true" />
            </div>
          )}
          {methodsError && (
            <p className="text-sm text-red-600">
              Không tải được danh sách vận chuyển. Vui lòng thử lại.
            </p>
          )}
          {!methodsLoading && !methodsError && methods.length === 0 && (
            <p className="text-sm text-gray-600">Chưa có phương thức vận chuyển.</p>
          )}
          {!methodsLoading && methods.length > 0 && (
            <div className="space-y-3" role="radiogroup" aria-label="Chọn phương thức vận chuyển">
              {methods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    shippingMethodId === method.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingMethodId === method.id}
                    onChange={() => {
                      setShippingMethodId(method.id)
                      setSelectedShippingMethod(method)
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="flex-1">
                    <span className="font-medium">{method.name}</span>
                    {method.estimated_days != null && (
                      <span className="ml-2 text-gray-600 text-sm">
                        ({method.estimated_days} ngày)
                      </span>
                    )}
                  </span>
                  <span className="font-medium">{method.price.toLocaleString('vi-VN')}₫</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Link
              href="/don-hang/thong-tin"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Quay lại
            </Link>
            <button
              type="button"
              onClick={handleContinue}
              disabled={methodsLoading || methods.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-gray-700">x{item.qty}</div>
                </div>
                <div className="text-right font-medium text-gray-900">
                  {(item.price * item.qty).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900">{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-900">
                {selectedMethod ? `${shippingFee.toLocaleString('vi-VN')}₫` : 'Chọn phương thức'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold text-gray-900">Tổng cộng</span>
              <span className="text-lg font-semibold text-gray-900">{orderTotal.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
