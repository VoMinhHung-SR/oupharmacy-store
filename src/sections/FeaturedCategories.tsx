'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'

interface Category {
  name: string
  icon: string
  count: number
  href: string
}

const categories: Category[] = [
  { name: 'Thần kinh não', icon: '🧠', count: 57, href: '/categories/than-kinh-nao' },
  { name: 'Vitamin & Khoáng chất', icon: '💊', count: 113, href: '/categories/vitamin-khoang-chat' },
  { name: 'Sức khoẻ tim mạch', icon: '❤️', count: 23, href: '/categories/suc-khoe-tim-mach' },
  { name: 'Tăng sức đề kháng, miễn dịch', icon: '🛡️', count: 39, href: '/categories/tang-suc-de-khang' },
  { name: 'Hỗ trợ tiêu hóa', icon: '🫀', count: 68, href: '/categories/ho-tro-tieu-hoa' },
  { name: 'Sinh lý - Nội tiết tố', icon: '⚕️', count: 42, href: '/categories/sinh-ly-noi-tiet' },
  { name: 'Dinh dưỡng', icon: '⚖️', count: 37, href: '/categories/dinh-duong' },
  { name: 'Hỗ trợ điều trị', icon: '➕', count: 125, href: '/categories/ho-tro-dieu-tri' },
  { name: 'Giải pháp làn da', icon: '✨', count: 88, href: '/categories/giai-phap-lan-da' },
  { name: 'Chăm sóc da mặt', icon: '😷', count: 198, href: '/categories/cham-soc-da-mat' },
  { name: 'Hỗ trợ làm đẹp', icon: '💅', count: 22, href: '/categories/ho-tro-lam-dep' },
  { name: 'Hỗ trợ tình dục', icon: '💑', count: 41, href: '/categories/ho-tro-tinh-duc' },
]

export const FeaturedCategories: React.FC = () => {
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`

  return (
    <section className="py-12 bg-primary-50">
      <Container>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Danh mục nổi bật</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.href}
              href={createLink(category.href)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="text-4xl mb-3 text-center">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900 mb-1 group-hover:text-primary-700 text-center line-clamp-2 min-h-[2.5rem]">
                {category.name}
              </div>
              <div className="text-xs text-gray-600 text-center">
                {category.count} sản phẩm
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FeaturedCategories

