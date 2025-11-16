'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'

export const PromotionalBanners: React.FC = () => {
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left banner */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Túi nhỏ đa-zi-năng
                </h3>
                <p className="text-gray-600 mb-4">
                  Hiểu đúng về thuốc, an tâm khi cần
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Hình ảnh sản phẩm</div>
            </div>
            <Link href={createLink('/articles/thuoc')}>
              <Button variant="primary" size="md" className="w-full bg-red-600 hover:bg-red-700">
                ĐỌC NGAY
              </Button>
            </Link>
          </div>

          {/* Right banner */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Dịu mắt cả ngày Đẩy nhanh công việc
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Hình ảnh sản phẩm</div>
            </div>
            <Link href={createLink('/categories/thuoc-nho-mat')}>
              <Button variant="primary" size="md" className="w-full bg-pink-500 hover:bg-pink-600">
                MUA NGAY
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default PromotionalBanners

