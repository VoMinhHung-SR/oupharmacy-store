'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import PromotionalBanners from '@/sections/PromotionalBanners'
import type { PlacementWinner } from '@/lib/services/campaign'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { safeCampaignHref } from './campaignPlacementUtils'

export interface CampaignPromoSlotsProps {
  left: PlacementWinner | null
  right: PlacementWinner | null
}

function PromoCard({ placement }: { placement: PlacementWinner }) {
  const href = safeCampaignHref(placement.cta_url)
  const ctaLabel = placement.cta_label?.trim() || 'Mua ngay'
  const imageSrc =
    placement.image_desktop_url?.trim() ||
    placement.image_mobile_url?.trim() ||
    null
  const alt = placement.image_alt?.trim() || placement.title

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <h3 className="mb-2 text-lg font-bold text-gray-900">{placement.title}</h3>
      {placement.subtitle ? (
        <p className="mb-4 text-gray-600">{placement.subtitle}</p>
      ) : null}
      <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary
          <img src={imageSrc} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="text-sm text-gray-400">Hình ảnh sản phẩm</div>
        )}
      </div>
      {href ? (
        <Link href={href} onClick={() => setCampaignAttributionId(placement.campaign_id)}>
          <Button variant="primary" size="md" className="w-full bg-red-600 hover:bg-red-700">
            {ctaLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  )
}

/**
 * HOME_PROMO_LEFT / HOME_PROMO_RIGHT winners, or static PromotionalBanners (D-08).
 * If only one side wins, still prefer campaign layout for that side + soft empty for the other.
 */
export const CampaignPromoSlots: React.FC<CampaignPromoSlotsProps> = ({ left, right }) => {
  if (!left && !right) {
    return <PromotionalBanners />
  }

  return (
    <section className="bg-gray-50 py-12">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          {left ? (
            <PromoCard placement={left} />
          ) : (
            <div className="hidden md:block" aria-hidden />
          )}
          {right ? (
            <PromoCard placement={right} />
          ) : (
            <div className="hidden md:block" aria-hidden />
          )}
        </div>
      </Container>
    </section>
  )
}

export default CampaignPromoSlots
