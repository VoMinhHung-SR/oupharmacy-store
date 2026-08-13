'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '@/components/Container'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'

export interface CampaignHeroSlotProps {
  slides: PlacementWinner[]
  embedded?: boolean
  /** Controlled slide index (syncs with theme layer). */
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
}

const TRANSITION_MS = 500

/** Wide hero frame (~4.34:1). Main PNG fills this box; theme peeks in page gutters. */
const HERO_MAIN_ASPECT = 'aspect-[1280/295]'

function HeroSlideMedia({ placement }: { placement: PlacementWinner }) {
  const desktopSrc = placement.image_desktop_url?.trim() || null
  const mobileSrc = placement.image_mobile_url?.trim() || desktopSrc
  const alt = placement.image_alt?.trim() || placement.title || 'Campaign banner'

  return (
    <div className="absolute inset-0 bg-transparent">
      {desktopSrc || mobileSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary */}
          <img
            src={mobileSrc || desktopSrc || ''}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desktopSrc || mobileSrc || ''}
            alt=""
            aria-hidden
            className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700 to-sky-400" aria-hidden />
      )}
    </div>
  )
}

function HeroSlideLink({
  placement,
  className,
  style,
  inert,
}: {
  placement: PlacementWinner
  className?: string
  style?: React.CSSProperties
  inert?: boolean
}) {
  const href = safeCampaignHref(placement.cta_url)
  const alt = placement.image_alt?.trim() || placement.title || 'Campaign banner'
  const inner = <HeroSlideMedia placement={placement} />

  if (!href) {
    return (
      <div className={className} style={style} aria-hidden={inert || undefined}>
        {inner}
      </div>
    )
  }

  return (
    <Link
      href={href}
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
      className={`block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${className || ''}`}
      style={style}
      onClick={() => setCampaignAttributionId(placement.campaign_id)}
      aria-label={alt}
    >
      {inner}
    </Link>
  )
}

/** HOME_HERO content card only (main image + link). Theme is a sibling layer. */
export const CampaignHeroSlot: React.FC<CampaignHeroSlotProps> = ({
  slides,
  embedded = false,
  activeIndex,
  onActiveIndexChange,
}) => {
  const list = slides.slice(0, 3)
  const [uncontrolled, setUncontrolled] = useState(0)
  const controlled = typeof activeIndex === 'number'
  const index = controlled ? activeIndex : uncontrolled
  const count = list.length

  const setIndex = useCallback(
    (next: number) => {
      if (count <= 1) return
      const value = ((next % count) + count) % count
      if (controlled) onActiveIndexChange?.(value)
      else setUncontrolled(value)
    },
    [controlled, count, onActiveIndexChange]
  )

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(() => setIndex(index + 1), 6000)
    return () => window.clearInterval(id)
  }, [count, index, setIndex])

  if (count === 0) return null

  const stage = (
    <div
      className={`relative w-full overflow-hidden ${HERO_MAIN_ASPECT}`}
      style={{
        // Soft L/R dissolve into theme band so main + BG read as one surface.
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, #000 3%, #000 97%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, #000 3%, #000 97%, transparent 100%)',
      }}
    >
      {count === 1 ? (
        <HeroSlideLink placement={list[0]} className="absolute inset-0" />
      ) : (
        list.map((slide, i) => {
          const active = i === index
          return (
            <HeroSlideLink
              key={`${slide.campaign_id}-${slide.sort_order ?? i}-${i}`}
              placement={slide}
              inert={!active}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                opacity: active ? 1 : 0,
                transitionDuration: `${TRANSITION_MS}ms`,
                zIndex: active ? 1 : 0,
                pointerEvents: active ? 'auto' : 'none',
              }}
            />
          )
        })
      )}

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Slide trước"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-slate-800 shadow hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIndex(index - 1)
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Slide sau"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-slate-800 shadow hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIndex(index + 1)
            }}
          >
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5" role="tablist">
            {list.map((slide, i) => (
              <button
                key={`dot-${slide.campaign_id}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 w-2 rounded-full shadow ${i === index ? 'bg-white' : 'bg-white/60'}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIndex(i)
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )

  if (embedded) return stage

  return (
    <section className="py-4 sm:py-5">
      <Container>{stage}</Container>
    </section>
  )
}

export default CampaignHeroSlot
