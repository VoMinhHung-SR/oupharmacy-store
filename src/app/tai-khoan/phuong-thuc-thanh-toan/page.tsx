'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/Button'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { CreditCardIcon } from '@/components/icons'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'momo' | 'zalopay'
  name: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!authLoading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/phuong-thuc-thanh-toan')
    }
  }, [isAuthenticated, authLoading, openModal, isOpen])

  useEffect(() => {
    // TODO: Load payment methods from API
    const saved = localStorage.getItem('user_payment_methods')
    if (saved) {
      try {
        setMethods(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) return

    setLoading(true)
    try {
      const updated = methods.filter(m => m.id !== id)
      setMethods(updated)
      localStorage.setItem('user_payment_methods', JSON.stringify(updated))
      toastSuccess('Đã xóa phương thức thanh toán')
    } catch (error: any) {
      toastError(error.message || 'Xóa thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    setLoading(true)
    try {
      const updated = methods.map(m => ({
        ...m,
        isDefault: m.id === id,
      }))
      setMethods(updated)
      localStorage.setItem('user_payment_methods', JSON.stringify(updated))
      toastSuccess('Đã đặt làm phương thức mặc định')
    } catch (error: any) {
      toastError(error.message || 'Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return (
          <CreditCardIcon className="w-8 h-8" />
        )
      case 'momo':
        return <span className="text-2xl">💳</span>
      case 'zalopay':
        return <span className="text-2xl">💵</span>
      default:
        return <span className="text-2xl">🏦</span>
    }
  }

  return (
    <AccountPageShell>
      <div className="space-y-6">
        <AccountPageHeader title="Phương thức thanh toán" rightSlot={<Button variant="primary">Thêm phương thức</Button>} />

        {methods.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <CreditCardIcon className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">Chưa có phương thức thanh toán nào</p>
            <Button variant="primary">Thêm phương thức đầu tiên</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 text-primary-600">
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {method.last4 && (
                      <p className="text-sm text-gray-600">
                        •••• •••• •••• {method.last4}
                      </p>
                    )}
                    {method.expiryMonth && method.expiryYear && (
                      <p className="text-sm text-gray-600">
                        Hết hạn: {method.expiryMonth}/{method.expiryYear}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={loading}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountPageShell>
  )
}
