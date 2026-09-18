'use client'

import { CategoryIcon, ShieldCheckIcon } from '@/components/icons'
import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import { SECTION_Y } from '@/lib/layout/pageLayout'
import featuredCategories from '@/api/mocks/home/featured-categories.response.json'
import type { FeaturedCategoriesResponse } from '@/api/mocks/home/types'

function catalogHrefFromFeatured(href: string): string {
  const parts = href.replace(/^\/+/, '').split('/').filter(Boolean)
  const slug = (parts[0] === 'categories' ? parts.slice(1) : parts).at(-1)
  return slug ? `/${slug}` : '/'
}

function slugFromCategoryHref(href: string): string {
  return catalogHrefFromFeatured(href).replace(/^\//, '')
}

/** Featured categories — fixture `home/featured-categories.response.json` (hrefs → catalog `/{slug}`). */
export const FeaturedCategories: React.FC = () => {
  const data = featuredCategories as FeaturedCategoriesResponse

  return (
    <section className={`bg-white ${SECTION_Y}`} aria-label={data.title}>
      <Container>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {data.categories.slice(0, 12).map((category) => {
            const href = catalogHrefFromFeatured(category.href)
            return (
              <Link
                key={href}
                href={href}
                className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary-500 hover:bg-primary-50 hover:shadow-lg"
              >
                <div className="mb-2 flex justify-center leading-none text-primary-600">
                  <CategoryIcon categorySlug={slugFromCategoryHref(category.href)} className="h-10 w-10" />
                </div>
                <div className="mb-1 min-h-[2.5rem] text-center text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-700">
                  {category.name}
                </div>
                <div className="text-center text-xs text-gray-600">{category.count} sản phẩm</div>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default FeaturedCategories
