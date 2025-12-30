'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'
import { useAuth } from '@/contexts/AuthContext'
import AvatarBadge from '@/components/AvatarBadge'
import { useCart } from '@/contexts/CartContext'

export const Header: React.FC = () => {
  const t = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const { items } = useCart()
  return (
    <header className="sticky top-0 left-0 right-0 z-30 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-primary-800/50 text-white text-sm py-2 border-b border-white/10">
        <Container>
          <div className="flex justify-between items-center">
            <div className="hidden md:flex items-center gap-4">
              <span className="hover:text-primary-100 transition-colors cursor-pointer">Đặt lịch khám</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Hotline: <span className="font-bold">Tại đây</span></span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <div className="py-4">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">NHÀ THUỐC</span>
                <span className="text-xl font-semibold text-primary-100">OUPHARMACY</span>
              </div>
            </Link>

            {/* Search bar */}
            <form action="/search" className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  name="q"
                  placeholder="Mua trước trả sau 0% lãi suất"
                  className="w-full rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button type="button" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button type="button" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button type="submit" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <AvatarBadge />
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-primary-100 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                >
                  {t('login')}
                </Link>
              )}
              <Link
                href="/cart"
                className="relative px-4 py-2 text-sm font-medium text-white hover:text-primary-100 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
              >
                {t('cart')}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{items.length}</span>
              </Link>
            </div>
          </div>

          {/* Popular search terms */}
          <div className="mt-3 flex items-center gap-3 text-sm text-white/90 flex-wrap">
            <span className="font-medium text-white">Tìm kiếm phổ biến:</span>
            {['Omega 3', 'Canxi', 'Dung dịch vệ sinh', 'Sữa rửa mặt', 'Thuốc nhỏ mắt', 'Kẽm', 'Men vi sinh', 'Kem chống nắng'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="hover:text-white transition-colors text-white/80"
              >
                {term}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Header

