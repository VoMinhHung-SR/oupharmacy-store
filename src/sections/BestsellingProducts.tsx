'use client'

import React, { useRef } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import { DeferredRailMount, ProgressiveRailItem } from '@/components/carousel/ProgressiveRailItem'
import { HOME_MERCH_ORANGE } from '@/lib/constant'
import { useHorizontalScrollEdges } from '@/lib/hooks/useHorizontalScrollEdges'
import type { ProductCardPayload } from '@/lib/services/products'

const DEFAULT_TITLE = 'Sản phẩm bán chạy'

type BestsellingProductsProps = {
  products: ProductCardPayload[]
  title?: string
}

function BestsellingRail({
  products,
  title,
}: {
  products: ProductCardPayload[]
  title: string
}) {
  const rail = (products || []).slice(0, 12)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { canScrollLeft, canScrollRight, scrollPage } = useHorizontalScrollEdges(scrollerRef, [
    rail.length,
  ])

  if (rail.length === 0) return null

  return (
    <section className="bg-white pb-6 pt-8 sm:pb-8 sm:pt-10" aria-label={title}>
      <Container>
        <div className="relative overflow-visible">
          <div
            className="relative overflow-visible rounded-2xl px-3 pb-3 pt-9 sm:px-4 sm:pb-4 sm:pt-10"
            style={{ backgroundColor: HOME_MERCH_ORANGE }}
          >
            <h2 className="hot-sale-tab">{title}</h2>

            <div className="relative overflow-visible">
              {canScrollLeft ? (
                <CarouselArrowButton
                  variant="merchRail"
                  direction="prev"
                  label="Sản phẩm trước"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(-1)
                  }}
                />
              ) : null}
              {canScrollRight ? (
                <CarouselArrowButton
                  variant="merchRail"
                  direction="next"
                  label="Sản phẩm sau"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(1)
                  }}
                />
              ) : null}

              <div ref={scrollerRef} className="hot-sale-track scrollbar-hide scroll-smooth">
                {rail.map((product, index) => (
                  <ProgressiveRailItem key={product.id} index={index} eagerCount={3}>
                    <ProductCard product={product} />
                  </ProgressiveRailItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/** Hot-sale / bestsellers rail (home SSG). */
export const BestsellingProducts: React.FC<BestsellingProductsProps> = ({
  products,
  title = DEFAULT_TITLE,
}) => {
  const rail = (products || []).slice(0, 12)
  if (rail.length === 0) return null

  return (
    <DeferredRailMount minHeightClassName="min-h-[22rem] bg-white">
      <BestsellingRail products={rail} title={title} />
    </DeferredRailMount>
  )
}

export default BestsellingProducts
