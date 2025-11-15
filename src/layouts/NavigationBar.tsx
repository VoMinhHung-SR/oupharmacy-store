'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'

const categories = [
  { name: 'Thực phẩm chức năng', href: '/categories/thuc-pham-chuc-nang' },
  { name: 'Dược mỹ phẩm', href: '/categories/duoc-my-pham' },
  { name: 'Thuốc', href: '/categories/thuoc' },
  { name: 'Chăm sóc cá nhân', href: '/categories/cham-soc-ca-nhan' },
  { name: 'Thiết bị y tế', href: '/categories/thiet-bi-y-te' },
  { name: 'Tiêm chủng', href: '/categories/tiem-chung' },
  { name: 'Bệnh & Góc sức khỏe', href: '/categories/benh-goc-suc-khoe' },
  { name: 'Hệ thống nhà thuốc', href: '/categories/he-thong-nha-thuoc' },
]

export const NavigationBar: React.FC = () => {
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`

  return (
    <nav className="bg-primary-700 text-white">
      <Container>
        <div className="flex items-center gap-6 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={createLink(category.href)}
              className="flex items-center gap-1 py-3 px-2 hover:bg-primary-800 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          ))}
        </div>
      </Container>
    </nav>
  )
}

export default NavigationBar

