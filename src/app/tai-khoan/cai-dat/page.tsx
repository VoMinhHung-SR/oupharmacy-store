'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toastSuccess } from '@/lib/utils/toast'
import { ArrowLeftIcon } from '@/components/icons'

interface AccountSettings {
  language: string
  currency: string
  timezone: string
  dateFormat: string
  autoSave: boolean
  twoFactorAuth: boolean
}

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<AccountSettings>({
    language: 'vi',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    autoSave: true,
    twoFactorAuth: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const saved = localStorage.getItem('account_settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      localStorage.setItem('account_settings', JSON.stringify(settings))
      toastSuccess('Đã lưu cài đặt')
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = <K extends keyof AccountSettings>(key: K, value: AccountSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
          <h1 className="text-2xl font-semibold text-gray-900">Cài đặt tài khoản</h1>
        </div>

        <div className="space-y-6">
          {/* Language */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngôn ngữ
            </label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Currency */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị tiền tệ
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Múi giờ
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => updateSetting('timezone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="UTC">UTC (GMT+0)</option>
            </select>
          </div>

          {/* Date Format */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Định dạng ngày
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => updateSetting('dateFormat', e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Auto Save */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Tự động lưu</span>
                <p className="text-xs text-gray-500 mt-1">Tự động lưu thay đổi khi chỉnh sửa</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {/* Two Factor Auth */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Xác thực hai yếu tố</span>
                <p className="text-xs text-gray-500 mt-1">Bảo mật tài khoản với mã xác thực</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => updateSetting('twoFactorAuth', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
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
