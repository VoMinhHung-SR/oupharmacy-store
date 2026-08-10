import type { PlacementWinner, PublicCampaignDetail } from '@/lib/services/campaign'

const CATEGORY_LABELS: Record<string, string> = {
  'duoc-my-pham': 'Dược mỹ phẩm',
  'cham-soc-da-mat': 'Chăm sóc da mặt',
  'sua-rua-mat-kem-gel-sua': 'Sữa rửa mặt',
  'chong-nang-da-mat': 'Chống nắng',
  'duong-da-mat': 'Dưỡng da mặt',
  'mat-na': 'Mặt nạ',
  'nuoc-tay-trang': 'Tẩy trang',
  'thuc-pham-chuc-nang': 'Thực phẩm chức năng',
  'vitamin-khoang-chat': 'Vitamin & khoáng chất',
  'vitamin-tong-hop': 'Vitamin tổng hợp',
  'canxi-vitamin-D': 'Canxi & vitamin D',
  'trang-thiet-bi-y-te': 'Thiết bị y tế',
  'dung-cu-y-te': 'Dụng cụ y tế',
  'bang-y-te': 'Băng y tế',
  'thuoc': 'Thuốc',
  'cham-soc-ca-nhan': 'Chăm sóc cá nhân',
}

export function campaignCategoryLabel(slug: string): string {
  const key = slug.trim().toLowerCase()
  return CATEGORY_LABELS[key] || slug.replace(/-/g, ' ')
}

export function formatCampaignDateRange(startAt: string, endAt: string): string {
  try {
    const start = new Date(startAt)
    const end = new Date(endAt)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return `${startAt} – ${endAt}`
    }
    const opts: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
    return `${start.toLocaleDateString('vi-VN', opts)} – ${end.toLocaleDateString('vi-VN', opts)}`
  } catch {
    return `${startAt} – ${endAt}`
  }
}

/** Prefer HOME_HERO creative, else first enabled placement with an image. */
export function pickLandingBanner(campaign: PublicCampaignDetail) {
  const rows = (campaign.placements || []).filter((row) => row.is_enabled !== false)
  const withImage = (row: (typeof rows)[number]) =>
    Boolean(row.image_desktop_url?.trim() || row.image_mobile_url?.trim())
  return rows.find((row) => row.slot === 'HOME_HERO' && withImage(row)) || rows.find(withImage) || null
}

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
