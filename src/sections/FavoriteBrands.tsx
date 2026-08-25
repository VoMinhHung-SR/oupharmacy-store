'use client'

import Link from 'next/link'
import React, { useCallback, useRef } from 'react'
import Container from '@/components/Container'
import { CarouselArrowButton } from '@/components/carousel/CarouselArrowButton'
import type { FavoriteBrandCard } from '@/lib/services/brandCampaigns'

const DEFAULT_TITLE = 'Thương hiệu yêu thích'

const ARROW_ON_LIGHT =
  '!bg-white !text-primary-700 shadow-md ring-1 ring-gray-200 hover:!bg-gray-50'

type FavoriteBrandsProps = {
  brands: FavoriteBrandCard[]
  title?: string
}

/** Favorite brands — classic card: product image → logo frame → promo line. */
export const FavoriteBrands: React.FC<FavoriteBrandsProps> = ({
  brands,
  title = DEFAULT_TITLE,
}) => {
  const rail = [...(brands || [])].sort((a, b) => b.discountPercent - a.discountPercent)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollPage = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }, [])

  if (rail.length === 0) return null

  return (
    <section className="bg-gray-50 py-12 sm:py-14" aria-label={title}>
      <Container>
        <div className="mb-8 flex items-center gap-2 sm:mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        <div className="relative">
          {rail.length > 1 ? (
            <>
              <CarouselArrowButton
                direction="prev"
                label="Thương hiệu trước"
                className={ARROW_ON_LIGHT}
                onClick={(e) => {
                  e.preventDefault()
                  scrollPage(-1)
                }}
              />
              <CarouselArrowButton
                direction="next"
                label="Thương hiệu sau"
                className={ARROW_ON_LIGHT}
                onClick={(e) => {
                  e.preventDefault()
                  scrollPage(1)
                }}
              />
            </>
          ) : null}

          <div ref={scrollerRef} className="favorite-brands-track scrollbar-hide scroll-smooth">
            {rail.map((brand) => (
              <Link
                key={brand.id}
                href={brand.href}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-primary-500 hover:shadow-lg sm:p-4"
              >
                {/* Product image — padded, object-contain (classic rail). */}
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-white">
                  {brand.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- catalog CDN hosts vary
                    <img
                      src={brand.productImage}
                      alt=""
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-4xl font-bold text-gray-300">
                      {brand.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Logo frame — logo when present, else brand name as placeholder. */}
                <div className="mb-2.5 flex h-12 w-full items-center justify-center rounded-md border border-gray-200 bg-white px-2 sm:h-14">
                  {brand.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- brand CDN hosts vary
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-h-9 w-auto max-w-full object-contain sm:max-h-10"
                    />
                  ) : (
                    <span className="line-clamp-2 text-center text-xs font-semibold leading-tight text-gray-800 sm:text-sm">
                      {brand.name}
                    </span>
                  )}
                </div>

                <p className="text-center text-sm font-medium text-primary-600">
                  Giảm đến {brand.discountPercent}%
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FavoriteBrands
