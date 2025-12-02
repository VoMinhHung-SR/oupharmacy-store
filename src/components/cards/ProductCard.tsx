'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ImagePlaceholderIcon } from '@/components/icons'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    discount?: number
    image_url?: string
    packaging?: string
    medicine_unit_id?: number
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productLink = `/products/${product.medicine_unit_id || product.id}`
  const discount = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0)

  return (
    <Link
      href={productLink}
      className="group relative rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-all"
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </div>
      )}

      {/* Product image */}
      <div className="aspect-square w-full overflow-hidden rounded bg-gray-100 mb-3">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImagePlaceholderIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-2">
        <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary-700 min-h-[2.5rem]">
          {product.name}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-primary-700 font-bold text-base">
            {product.price.toLocaleString('vi-VN')}₫
          </div>
          <span className="text-xs text-gray-500">/ Hộp</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-gray-400 text-sm line-through ml-auto">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </div>
          )}
        </div>

        {product.packaging && (
          <div className="text-xs text-gray-500">{product.packaging}</div>
        )}

        <button
          type="button"
          className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            window.location.href = productLink
          }}
        >
          Chọn mua
        </button>
      </div>
    </Link>
  )
}

export default ProductCard


