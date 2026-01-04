import { ProductCard } from '@/components/cards/ProductCard'
import React from 'react'
import { PRICE_CONSULT } from '@/lib/constant'

interface Props {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q || '').trim()
  const results = q
    ? Array.from({ length: 6 }).map((_, i) => ({ 
        id: `s-${i}`, 
        name: `${q} – kết quả ${i + 1}`, 
        price: 100000 + i * 10000,
        price_display: String(100000 + i * 10000),
        medicine_unit_id: i + 1,
        in_stock: 10,
      }))
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Tìm kiếm: “{q}”</h1>
      {q && results.length === 0 && <div className="text-sm text-gray-600">Không tìm thấy sản phẩm.</div>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}


