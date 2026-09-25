import FeaturedCategories from '@/sections/FeaturedCategories'
import FavoriteBrands from '@/sections/FavoriteBrands'
import BestsellingProducts from '@/sections/BestsellingProducts'
import FlashSaleProducts from '@/sections/FlashSaleProducts'
import { CampaignHomeCluster, pickHomePlacement, pickHomeSlides } from '@/components/campaign'
import type { PlacementWinner } from '@/lib/services/campaign'
import { getCampaignPlacementsSSG } from '@/lib/services/campaign'
import { getFavoriteBrandsSSG } from '@/lib/services/brandCampaigns'
import { getFlashSaleProductsSSG } from '@/lib/services/flashSale'
import { getHotSaleProductsSSG } from '@/lib/services/search'
import { HomeQuickLinks } from '@/components/consultation/HomeQuickLinks'

/** BE does not expose theme_image_url yet — fall back to first-party demo themes by sort_order. */
function withHeroThemeFallback(slides: PlacementWinner[]): PlacementWinner[] {
  return slides.slice(0, 2).map((slide, i) => {
    const themeIdx = Math.min(i, 1) + 1
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
  const [placementsPayload, hotSaleProducts, favoriteBrands] = await Promise.all([
    getCampaignPlacementsSSG({
      slots: ['HOME_HERO', 'HOME_SECONDARY', 'HOME_NOTICE_TOP', 'HOME_NOTICE_BOTTOM'],
    }),
    getHotSaleProductsSSG(12),
    getFavoriteBrandsSSG(10),
  ])
  // After hot-sale IDs known — flash pool skips those to avoid duplicate rails on /
  const flashSale = await getFlashSaleProductsSSG(48, {
    excludeIds: hotSaleProducts.map((product) => product.id),
  })
  const placements = placementsPayload?.placements ?? null

  const heroSlides = withHeroThemeFallback(pickHomeSlides(placements, 'HOME_HERO'))
  const secondarySlides = pickHomeSlides(placements, 'HOME_SECONDARY')
  const noticeTop = pickHomePlacement(placements, 'HOME_NOTICE_TOP')
  const noticeBottom = pickHomePlacement(placements, 'HOME_NOTICE_BOTTOM')

  return (
    <div className="min-h-screen">
      <CampaignHomeCluster
        heroSlides={heroSlides}
        secondarySlides={secondarySlides}
        noticeTop={noticeTop}
        noticeBottom={noticeBottom}
        footer={<HomeQuickLinks />}
      />

      <FlashSaleProducts products={flashSale.products} dayKey={flashSale.dayKey} />

      <div className="relative z-10 bg-white">
        <BestsellingProducts products={hotSaleProducts} />
        <FeaturedCategories />
        <FavoriteBrands title={favoriteBrands.title} brands={favoriteBrands.brands} />
      </div>
    </div>
  )
}
