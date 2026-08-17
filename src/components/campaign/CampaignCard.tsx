import Link from 'next/link'
import type { PublicCampaignListItem } from '@/lib/services/campaign'
import { formatCampaignDateRange } from './campaignPlacementUtils'

export interface CampaignCardProps {
  campaign: PublicCampaignListItem
  viewLabel: string
  dateRangeLabel: string
}

export function CampaignCard({ campaign, viewLabel, dateRangeLabel }: CampaignCardProps) {
  const imageUrl = campaign.primary_placement?.image_desktop_url?.trim() || null
  const href = `/khuyen-mai/${encodeURIComponent(campaign.slug)}`

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[16/9] bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- campaign CDN hosts vary
          <img
            src={imageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4 text-center text-sm font-semibold text-white">
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
          {formatCampaignDateRange(campaign.start_at, campaign.end_at)}
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
