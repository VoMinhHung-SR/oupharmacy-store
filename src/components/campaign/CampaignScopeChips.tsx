import Link from 'next/link'
import { campaignCategoryLabel } from './campaignPlacementUtils'

export interface CampaignScopeChipsProps {
  categorySlugs: string[]
  featuredLabel: string
}

export function CampaignScopeChips({ categorySlugs, featuredLabel }: CampaignScopeChipsProps) {
  const slugs = categorySlugs.map((slug) => slug.trim()).filter(Boolean)
  if (!slugs.length) return null

  return (
    <nav aria-label={featuredLabel} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 pb-1 sm:w-full sm:flex-wrap">
        <li>
          <a
            href="#campaign-products"
            className="inline-flex whitespace-nowrap rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {featuredLabel}
          </a>
        </li>
        {slugs.map((slug) => (
          <li key={slug}>
            <Link
              href={`/${encodeURIComponent(slug)}`}
              className="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700"
            >
              {campaignCategoryLabel(slug)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
