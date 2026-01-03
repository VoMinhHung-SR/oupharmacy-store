'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toastSuccess } from '@/lib/utils/toast'
import { ArrowLeftIcon } from '@/components/icons'

interface NotificationPreferences {
  email: {
    orders: boolean
    promotions: boolean
    newsletters: boolean
    account: boolean
  }
  sms: {
    orders: boolean
    promotions: boolean
  }
  push: {
    orders: boolean
    promotions: boolean
    account: boolean
  }
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      orders: true,
      promotions: true,
      newsletters: false,
      account: true,
    },
    sms: {
      orders: false,
      promotions: false,
    },
    push: {
      orders: true,
      promotions: true,
      account: true,
    },
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const saved = localStorage.getItem('notification_preferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Call API to save preferences
      localStorage.setItem('notification_preferences', JSON.stringify(preferences))
      toastSuccess('Đã lưu tùy chọn thông báo')
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const updatePreference = (category: keyof NotificationPreferences, key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container className="py-6">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/tai-khoan"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Quay lại</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Tùy chọn thông báo</h1>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Email</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Thông báo đơn hàng</span>
                <input
                  type="checkbox"
                  checked={preferences.email.orders}
                  onChange={(e) => updatePreference('email', 'orders', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Khuyến mãi và ưu đãi</span>
                <input
                  type="checkbox"
                  checked={preferences.email.promotions}
                  onChange={(e) => updatePreference('email', 'promotions', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Bản tin</span>
                <input
                  type="checkbox"
                  checked={preferences.email.newsletters}
                  onChange={(e) => updatePreference('email', 'newsletters', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Thông báo tài khoản</span>
                <input
                  type="checkbox"
                  checked={preferences.email.account}
                  onChange={(e) => updatePreference('email', 'account', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SMS</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Thông báo đơn hàng</span>
                <input
                  type="checkbox"
                  checked={preferences.sms.orders}
                  onChange={(e) => updatePreference('sms', 'orders', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Khuyến mãi và ưu đãi</span>
                <input
                  type="checkbox"
                  checked={preferences.sms.promotions}
                  onChange={(e) => updatePreference('sms', 'promotions', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông báo đẩy</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Thông báo đơn hàng</span>
                <input
                  type="checkbox"
                  checked={preferences.push.orders}
                  onChange={(e) => updatePreference('push', 'orders', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Khuyến mãi và ưu đãi</span>
                <input
                  type="checkbox"
                  checked={preferences.push.promotions}
                  onChange={(e) => updatePreference('push', 'promotions', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Thông báo tài khoản</span>
                <input
                  type="checkbox"
                  checked={preferences.push.account}
                  onChange={(e) => updatePreference('push', 'account', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
