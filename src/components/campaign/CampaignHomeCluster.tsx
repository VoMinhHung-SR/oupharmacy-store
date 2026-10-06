import dynamic from 'next/dynamic'
import Container from '@/components/Container'
import HeroBanner from '@/sections/HeroBanner'
import PromotionalBanners from '@/sections/PromotionalBanners'
import type { PlacementWinner } from '@/lib/services/campaign'
import CampaignHomeHeroClient from './CampaignHomeHeroClient'

const CampaignHomeBottomClient = dynamic(() => import('./CampaignHomeBottomClient'), {
  loading: () => <div className="min-h-[11rem] rounded-2xl bg-white/40" aria-hidden />,
})

export type CampaignHomeClusterProps = {
  heroSlides: PlacementWinner[]
  secondarySlides: PlacementWinner[]
  noticeTop: PlacementWinner | null
  noticeBottom: PlacementWinner | null
  footer?: React.ReactNode
}

/**
 * Home CMS band — server shell with client hero/bottom islands.
 * Slot ARs: hero 3.7:1 · secondary 3.25:1 · notice 3.4:1.
 */
export default function CampaignHomeCluster({
  heroSlides,
  secondarySlides,
  noticeTop,
  noticeBottom,
  footer,
}: CampaignHomeClusterProps) {
  const slides = heroSlides.slice(0, 2)
  const hasHero = slides.length > 0
  const hasBottom = secondarySlides.length > 0 || Boolean(noticeTop || noticeBottom)

  return (
    <section className="relative isolate overflow-hidden">
      {hasHero ? (
        <CampaignHomeHeroClient slides={slides} />
      ) : (
        <>
          <div aria-hidden className="home-cms-band-fade pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-transparent" />
          </div>
          <Container className="relative z-10 pb-0 pt-3 sm:pt-4">
            <HeroBanner />
          </Container>
        </>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent via-white/80 to-white sm:h-52"
      />

      <Container className="relative z-10 pb-3 sm:pb-4">
        <div className={`space-y-3 ${hasHero ? 'mt-3' : 'py-4 sm:py-5'}`}>
          {hasBottom ? (
            <CampaignHomeBottomClient
              secondarySlides={secondarySlides}
              noticeTop={noticeTop}
              noticeBottom={noticeBottom}
            />
          ) : hasHero ? (
            <PromotionalBanners />
          ) : null}
        </div>

        {footer ? <div className="mt-3 sm:mt-4">{footer}</div> : null}
      </Container>
    </section>
  )
}
