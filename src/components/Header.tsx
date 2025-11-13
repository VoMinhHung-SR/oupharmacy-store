'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export const Header: React.FC = () => {
  const t = useTranslations('common')
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={createLink('/')} className="font-bold text-primary-700">
              OUPharmacy
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <Link href={createLink('/products')} className="hover:text-gray-900">{t('products')}</Link>
              <Link href={createLink('/categories')} className="hover:text-gray-900">{t('categories')}</Link>
              <Link href={createLink('/brands')} className="hover:text-gray-900">{t('brands')}</Link>
              <Link href={createLink('/deals')} className="hover:text-gray-900">{t('deals')}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <form action={createLink('/search')} className="hidden md:block">
              <input
                name="q"
                placeholder={t('searchPlaceholder')}
                className="w-80 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>
            <Link href={createLink('/cart')} className="text-sm font-medium hover:text-primary-700">
              {t('cart')}
            </Link>
            <Link href={createLink('/account')} className="text-sm text-gray-600 hover:text-primary-700">
              {t('account')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


