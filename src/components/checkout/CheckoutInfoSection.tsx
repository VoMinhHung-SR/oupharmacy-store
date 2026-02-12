'use client'

import React from 'react'
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'
import type { CheckoutInformationFormData } from '@/lib/validations/checkout'
import { toastError } from '@/lib/utils/toast'

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
const inputError = 'border-red-300 focus:ring-red-500'
const inputNormal = 'border-gray-300'

interface CheckoutInfoSectionProps {
  register: UseFormRegister<CheckoutInformationFormData>
  errors: FieldErrors<CheckoutInformationFormData>
  onSubmit: (data: CheckoutInformationFormData) => void
  handleSubmit: UseFormHandleSubmit<CheckoutInformationFormData>
}

export function CheckoutInfoSection({ register, errors, onSubmit, handleSubmit }: CheckoutInfoSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
      <form
        onSubmit={handleSubmit(onSubmit, (errs) => {
          const first = Object.values(errs)[0]
          if (first?.message) toastError(first.message as string)
        })}
        className="space-y-4"
      >
        <div>
          <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="checkout-name"
            type="text"
            {...register('name')}
            placeholder="Nhập họ và tên"
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="checkout-phone"
            type="tel"
            {...register('phone')}
            placeholder="Nhập số điện thoại"
            className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="checkout-email"
            type="email"
            {...register('email')}
            placeholder="Nhập email"
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="checkout-address"
            {...register('address')}
            placeholder="Nhập địa chỉ giao hàng"
            rows={3}
            className={`${inputBase} resize-none ${errors.address ? inputError : inputNormal}`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg ml-auto block
          hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Lưu thông tin
        </button>
      </form>
    </section>
  )
}
