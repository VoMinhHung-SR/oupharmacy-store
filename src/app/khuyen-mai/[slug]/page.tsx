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
} from '@/components/campaign'
import { getCampaignBySlugSSG } from '@/lib/services/campaign'
import { loadCampaignScopedProducts } from '@/lib/services/campaignProducts'

interface CampaignLandingPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: CampaignLandingPageProps): Promise<Metadata> {
  const campaign = await getCampaignBySlugSSG(params.slug)
  if (!campaign) {
    return { title: 'Không tìm thấy — OUPharmacy' }
  }
  return {
    title: `${campaign.title} — OUPharmacy`,
    description: campaign.subtitle || campaign.title,
  }
}

export default async function CampaignLandingPage({
  params,
}: CampaignLandingPageProps) {
  const campaign = await getCampaignBySlugSSG(params.slug)
  // Draft / invisible / missing → identical 404 (D-06)
  if (!campaign) {
    notFound()
  }

  const t = await getTranslations('campaign')
  const products = await loadCampaignScopedProducts(campaign)

  return (
    <main className="min-h-screen bg-white">
      <Container className="pt-4">
        <Link
          href="/khuyen-mai"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {t('backToIndex')}
        </Link>
      </Container>
      <CampaignLandingHeader
        campaign={campaign}
        dateRangeLabel={t('dateRangeLabel')}
      />
      <CampaignAttributionBeacon campaignId={campaign.id} />
      {products.length > 0 ? (
        <CampaignProductGrid products={products} heading={t('productsHeading')} />
      ) : (
        <CampaignEmptyProducts
          message={t('productsStub')}
          browseLabel={t('browseCatalog')}
        />
      )}
    </main>
  )
}
