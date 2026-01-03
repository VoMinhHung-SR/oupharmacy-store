'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { REGEX_EMAIL, REGEX_PHONE_NUMBER } from '@/lib/constant'
import { updateProfile } from '@/lib/services/auth'
import { ArrowLeftIcon, LocationIcon, UserIcon, XIcon } from '@/components/icons'
import Image from 'next/image'

const profileSchema = Yup.object().shape({
  first_name: Yup.string().trim().max(150, 'Tên không được vượt quá 150 ký tự'),
  last_name: Yup.string().trim().max(150, 'Họ không được vượt quá 150 ký tự'),
  name: Yup.string().trim().max(254, 'Tên đầy đủ không được vượt quá 254 ký tự'),
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
  phone_number: Yup.string()
    .trim()
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
})

type ProfileFormData = Yup.InferType<typeof profileSchema>

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  district: string
  ward?: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { user, refreshUser, isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

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

  useEffect(() => {
    // Load addresses from localStorage
    const saved = localStorage.getItem('user_addresses')
    if (saved) {
      try {
        setAddresses(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !token) {
      toastError('Vui lòng đăng nhập để cập nhật thông tin')
      return
    }

    setLoading(true)
    try {
      const response = await updateProfile(user.id, data, token)
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

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

    setAddressLoading(true)
    try {
      // TODO: Call API to delete address
      const updated = addresses.filter(a => a.id !== id)
      setAddresses(updated)
      localStorage.setItem('user_addresses', JSON.stringify(updated))
      toastSuccess('Đã xóa địa chỉ')
    } catch (error: any) {
      toastError(error.message || 'Xóa địa chỉ thất bại')
    } finally {
      setAddressLoading(false)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    setAddressLoading(true)
    try {
      // TODO: Call API to set default address
      const updated = addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      }))
      setAddresses(updated)
      localStorage.setItem('user_addresses', JSON.stringify(updated))
      toastSuccess('Đã đặt làm địa chỉ mặc định')
    } catch (error: any) {
      toastError(error.message || 'Cập nhật thất bại')
    } finally {
      setAddressLoading(false)
    }
  }

  const handleSaveAddress = (address: Address) => {
    if (editingAddress) {
      // Update existing
      const updated = addresses.map(a => a.id === editingAddress.id ? address : a)
      setAddresses(updated)
      localStorage.setItem('user_addresses', JSON.stringify(updated))
      toastSuccess('Đã cập nhật địa chỉ')
    } else {
      // Add new
      const updated = [...addresses, address]
      setAddresses(updated)
      localStorage.setItem('user_addresses', JSON.stringify(updated))
      toastSuccess('Đã thêm địa chỉ mới')
    }
    setShowAddressForm(false)
    setEditingAddress(null)
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <Container className="py-6">
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/tai-khoan"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Hồ sơ cá nhân</h1>
        </div>

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
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.first_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
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
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.last_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
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
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
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
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
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
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.phone_number ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex justify-end gap-3">
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

        {/* Section 2: Address Management - Independent Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sổ địa chỉ</h2>
              <p className="text-sm text-gray-600 mt-1">Quản lý địa chỉ giao hàng của bạn</p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setEditingAddress(null)
                setShowAddressForm(true)
              }}
            >
              Thêm địa chỉ mới
            </Button>
          </div>

          {/* Addresses List */}
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <LocationIcon className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">Chưa có địa chỉ nào được lưu</p>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingAddress(null)
                  setShowAddressForm(true)
                }}
              >
                Thêm địa chỉ đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="relative rounded-lg border border-gray-200 bg-white p-6 hover:border-primary-500 transition-colors"
                >
                  {address.isDefault && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Mặc định
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>

                    <div className="text-sm text-gray-700">
                      <p>{address.address}</p>
                      <p>
                        {address.ward && `${address.ward}, `}
                        {address.district}, {address.city}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAddress(address)
                          setShowAddressForm(true)
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          disabled={addressLoading}
                        >
                          Đặt mặc định
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={addressLoading}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Address Form Modal */}
        {showAddressForm && (
          <AddressFormModal
            address={editingAddress}
            onClose={() => {
              setShowAddressForm(false)
              setEditingAddress(null)
            }}
            onSave={handleSaveAddress}
          />
        )}
      </div>
    </Container>
  )
}

function AddressFormModal({
  address,
  onClose,
  onSave,
}: {
  address: Address | null
  onClose: () => void
  onSave: (address: Address) => void
}) {
  const [formData, setFormData] = useState({
    name: address?.name || '',
    phone: address?.phone || '',
    address: address?.address || '',
    city: address?.city || '',
    district: address?.district || '',
    ward: address?.ward || '',
    isDefault: address?.isDefault || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: address?.id || Date.now().toString(),
      ...formData,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã
            </label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {address ? 'Cập nhật' : 'Thêm địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
