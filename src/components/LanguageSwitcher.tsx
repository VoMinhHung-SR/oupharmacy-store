'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '../i18n/config'

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, '') || '/'
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value as Locale)}
        className="appearance-none bg-white/10 backdrop-blur-sm border border-white/30 rounded-md px-3 py-1.5 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="text-gray-900">
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}

