'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import HeroBanner from '@/sections/HeroBanner'
import PromotionalBanners from '@/sections/PromotionalBanners'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'
import CampaignHeroSlot from './CampaignHeroSlot'

export interface CampaignHomeClusterProps {
  hero: PlacementWinner | null
  /** Secondary wide banner (HOME_PROMO_LEFT). */
  secondary: PlacementWinner | null
  /** Stacked notice (HOME_STRIP). */
  noticeTop: PlacementWinner | null
  /** Stacked notice (HOME_PROMO_RIGHT). */
  noticeBottom: PlacementWinner | null
}

function SecondaryBanner({ placement }: { placement: PlacementWinner }) {
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
 * Home top cluster: main hero + secondary wide + 2 stacked notices.
 * Slot map: HERO / PROMO_LEFT / STRIP / PROMO_RIGHT. D-08 fallbacks when empty.
 */
export const CampaignHomeCluster: React.FC<CampaignHomeClusterProps> = ({
  hero,
  secondary,
  noticeTop,
  noticeBottom,
}) => {
  const hasBottom = Boolean(secondary || noticeTop || noticeBottom)

  return (
    <section className="bg-primary-50 py-4 sm:py-5">
      <Container className="space-y-3">
        {hero ? <CampaignHeroSlot placement={hero} embedded /> : <HeroBanner />}

        {hasBottom ? (
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-8">
              {secondary ? (
                <SecondaryBanner placement={secondary} />
              ) : (
                <div className="hidden min-h-[11rem] rounded-2xl bg-white/60 md:block" aria-hidden />
              )}
            </div>
            <div className="flex flex-col gap-3 md:col-span-4">
              {noticeTop ? <NoticeBanner placement={noticeTop} tone="primary" /> : null}
              {noticeBottom ? <NoticeBanner placement={noticeBottom} tone="muted" /> : null}
              {!noticeTop && !noticeBottom ? (
                <div className="min-h-[11rem] rounded-2xl bg-white/60" aria-hidden />
              ) : null}
            </div>
          </div>
        ) : !hero ? null : (
          <PromotionalBanners />
        )}
      </Container>
    </section>
  )
}

export default CampaignHomeCluster
