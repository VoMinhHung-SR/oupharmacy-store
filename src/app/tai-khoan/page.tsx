'use client'

import Link from 'next/link'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import { useRouter } from 'next/navigation'
import { UserIcon, LocationIcon, CreditCardIcon, BellIcon, SettingsIcon, LockIcon, KeyIcon, OrderIcon } from '@/components/icons'

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      title: 'Hồ sơ cá nhân',
      description: 'Chỉnh sửa thông tin cá nhân',
      href: '/tai-khoan/ho-so',
      icon: <UserIcon className="w-6 h-6" />,
    },
    {
      title: 'Phương thức thanh toán',
      description: 'Quản lý thẻ và phương thức thanh toán',
      href: '/tai-khoan/phuong-thuc-thanh-toan',
      icon: <CreditCardIcon className="w-6 h-6" />,
    },
    {
      title: 'Thông báo',
      description: 'Tùy chọn thông báo',
      href: '/tai-khoan/thong-bao',
      icon: <BellIcon className="w-6 h-6" />,
    },
    {
      title: 'Cài đặt tài khoản',
      description: 'Cài đặt và tùy chọn tài khoản',
      href: '/tai-khoan/cai-dat',
      icon: <SettingsIcon className="w-6 h-6" />,
    },
    {
      title: 'Quyền riêng tư',
      description: 'Cài đặt quyền riêng tư và bảo mật',
      href: '/tai-khoan/quyen-rieng-tu',
      icon: <LockIcon className="w-6 h-6" />,
    },
    {
      title: 'Đổi mật khẩu',
      description: 'Thay đổi mật khẩu tài khoản',
      href: '/tai-khoan/doi-mat-khau',
      icon: <KeyIcon className="w-6 h-6" />,
    },
    {
      title: 'Đơn hàng của tôi',
      description: 'Xem lịch sử đơn hàng',
      href: '/tai-khoan/don-hang',
      icon: <OrderIcon className="w-6 h-6" />,
    },
  ]

  return (
    <Container className="py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tài khoản của tôi</h1>
          <p className="text-sm text-gray-600 mt-1">
            Xin chào, {user?.name || user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-4 p-6 rounded-lg border border-gray-200 bg-white hover:border-primary-500 hover:shadow-md transition-all group"
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}
