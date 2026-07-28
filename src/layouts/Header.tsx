'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import AvatarBadge from '@/components/AvatarBadge'
import { HeaderSearchDropdown } from '@/components/search/HeaderSearchDropdown'
import { MenuIcon, UserIcon } from '@/components/icons'
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { HeaderCartDropdown } from '@/layouts/HeaderCartDropdown'
import { MobileNavDrawer } from '@/layouts/MobileNavDrawer'
import { useMobileNavUi } from '@/layouts/nav/NavProviders'
import { usePopularSearchTerms } from '@/lib/hooks/usePopularSearchTerms'

const FALLBACK_POPULAR_TERMS = [
  'Omega 3',
  'Canxi',
  'Dung dịch vệ sinh',
  'Sữa rửa mặt',
  'Thuốc nhỏ mắt',
  'Kẽm',
  'Men vi sinh',
  'Kem chống nắng',
]

function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`shrink-0 transition-opacity hover:opacity-90 ${className}`.trim()}>
      <span className="block whitespace-nowrap text-base font-bold leading-tight text-white sm:text-lg lg:text-2xl">
        NHÀ THUỐC
      </span>
      <span className="block whitespace-nowrap text-xs font-semibold leading-tight text-primary-100 sm:text-sm lg:text-lg">
        OUPHARMACY
      </span>
    </Link>
  )
}

export const Header: React.FC = () => {
  const t = useTranslations('common')
  const { isAuthenticated } = useAuth()
  const { openModal } = useLoginModal()
  const { openNav } = useMobileNavUi()
  const { data: popularTerms = [] } = usePopularSearchTerms(20)

  const displayTerms =
    popularTerms.length > 0 ? popularTerms.map((item) => item.keyword) : FALLBACK_POPULAR_TERMS
  const compactTerms = displayTerms.slice(0, 6)

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full bg-primary-600 pt-[env(safe-area-inset-top)] text-white shadow-lg">
      <PwaInstallPrompt />
      <MobileNavDrawer />

      <div className="hidden border-b border-white/10 bg-primary-700/80 py-1.5 text-xs text-white lg:block">
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

      <div className="py-2.5 lg:py-3">
        <Container>
          {/* Mobile (&lt; lg): row1 menu|logo|cart · row2 full-width search */}
          <div className="lg:hidden">
            <div className="grid grid-cols-[minmax(2.75rem,1fr)_auto_minmax(2.75rem,1fr)] items-center gap-x-2">
              <div className="justify-self-start">
                <button
                  type="button"
                  onClick={openNav}
                  className="rounded-lg p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  aria-label="Mở menu danh mục"
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>
              <BrandLogo className="text-center" />
              <div className="justify-self-end">
                <HeaderCartDropdown />
              </div>
            </div>
            <div className="mt-2.5 w-full min-w-0">
              <HeaderSearchDropdown popularTerms={displayTerms} />
            </div>
          </div>

          {/* Desktop (lg+): logo | search | account | cart */}
          <div className="hidden items-center gap-3 lg:flex">
            <BrandLogo />
            <div className="min-w-0 flex-1">
              <HeaderSearchDropdown popularTerms={displayTerms} />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {isAuthenticated ? (
                <AvatarBadge />
              ) : (
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white transition-colors hover:text-primary-100"
                  type="button"
                  aria-label={t('login')}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{t('login')}</span>
                </button>
              )}
              <HeaderCartDropdown />
            </div>
          </div>

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
