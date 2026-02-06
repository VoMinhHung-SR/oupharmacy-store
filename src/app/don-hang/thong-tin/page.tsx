'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { toastError } from '@/lib/utils/toast'
import { checkoutInformationSchema, type CheckoutInformationFormData } from '@/lib/validations/checkout'
import Breadcrumb from '@/components/Breadcrumb'

export default function CheckoutThongTinPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { information, setInformation } = useCheckout()
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutInformationFormData>({
    resolver: yupResolver(checkoutInformationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: information?.name || '',
      phone: information?.phone || '',
      email: information?.email || '',
      address: information?.address || '',
    },
  })

  useEffect(() => {
    if (information) {
      setValue('name', information.name)
      setValue('phone', information.phone)
      setValue('email', information.email)
      setValue('address', information.address)
    }
  }, [information, setValue])

  useEffect(() => {
    if (information || !user) return
    const name =
      user.name ||
      [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
      user.username ||
      ''
    if (name) setValue('name', name)
    if (user.email) setValue('email', user.email)
    if (user.phone_number) setValue('phone', user.phone_number)
  }, [user, information, setValue])

  const onSubmit = async (data: CheckoutInformationFormData) => {
    setLoading(true)
    try {
      setInformation({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      })
      router.push('/don-hang/van-chuyen')
    } catch (err: any) {
      const errorMsg = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      toastError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (items.length === 0) {
      router.push('/gio-hang')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 py-8 px-4">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Thông tin khách hàng' },
        ]}
      />

      <h1 className="text-2xl font-semibold text-gray-900">Thông tin khách hàng</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <form
          className="space-y-4 rounded-lg border bg-white p-6"
          onSubmit={handleSubmit(onSubmit, (errors) => {
            const firstError = Object.values(errors)[0]
            if (firstError?.message) {
              toastError(firstError.message)
            }
          })}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Nhập họ và tên"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="Nhập số điện thoại"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Nhập email"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              {...register('address')}
              placeholder="Nhập địa chỉ giao hàng"
              rows={3}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-none ${
                errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Link
              href="/gio-hang"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Quay lại
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Tiếp tục'
              )}
            </button>
          </div>
        </form>

        <div className="rounded-lg border bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">x{item.qty}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{(item.price * item.qty).toLocaleString('vi-VN')}₫</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <div className="font-semibold">Tạm tính</div>
              <div className="text-lg font-semibold">{total.toLocaleString('vi-VN')}₫</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
