'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  isIosSafari,
  isStandaloneDisplay,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/install'
import { isPwaEnabled } from '@/lib/pwa/config'

type BannerMode = 'standalone' | 'android' | 'ios' | 'desktop' | 'hint'

/**
 * Cart sidebar “Mua trên app” — install CTA + desktop QR with brand mark.
 */
export function CartPwaInstallBanner() {
  const t = useTranslations('pwa')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installing, setInstalling] = useState(false)
  const [mode, setMode] = useState<BannerMode>('hint')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)

    if (isStandaloneDisplay()) {
      setMode('standalone')
      return
    }

    let cancelled = false

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      const bip = e as BeforeInstallPromptEvent
      if (cancelled) return
      setDeferred(bip)
      setMode('android')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    const timer = window.setTimeout(() => {
      if (cancelled) return
      if (isStandaloneDisplay()) {
        setMode('standalone')
        return
      }
      if (isIosSafari()) {
        setMode('ios')
        return
      }
      setMode((current) => {
        if (current === 'android' || current === 'standalone') return current
        const coarse =
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(pointer: coarse)').matches
        return coarse ? 'hint' : 'desktop'
      })
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }
  }, [])

  const qrSrc = useMemo(() => {
    if (!origin) return ''
    const data = encodeURIComponent(origin)
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=6&data=${data}`
  }, [origin])

  const onInstall = useCallback(async () => {
    if (!deferred) return
    setInstalling(true)
    try {
      await deferred.prompt()
      await deferred.userChoice
    } finally {
      setDeferred(null)
      setInstalling(false)
      setMode(isStandaloneDisplay() ? 'standalone' : 'hint')
    }
  }, [deferred])

  const body =
    mode === 'standalone'
      ? t('cartBannerStandaloneBody')
      : mode === 'android'
        ? t('bannerAndroidBody')
        : mode === 'ios'
          ? t('bannerIosBody')
          : mode === 'desktop'
            ? t('cartBannerDesktopBody')
            : t('cartBannerMobileHintBody')

  const showInstall = mode === 'android' && Boolean(deferred) && isPwaEnabled()
  const showQr = mode === 'desktop' && Boolean(qrSrc)

  return (
    <div className="rounded-xl border border-primary-100/80 bg-gradient-to-br from-primary-50 via-white to-sky-50 px-3.5 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-primary-700">{t('cartBannerTitle')}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-600">{body}</p>
        </div>
        {showQr ? (
          <div
            className="shrink-0 rounded-xl border border-dashed border-primary-200/90 bg-white/80 p-2.5"
            title={t('cartBannerQrHint')}
          >
            <div className="relative h-[4.5rem] w-[4.5rem]">
              {/* eslint-disable-next-line @next/next/no-img-element -- external QR API */}
              <img
                src={qrSrc}
                alt={t('cartBannerQrAlt')}
                width={72}
                height={72}
                className="h-full w-full rounded-md bg-white"
                loading="lazy"
              />
              <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white shadow-sm ring-2 ring-white">
                <Image
                  src="/icons/icon-192.png"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full"
                />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {showInstall ? (
        <button
          type="button"
          onClick={() => void onInstall()}
          disabled={installing || !deferred}
          className="mt-2.5 w-full rounded-lg bg-primary-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          {installing ? t('installing') : t('installCta')}
        </button>
      ) : null}

      {mode === 'ios' || mode === 'hint' || mode === 'standalone' ? (
        <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">
          {mode === 'standalone'
            ? t('cartBannerStandaloneBadge')
            : mode === 'ios'
              ? t('installIosBody')
              : t('installAndroidBody')}
        </p>
      ) : null}
    </div>
  )
}

export default CartPwaInstallBanner
