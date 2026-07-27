'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import Container from '@/components/Container'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import AvatarBadge from '@/components/AvatarBadge'
import { HeaderSearchDropdown } from '@/components/search/HeaderSearchDropdown'
import { UserIcon } from '@/components/icons'
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { HeaderCartDropdown } from '@/layouts/HeaderCartDropdown'
import { getPopularSearchTerms } from '@/lib/services/searchTerms'
import type { SearchKeywordItem } from '@/lib/services/searchTerms'

const FALLBACK_POPULAR_TERMS = ['Omega 3', 'Canxi', 'Dung dịch vệ sinh', 'Sữa rửa mặt', 'Thuốc nhỏ mắt', 'Kẽm', 'Men vi sinh', 'Kem chống nắng']

export const Header: React.FC = () => {
  const t = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const { openModal } = useLoginModal()
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
    <header className="sticky top-0 left-0 right-0 z-40 w-full bg-primary-600 pt-[env(safe-area-inset-top)] text-white shadow-lg">
      <PwaInstallPrompt />

      {/* Top bar — desktop chrome */}
      <div className="hidden border-b border-white/10 bg-primary-700/80 py-1.5 text-xs text-white md:block">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="cursor-pointer transition-colors hover:text-primary-100">Đặt lịch khám</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Hotline: <span className="font-bold">Tại đây</span>
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <div className="py-3">
        <Container>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Logo */}
            <Link href="/" className="min-w-0 flex-shrink-0 hover:opacity-90 transition-opacity">
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white sm:text-xl lg:text-2xl">NHÀ THUỐC</span>
                <span className="text-sm font-semibold leading-tight text-primary-100 sm:text-base lg:text-lg">OUPHARMACY</span>
              </div>
            </Link>

            <HeaderSearchDropdown popularTerms={displayTerms} />

            {/* Right actions */}
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <AvatarBadge />
              ) : (
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary-100 transition-colors whitespace-nowrap"
                  type="button"
                  aria-label={t('login')}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </button>
              )}
              <HeaderCartDropdown />
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

