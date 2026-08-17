'use client'

import { useEffect } from 'react'
import { setCampaignAttributionId } from '@/lib/utils/campaignAttribution'

/** Quietly stamps oup_campaign_id when a campaign landing mounts (D-10 / ui.md). */
export function CampaignAttributionBeacon({ campaignId }: { campaignId: number }) {
  useEffect(() => {
    setCampaignAttributionId(campaignId)
  }, [campaignId])

  return null
}

export default CampaignAttributionBeacon
