import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { CampaignHomeCluster, pickHomePlacement, pickHomeSlides } from '@/components/campaign'
import type { PlacementWinner } from '@/lib/services/campaign'
import { getCampaignPlacementsSSG } from '@/lib/services/campaign'
import { getFavoriteBrandsSSG } from '@/lib/services/brandCampaigns'
import { getFlashSaleProductsSSG } from '@/lib/services/flashSale'
import { getHotSaleProductsSSG } from '@/lib/services/search'
import { HomeQuickLinks } from '@/components/consultation/HomeQuickLinks'

const FlashSaleProducts = dynamic(() => import('@/sections/FlashSaleProducts'), {
  loading: () => <div className="min-h-[22rem] bg-white" aria-hidden />,
})
const BestsellingProducts = dynamic(() => import('@/sections/BestsellingProducts'), {
  loading: () => <div className="min-h-[22rem] bg-white" aria-hidden />,
})
const FeaturedCategories = dynamic(() => import('@/sections/FeaturedCategories'), {
  loading: () => <div className="min-h-[16rem] bg-white" aria-hidden />,
})
const FavoriteBrands = dynamic(() => import('@/sections/FavoriteBrands'), {
  loading: () => <div className="min-h-[18rem] bg-gray-50" aria-hidden />,
})

export const metadata: Metadata = {
  title: 'Nhà thuốc OUPharmacy — mua thuốc, tư vấn và đặt hàng trực tuyến',
  description:
    'Nhà thuốc OUPharmacy: mua thuốc chính hãng, tủ thuốc thông minh, tư vấn dược sĩ và giao hàng nhanh.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nhà thuốc OUPharmacy',
    description:
      'Mua thuốc chính hãng, tư vấn dược sĩ và đặt hàng trực tuyến tại OUPharmacy.',
    url: '/',
    type: 'website',
  },
}

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
  const flashSale = await getFlashSaleProductsSSG(16, {
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
