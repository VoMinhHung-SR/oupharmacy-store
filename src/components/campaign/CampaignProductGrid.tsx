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
    <section className="bg-gray-50 py-10 sm:py-12" aria-label={heading}>
      <Container>
        <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">{heading}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
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
