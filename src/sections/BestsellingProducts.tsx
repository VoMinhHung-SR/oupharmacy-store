'use client'

import React, { useCallback, useRef } from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import hotSale from '@/api/mocks/home/hot-sale.response.json'
import type { HotSaleResponse } from '@/api/mocks/home/types'

const ARROW_CLASS =
  'absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary-600 shadow-md hover:bg-white sm:h-10 sm:w-10'

/** Hot-sale / bestsellers — mock top-12 rail with carousel (home fixture). */
export const BestsellingProducts: React.FC = () => {
  const data = hotSale as HotSaleResponse
  const products = (data.products || []).slice(0, 12)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }, [])

  if (products.length === 0) return null

  return (
    <section className="bg-white pb-8 pt-12 sm:pb-10 sm:pt-14" aria-label={data.title}>
      <Container>
        <div className="relative">
          <h2 className="hot-sale-tab">{data.title}</h2>

          <div className="relative rounded-2xl bg-[#f39800] px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-7">
            {products.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Sản phẩm trước"
                  className={`${ARROW_CLASS} left-1 sm:left-1.5`}
                  onClick={() => scrollPage(-1)}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Sản phẩm sau"
                  className={`${ARROW_CLASS} right-1 sm:right-1.5`}
                  onClick={() => scrollPage(1)}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <div
              ref={scrollerRef}
              className="hot-sale-track scrollbar-hide scroll-smooth"
            >
              {products.map((product) => (
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
