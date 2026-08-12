'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'

export interface CampaignHeroSlotProps {
  placement: PlacementWinner | null
  /** When true, omit outer section padding — parent cluster owns chrome. */
  embedded?: boolean
}

/**
 * HOME_HERO — full-bleed banner creative. Fallback handled by parent when null.
 */
export const CampaignHeroSlot: React.FC<CampaignHeroSlotProps> = ({
  placement,
  embedded = false,
}) => {
  if (!placement) return null

  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Xem thêm'
  const desktopSrc = placement.image_desktop_url?.trim() || null
  const mobileSrc = placement.image_mobile_url?.trim() || desktopSrc
  const alt = placement.image_alt?.trim() || placement.title

  const banner = (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      {(desktopSrc || mobileSrc) && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary */}
          <img
            src={mobileSrc || desktopSrc || ''}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover opacity-45 md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={desktopSrc || mobileSrc || ''}
            alt={alt}
            className="absolute inset-0 hidden h-full w-full object-cover opacity-45 md:block"
          />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" aria-hidden />
      <div className="relative z-10 flex min-h-[12rem] flex-col justify-end p-5 sm:min-h-[15rem] sm:p-7 md:min-h-[18rem] md:p-8">
        <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{placement.title}</h2>
        {placement.subtitle ? (
          <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">{placement.subtitle}</p>
        ) : null}
        {href ? (
          <Link
            href={href}
            className="mt-4 inline-flex w-fit"
            onClick={() => setCampaignAttributionId(placement.campaign_id)}
          >
            <Button
              variant="secondary"
              size="md"
              className="bg-accent-500 font-bold text-white hover:bg-accent-600"
            >
              {ctaLabel}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  )

  if (embedded) return banner

  return (
    <section className="bg-primary-50 py-4 sm:py-5">
      <Container>{banner}</Container>
    </section>
  )
}

export default CampaignHeroSlot
