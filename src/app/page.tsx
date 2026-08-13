import Link from 'next/link'
import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import FlashSaleProducts from '@/sections/FlashSaleProducts'
import { CampaignHomeCluster, pickHomePlacement, pickHomeSlides } from '@/components/campaign'
import type { PlacementWinner } from '@/lib/services/campaign'
import { getCampaignPlacementsSSG } from '@/lib/services/campaign'
import { HOME_QUICK_LINKS } from '@/lib/constant'

/** BE does not expose theme_image_url yet — fall back to first-party demo themes by sort_order. */
function withHeroThemeFallback(slides: PlacementWinner[]): PlacementWinner[] {
  return slides.slice(0, 3).map((slide, i) => {
    const order = slide.sort_order ?? i
    const themeIdx = Math.min(Math.max(order, 0), 2) + 1
    return {
      ...slide,
      theme_image_url:
        slide.theme_image_url?.trim() || `/mocks/home-cms/hero-theme-${themeIdx}.png`,
    }
  })
}

/**
 * Home cluster: theme band (fade to white) + hero content card, synced by slide.
 * SoT: placements API; empty/error → static fallbacks (D-08).
 */
export default async function Home() {
  const placementsPayload = await getCampaignPlacementsSSG({
    slots: ['HOME_HERO', 'HOME_SECONDARY', 'HOME_NOTICE_TOP', 'HOME_NOTICE_BOTTOM'],
  })
  const placements = placementsPayload?.placements ?? null

  const heroSlides = withHeroThemeFallback(pickHomeSlides(placements, 'HOME_HERO'))
  const secondarySlides = pickHomeSlides(placements, 'HOME_SECONDARY')
  const noticeTop = pickHomePlacement(placements, 'HOME_NOTICE_TOP')
  const noticeBottom = pickHomePlacement(placements, 'HOME_NOTICE_BOTTOM')

  const quickLinks = (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6" aria-label="Lối tắt dịch vụ">
      {HOME_QUICK_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex flex-col items-center rounded-xl border border-white/70 bg-white px-2 py-3 text-center shadow-md transition-all hover:border-primary-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <span className="text-2xl sm:text-3xl" aria-hidden>
            {link.icon}
          </span>
          <span className="mt-1.5 text-xs font-semibold text-gray-800 sm:text-sm">{link.title}</span>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen">
      <CampaignHomeCluster
        heroSlides={heroSlides}
        secondarySlides={secondarySlides}
        noticeTop={noticeTop}
        noticeBottom={noticeBottom}
        footer={quickLinks}
      />

      <div className="relative z-10 bg-white">
        <FlashSaleProducts />
        <BestsellingProducts />
        <FeaturedCategories />
        <FavoriteBrands />
      </div>
    </div>
  )
}
