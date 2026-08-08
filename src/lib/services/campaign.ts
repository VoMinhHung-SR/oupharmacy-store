import { apiGet } from '../api'

/** Placement slot keys — keep in sync with storeApp.CampaignPlacement.SLOT_CHOICES */
export type CampaignSlot =
  | 'HOME_HERO'
  | 'HOME_PROMO_LEFT'
  | 'HOME_PROMO_RIGHT'
  | 'HOME_STRIP'
  | 'CATEGORY_BANNER'
  | 'SEARCH_BANNER'

export const CAMPAIGN_SLOTS: CampaignSlot[] = [
  'HOME_HERO',
  'HOME_PROMO_LEFT',
  'HOME_PROMO_RIGHT',
  'HOME_STRIP',
  'CATEGORY_BANNER',
  'SEARCH_BANNER',
]

export interface CampaignPlacementBrief {
  slot: CampaignSlot | string
  image_desktop_url: string | null
  cta_url: string | null
}

export interface PublicCampaignListItem {
  id: number
  slug: string
  title: string
  subtitle: string | null
  priority: number
  start_at: string
  end_at: string
  primary_placement: CampaignPlacementBrief | null
}

export interface CampaignPlacement {
  id: number
  slot: CampaignSlot | string
  title: string
  subtitle: string | null
  cta_label: string | null
  cta_url: string | null
  image_desktop_url: string | null
  image_mobile_url: string | null
  image_alt: string | null
  sort_order: number
  is_enabled: boolean
}

/** Public voucher callout shape (P5); empty until BE ships CampaignVoucher. */
export interface PublicCampaignVoucher {
  code: string
  description: string | null
  type: string
  value: string
  scope: string
  is_displayable: boolean
}

export interface PublicCampaignDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  description_html: string | null
  start_at: string
  end_at: string
  placements: CampaignPlacement[]
  product_mids: string[]
  category_slugs: string[]
  vouchers: PublicCampaignVoucher[]
}

export interface PlacementWinner {
  campaign_id: number
  campaign_slug: string
  title: string
  subtitle: string | null
  cta_label: string | null
  cta_url: string | null
  image_desktop_url: string | null
  image_mobile_url: string | null
  image_alt: string | null
}

export interface CampaignPlacementsResponse {
  generated_at: string
  placements: Partial<Record<CampaignSlot | string, PlacementWinner | null>>
}

export interface GetCampaignsParams {
  page?: number
  page_size?: number
}

export interface GetCampaignPlacementsParams {
  /** Limit slots; comma-joined in query (e.g. HOME_HERO,HOME_STRIP). */
  slots?: CampaignSlot[] | string[]
}

function storeApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/store'
}

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    qs.set(key, String(value))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

/** List active-in-window campaigns (public). BE currently returns a bare array. */
export async function getCampaigns(params?: GetCampaignsParams) {
  const query = buildQuery({
    page: params?.page,
    page_size: params?.page_size,
  })
  return apiGet<PublicCampaignListItem[]>(`/campaigns/${query}`)
}

/** Retrieve one public campaign by slug; 404 for draft/invisible (D-06). */
export async function getCampaignBySlug(slug: string) {
  return apiGet<PublicCampaignDetail>(`/campaigns/${encodeURIComponent(slug)}/`)
}

/** Winning placements by slot; null slot → static FE fallback (D-08). */
export async function getCampaignPlacements(params?: GetCampaignPlacementsParams) {
  const slots =
    params?.slots && params.slots.length > 0 ? params.slots.join(',') : undefined
  const query = buildQuery({ slots })
  return apiGet<CampaignPlacementsResponse>(`/campaigns/placements/${query}`)
}

/**
 * Server/SSG fetch for placements (homepage). Short TTL per public Cache-Control.
 * On error returns null so callers can fall back to static banners (D-08).
 */
export async function getCampaignPlacementsSSG(
  params?: GetCampaignPlacementsParams
): Promise<CampaignPlacementsResponse | null> {
  const slots =
    params?.slots && params.slots.length > 0 ? params.slots.join(',') : undefined
  const query = buildQuery({ slots })
  const url = `${storeApiBase()}/campaigns/placements/${query}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.warn(
        `[getCampaignPlacementsSSG] BE returned ${response.status} ${response.statusText} for ${url}`
      )
      return null
    }

    return (await response.json()) as CampaignPlacementsResponse
  } catch (error) {
    console.warn('[getCampaignPlacementsSSG] Fetch failed:', error)
    return null
  }
}

/**
 * Server/SSG fetch for campaign detail by slug.
 * Returns null on 404/error so landing can show not-found without leaking drafts.
 */
export async function getCampaignBySlugSSG(
  slug: string
): Promise<PublicCampaignDetail | null> {
  const url = `${storeApiBase()}/campaigns/${encodeURIComponent(slug)}/`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 60 },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      console.warn(
        `[getCampaignBySlugSSG] BE returned ${response.status} ${response.statusText} for ${url}`
      )
      return null
    }

    return (await response.json()) as PublicCampaignDetail
  } catch (error) {
    console.warn('[getCampaignBySlugSSG] Fetch failed:', error)
    return null
  }
}

/** Server/SSG list of public campaigns; empty array on failure. */
export async function getCampaignsSSG(
  params?: GetCampaignsParams
): Promise<PublicCampaignListItem[]> {
  const query = buildQuery({
    page: params?.page,
    page_size: params?.page_size,
  })
  const url = `${storeApiBase()}/campaigns/${query}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.warn(
        `[getCampaignsSSG] BE returned ${response.status} ${response.statusText} for ${url}`
      )
      return []
    }

    return (await response.json()) as PublicCampaignListItem[]
  } catch (error) {
    console.warn('[getCampaignsSSG] Fetch failed:', error)
    return []
  }
}
