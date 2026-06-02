import React from 'react'
import Link from 'next/link'
import { Product, getProductEntity } from '@/lib/services/products'
import { getNearestParentCategory } from '@/lib/products/nearest-parent-category'
import { ProductCategoryOptionLink } from '@/components/products/shared/ProductCategoryOptionLink'

interface ProductDetailSpecsPanelProps {
  product: Product
  productName: string
  productPackaging: string
  categorySlug: string
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <span className="font-medium text-gray-700">{label}</span>{' '}
      <span className="font-medium text-gray-700">{children}</span>
    </div>
  )
}

export function ProductDetailSpecsPanel({
  product,
  productName,
  productPackaging,
  categorySlug,
}: ProductDetailSpecsPanelProps) {
  const productEntity = getProductEntity(product)
  const parentCategory = getNearestParentCategory(product, categorySlug)

  return (
    <div className="relative z-10 space-y-3 border-t border-gray-200 pt-4">
      {parentCategory ? (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          <span className="shrink-0 font-medium text-gray-700">Danh mục:</span>
          <ProductCategoryOptionLink name={parentCategory.name} href={parentCategory.href} />
        </div>
      ) : null}

      <SpecRow label="Tên chính hãng:">{productName}</SpecRow>

      {product.registration_number ? (
        <div className="text-sm">
          <span className="font-medium text-gray-700">Số đăng ký:</span>{' '}
          <span className="font-medium text-gray-700">{product.registration_number}</span>
          {product.link ? (
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 font-medium text-primary-600 underline hover:text-primary-700"
            >
              Xem giấy công bố sản phẩm
            </Link>
          ) : null}
        </div>
      ) : null}

      {productPackaging ? <SpecRow label="Quy cách:">{productPackaging}</SpecRow> : null}

      {product.manufacturer ? <SpecRow label="Nhà sản xuất:">{product.manufacturer}</SpecRow> : null}

      {product.origin ? <SpecRow label="Nước sản xuất:">{product.origin}</SpecRow> : null}

      {productEntity?.ingredients ? (
        <SpecRow label="Thành phần:">{productEntity.ingredients}</SpecRow>
      ) : null}

      {product.shelf_life ? <SpecRow label="Hạn sử dụng:">{product.shelf_life}</SpecRow> : null}
    </div>
  )
}
