'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CloseIcon } from '@/components/icons'
import {
  dismissInstallPrompt,
  isInstallDismissed,
  isIosSafari,
  isStandaloneDisplay,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa/install'

const SHOW_DELAY_MS = 1800

type PromptMode = 'android' | 'ios' | null

/**
 * Mobile top-header tip: Chrome `beforeinstallprompt` or Safari Add to Home Screen.
 * Hidden when standalone, dismissed (14 days), or viewport ≥ md.
 */
export function PwaInstallPrompt() {
  const t = useTranslations('pwa')
  const [mode, setMode] = useState<PromptMode>(null)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (isStandaloneDisplay() || isInstallDismissed()) return

    let cancelled = false
    let showTimer: ReturnType<typeof setTimeout> | undefined

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      const bip = e as BeforeInstallPromptEvent
      setDeferred(bip)
      window.clearTimeout(showTimer)
      showTimer = setTimeout(() => {
        if (!cancelled) setMode('android')
      }, SHOW_DELAY_MS)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    showTimer = setTimeout(() => {
      if (cancelled) return
      if (isIosSafari() && !isStandaloneDisplay() && !isInstallDismissed()) {
        setMode((current) => current ?? 'ios')
      }
    }, SHOW_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(showTimer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }
  }, [])

  const close = useCallback(() => {
    dismissInstallPrompt()
    setMode(null)
  }, [])

  const onInstall = useCallback(async () => {
    if (!deferred) return
    setInstalling(true)
    try {
      await deferred.prompt()
      await deferred.userChoice
    } finally {
      setDeferred(null)
      setInstalling(false)
      dismissInstallPrompt()
      setMode(null)
    }
  }, [deferred])

  if (!mode) return null

  return (
    <div
      className="border-b border-gray-200 bg-white text-gray-900 md:hidden"
      role="region"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
    >
      <div className="flex items-center gap-2 px-2.5 py-2 sm:px-3">
        <button
          type="button"
          onClick={close}
          className="shrink-0 rounded p-1 text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label={t('dismiss')}
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>

        <Image
          src="/icons/icon-192.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-lg"
        />

        <div className="min-w-0 flex-1">
          <p id="pwa-install-title" className="truncate text-sm font-semibold leading-tight text-gray-900">
            {t('bannerTitle')}
          </p>
          <p id="pwa-install-desc" className="truncate text-[11px] leading-tight text-gray-500">
            {mode === 'android' ? t('bannerAndroidBody') : t('bannerIosBody')}
          </p>
        </div>

        {mode === 'android' ? (
          <button
            type="button"
            onClick={onInstall}
            disabled={installing || !deferred}
            className="shrink-0 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:opacity-60"
          >
            {installing ? t('installing') : t('openCta')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default PwaInstallPrompt
