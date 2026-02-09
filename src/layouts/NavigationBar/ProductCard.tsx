'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { ProductMinimal } from './types'

export interface ProductCardProps {
  product: ProductMinimal
  onNavigate: () => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  return (
    <Link
      href={product.web_slug}
      onClick={() => onNavigate()}
      className="flex flex-col gap-2 p-2 border-2 border-transparent hover:border-primary-500 rounded-lg transition-colors group"
    >
      <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={160}
            height={160}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-[32px] group-hover:text-primary-700 transition-colors">
          {product.name}
        </h4>
        <div className="flex flex-col overflow-hidden">
          <span
            className="text-sm font-bold text-primary-700 truncate whitespace-nowrap"
            title={
              product.price_value === 0
                ? 'Tư vấn'
                : `${product.price_value.toLocaleString('vi-VN')}đ / ${product.package_size || 'Hộp'}`
            }
          >
            {product.price_value === 0
              ? 'Tư vấn'
              : `${product.price_value.toLocaleString('vi-VN')}đ / ${product.package_size || 'Hộp'}`}
          </span>
          {product.original_price_value &&
            product.original_price_value > product.price_value && (
              <span className="text-xs text-gray-400 line-through truncate whitespace-nowrap">
                {product.original_price_value.toLocaleString('vi-VN')}đ
              </span>
            )}
        </div>
      </div>
    </Link>
  )
}
