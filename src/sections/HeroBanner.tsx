'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'

export const HeroBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-8 text-white sm:py-10 md:py-12">
      <Container>
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              <div>PHÁI MẠNH BẢN LĨNH</div>
              <div className="text-primary-100">Sức khỏe vững vàng</div>
            </div>
            <p className="text-sm text-primary-100 sm:text-base md:text-lg">
              Chăm sóc sức khỏe toàn diện cho bạn và gia đình
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="md"
                className="bg-white font-bold text-primary-600 shadow-lg transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                Mua ngay
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5 md:p-6">
              <div className="mb-1 text-base font-bold sm:mb-2 sm:text-xl md:text-2xl">Dược Mỹ Phẩm</div>
              <div className="mb-3 text-xl font-bold text-yellow-300 sm:mb-4 sm:text-2xl md:text-3xl">
                Giảm đến 35%
              </div>
              <Link href="/categories/duoc-my-pham">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white font-semibold text-primary-600 shadow-md transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  Mua ngay
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5 md:p-6">
              <div className="mb-1 text-base font-bold sm:mb-2 sm:text-xl md:text-2xl">
                TPCN Hàng Nhật Âu Mỹ
              </div>
              <div className="mb-3 text-xl font-bold text-yellow-300 sm:mb-4 sm:text-2xl md:text-3xl">
                Giảm đến 30%
              </div>
              <Link href="/categories/thuc-pham-chuc-nang">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white font-semibold text-primary-600 shadow-md transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  Mua ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroBanner
