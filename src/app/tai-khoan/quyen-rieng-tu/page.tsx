'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { toastSuccess } from '@/lib/utils/toast'
import { ArrowLeftIcon } from '@/components/icons'


interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  showPhone: boolean
  allowSearch: boolean
  dataSharing: boolean
  marketingEmails: boolean
}

export default function PrivacyPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowSearch: true,
    dataSharing: false,
    marketingEmails: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!authLoading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/quyen-rieng-tu')
    }
  }, [isAuthenticated, authLoading, openModal, isOpen])

  useEffect(() => {
    const saved = localStorage.getItem('privacy_settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      localStorage.setItem('privacy_settings', JSON.stringify(settings))
      toastSuccess('Đã lưu cài đặt quyền riêng tư')
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
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
          <h1 className="text-2xl font-semibold text-gray-900">Quyền riêng tư</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiển thị hồ sơ
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => updateSetting('profileVisibility', e.target.value as 'public' | 'friends' | 'private')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="public">Công khai</option>
              <option value="friends">Bạn bè</option>
              <option value="private">Riêng tư</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {settings.profileVisibility === 'public' && 'Mọi người có thể xem hồ sơ của bạn'}
              {settings.profileVisibility === 'friends' && 'Chỉ bạn bè có thể xem hồ sơ của bạn'}
              {settings.profileVisibility === 'private' && 'Chỉ bạn có thể xem hồ sơ của bạn'}
            </p>
          </div>

          {/* Show Email */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Hiển thị email</span>
                <p className="text-xs text-gray-500 mt-1">Cho phép người khác xem email của bạn</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showEmail}
                onChange={(e) => updateSetting('showEmail', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {/* Show Phone */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Hiển thị số điện thoại</span>
                <p className="text-xs text-gray-500 mt-1">Cho phép người khác xem số điện thoại của bạn</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showPhone}
                onChange={(e) => updateSetting('showPhone', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {/* Allow Search */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Cho phép tìm kiếm</span>
                <p className="text-xs text-gray-500 mt-1">Cho phép người khác tìm thấy bạn qua tìm kiếm</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowSearch}
                onChange={(e) => updateSetting('allowSearch', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {/* Data Sharing */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Chia sẻ dữ liệu</span>
                <p className="text-xs text-gray-500 mt-1">Cho phép chia sẻ dữ liệu với đối tác để cải thiện dịch vụ</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dataSharing}
                onChange={(e) => updateSetting('dataSharing', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Email tiếp thị</span>
                <p className="text-xs text-gray-500 mt-1">Nhận email về sản phẩm và khuyến mãi mới</p>
              </div>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => updateSetting('marketingEmails', e.target.checked)}
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
