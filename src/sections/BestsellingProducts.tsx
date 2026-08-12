'use client'

import React from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import hotSale from '@/api/mocks/home/hot-sale.response.json'
import type { HotSaleResponse } from '@/api/mocks/home/types'

/** Hot-sale / bestsellers — fixed section; data from `home/hot-sale.response.json`. */
export const BestsellingProducts: React.FC = () => {
  const data = hotSale as HotSaleResponse

  return (
    <section className="bg-white py-8 sm:py-10" aria-label={data.title}>
      <Container>
        <div className="overflow-hidden rounded-2xl bg-accent-500 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-t-lg bg-accent-600 px-6 py-2 text-white shadow">
              <h2 className="text-lg font-bold sm:text-xl">{data.title}</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BestsellingProducts
