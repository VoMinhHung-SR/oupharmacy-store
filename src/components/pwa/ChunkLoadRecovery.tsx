'use client'

import React, { useEffect } from 'react'

/**
 * One-shot recovery when a stale SW / chunk mismatch throws webpack
 * `Cannot read properties of undefined (reading 'call')`.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    const isChunkError = (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err ?? '')
      return (
        msg.includes("reading 'call'") ||
        msg.includes('Loading chunk') ||
        msg.includes('ChunkLoadError') ||
        msg.includes('Failed to fetch dynamically imported module')
      )
    }

    const reloadOnce = () => {
      try {
        const key = 'oup-chunk-reload'
        if (sessionStorage.getItem(key) === '1') return
        sessionStorage.setItem(key, '1')
        window.location.reload()
      } catch {
        window.location.reload()
      }
    }

    const onError = (event: ErrorEvent) => {
      if (isChunkError(event.error) || isChunkError(event.message)) {
        event.preventDefault()
        reloadOnce()
      }
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkError(event.reason)) {
        event.preventDefault()
        reloadOnce()
      }
    }

    // Clear the one-shot flag after a healthy load.
    try {
      sessionStorage.removeItem('oup-chunk-reload')
    } catch {
      /* ignore */
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  return null
}
