'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { REGEX_EMAIL, REGEX_PHONE_NUMBER } from '@/lib/constant'
import { updateProfile } from '@/lib/services/auth'
import { LocationIcon, UserIcon } from '@/components/icons'
import Image from 'next/image'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'

const profileSchema = Yup.object().shape({
  first_name: Yup.string().trim().nullable().defined().max(150, 'Tên không được vượt quá 150 ký tự'),
  last_name: Yup.string().trim().nullable().defined().max(150, 'Họ không được vượt quá 150 ký tự'),
  name: Yup.string().trim().nullable().defined().max(254, 'Tên đầy đủ không được vượt quá 254 ký tự'),
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
  phone_number: Yup.string()
    .trim()
    .nullable()
    .defined()
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
})

type ProfileFormData = Yup.InferType<typeof profileSchema>

export default function ProfilePage() {
  const { user, refreshUser, isAuthenticated, token } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!isAuthenticated && !isOpen) {
      openModal('/tai-khoan/ho-so')
    }
  }, [isAuthenticated, openModal, isOpen])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !token) {
      toastError('Vui lòng đăng nhập để cập nhật thông tin')
      return
    }

    setLoading(true)
    try {
      const updateData = {
        first_name: data.first_name ?? undefined,
        last_name: data.last_name ?? undefined,
        name: data.name ?? undefined,
        email: data.email,
        phone_number: data.phone_number ?? undefined,
      }
      const response = await updateProfile(user.id, updateData, token)
      if (response.error) {
        throw new Error(response.error)
      }

      await refreshUser()
      toastSuccess('Cập nhật thông tin thành công')
    } catch (error: any) {
      toastError(error.message || 'Cập nhật thông tin thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <AccountPageShell>
      <div className="space-y-6">
        <AccountPageHeader title="Hồ sơ cá nhân" />

        {/* Section 1: Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {user.avatar_path || user.avatar ? (
                  <Image
                    src={user.avatar_path || user.avatar || '/images/avatar.png'}
                    width={96}
                    height={96}
                    alt={user.first_name + ' ' + user.last_name || user.email}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-primary-700" />
                    <span className="text-3xl font-semibold text-primary-700">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name || user.email}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <button
                  type="button"
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Thay đổi ảnh đại diện
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  id="first_name"
                  type="text"
                  {...register('first_name')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.first_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  disabled={loading}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...register('last_name')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.last_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  disabled={loading}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đầy đủ
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  {...register('phone_number')}
                  placeholder="0123456789"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phone_number ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  disabled={loading}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="mt-2 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <Link href="/tai-khoan">
                <Button variant="outline" disabled={loading}>
                  Hủy
                </Button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>

          </div>
        </form>

        <Link
          href="/tai-khoan/dia-chi"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 hover:border-primary-500"
        >
          <LocationIcon className="h-8 w-8 shrink-0 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sổ địa chỉ</h2>
            <p className="mt-1 text-sm text-gray-600">Quản lý địa chỉ giao hàng đã lưu trên tài khoản.</p>
          </div>
        </Link>
      </div>
    </AccountPageShell>
  )
}
