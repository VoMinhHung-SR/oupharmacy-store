import Link from 'next/link'
import type { PublicCampaignListItem } from '@/lib/services/campaign'

function formatCampaignRange(startAt: string, endAt: string): string {
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

export interface CampaignCardProps {
  campaign: PublicCampaignListItem
  viewLabel: string
  dateRangeLabel: string
}

export function CampaignCard({ campaign, viewLabel, dateRangeLabel }: CampaignCardProps) {
  const imageUrl = campaign.primary_placement?.image_desktop_url?.trim() || null
  const href = `/khuyen-mai/${encodeURIComponent(campaign.slug)}`

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <div className="flex h-40 items-center justify-center bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary
          <img
            src={imageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-8 text-center text-sm font-semibold text-white">
            {campaign.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-bold text-gray-900">{campaign.title}</h2>
        {campaign.subtitle ? (
          <p className="text-sm text-gray-600 line-clamp-2">{campaign.subtitle}</p>
        ) : null}
        <p className="text-xs text-gray-500">
          <span className="font-medium">{dateRangeLabel}: </span>
          {formatCampaignRange(campaign.start_at, campaign.end_at)}
        </p>
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {viewLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
