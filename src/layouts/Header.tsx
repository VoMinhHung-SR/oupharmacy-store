'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Container from '@/components/Container'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import AvatarBadge from '@/components/AvatarBadge'
import { CartIcon, SearchIcon, UserIcon } from '@/components/icons'
import { useCart } from '@/contexts/CartContext'
import { getPopularSearchTerms } from '@/lib/services/searchTerms'
import type { SearchKeywordItem } from '@/lib/services/searchTerms'

const FALLBACK_POPULAR_TERMS = ['Omega 3', 'Canxi', 'Dung dịch vệ sinh', 'Sữa rửa mặt', 'Thuốc nhỏ mắt', 'Kẽm', 'Men vi sinh', 'Kem chống nắng']

export const Header: React.FC = () => {
  const t = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const { openModal } = useLoginModal()
  const { items } = useCart()
  const [popularTerms, setPopularTerms] = useState<SearchKeywordItem[]>([])

  useEffect(() => {
    getPopularSearchTerms(20).then((res) => {
      if (res.data && Array.isArray(res.data)) setPopularTerms(res.data)
    })
  }, [])

  const displayTerms = popularTerms.length > 0
    ? popularTerms.map((item) => item.keyword)
    : FALLBACK_POPULAR_TERMS

  return (
    <header className="sticky top-0 left-0 right-0 z-30 w-full bg-primary-600 text-white shadow-lg">
      {/* Top bar - Tải ứng dụng | Tư vấn ngay */}
      <div className="bg-primary-700/80 text-white text-sm py-2 border-b border-white/10">
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

            {/* Search bar - pill trắng nổi bật, icon tối bên trong */}
            <form action="/tim-kiem" method="get" className="flex-1 max-w-2xl">
              <div className="relative flex items-center bg-white rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 focus-within:ring-offset-primary-600">
                <input
                  name="q"
                  placeholder="Mua trước trả sau 0% lãi suất"
                  className="flex-1 min-w-0 bg-transparent text-gray-900 placeholder:text-gray-500 px-4 py-3 pl-5 focus:outline-none"
                />
                <div className="flex items-center gap-1 pr-2">
                  <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100" aria-label="Tìm bằng giọng nói">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100" aria-label="Quét mã">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </button>
                  <button type="submit" className="p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50" aria-label="Tìm kiếm">
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <AvatarBadge />
              ) : (
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary-100 transition-colors whitespace-nowrap"
                  type="button"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{t('login')}</span>
                </button>
              )}
              <Link
                href="/gio-hang"
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
                aria-label={t('cart')}
              >
                <CartIcon className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="hidden sm:inline">{t('cart')}</span>
                {items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center font-bold px-1">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Tìm kiếm phổ biến */}
          <div className="mt-3 flex items-center gap-3 text-sm text-white/90 flex-wrap">
            <span className="font-medium text-white">Tìm kiếm phổ biến:</span>
            {displayTerms.map((term) => (
              <Link
                key={term}
                href={`/tim-kiem?q=${encodeURIComponent(term)}`}
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

