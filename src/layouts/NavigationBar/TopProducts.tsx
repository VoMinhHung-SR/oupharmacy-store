'use client'

import Link from 'next/link'
import React from 'react'
import type { ProductMinimal } from './types'
import { ProductCard } from './ProductCard'

export interface TopProductsProps {
  products: ProductMinimal[]
  categoryHref: string
  onNavigate: () => void
}

export const TopProducts: React.FC<TopProductsProps> = ({
  products,
  categoryHref,
  onNavigate,
}) => {
  if (!products || products.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">Bán chạy nhất</h3>
          <span className="h-4 w-[1px] bg-gray-300" />
          <Link
            href={categoryHref}
            className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
          >
            Xem tất cả
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}
