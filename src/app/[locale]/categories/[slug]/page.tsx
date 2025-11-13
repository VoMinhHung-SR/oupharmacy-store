import React from 'react'
import { ProductCard } from '@/components/ProductCard'

interface Props {
  params: { slug: string }
}

export default function CategoryListingPage({ params }: Props) {
  const { slug } = params
  const demo = Array.from({ length: 8 }).map((_, i) => ({
    id: `${slug}-${i + 1}`,
    name: `SP ${i + 1} (${slug})`,
    price: 120000 + i * 5000,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Danh mục: {slug}</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {demo.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}


