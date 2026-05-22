'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Container from '@/components/Container'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import AvatarBadge from '@/components/AvatarBadge'
import { HeaderSearchDropdown } from '@/components/search/HeaderSearchDropdown'
import { CartIcon, UserIcon } from '@/components/icons'
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
  const compactTerms = displayTerms.slice(0, 6)

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full bg-primary-600 text-white shadow-lg">
      {/* Top bar - Tải ứng dụng | Tư vấn ngay */}
      <div className="border-b border-white/10 bg-primary-700/80 py-1.5 text-xs text-white">
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
      <div className="py-3">
        <Container>
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight text-white lg:text-2xl">NHÀ THUỐC</span>
                <span className="text-base font-semibold leading-tight text-primary-100 lg:text-lg">OUPHARMACY</span>
              </div>
            </Link>

            <HeaderSearchDropdown popularTerms={displayTerms} />

            {/* Right actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
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
                className="relative flex items-center gap-2 rounded-full bg-primary-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors whitespace-nowrap hover:bg-primary-800"
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
          <div className="mt-2 hidden items-center gap-3 overflow-hidden text-xs text-white/90 lg:flex">
            <span className="shrink-0 font-medium text-white">Tìm kiếm phổ biến:</span>
            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
              {compactTerms.map((term) => (
                <Link
                  key={term}
                  href={`/tim-kiem?q=${encodeURIComponent(term)}`}
                  className="inline-block max-w-[180px] shrink-0 truncate text-white/80 transition-colors hover:text-white"
                  title={term}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}

export default Header

