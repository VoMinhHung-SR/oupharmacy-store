'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import React from 'react'
import Container from '@/components/Container'

interface Brand {
  id: string
  name: string
  image?: string
  discount: string
  href: string
}

const brands: Brand[] = [
  { id: '1', name: 'JpanWell', discount: 'Giảm đến 35%', href: '/brands/jpanwell' },
  { id: '2', name: 'Ocavill', discount: 'Giảm đến 20%', href: '/brands/ocavill' },
  { id: '3', name: 'BRAUER', discount: 'Giảm đến 20%', href: '/brands/brauer' },
  { id: '4', name: 'Vitamins For Life', discount: 'Giảm đến 20%', href: '/brands/vitamins-for-life' },
  { id: '5', name: 'VITABIOTICS', discount: 'Giảm đến 20%', href: '/brands/vitabiotics' },
]

export const FavoriteBrands: React.FC = () => {
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Thương hiệu yêu thích</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={createLink(brand.href)}
              className="flex-shrink-0 bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-primary-500 transition-all w-48"
            >
              <div className="aspect-square w-full bg-gray-100 rounded mb-4 flex items-center justify-center">
                {brand.image ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-4xl text-gray-400">{brand.name.charAt(0)}</div>
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 mb-2">{brand.name}</div>
                <div className="text-sm text-primary-600 font-medium">{brand.discount}</div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FavoriteBrands

