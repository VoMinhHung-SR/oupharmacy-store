'use client'

import React, { useCallback, useRef } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import { HOME_MERCH_ORANGE } from '@/lib/constant'
import type { ProductCardPayload } from '@/lib/services/products'

const DEFAULT_TITLE = 'Sản phẩm bán chạy'

type BestsellingProductsProps = {
  products: ProductCardPayload[]
  title?: string
}

/** Hot-sale / bestsellers rail — priced products with per-card discount badge (home SSG). */
export const BestsellingProducts: React.FC<BestsellingProductsProps> = ({
  products,
  title = DEFAULT_TITLE,
}) => {
  const rail = (products || []).slice(0, 12)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }, [])

  if (rail.length === 0) return null

  return (
    <section className="bg-white pb-8 pt-12 sm:pb-10 sm:pt-14" aria-label={title}>
      <Container>
        <div className="relative">
          <h2 className="hot-sale-tab">{title}</h2>

          <div
            className="relative rounded-2xl px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7"
            style={{ backgroundColor: HOME_MERCH_ORANGE }}
          >
            {rail.length > 1 ? (
              <>
                <CarouselArrowButton
                  direction="prev"
                  label="Sản phẩm trước"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(-1)
                  }}
                />
                <CarouselArrowButton
                  direction="next"
                  label="Sản phẩm sau"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollPage(1)
                  }}
                />
              </>
            ) : null}

            <div
              ref={scrollerRef}
              className="hot-sale-track scrollbar-hide scroll-smooth"
            >
              {rail.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BestsellingProducts
