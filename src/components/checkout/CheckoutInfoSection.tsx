'use client'

import React from 'react'
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form'
import type { CheckoutInformationFormData } from '@/lib/validations/checkout'
import { UserIcon, LocationIcon } from '@/components/icons'
import { toastError } from '@/lib/utils/toast'
import { TextField } from '@/components/TextField'

const inputBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed'
const inputError = 'border-red-300 focus:ring-red-500'
const inputNormal = 'border-slate-200'

interface CheckoutInfoSectionProps {
  register: UseFormRegister<CheckoutInformationFormData>
  errors: FieldErrors<CheckoutInformationFormData>
  onSubmit: (data: CheckoutInformationFormData) => void
  handleSubmit: UseFormHandleSubmit<CheckoutInformationFormData>
  notes: string
  onNotesChange: (value: string) => void
}

export function CheckoutInfoSection({
  register,
  errors,
  onSubmit,
  handleSubmit,
  notes,
  onNotesChange,
}: CheckoutInfoSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit, (errs) => {
          const first = Object.values(errs)[0]
          if (first?.message) toastError(first.message as string)
        })}
        className="space-y-8"
      >
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <UserIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin người đặt
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              <TextField
                label="Họ và tên người đặt"
                required
                id="checkout-name"
                type="text"
                {...register('name')}
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </div>
            <div className="md:col-span-1">
              <TextField
                label="Số điện thoại"
                required
                id="checkout-phone"
                type="tel"
                {...register('phone')}
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </div>
            <div className="md:col-span-2">
              <TextField
                label="Email (không bắt buộc)"
                id="checkout-email"
                type="email"
                {...register('email')}
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <LocationIcon className="h-5 w-5 shrink-0 text-primary-600" />
            Thông tin nhận hàng
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <TextField
                label="Họ và tên người nhận"
                required
                id="checkout-recipient-name"
                type="text"
                {...register('recipient_name')}
                autoComplete="section-shipping name"
                error={!!errors.recipient_name}
                helperText={errors.recipient_name?.message}
              />
            </div>
            <div>
              <TextField
                label="Số điện thoại"
                required
                id="checkout-recipient-phone"
                type="tel"
                {...register('recipient_phone')}
                autoComplete="section-shipping tel"
                error={!!errors.recipient_phone}
                helperText={errors.recipient_phone?.message}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs leading-relaxed text-sky-900 sm:text-sm">
            Địa chỉ nhập theo <span className="font-semibold">ranh giới hành chính sau sáp nhập</span> (không dùng
            địa danh trước sáp nhập).
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <select
                id="checkout-province"
                {...register('province')}
                className={`${inputBase} ${errors.province ? inputError : inputNormal}`}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
              </select>
            </div>
            <div>
              <select
                id="checkout-district"
                {...register('district')}
                className={`${inputBase} ${errors.district ? inputError : inputNormal}`}
              >
                <option value="">Chọn Quận/Huyện</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                id="checkout-ward"
                {...register('ward')}
                className={`${inputBase} ${errors.ward ? inputError : inputNormal}`}
              >
                <option value="">Chọn Phường/Xã</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium text-slate-700">
              Nhập địa chỉ cụ thể <span className="text-red-500">*</span>
            </label>
            <textarea
              id="checkout-address"
              {...register('address')}
              placeholder="Số nhà, tên đường, tòa nhà…"
              rows={3}
              className={`${inputBase} resize-none ${errors.address ? inputError : inputNormal}`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="checkout-notes-inline" className="mb-1 block text-sm font-medium text-slate-700">
              Ghi chú <span className="text-slate-400">(không bắt buộc)</span>
            </label>
            <p className="mb-2 text-xs text-slate-500">Ví dụ: gọi trước khi giao 15 phút.</p>
            <textarea
              id="checkout-notes-inline"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Ghi chú cho đơn hàng"
              rows={3}
              maxLength={2000}
              className={`${inputBase} resize-none ${inputNormal}`}
            />
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
