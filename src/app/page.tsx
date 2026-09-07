import Link from 'next/link'
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
import { HOME_QUICK_LINKS } from '@/lib/constant'
import { resolveHomeQuickLinkIcon } from '@/components/icons/categoryIconMap'
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

  const quickLinks = (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5" aria-label="Lối tắt dịch vụ">
      {HOME_QUICK_LINKS.map((link) => {
        const Icon = resolveHomeQuickLinkIcon(link.iconId)
        return (
          <Link
            key={link.href}
            href={link.href}
            className="relative grid h-full grid-rows-[1fr_auto_1fr] justify-items-center rounded-lg border border-slate-200/90 bg-white px-1.5 py-2 text-center shadow-sm transition-all hover:border-primary-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 sm:py-2.5"
          >
            {link.comingSoon ? (
              <span className="absolute right-1 top-1 z-10 rounded bg-amber-100 px-1 py-px text-[9px] font-semibold leading-none text-amber-800">
                Sắp có
              </span>
            ) : null}
            <span aria-hidden />
            <span className="flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center text-primary-600 sm:h-9 sm:w-9" aria-hidden>
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <span className="mt-0.5 line-clamp-2 max-w-full text-[11px] font-medium leading-tight text-slate-800 sm:text-xs">
                {link.title}
              </span>
            </span>
            <span aria-hidden />
          </Link>
        )
      })}
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

      <FlashSaleProducts products={flashSale.products} dayKey={flashSale.dayKey} />

      <div className="relative z-10 bg-white">
        <BestsellingProducts products={hotSaleProducts} />
        <FeaturedCategories />
        <FavoriteBrands title={favoriteBrands.title} brands={favoriteBrands.brands} />
      </div>
    </div>
  )
}
