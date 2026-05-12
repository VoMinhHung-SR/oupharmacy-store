'use client'

import React from 'react'
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'
import type { CheckoutInformationFormData } from '@/lib/validations/checkout'
import { UserIcon, LocationIcon } from '@/components/icons'
import { toastError } from '@/lib/utils/toast'

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
const inputError = 'border-red-300 focus:ring-red-500'
const inputNormal = 'border-gray-200'

interface CheckoutInfoSectionProps {
  register: UseFormRegister<CheckoutInformationFormData>
  errors: FieldErrors<CheckoutInformationFormData>
  onSubmit: (data: CheckoutInformationFormData) => void
  handleSubmit: UseFormHandleSubmit<CheckoutInformationFormData>
}

export function CheckoutInfoSection({ register, errors, onSubmit, handleSubmit }: CheckoutInfoSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit, (errs) => {
          const first = Object.values(errs)[0]
          if (first?.message) toastError(first.message as string)
        })}
        className="space-y-6"
      >
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <UserIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin người đặt
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="checkout-name" className="mb-1 block text-sm font-medium text-gray-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                {...register('name')}
                placeholder="Nhập họ và tên"
                autoComplete="name"
                className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="checkout-phone" className="mb-1 block text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                {...register('phone')}
                placeholder="Nhập số điện thoại"
                autoComplete="tel"
                className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="checkout-email" className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-gray-400">(không bắt buộc)</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                {...register('email')}
                placeholder="Nhập email nếu cần nhận xác nhận"
                autoComplete="email"
                className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <LocationIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin nhận hàng
          </h2>
          <div>
            <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium text-gray-700">
              Địa chỉ giao hàng <span className="text-red-500">*</span>
            </label>
            <textarea
              id="checkout-address"
              {...register('address')}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              rows={3}
              className={`${inputBase} resize-none ${errors.address ? inputError : inputNormal}`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="ml-auto block rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Lưu thông tin
        </button>
      </form>
    </section>
  )
}
