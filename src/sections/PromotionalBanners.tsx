'use client'

import { LocationIcon } from '@/components/icons'
import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'

export const PromotionalBanners: React.FC = () => {

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left banner */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center flex-shrink-0">
                <LocationIcon className="w-5 h-5 text-white" />
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
            <Link href="/articles/thuoc">
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
            <Link href="/categories/thuoc-nho-mat">
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

