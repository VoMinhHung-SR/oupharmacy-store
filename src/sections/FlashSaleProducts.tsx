'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import flashSaleMeta from '@/api/mocks/home/flash-sale.response.json'
import type { FlashSaleResponse, FlashSaleWindow } from '@/api/mocks/home/types'
import { HOME_MERCH_ORANGE } from '@/lib/constant'
import {
  FLASH_SALE_RAIL_SIZE,
  pickFlashSaleWindowProducts,
  withFlashMerchDisplay,
  withFlashMerchTeaser,
  type FlashSaleRailProduct,
} from '@/lib/services/flashSale'
import { buildFlashSaleWindowsFromTemplates } from '@/lib/services/homeMerch'
import { useHorizontalScrollEdges } from '@/lib/hooks/useHorizontalScrollEdges'

type CountdownParts = { hours: string; minutes: string; seconds: string }

type FlashSaleProductsProps = {
  /** Daily priced pool (40–60); rail shows max 12 per window. */
  products: FlashSaleRailProduct[]
  dayKey: string
}

function pad2(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function resolveFixtureWindows(meta: FlashSaleResponse, now: Date): FlashSaleWindow[] {
  const templates = meta.window_templates
  if (Array.isArray(templates) && templates.length > 0) {
    return buildFlashSaleWindowsFromTemplates(templates, now)
  }
  return Array.isArray(meta.windows) ? meta.windows : []
}

function windowPhase(
  win: FlashSaleWindow,
  now: number
): 'upcoming' | 'live' | 'ended' {
  const start = Date.parse(win.starts_at)
  const end = Date.parse(win.ends_at)
  if (Number.isFinite(start) && now < start) return 'upcoming'
  if (Number.isFinite(end) && now < end) return 'live'
  return 'ended'
}

/** Drop ended windows — UI keeps live + upcoming only. */
function visibleWindows(windows: FlashSaleWindow[], now: number): FlashSaleWindow[] {
  return windows
    .filter((win) => windowPhase(win, now) !== 'ended')
    .sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at))
}

function pickWindowId(
  windows: FlashSaleWindow[],
  now: number,
  preferred?: string | null
): string | null {
  if (!windows.length) return null
  if (preferred && windows.some((w) => w.id === preferred)) return preferred
  const live = windows.find((w) => windowPhase(w, now) === 'live')
  if (live) return live.id
  return windows[0]?.id ?? null
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

function useNowTicker(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [enabled])

  return now
}

function countdownParts(targetMs: number | null, now: number): CountdownParts | null {
  if (targetMs == null) return null
  const diff = Math.max(0, targetMs - now)
  const totalSec = Math.floor(diff / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { hours: pad2(hours), minutes: pad2(minutes), seconds: pad2(seconds) }
}

function countdownLabel(win: FlashSaleWindow | undefined, now: number): string {
  if (!win) return 'Khung giờ'
  const start = Date.parse(win.starts_at)
  const end = Date.parse(win.ends_at)
  if (Number.isFinite(start) && now < start) return 'Bắt đầu sau'
  if (Number.isFinite(end) && now < end) return 'Kết thúc sau'
  return 'Khung giờ'
}

function windowStatusLabel(phase: 'upcoming' | 'live'): string {
  return phase === 'live' ? 'Đang diễn ra' : 'Sắp diễn ra'
}

/** Flash sale rail — SSG pool + fixture windows (D-23). */
export const FlashSaleProducts: React.FC<FlashSaleProductsProps> = ({
  products: pool,
  dayKey,
}) => {
  const meta = flashSaleMeta as FlashSaleResponse
  const enabled = meta.enabled !== false
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(
    meta.active_window_id ?? null
  )

  const now = useNowTicker(enabled && pool.length > 0)
  const builtWindows = useMemo(
    () => resolveFixtureWindows(meta, new Date(now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh VN day_offset on tick
    [now]
  )
  const windows = useMemo(() => visibleWindows(builtWindows, now), [builtWindows, now])

  const activeWindowId = useMemo(
    () => pickWindowId(windows, now, selectedWindowId),
    [windows, now, selectedWindowId]
  )

  useEffect(() => {
    if (activeWindowId && activeWindowId !== selectedWindowId) {
      setSelectedWindowId(activeWindowId)
      const el = scrollerRef.current
      if (el) el.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [activeWindowId, selectedWindowId])

  const selectedWindow = useMemo(
    () => windows.find((w) => w.id === activeWindowId),
    [windows, activeWindowId]
  )

  const phase = selectedWindow ? windowPhase(selectedWindow, now) : 'ended'
  const isUpcoming = phase === 'upcoming'
  const isLive = phase === 'live'
  const targetMs = getCountdownTarget(selectedWindow, now)
  const countdown = countdownParts(targetMs, now)
  const label = countdownLabel(selectedWindow, now)

  const railProducts = useMemo(() => {
    if (!activeWindowId) return []
    const slice = pickFlashSaleWindowProducts(
      pool,
      activeWindowId,
      dayKey,
      FLASH_SALE_RAIL_SIZE
    )
    if (isUpcoming) {
      return slice.map((product) => withFlashMerchTeaser(product))
    }
    if (isLive) {
      return slice.map((product) =>
        withFlashMerchDisplay(product, product.flashMerchPercent)
      )
    }
    return slice
  }, [pool, activeWindowId, dayKey, isUpcoming, isLive])

  const { canScrollLeft, canScrollRight, scrollPage } = useHorizontalScrollEdges(scrollerRef, [
    railProducts.length,
    activeWindowId,
  ])

  const selectWindow = useCallback((windowId: string) => {
    setSelectedWindowId(windowId)
    const el = scrollerRef.current
    if (el) el.scrollTo({ left: 0, behavior: 'smooth' })
  }, [])

  if (!enabled || pool.length === 0 || windows.length === 0) return null

  return (
    <section className="bg-white pb-6 pt-2 sm:pb-8 sm:pt-3" aria-label={meta.title}>
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

              <Link
                href={meta.cta_url}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
              >
                {meta.cta_label}
              </Link>
            </div>
          </div>

          <div className="mx-2 mb-2 rounded-xl bg-white px-3 pb-4 pt-3 sm:mx-3 sm:mb-3 sm:px-4 sm:pb-5 sm:pt-4">
            <div
              className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide"
              role="tablist"
              aria-label="Khung giờ flash sale"
            >
              {windows.map((win) => {
                const isActive = win.id === activeWindowId
                const tabPhase = windowPhase(win, now) === 'live' ? 'live' : 'upcoming'
                return (
                  <button
                    key={win.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectWindow(win.id)}
                    className={
                      isActive
                        ? 'shrink-0 rounded-lg border-b-2 border-red-600 bg-red-50 px-3 py-2 text-left ring-1 ring-inset ring-red-200 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
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
                      {windowStatusLabel(tabPhase)}
                    </span>
                  </button>
                )
              })}
            </div>

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
            ) : null}

            <div className="relative overflow-visible">
              {canScrollLeft ? (
                <CarouselArrowButton
                  variant="merchRail"
                  direction="prev"
                  label="Sản phẩm trước"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(-1)
                  }}
                />
              ) : null}
              {canScrollRight ? (
                <CarouselArrowButton
                  variant="merchRail"
                  direction="next"
                  label="Sản phẩm sau"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(1)
                  }}
                />
              ) : null}

              <div ref={scrollerRef} className="hot-sale-track scrollbar-hide scroll-smooth">
                {railProducts.map((product) => (
                  <div key={`${activeWindowId}-${product.id}`} className="min-w-0">
                    <ProductCard product={product} ctaVariant="viewDetail" merchShockOffer="compact" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Link
                href={meta.cta_url}
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
