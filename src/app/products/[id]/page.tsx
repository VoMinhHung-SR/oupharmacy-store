"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { useProduct } from '@/lib/hooks/useProducts'
import { useCart } from '@/contexts/CartContext'

interface Props {
  params: { id: string }
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = params
  const router = useRouter()
  const { add } = useCart()
  const { data: product, isLoading: loading, error } = useProduct(id)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!product) return
    add(
      {
        id: product.id.toString(),
        medicine_unit_id: product.id,
        name: product.medicine.name,
        price: product.price,
        image_url: product.image_url,
        packaging: product.packaging,
      },
      quantity
    )
    // Show success message or toast here
  }

  const handleBuyNow = () => {
    if (!product) return
    add(
      {
        id: product.id.toString(),
        medicine_unit_id: product.id,
        name: product.medicine.name,
        price: product.price,
        image_url: product.image_url,
        packaging: product.packaging,
      },
      quantity
    )
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
            { label: 'Đang tải...' },
          ]}
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
            { label: 'Lỗi' },
          ]}
        />
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error.message || 'Không tìm thấy sản phẩm'}
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sản phẩm', href: '/products' },
          { label: product.medicine.name },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.medicine.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">{product.medicine.name}</h1>
            {product.packaging && (
              <div className="mt-1 text-sm text-gray-600">Quy cách: {product.packaging}</div>
            )}
            {product.brand && (
              <div className="mt-1 text-sm text-gray-600">Thương hiệu: {product.brand.name}</div>
            )}
            {product.category && (
              <div className="mt-1 text-sm text-gray-600">Danh mục: {product.category.name}</div>
            )}
          </div>
          <div className="text-3xl font-bold text-primary-700">
            {product.price.toLocaleString('vi-VN')}₫
          </div>
          {product.medicine.effect && (
            <div>
              <h3 className="font-semibold">Công dụng:</h3>
              <p className="text-sm text-gray-600">{product.medicine.effect}</p>
            </div>
          )}
          {product.medicine.contraindications && (
            <div>
              <h3 className="font-semibold">Chống chỉ định:</h3>
              <p className="text-sm text-gray-600">{product.medicine.contraindications}</p>
            </div>
          )}
          <div>
            <div className="mb-2 text-sm font-medium">
              Tồn kho: {product.in_stock > 0 ? `${product.in_stock} sản phẩm` : 'Hết hàng'}
            </div>
            {product.in_stock > 0 && (
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm font-medium">Số lượng:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded border hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.in_stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setQuantity(Math.max(1, Math.min(product.in_stock, val)))
                    }}
                    className="h-8 w-16 rounded border border-gray-300 bg-white text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.in_stock, quantity + 1))}
                    className="h-8 w-8 rounded border hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAddToCart} disabled={product.in_stock === 0}>
              Thêm vào giỏ
            </Button>
            <Button variant="outline" onClick={handleBuyNow} disabled={product.in_stock === 0}>
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


