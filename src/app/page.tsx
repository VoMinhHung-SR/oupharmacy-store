import Link from 'next/link'
import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import { CampaignHomeCluster, pickHomePlacement } from '@/components/campaign'
import { getCampaignPlacementsSSG } from '@/lib/services/campaign'
import { HOME_QUICK_LINKS } from '@/lib/constant'

/**
 * Home layout (existing sections; placement-driven top cluster):
 * 1) HERO → PROMO_LEFT + (STRIP | PROMO_RIGHT) notices
 * 2) Quick cate bar
 * 3) Bestsellers
 * 4) Featured categories
 * 5) Favorite brands
 *
 * Content from Jazzmin placements; frame fixed (D-20). D-08 fallbacks inside cluster.
 */
export default async function Home() {
  const placementsPayload = await getCampaignPlacementsSSG({
    slots: ['HOME_HERO', 'HOME_STRIP', 'HOME_PROMO_LEFT', 'HOME_PROMO_RIGHT'],
  })
  const placements = placementsPayload?.placements ?? null

  const hero = pickHomePlacement(placements, 'HOME_HERO')
  const secondary = pickHomePlacement(placements, 'HOME_PROMO_LEFT')
  const noticeTop = pickHomePlacement(placements, 'HOME_STRIP')
  const noticeBottom = pickHomePlacement(placements, 'HOME_PROMO_RIGHT')

  return (
    <main className="min-h-screen bg-white">
      <CampaignHomeCluster
        hero={hero}
        secondary={secondary}
        noticeTop={noticeTop}
        noticeBottom={noticeBottom}
      />

      <section className="border-b border-gray-100 bg-white py-4 sm:py-5" aria-label="Lối tắt dịch vụ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {HOME_QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center rounded-xl border border-primary-100 bg-white px-2 py-3 text-center shadow-sm transition-all hover:border-primary-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {link.icon}
                </span>
                <span className="mt-1.5 text-xs font-semibold text-gray-800 sm:text-sm">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BestsellingProducts />
      <FeaturedCategories />
      <FavoriteBrands />
    </main>
  )
}
