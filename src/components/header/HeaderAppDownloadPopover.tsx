'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { topBarButtonClass } from '@/components/header/topBarStyles'
import { buildAppInstallQrUrl } from '@/lib/pwa/appInstallQr'

export function HeaderAppDownloadPopover() {
  const t = useTranslations('header')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const qrSrc = useMemo(() => (origin ? buildAppInstallQrUrl(origin, 168) : ''), [origin])

  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        className={topBarButtonClass}
        aria-haspopup="true"
        aria-label={t('downloadApp')}
      >
        {t('downloadApp')}
      </button>

      <div
        role="tooltip"
        className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-50 hidden w-[11.5rem] translate-y-1 opacity-0 transition-[opacity,transform] duration-150 group-hover:pointer-events-auto group-hover:block group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:block group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <div className="relative rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
          <span
            className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"
            aria-hidden
          />
          <div className="relative mx-auto h-[8.5rem] w-[8.5rem]">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- external QR API
              <img
                src={qrSrc}
                alt={t('downloadAppQrAlt')}
                width={136}
                height={136}
                className="h-full w-full rounded-md bg-white"
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-md bg-gray-100" />
            )}
            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white shadow-sm ring-2 ring-white">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
            </span>
          </div>
          <p className="mt-2 text-center text-[11px] leading-snug text-gray-500">{t('downloadAppQrHint')}</p>
        </div>
      </div>
    </div>
  )
}
