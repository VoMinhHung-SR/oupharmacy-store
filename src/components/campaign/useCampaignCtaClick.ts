'use client'

import type { MouseEvent } from 'react'
import { useConsultUi } from '@/contexts/ConsultUiContext'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'
import { isConsultOpenHref } from './campaignPlacementUtils'

/** Attribution + open ConsultChatbox when CTA is `/?consult=open`. */
export function useCampaignCtaClick() {
  const { open: openConsult } = useConsultUi()

  return (e: MouseEvent, campaignId: number, href: string | null) => {
    setCampaignAttributionId(campaignId)
    if (isConsultOpenHref(href)) {
      e.preventDefault()
      openConsult()
    }
  }
}
