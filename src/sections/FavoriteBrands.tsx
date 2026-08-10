'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import { HOME_MOCK_BRANDS } from '@/lib/homeMerchandising'

export const FavoriteBrands: React.FC = () => {
  return (
    <section className="bg-primary-50 py-10 sm:py-12">
      <Container>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thương hiệu yêu thích</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {HOME_MOCK_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={brand.href}
              className="w-48 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-500 hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-gray-50">
                {brand.productImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- catalog CDN
                  <img src={brand.productImage} alt="" className="h-full w-full object-contain p-3" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-gray-400">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 p-3 text-center">
                <div className="mx-auto mb-2 flex h-10 w-16 items-center justify-center rounded border border-gray-200 text-xs font-bold text-gray-700">
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
                <div className="mt-1 text-sm font-medium text-primary-600">Giảm đến {brand.discountPercent}%</div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FavoriteBrands
