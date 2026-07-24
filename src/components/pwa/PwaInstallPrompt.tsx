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

const SHOW_DELAY_MS = 2500

type PromptMode = 'android' | 'ios' | null

/**
 * Bottom install tip: Chrome `beforeinstallprompt` (Android/desktop) or
 * Safari iOS “Add to Home Screen” instructions. Hidden when already standalone
 * or dismissed (14 days).
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

    // iOS has no beforeinstallprompt — tip after delay when Safari + not installed.
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
      className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
    >
      <div className="mx-auto flex max-w-lg items-start gap-3 rounded-xl border border-primary-200 bg-white p-3 shadow-lg ring-1 ring-black/5">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={48}
          height={48}
          className="mt-0.5 h-12 w-12 flex-shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p id="pwa-install-title" className="text-sm font-semibold text-gray-900">
            {t('installTitle')}
          </p>
          <p id="pwa-install-desc" className="mt-1 text-xs leading-relaxed text-gray-600">
            {mode === 'android' ? t('installAndroidBody') : t('installIosBody')}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {mode === 'android' ? (
              <button
                type="button"
                onClick={onInstall}
                disabled={installing || !deferred}
                className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {installing ? t('installing') : t('installCta')}
              </button>
            ) : null}
            <button
              type="button"
              onClick={close}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              {t('dismiss')}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label={t('dismiss')}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default PwaInstallPrompt
