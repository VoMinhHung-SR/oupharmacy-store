'use client'

import { useEffect } from 'react'

/**
 * Register the Workbox SW only in a secure context (HTTPS or localhost).
 * On plain http://<lan-ip>, `navigator.serviceWorker` is undefined and
 * next-pwa's auto-register would throw a client-side exception.
 */
export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
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
