import Link from 'next/link'
import React from 'react'
import { ProductCard } from '@/components/ProductCard'

export default function ProductsPage() {
  // Placeholder list (replace with real data fetching later)
  const demo = Array.from({ length: 12 }).map((_, i) => ({
    id: `p-${i + 1}`,
    name: `Sản phẩm ${i + 1}`,
    price: 100000 + i * 10000,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tất cả sản phẩm</h1>
        <Link href="/categories" className="text-sm text-primary-700">Xem danh mục</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {demo.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}


