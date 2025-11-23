'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'

export const HeroBanner: React.FC = () => {

  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12">
      <Container>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="text-4xl md:text-5xl font-bold">
              <div>PHÁI MẠNH BẢN LĨNH</div>
              <div className="text-primary-100">Sức khỏe vững vàng</div>
            </div>
            <p className="text-lg text-primary-100">
              Chăm sóc sức khỏe toàn diện cho bạn và gia đình
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors font-bold shadow-lg">
                Mua ngay
              </Button>
            </div>
          </div>

          {/* Right promotions */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl font-bold mb-2">Dược Mỹ Phẩm</div>
              <div className="text-3xl font-bold text-yellow-300 mb-4">Giảm đến 35%</div>
              <Link href="/categories/duoc-my-pham">
                <Button variant="secondary" size="md" className="bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors font-semibold shadow-md">
                  Mua ngay
                </Button>
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl font-bold mb-2">TPCN Hàng Nhật Âu Mỹ</div>
              <div className="text-3xl font-bold text-yellow-300 mb-4">Giảm đến 30%</div>
              <Link href="/categories/thuc-pham-chuc-nang">
                <Button variant="secondary" size="md" className="bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors font-semibold shadow-md">
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

