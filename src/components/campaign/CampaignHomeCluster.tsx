'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import HeroBanner from '@/sections/HeroBanner'
import PromotionalBanners from '@/sections/PromotionalBanners'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'
import CampaignHeroSlot from './CampaignHeroSlot'

const THEME_FADE_MS = 500

export interface CampaignHomeClusterProps {
  heroSlides: PlacementWinner[]
  secondarySlides: PlacementWinner[]
  noticeTop: PlacementWinner | null
  noticeBottom: PlacementWinner | null
  /** Optional row under banners (quick cate) — stays inside theme band. */
  footer?: React.ReactNode
}

/**
 * Slot ARs (PNG pixels in scripts/apply-old-home-cms-assets.py):
 * - Hero 3.7:1 → 1920×516
 * - Secondary (campaign lớn) 3.25:1 → 1300×400
 * - Notice (campaign nhỏ) 3.4:1 → 1020×300
 */
const SECONDARY_ASPECT = 'aspect-[13/4]'
const NOTICE_ASPECT = 'aspect-[17/5]'

function SecondarySlide({ placement }: { placement: PlacementWinner }) {
  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Mua ngay'
  const imageSrc =
    placement.image_desktop_url?.trim() || placement.image_mobile_url?.trim() || null
  const alt = placement.image_alt?.trim() || placement.title

  const body = (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-primary-700 text-white">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- campaign CDN
        <img
          src={imageSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
          <p className="text-lg font-bold sm:text-xl">{placement.title}</p>
          {placement.subtitle ? (
            <p className="mt-1 line-clamp-2 text-sm text-white/90">{placement.subtitle}</p>
          ) : null}
          <span className="mt-3 inline-flex w-fit rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-primary-700">
            {ctaLabel}
          </span>
        </div>
      )}
    </div>
  )

  if (!href) return body
  return (
    <Link
      href={href}
      className="block h-full w-full"
      onClick={() => setCampaignAttributionId(placement.campaign_id)}
    >
      {body}
    </Link>
  )
}

function SecondaryCarousel({ slides }: { slides: PlacementWinner[] }) {
  const list = slides.slice(0, 5)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = list.length

  const go = useCallback(
    (next: number) => {
      if (count <= 1) return
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, 5000)
    return () => window.clearInterval(id)
  }, [count, paused])

  if (count === 0) return null

  const stage =
    count === 1 ? (
      <div className={SECONDARY_ASPECT}>
        <SecondarySlide placement={list[0]} />
      </div>
    ) : (
      <div className={`relative ${SECONDARY_ASPECT}`}>
        {list.map((slide, i) => {
          const active = i === index
          return (
            <div
              key={`${slide.campaign_id}-${slide.sort_order ?? i}-${i}`}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: active ? 1 : 0,
                zIndex: active ? 1 : 0,
                pointerEvents: active ? 'auto' : 'none',
              }}
            >
              <SecondarySlide placement={slide} />
            </div>
          )
        })}
      </div>
    )

  if (count === 1) return stage

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {stage}
      <CarouselArrowButton
        direction="prev"
        label="Banner phụ trước"
        zClassName="z-30"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          go(index - 1)
        }}
      />
      <CarouselArrowButton
        direction="next"
        label="Banner phụ sau"
        zClassName="z-30"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          go(index + 1)
        }}
      />
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-30 flex justify-center gap-1.5">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Secondary slide ${i + 1}`}
            className={`pointer-events-auto h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              go(i)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function NoticeBanner({
  placement,
  tone,
}: {
  placement: PlacementWinner
  tone: 'primary' | 'muted'
}) {
  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Xem ngay'
  const imageSrc =
    placement.image_desktop_url?.trim() || placement.image_mobile_url?.trim() || null

  const className =
    tone === 'primary'
      ? 'bg-primary-700 text-white'
      : 'border border-gray-200 bg-white text-gray-900'

  const body = (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-2xl p-4 ${NOTICE_ASPECT} ${className}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- campaign CDN
        <img
          src={imageSrc}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center ${
            tone === 'primary' ? 'opacity-35' : 'opacity-20'
          }`}
        />
      ) : null}
      <div className="relative z-10">
        <p className="text-sm font-bold leading-snug">{placement.title}</p>
        {placement.subtitle ? (
          <p
            className={`mt-1 line-clamp-2 text-xs ${
              tone === 'primary' ? 'text-primary-100' : 'text-gray-600'
            }`}
          >
            {placement.subtitle}
          </p>
        ) : null}
      </div>
      <span
        className={`relative z-10 mt-2 text-xs font-semibold ${
          tone === 'primary' ? 'text-white' : 'text-primary-700'
        }`}
      >
        {ctaLabel} →
      </span>
    </div>
  )

  if (!href) return body
  return (
    <Link
      href={href}
      className="flex flex-1"
      onClick={() => setCampaignAttributionId(placement.campaign_id)}
    >
      {body}
    </Link>
  )
}

/**
 * Hero band: theme wash + content carousel, aligned with header max-w and a bit less side padding.
 */
export const CampaignHomeCluster: React.FC<CampaignHomeClusterProps> = ({
  heroSlides,
  secondarySlides,
  noticeTop,
  noticeBottom,
  footer,
}) => {
  const slides = heroSlides.slice(0, 2)
  const [heroIndex, setHeroIndex] = useState(0)
  const hasHero = slides.length > 0
  const hasBottom = secondarySlides.length > 0 || Boolean(noticeTop || noticeBottom)
  const activeTheme = slides[heroIndex]?.theme_image_url?.trim() || null

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="home-cms-band-fade pointer-events-none absolute inset-0 -z-10">
        {slides.map((slide, i) => {
          const src = slide.theme_image_url?.trim()
          if (!src) return null
          const active = i === heroIndex
          return (
            // eslint-disable-next-line @next/next/no-img-element -- theme CDN / mocks
            <img
              key={`theme-${slide.campaign_id}-${i}`}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity ease-in-out"
              style={{
                opacity: active ? 1 : 0,
                transitionDuration: `${THEME_FADE_MS}ms`,
              }}
            />
          )
        })}
        {!activeTheme ? (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-transparent" />
        ) : null}

        {slides.map((slide, i) => {
          const src = slide.image_desktop_url?.trim() || slide.image_mobile_url?.trim()
          if (!src) return null
          const active = i === heroIndex
          return (
            // eslint-disable-next-line @next/next/no-img-element -- campaign CDN / mocks
            <img
              key={`ambient-${slide.campaign_id}-${i}`}
              src={src}
              alt=""
              className="absolute inset-x-0 top-0 h-[58%] w-full object-cover object-top blur-2xl transition-opacity ease-in-out"
              style={{
                opacity: active ? 0.35 : 0,
                transitionDuration: `${THEME_FADE_MS}ms`,
              }}
            />
          )
        })}
      </div>

      {/* Hero wash → section white (same as featured-categories). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent via-white/80 to-white sm:h-52"
      />

      {/* Same max-w as header; slightly less padding so the hero band reads a bit wider. */}
      <div className="relative z-10 mx-auto max-w-7xl px-2 pb-3 pt-3 sm:px-3 sm:pb-4 sm:pt-4 lg:px-4">
        {hasHero ? (
          <CampaignHeroSlot
            slides={slides}
            embedded
            activeIndex={heroIndex}
            onActiveIndexChange={setHeroIndex}
          />
        ) : (
          <HeroBanner />
        )}

        <div className={`space-y-3 ${hasHero ? 'mt-3' : 'py-4 sm:py-5'}`}>
          {hasBottom ? (
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-8">
                {secondarySlides.length > 0 ? (
                  <SecondaryCarousel slides={secondarySlides} />
                ) : (
                  <div className="hidden min-h-[11rem] rounded-2xl bg-white/40 md:block" aria-hidden />
                )}
              </div>
              <div className="flex flex-col gap-3 md:col-span-4 md:h-full">
                {noticeTop ? <NoticeBanner placement={noticeTop} tone="primary" /> : null}
                {noticeBottom ? <NoticeBanner placement={noticeBottom} tone="muted" /> : null}
                {!noticeTop && !noticeBottom ? (
                  <div className="min-h-[11rem] rounded-2xl bg-white/40" aria-hidden />
                ) : null}
              </div>
            </div>
          ) : !hasHero ? null : (
            <PromotionalBanners />
          )}
        </div>

        {footer ? <div className="mt-4 sm:mt-5">{footer}</div> : null}
      </div>
    </section>
  )
}

export default CampaignHomeCluster
