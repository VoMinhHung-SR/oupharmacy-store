/**
 * First-party campaign attribution cookie (D-10).
 * Cookie: oup_campaign_id — Max-Age 7 days, SameSite=Lax, path=/
 */

export const CAMPAIGN_ATTRIBUTION_COOKIE = 'oup_campaign_id'
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60

function canUseDocument(): boolean {
  return typeof document !== 'undefined'
}

export function readCampaignAttributionId(): number | null {
  if (!canUseDocument()) return null
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CAMPAIGN_ATTRIBUTION_COOKIE}=`))
  if (!match) return null
  const raw = decodeURIComponent(match.slice(CAMPAIGN_ATTRIBUTION_COOKIE.length + 1))
  const id = Number(raw)
  if (!Number.isFinite(id) || id <= 0) return null
  return Math.trunc(id)
}

/** Alias used by checkout path. */
export const getCampaignAttributionId = readCampaignAttributionId

export function setCampaignAttributionId(campaignId: number | string | null | undefined): void {
  if (!canUseDocument()) return
  const id = Number(campaignId)
  if (!Number.isFinite(id) || id <= 0) return
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CAMPAIGN_ATTRIBUTION_COOKIE}=${encodeURIComponent(String(Math.trunc(id)))}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`
}

export function clearCampaignAttributionId(): void {
  if (!canUseDocument()) return
  document.cookie = `${CAMPAIGN_ATTRIBUTION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
}
