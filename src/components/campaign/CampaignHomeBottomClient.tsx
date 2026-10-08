'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import type { PlacementWinner } from '@/lib/services/campaign'
import { safeCampaignHref } from './campaignPlacementUtils'
import { useCampaignCtaClick } from './useCampaignCtaClick'

const CAMPAIGN_IMG_QUALITY = 75
const SECONDARY_ASPECT = 'aspect-[13/4]'
const NOTICE_ASPECT = 'aspect-[17/5]'

function SecondarySlide({ placement }: { placement: PlacementWinner }) {
  const onCtaClick = useCampaignCtaClick()
  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Mua ngay'
  const imageSrc =
    placement.image_desktop_url?.trim() || placement.image_mobile_url?.trim() || null
  const alt = placement.image_alt?.trim() || placement.title

  const body = (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-primary-700 text-white">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          quality={CAMPAIGN_IMG_QUALITY}
          className="object-cover object-center"
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
      onClick={(e) => onCtaClick(e, placement.campaign_id, href)}
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
              {active ||
              Math.abs(i - index) === 1 ||
              (index === 0 && i === count - 1) ||
              (index === count - 1 && i === 0) ? (
                <SecondarySlide placement={slide} />
              ) : null}
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
  const onCtaClick = useCampaignCtaClick()
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
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={CAMPAIGN_IMG_QUALITY}
          className={`object-cover object-center ${
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
      onClick={(e) => onCtaClick(e, placement.campaign_id, href)}
    >
      {body}
    </Link>
  )
}

export type CampaignHomeBottomClientProps = {
  secondarySlides: PlacementWinner[]
  noticeTop: PlacementWinner | null
  noticeBottom: PlacementWinner | null
}

export default function CampaignHomeBottomClient({
  secondarySlides,
  noticeTop,
  noticeBottom,
}: CampaignHomeBottomClientProps) {
  return (
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
  )
}
