'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Container from '@/components/Container'
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

function SecondarySlide({ placement }: { placement: PlacementWinner }) {
  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Mua ngay'
  const imageSrc =
    placement.image_desktop_url?.trim() || placement.image_mobile_url?.trim() || null
  const alt = placement.image_alt?.trim() || placement.title

  const body = (
    <div className="relative flex h-full min-h-[11rem] overflow-hidden rounded-2xl bg-primary-700 text-white sm:min-h-[13rem]">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- campaign CDN
        <img src={imageSrc} alt={alt} className="absolute inset-0 h-full w-full object-cover opacity-40" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" aria-hidden />
      <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
        <p className="text-lg font-bold sm:text-xl">{placement.title}</p>
        {placement.subtitle ? <p className="mt-1 text-sm text-white/90">{placement.subtitle}</p> : null}
        <span className="mt-3 inline-flex w-fit rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-primary-700">
          {ctaLabel}
        </span>
      </div>
    </div>
  )

  if (!href) return body
  return (
    <Link href={href} className="block h-full" onClick={() => setCampaignAttributionId(placement.campaign_id)}>
      {body}
    </Link>
  )
}

function SecondaryCarousel({ slides }: { slides: PlacementWinner[] }) {
  const list = slides.slice(0, 5)
  const [index, setIndex] = useState(0)
  const count = list.length

  if (count === 0) return null
  if (count === 1) return <SecondarySlide placement={list[0]} />

  return (
    <div className="relative h-full">
      <SecondarySlide placement={list[index]} />
      <button
        type="button"
        aria-label="Banner phụ trước"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 px-2.5 py-1.5 text-sm text-white"
        onClick={() => setIndex((i) => (i - 1 + count) % count)}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Banner phụ sau"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 px-2.5 py-1.5 text-sm text-white"
        onClick={() => setIndex((i) => (i + 1) % count)}
      >
        ›
      </button>
      <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
        {list.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Secondary slide ${i + 1}`}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/45'}`}
            onClick={() => setIndex(i)}
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
      className={`relative flex min-h-[5.5rem] flex-1 flex-col justify-between overflow-hidden rounded-2xl p-4 ${className}`}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- campaign CDN
        <img
          src={imageSrc}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${tone === 'primary' ? 'opacity-25' : 'opacity-15'}`}
        />
      ) : null}
      <div className="relative z-10">
        <p className="text-sm font-bold">{placement.title}</p>
        {placement.subtitle ? (
          <p className={`mt-1 text-xs ${tone === 'primary' ? 'text-primary-100' : 'text-gray-600'}`}>
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
 * Hero band: theme image (full bleed, fade down) + main content carousel synced by index.
 */
export const CampaignHomeCluster: React.FC<CampaignHomeClusterProps> = ({
  heroSlides,
  secondarySlides,
  noticeTop,
  noticeBottom,
  footer,
}) => {
  const slides = heroSlides.slice(0, 3)
  const [heroIndex, setHeroIndex] = useState(0)
  const hasHero = slides.length > 0
  const hasBottom = secondarySlides.length > 0 || Boolean(noticeTop || noticeBottom)
  const activeTheme = slides[heroIndex]?.theme_image_url?.trim() || null

  return (
    <section className="relative isolate overflow-hidden">
      {/* Theme layer — synced with active HOME_HERO slide (not the main creative). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
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
          <div className="absolute inset-0 bg-gradient-to-b from-sky-600 via-sky-300 to-white" />
        ) : null}
        {/* Fade theme into page white */}
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-b from-transparent via-white/70 to-white" />
      </div>

      <div className="relative z-10 py-4 sm:py-5">
        <Container className="space-y-3">
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

          {hasBottom ? (
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-8">
                {secondarySlides.length > 0 ? (
                  <SecondaryCarousel slides={secondarySlides} />
                ) : (
                  <div className="hidden min-h-[11rem] rounded-2xl bg-white/40 md:block" aria-hidden />
                )}
              </div>
              <div className="flex flex-col gap-3 md:col-span-4">
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
        </Container>

        {footer ? <div className="mx-auto mt-4 max-w-7xl px-4 sm:mt-5 sm:px-6 lg:px-8">{footer}</div> : null}
      </div>
    </section>
  )
}

export default CampaignHomeCluster
