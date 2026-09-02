'use client'

import { useEffect, useState } from 'react'
import { getCampaignBySlug } from '@/lib/services/campaign'

export const HOT_SALE_CAMPAIGN_SLUG = 'san-pham-ban-chay'

/** Fetch hot-sale campaign end date when catalog direct promo is shown. */
export function useHotSalePromoEndsAt(enabled = true): string | null {
  const [promoEndsAt, setPromoEndsAt] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setPromoEndsAt(null)
      return
    }
    let cancelled = false
    void getCampaignBySlug(HOT_SALE_CAMPAIGN_SLUG)
      .then((res) => {
        const endAt = res.data?.end_at
        if (!cancelled && endAt) setPromoEndsAt(endAt)
      })
      .catch(() => {
        if (!cancelled) setPromoEndsAt(null)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return promoEndsAt
}
