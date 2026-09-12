import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Container from '@/components/Container'
import { CampaignCard } from '@/components/campaign'
import { getCampaignsSSG } from '@/lib/services/campaign'
import { PAGE_Y, PAGE_Y_SECTION } from '@/lib/layout/pageLayout'

export const metadata: Metadata = {
  title: 'Khuyến mãi — OUPharmacy',
  description: 'Các chương trình khuyến mãi đang diễn ra tại OUPharmacy',
}

export default async function CampaignIndexPage() {
  const t = await getTranslations('campaign')
  const campaigns = await getCampaignsSSG()

  return (
    <main className="bg-white">
      <section className={`border-b border-gray-100 bg-white ${PAGE_Y_SECTION}`}>
        <Container>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('indexTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{t('indexSubtitle')}</p>
        </Container>
      </section>

      <Container className={PAGE_Y}>
        {campaigns.length === 0 ? (
          <div className="mx-auto max-w-lg py-8 text-center">
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
