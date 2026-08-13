'use client'

import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import flashSale from '@/api/mocks/home/flash-sale.response.json'
import type { FlashSaleResponse } from '@/api/mocks/home/types'

/**
 * Flash sale rail — fixed frame; payload from `home/flash-sale.response.json`.
 * D-23: hide when enabled=false or products empty. Does not overwrite catalog price (D-01).
 */
export const FlashSaleProducts: React.FC = () => {
  const data = flashSale as FlashSaleResponse
  const enabled = data.enabled !== false
  const products = data.products || []
  if (!enabled || products.length === 0) return null

  const activeId = data.active_window_id

  return (
    <section className="bg-white py-8 sm:py-10" aria-label={data.title}>
      <Container>
        <div className="overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{data.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2" role="list" aria-label="Khung giờ">
                {data.windows.map((win) => {
                  const isActive = win.id === activeId
                  return (
                    <span
                      key={win.id}
                      role="listitem"
                      className={
                        isActive
                          ? 'rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white'
                          : 'rounded-lg border border-primary-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-800'
                      }
                    >
                      {win.label}
                    </span>
                  )
                })}
              </div>
            </div>
            <Link
              href={data.cta_url}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {data.cta_label}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default FlashSaleProducts
