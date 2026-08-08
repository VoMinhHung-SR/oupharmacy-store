import type { PlacementWinner } from '@/lib/services/campaign'

/** Only relative CTAs (D-09). */
export function safeCampaignHref(ctaUrl: string | null | undefined): string | null {
  if (!ctaUrl) return null
  const trimmed = ctaUrl.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null
  return trimmed
}

export function pickHomePlacement(
  placements: Partial<Record<string, PlacementWinner | null>> | null | undefined,
  slot: string
): PlacementWinner | null {
  if (!placements) return null
  return placements[slot] ?? null
}
