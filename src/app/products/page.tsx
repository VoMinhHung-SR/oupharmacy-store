"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { useProducts } from '@/lib/hooks/useProducts'
import { ProductFilters } from '@/lib/services/products'

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, page_size: 12 })
  const { data, isLoading, error } = useProducts(filters)

  const products = data?.results || []
  const loading = isLoading

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Tất cả sản phẩm</h1>
          <Link href="/categories" className="text-sm text-primary-700">Xem danh mục</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Tất cả sản phẩm</h1>
          <Link href="/categories" className="text-sm text-primary-700">Xem danh mục</Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Lỗi khi tải sản phẩm: {error.message || 'Đã xảy ra lỗi'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tất cả sản phẩm</h1>
        <Link href="/categories" className="text-sm text-primary-700">Xem danh mục</Link>
      </div>
      {products.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-600">
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id.toString(),
                name: product.medicine.name,
                price: product.price,
                image_url: product.image_url,
                packaging: product.packaging,
                medicine_unit_id: product.id,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}


