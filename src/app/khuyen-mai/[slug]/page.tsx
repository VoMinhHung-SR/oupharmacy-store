import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Container from '@/components/Container'
import {
  CampaignAttributionBeacon,
  CampaignEmptyProducts,
  CampaignLandingHeader,
  CampaignProductGrid,
  CampaignScopeChips,
  CampaignTermsBlock,
  CampaignVoucherStrip,
} from '@/components/campaign'
import { getCampaignBySlugSSG } from '@/lib/services/campaign'
import { loadCampaignScopedProducts } from '@/lib/services/campaignProducts'

interface CampaignLandingPageProps {
  params: { slug: string }
  searchParams: { preview?: string }
}

function previewTokenFromSearch(searchParams: CampaignLandingPageProps['searchParams']) {
  const raw = searchParams?.preview
  return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined
}

export async function generateMetadata({
  params,
  searchParams,
}: CampaignLandingPageProps): Promise<Metadata> {
  const campaign = await getCampaignBySlugSSG(params.slug, {
    previewToken: previewTokenFromSearch(searchParams),
  })
  if (!campaign) {
    return { title: 'Không tìm thấy — OUPharmacy' }
  }
  return {
    title: `${campaign.title} — OUPharmacy`,
    description: campaign.subtitle || campaign.title,
    ...(campaign.is_preview ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function CampaignLandingPage({
  params,
  searchParams,
}: CampaignLandingPageProps) {
  const campaign = await getCampaignBySlugSSG(params.slug, {
    previewToken: previewTokenFromSearch(searchParams),
  })
  // Draft / invisible / missing / bad preview → identical 404 (D-06 / D-19)
  if (!campaign) {
    notFound()
  }

  const t = await getTranslations('campaign')
  const products = await loadCampaignScopedProducts(campaign)

  return (
    <main className="bg-gray-50">
      <Container className="space-y-4 py-3 sm:space-y-5 sm:py-4">
        {campaign.is_preview ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {t('previewBanner')}
          </p>
        ) : null}

        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/khuyen-mai" className="font-medium text-primary-600 hover:text-primary-700">
                {t('backToIndex')}
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li className="line-clamp-1 text-gray-700">{campaign.title}</li>
          </ol>
        </nav>

        <CampaignLandingHeader campaign={campaign} dateRangeLabel={t('dateRangeLabel')} />

        {campaign.is_preview ? null : <CampaignAttributionBeacon campaignId={campaign.id} />}

        <CampaignVoucherStrip vouchers={campaign.vouchers || []} heading={t('voucherHeading')} />

        <CampaignScopeChips
          categorySlugs={campaign.category_slugs || []}
          featuredLabel={t('featuredChip')}
        />
      </Container>

      {products.length > 0 ? (
        <CampaignProductGrid products={products} heading={t('productsHeading')} />
      ) : (
        <CampaignEmptyProducts message={t('productsStub')} browseLabel={t('browseCatalog')} />
      )}

      {campaign.description_html ? (
        <Container className="pb-10 pt-2 sm:pb-14">
          <CampaignTermsBlock
            html={campaign.description_html}
            heading={t('termsHeading')}
            moreLabel={t('termsMore')}
            lessLabel={t('termsLess')}
          />
        </Container>
      ) : null}
    </main>
  )
}
