'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { QrScanIcon } from '@/components/icons/QrScanIcon'

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>
}

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike

function getBarcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === 'undefined') return null
  return (window as Window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null
}

type SkuScanControlProps = {
  onSku: (sku: string) => void
}

export function SkuScanControl({ onSku }: SkuScanControlProps) {
  const t = useTranslations('cabinet')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const [scanning, setScanning] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  const stop = () => {
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setScanning(false)
  }

  useEffect(() => () => stop(), [])

  const start = async () => {
    setHint(null)
    const Detector = getBarcodeDetector()
    if (!Detector) {
      setHint(t('scan.unsupported'))
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setHint(t('scan.noCamera'))
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      setScanning(true)
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()
      const detector = new Detector({
        formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e'],
      })
      const tick = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = window.requestAnimationFrame(() => {
            void tick()
          })
          return
        }
        try {
          const codes = await detector.detect(videoRef.current)
          const value = codes.find((row) => row.rawValue?.trim())?.rawValue?.trim()
          if (value) {
            onSku(value)
            stop()
            return
          }
        } catch {
          // Keep scanning while the camera is open.
        }
        rafRef.current = window.requestAnimationFrame(() => {
          void tick()
        })
      }
      void tick()
    } catch {
      setHint(t('scan.noCamera'))
      stop()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {scanning ? (
          <Button variant="outline" size="sm" onClick={stop}>
            {t('scan.stop')}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => void start()}>
            <span className="inline-flex items-center gap-2">
              <QrScanIcon className="h-4 w-4" />
              {t('scan.start')}
            </span>
          </Button>
        )}
      </div>
      <video
        ref={videoRef}
        className={scanning ? 'h-40 w-full rounded-lg bg-slate-900 object-cover' : 'hidden'}
        muted
        playsInline
      />
      {hint ? <p className="text-sm text-gray-500">{hint}</p> : null}
      <p className="text-xs text-gray-500">{t('scan.hint')}</p>
    </div>
  )
}
