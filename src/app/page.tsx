import Link from 'next/link'
import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import { CampaignHeroSlot, CampaignPromoSlots, pickHomePlacement } from '@/components/campaign'
import { getCampaignPlacementsSSG } from '@/lib/services/campaign'
import { HOME_QUICK_LINKS } from '@/lib/constant'

export default async function Home() {
  const placementsPayload = await getCampaignPlacementsSSG({
    slots: ['HOME_HERO', 'HOME_PROMO_LEFT', 'HOME_PROMO_RIGHT'],
  })
  const placements = placementsPayload?.placements ?? null

  const hero = pickHomePlacement(placements, 'HOME_HERO')
  const promoLeft = pickHomePlacement(placements, 'HOME_PROMO_LEFT')
  const promoRight = pickHomePlacement(placements, 'HOME_PROMO_RIGHT')

  return (
    <main className="min-h-screen bg-white">
      <CampaignHeroSlot placement={hero} />

      <FeaturedCategories />

      <FavoriteBrands />

      <BestsellingProducts />

      <CampaignPromoSlots left={promoLeft} right={promoRight} />

      <section className="bg-white py-12" aria-label="Lối tắt dịch vụ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {HOME_QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-primary-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="mb-2 text-4xl" aria-hidden>
                  {link.icon}
                </span>
                <span className="text-center text-sm font-medium text-gray-900">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
