import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Container from '@/components/Container'
import { CampaignCard } from '@/components/campaign'
import { getCampaignsSSG } from '@/lib/services/campaign'

export const metadata: Metadata = {
  title: 'Khuyến mãi — OUPharmacy',
  description: 'Các chương trình khuyến mãi đang diễn ra tại OUPharmacy',
}

export default async function CampaignIndexPage() {
  const t = await getTranslations('campaign')
  const campaigns = await getCampaignsSSG()

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-700 py-10 text-white sm:py-12">
        <Container>
          <h1 className="text-3xl font-bold sm:text-4xl">{t('indexTitle')}</h1>
          <p className="mt-2 text-primary-100">{t('indexSubtitle')}</p>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        {campaigns.length === 0 ? (
          <div className="mx-auto max-w-lg py-16 text-center">
            <p className="text-base text-gray-600">{t('indexEmpty')}</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {t('backHome')}
            </Link>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <li key={campaign.id}>
                <CampaignCard
                  campaign={campaign}
                  viewLabel={t('viewCampaign')}
                  dateRangeLabel={t('dateRangeLabel')}
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  )
}
