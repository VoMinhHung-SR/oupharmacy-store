import { HtmlContent } from '@/components/common/HtmlContent'
import type { PublicCampaignDetail } from '@/lib/services/campaign'

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

export interface CampaignLandingHeaderProps {
  campaign: PublicCampaignDetail
  dateRangeLabel: string
}

export function CampaignLandingHeader({
  campaign,
  dateRangeLabel,
}: CampaignLandingHeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-700 py-10 text-white sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {campaign.title}
        </h1>
        {campaign.subtitle ? (
          <p className="mt-3 text-lg text-primary-100 sm:text-xl">{campaign.subtitle}</p>
        ) : null}
        <p className="mt-4 text-sm text-primary-100">
          <span className="font-medium">{dateRangeLabel}: </span>
          {formatCampaignRange(campaign.start_at, campaign.end_at)}
        </p>
        {campaign.description_html ? (
          <div className="prose prose-invert mt-6 max-w-3xl prose-p:text-primary-50">
            <HtmlContent html={campaign.description_html} />
          </div>
        ) : null}
      </div>
    </header>
  )
}
