'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import flashSale from '@/api/mocks/home/flash-sale.response.json'
import type { FlashSaleResponse, FlashSaleWindow } from '@/api/mocks/home/types'
import { HOME_MERCH_ORANGE } from '@/lib/constant'

const ARROW_ON_ORANGE =
  '!bg-white !text-orange-700 shadow-md ring-1 ring-orange-200 hover:!bg-orange-50'

type CountdownParts = { hours: string; minutes: string; seconds: string }

function pad2(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function getCountdownTarget(win: FlashSaleWindow | undefined, now: number): number | null {
  if (!win) return null
  const start = Date.parse(win.starts_at)
  const end = Date.parse(win.ends_at)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  if (now < start) return start
  if (now < end) return end
  return null
}

function useFlashCountdown(targetMs: number | null): {
  parts: CountdownParts | null
  now: number
} {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (targetMs == null) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [targetMs])

  const parts = useMemo(() => {
    if (targetMs == null) return null
    const diff = Math.max(0, targetMs - now)
    const totalSec = Math.floor(diff / 1000)
    const hours = Math.floor(totalSec / 3600)
    const minutes = Math.floor((totalSec % 3600) / 60)
    const seconds = totalSec % 60
    return { hours: pad2(hours), minutes: pad2(minutes), seconds: pad2(seconds) }
  }, [targetMs, now])

  return { parts, now }
}

function countdownLabel(win: FlashSaleWindow | undefined, now: number): string {
  if (!win) return 'Khung giờ'
  const start = Date.parse(win.starts_at)
  const end = Date.parse(win.ends_at)
  if (Number.isFinite(start) && now < start) return 'Bắt đầu sau'
  if (Number.isFinite(end) && now < end) return 'Kết thúc sau'
  return 'Đã kết thúc'
}

function windowStatusLabel(status: string): string {
  if (status === 'live') return 'Đang diễn ra'
  if (status === 'ended') return 'Đã kết thúc'
  return 'Sắp diễn ra'
}

/**
 * Flash sale rail — mock fixture `home/flash-sale.response.json` (D-23).
 * Hide when disabled or products empty; does not overwrite catalog price (D-01).
 */
export const FlashSaleProducts: React.FC = () => {
  const data = flashSale as FlashSaleResponse
  const enabled = data.enabled !== false
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [selectedWindowId, setSelectedWindowId] = useState(data.active_window_id)

  const selectedWindow = useMemo(
    () => data.windows.find((w) => w.id === selectedWindowId) ?? data.windows[0],
    [data.windows, selectedWindowId]
  )

  const products = useMemo(() => {
    const byWindow = data.products_by_window?.[selectedWindowId]
    if (byWindow && byWindow.length > 0) return byWindow
    return data.products || []
  }, [data.products, data.products_by_window, selectedWindowId])

  const targetMs = useMemo(
    () => getCountdownTarget(selectedWindow, Date.now()),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- target from window bounds
    [selectedWindow?.id, selectedWindow?.starts_at, selectedWindow?.ends_at]
  )

  const { parts: countdown, now } = useFlashCountdown(targetMs)
  const label = countdownLabel(selectedWindow, now)

  const selectWindow = useCallback((windowId: string) => {
    setSelectedWindowId(windowId)
    const el = scrollerRef.current
    if (el) el.scrollTo({ left: 0, behavior: 'smooth' })
  }, [])

  const scrollPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }, [])

  if (!enabled || (data.products || []).length === 0) return null

  return (
    <section className="bg-white pb-6 pt-2 sm:pb-8 sm:pt-3" aria-label={data.title}>
      <Container>
        <div
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: HOME_MERCH_ORANGE }}
        >
          <div className="flash-sale-banner relative px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg text-yellow-300 drop-shadow" aria-hidden>
                  ⚡
                </span>
                <h2 className="flash-sale-title text-xl font-black uppercase tracking-tight sm:text-2xl md:text-3xl">
                  Flashsale giá tốt
                </h2>
                <span className="hidden text-lg text-yellow-300 sm:inline" aria-hidden>
                  ⚡
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden>
                  📢
                </span>
                <Link
                  href={data.cta_url}
                  className="inline-flex items-center rounded-lg border-2 border-white bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
                >
                  {data.cta_label}
                </Link>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="mx-2 mb-2 rounded-xl bg-white px-3 pb-4 pt-3 sm:mx-3 sm:mb-3 sm:px-4 sm:pb-5 sm:pt-4">
            {data.windows.length > 0 ? (
              <div
                className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide"
                role="tablist"
                aria-label="Khung giờ flash sale"
              >
                {data.windows.map((win) => {
                  const isActive = win.id === selectedWindowId
                  return (
                    <button
                      key={win.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => selectWindow(win.id)}
                      className={
                        isActive
                          ? 'shrink-0 rounded-lg bg-red-50 px-3 py-2 text-left ring-1 ring-inset ring-red-200 border-b-2 border-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
                          : 'shrink-0 rounded-lg border-b-2 border-transparent bg-gray-50 px-3 py-2 text-left ring-1 ring-inset ring-gray-200 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300'
                      }
                    >
                      <span
                        className={`block text-xs font-bold leading-tight sm:text-sm ${
                          isActive ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {win.label}
                      </span>
                      <span
                        className={`block text-[10px] font-medium leading-tight sm:text-xs ${
                          isActive ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        {windowStatusLabel(win.status)}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : null}

            {countdown ? (
              <div
                className="mb-4 flex flex-wrap items-center gap-2 text-sm"
                aria-live="polite"
              >
                <span className="font-medium text-gray-700">{label}</span>
                <span className="inline-flex items-center gap-1 font-bold tabular-nums text-white">
                  <span className="rounded-md bg-red-600 px-2 py-1 shadow-sm">
                    {countdown.hours}
                  </span>
                  <span className="font-bold text-red-600">:</span>
                  <span className="rounded-md bg-red-600 px-2 py-1 shadow-sm">
                    {countdown.minutes}
                  </span>
                  <span className="font-bold text-red-600">:</span>
                  <span className="rounded-md bg-red-600 px-2 py-1 shadow-sm">
                    {countdown.seconds}
                  </span>
                </span>
              </div>
            ) : (
              <p className="mb-4 text-sm font-medium text-gray-500">{label}</p>
            )}

            <div className="relative">
              {products.length > 1 ? (
                <>
                  <CarouselArrowButton
                    direction="prev"
                    label="Sản phẩm trước"
                    className={ARROW_ON_ORANGE}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollPage(-1)
                    }}
                  />
                  <CarouselArrowButton
                    direction="next"
                    label="Sản phẩm sau"
                    className={ARROW_ON_ORANGE}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollPage(1)
                    }}
                  />
                </>
              ) : null}

              <div ref={scrollerRef} className="hot-sale-track scrollbar-hide scroll-smooth">
                {products.map((product) => (
                  <div key={`${selectedWindowId}-${product.id}`} className="min-w-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Link
                href={data.cta_url}
                className="text-sm font-semibold text-primary-700 transition hover:text-primary-800"
              >
                Xem tất cả <span aria-hidden>›</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FlashSaleProducts
