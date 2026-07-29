import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Offline — OUPharmacy',
  robots: { index: false, follow: false },
}

/**
 * Document fallback for @ducanh2912/next-pwa when the network is unavailable.
 * Route is special-cased by next-pwa as `/~offline`.
 */
export default async function OfflinePage() {
  const t = await getTranslations('pwa')

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
        OUPharmacy
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">{t('offlineTitle')}</h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{t('offlineBody')}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        {t('offlineHome')}
      </Link>
    </div>
  )
}
