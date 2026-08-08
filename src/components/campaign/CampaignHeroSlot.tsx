'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import HeroBanner from '@/sections/HeroBanner'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'

export interface CampaignHeroSlotProps {
  placement: PlacementWinner | null
}

/**
 * HOME_HERO winner or static HeroBanner fallback (D-08).
 * Keeps existing home hero visual language.
 */
export const CampaignHeroSlot: React.FC<CampaignHeroSlotProps> = ({ placement }) => {
  if (!placement) {
    return <HeroBanner />
  }

  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Mua ngay'
  const desktopSrc = placement.image_desktop_url?.trim() || null
  const mobileSrc = placement.image_mobile_url?.trim() || desktopSrc
  const alt = placement.image_alt?.trim() || placement.title

  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-8 text-white sm:py-10 md:py-12">
      <Container>
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              <div>{placement.title}</div>
              {placement.subtitle ? (
                <div className="text-primary-100">{placement.subtitle}</div>
              ) : null}
            </div>
            {href ? (
              <div className="flex gap-4">
                <Link
                  href={href}
                  onClick={() => setCampaignAttributionId(placement.campaign_id)}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    className="bg-white font-bold text-primary-600 shadow-lg transition-colors hover:bg-primary-50 hover:text-primary-700"
                  >
                    {ctaLabel}
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>

          {(desktopSrc || mobileSrc) && (
            <div className="relative overflow-hidden rounded-lg border border-white/20 bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary; remotePatterns not campaign-scoped yet */}
              <img
                src={mobileSrc || desktopSrc || ''}
                alt={alt}
                className="h-48 w-full object-cover sm:h-56 md:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={desktopSrc || mobileSrc || ''}
                alt={alt}
                className="hidden h-64 w-full object-cover md:block"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default CampaignHeroSlot
