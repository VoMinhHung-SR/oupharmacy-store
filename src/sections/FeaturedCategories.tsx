'use client'

import { CategoryIcon, ShieldCheckIcon } from '@/components/icons'
import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import featuredCategories from '@/api/mocks/home/featured-categories.response.json'
import type { FeaturedCategoriesResponse } from '@/api/mocks/home/types'

function slugFromCategoryHref(href: string): string {
  const cleaned = href.replace(/^\/+/, '')
  const parts = cleaned.split('/')
  // /categories/than-kinh-nao → than-kinh-nao
  return parts[parts.length - 1] || cleaned
}

/** Featured categories — fixed section; data from `home/featured-categories.response.json`. */
export const FeaturedCategories: React.FC = () => {
  const data = featuredCategories as FeaturedCategoriesResponse

  return (
    <section className="bg-white py-10 sm:py-12" aria-label={data.title}>
      <Container>
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-600">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {data.categories.slice(0, 12).map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary-500 hover:bg-primary-50 hover:shadow-lg"
            >
              <div className="mb-2 flex justify-center leading-none text-primary-600">
                <CategoryIcon
                  categorySlug={slugFromCategoryHref(category.href)}
                  className="h-10 w-10"
                />
              </div>
              <div className="mb-1 min-h-[2.5rem] text-center text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-700">
                {category.name}
              </div>
              <div className="text-center text-xs text-gray-600">{category.count} sản phẩm</div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default FeaturedCategories
