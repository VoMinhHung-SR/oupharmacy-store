import Link from 'next/link'
import React from 'react'

interface ProductCardProps {
  product: { id: string; name: string; price: number }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`} className="group rounded-lg border p-4 hover:shadow">
      <div className="aspect-square w-full rounded bg-gray-100" />
      <div className="mt-3 space-y-1">
        <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary-700">{product.name}</div>
        <div className="text-primary-700">{product.price.toLocaleString('vi-VN')}₫</div>
      </div>
    </Link>
  )
}

export default ProductCard


