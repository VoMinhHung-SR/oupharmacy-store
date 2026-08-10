'use client'

import React from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/cards/ProductCard'
import { HOME_MOCK_HOT_PRODUCTS } from '@/lib/homeMerchandising'

/** Hot-sale / bestsellers product rail. */
export const BestsellingProducts: React.FC = () => {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-accent-500 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-t-lg bg-accent-600 px-6 py-2 text-white shadow">
              <h2 className="text-lg font-bold sm:text-xl">Sản phẩm bán chạy</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {HOME_MOCK_HOT_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BestsellingProducts
