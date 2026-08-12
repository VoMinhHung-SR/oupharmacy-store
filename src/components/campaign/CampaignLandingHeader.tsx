import type { PublicCampaignDetail } from '@/lib/services/campaign'
import { formatCampaignDateRange, pickLandingBanner } from './campaignPlacementUtils'

export interface CampaignLandingHeaderProps {
  campaign: PublicCampaignDetail
  dateRangeLabel: string
}

export function CampaignLandingHeader({
  campaign,
  dateRangeLabel,
}: CampaignLandingHeaderProps) {
  const banner = pickLandingBanner(campaign)
  const desktopSrc = banner?.image_desktop_url?.trim() || null
  const mobileSrc = banner?.image_mobile_url?.trim() || desktopSrc
  const alt = banner?.image_alt?.trim() || campaign.title
  const range = formatCampaignDateRange(campaign.start_at, campaign.end_at)

  return (
    <header>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-900 shadow-sm">
        {mobileSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- first-party / configured CDN only
          <img
            src={mobileSrc}
            alt={alt}
            className="h-52 w-full object-cover sm:hidden"
          />
        ) : null}
        {desktopSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={desktopSrc}
            alt={alt}
            className="hidden h-64 w-full object-cover sm:block md:h-80 lg:h-[22rem]"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[13rem] flex-col justify-end p-5 sm:min-h-[20rem] sm:p-8 md:min-h-[22rem] md:p-10">
          <p className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {dateRangeLabel}: {range}
          </p>
          <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {campaign.title}
          </h1>
          {campaign.subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-lg">{campaign.subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
