'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { ArrowLeftIcon, LocationIcon, XIcon } from '@/components/icons'

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

export default function AddressesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!authLoading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/dia-chi')
    }
  }, [isAuthenticated, authLoading, openModal, isOpen])

  useEffect(() => {
    // TODO: Load addresses from API
    // For now, load from localStorage
    const saved = localStorage.getItem('user_addresses')
    if (saved) {
      try {
        setAddresses(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

    setLoading(true)
    try {
      // TODO: Call API to delete address
      const updated = addresses.filter(a => a.id !== id)
      setAddresses(updated)
      localStorage.setItem('user_addresses', JSON.stringify(updated))
      toastSuccess('Đã xóa địa chỉ')
    } catch (error: any) {
      toastError(error.message || 'Xóa địa chỉ thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container className="py-6">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/tai-khoan"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Quay lại</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Sổ địa chỉ</h1>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingAddress(null)
              setShowForm(true)
            }}
          >
            Thêm địa chỉ mới
          </Button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <LocationIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">Chưa có địa chỉ nào được lưu</p>
            <Button
              variant="primary"
              onClick={() => {
                setEditingAddress(null)
                setShowForm(true)
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
                        setShowForm(true)
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={loading}
                      >
                        Đặt mặc định
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={loading}
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

        {/* Add/Edit Form Modal */}
        {showForm && (
          <AddressFormModal
            address={editingAddress}
            onClose={() => {
              setShowForm(false)
              setEditingAddress(null)
            }}
            onSave={(address) => {
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
              setShowForm(false)
              setEditingAddress(null)
            }}
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
            <Button variant="primary">
              {address ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
