'use client'

import { ProductCard } from '@/components/cards/ProductCard'
import Container from '@/components/Container'
import {
  buildProductCardPayload,
  getListProductKey,
  type Product,
} from '@/lib/services/products'

export interface CampaignProductGridProps {
  products: Product[]
  heading: string
}

export function CampaignProductGrid({ products, heading }: CampaignProductGridProps) {
  if (!products.length) return null

  return (
    <section id="campaign-products" className="bg-white py-8 sm:py-10" aria-label={heading}>
      <Container>
        <h2 className="mb-5 text-lg font-bold text-gray-900 sm:text-xl">{heading}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={getListProductKey(product)}
              product={buildProductCardPayload(product)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CampaignProductGrid
