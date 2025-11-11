import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image_url?: string
    packaging?: string
    medicine_unit_id?: number
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      href={`/products/${product.medicine_unit_id || product.id}`}
      className="group rounded-lg border p-4 hover:shadow transition-shadow"
    >
      <div className="aspect-square w-full overflow-hidden rounded bg-gray-100">
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
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
      <div className="mt-3 space-y-1">
        <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary-700">
          {product.name}
        </div>
        {product.packaging && (
          <div className="text-xs text-gray-500">{product.packaging}</div>
        )}
        <div className="text-primary-700 font-semibold">
          {product.price.toLocaleString('vi-VN')}₫
        </div>
      </div>
    </Link>
  )
}

export default ProductCard


