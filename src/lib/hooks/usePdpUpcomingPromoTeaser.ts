'use client'

import { useMemo } from 'react'
import flashSaleMeta from '@/api/mocks/home/flash-sale.response.json'
import type { FlashSaleResponse } from '@/api/mocks/home/types'
import { flashMerchPercentForProduct, flashSaleDayKey } from '@/lib/services/flashSale'
import { findNextUpcomingFlashWindow, formatUpcomingPriceTeaser } from '@/lib/services/homeMerch'
import type { Product } from '@/lib/services/products'
import { formatPromoStartDateTimeLabel } from '@/lib/utils/catalogPromoCopy'

export type PdpUpcomingPromoTeaser = {
  maskedPrice: string
  startsAt: string
}

/** PDP flash-window teaser — display-only (D-01). */
export function usePdpUpcomingPromoTeaser(
  product: Product | null | undefined,
  listPrice: number,
  enabled: boolean
): PdpUpcomingPromoTeaser | null {
  return useMemo(() => {
    if (!enabled || !product || !(listPrice > 0)) return null

    const meta = flashSaleMeta as FlashSaleResponse
    if (meta.enabled === false) return null

    const templates = meta.window_templates
    if (!Array.isArray(templates) || templates.length === 0) return null

    const now = new Date()
    const nextUpcoming = findNextUpcomingFlashWindow(templates, now)
    if (!nextUpcoming || !formatPromoStartDateTimeLabel(nextUpcoming.starts_at)) return null

    const tier = flashMerchPercentForProduct(product, flashSaleDayKey(now))
    if (tier < 10) return null

    return {
      maskedPrice: formatUpcomingPriceTeaser(listPrice),
      startsAt: nextUpcoming.starts_at,
    }
  }, [enabled, listPrice, product])
}
