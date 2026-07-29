'use client'

import { useEffect } from 'react'
import { isPwaEnabled } from '@/lib/pwa/config'

async function unregisterAllServiceWorkers() {
  if (!('serviceWorker' in navigator)) return
  const regs = await navigator.serviceWorker.getRegistrations()
  await Promise.all(regs.map((reg) => reg.unregister()))
  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }
}

/**
 * Registers Workbox SW only when `NEXT_PUBLIC_ENABLE_PWA=true`
 * (container / staging / production). Otherwise unregisters leftovers
 * so local/dev never keeps a stale SW.
 */
export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    if (!isPwaEnabled()) {
      void unregisterAllServiceWorkers().catch((err) => {
        console.warn('[pwa] unregister (PWA disabled) failed', err)
      })
      return
    }

    if (!window.isSecureContext) return

    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[pwa] service worker register failed', err)
      })
    }

    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    return () => window.removeEventListener('load', onLoad)
  }, [])

  return null
}

export default PwaServiceWorkerRegister
