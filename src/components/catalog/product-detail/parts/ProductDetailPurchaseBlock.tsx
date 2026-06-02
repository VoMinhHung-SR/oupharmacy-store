'use client'

import { RefObject } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Button } from '@/components/Button'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { ProductUnitOptionButton } from '@/components/catalog/product-detail/parts/ProductUnitOptionButton'
import { Product, ProductUnitOption } from '@/lib/services/products'
import { buildProductPathWithVariant } from '@/lib/store-path'

interface ProductDetailPurchaseBlockProps {
  product: Product
  categorySlug: string
  productSlug: string
  router: AppRouterInstance
  isConsultPrice: boolean
  packagingVariants: Product['variants']
  effectivePriceValue: number
  effectiveCompareAtPrice: number | null
  selectedUnitName: string
  unitOptions: ProductUnitOption[]
  selectedUnit: ProductUnitOption | null
  onSelectUnit: (unitId: number) => void
  quantity: number
  maxSelectableQuantity: number
  onQuantityChange: (value: number) => void
  onAddToCart: () => void
  purchaseActionSectionRef: RefObject<HTMLDivElement>
}

export function ProductDetailPurchaseBlock({
  product,
  categorySlug,
  productSlug,
  router,
  isConsultPrice,
  packagingVariants,
  effectivePriceValue,
  effectiveCompareAtPrice,
  selectedUnitName,
  unitOptions,
  selectedUnit,
  onSelectUnit,
  quantity,
  maxSelectableQuantity,
  onQuantityChange,
  onAddToCart,
  purchaseActionSectionRef,
}: ProductDetailPurchaseBlockProps) {
  if (isConsultPrice) {
    return (
      <>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => {}} className="w-full" size="lg">
            Tư vấn ngay
          </Button>
          <Button variant="outline" onClick={() => {}} className="w-full" size="lg">
            Tìm nhà thuốc
          </Button>
        </div>
      </>
    )
  }

  const displayUnitOptions =
    unitOptions.length > 0
      ? unitOptions
      : [
          {
            unit_id: 0,
            unit_name: selectedUnitName || 'Mặc định',
            price_value: effectivePriceValue,
            quantity_in_base: 1,
          },
        ]

  return (
    <>
      {packagingVariants && packagingVariants.length > 1 ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Chọn quy cách</label>
          <div className="flex flex-wrap gap-2">
            {packagingVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  router.replace(buildProductPathWithVariant(categorySlug, productSlug, variant.id))
                }}
                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium ${
                  product.id === variant.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {variant.packing || `Variant ${variant.id}`}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <div className="text-3xl font-bold text-primary-700">
          {effectivePriceValue.toLocaleString('vi-VN')}₫
          {selectedUnitName ? (
            <span className="text-2xl font-semibold text-primary-700"> / {selectedUnitName}</span>
          ) : null}
        </div>
        {effectiveCompareAtPrice && effectiveCompareAtPrice > effectivePriceValue ? (
          <div className="text-base text-gray-400 line-through">
            {effectiveCompareAtPrice.toLocaleString('vi-VN')}₫
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="shrink-0 text-sm font-medium text-gray-700">Chọn đơn vị tính</span>
        <div className="ml-2 flex flex-wrap gap-2 md:ml-3">
          {displayUnitOptions.map((unit) => {
            const isSelected =
              (selectedUnit?.unit_id ?? product.default_unit_id ?? 0) === unit.unit_id
            return (
              <ProductUnitOptionButton
                key={unit.unit_id}
                label={unit.unit_name}
                selected={isSelected}
                onSelect={() => onSelectUnit(unit.unit_id)}
              />
            )
          })}
        </div>
      </div>

      {product.in_stock > 0 ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Chọn số lượng</label>
          <div className="flex min-w-0 items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={maxSelectableQuantity}
              onChange={onQuantityChange}
              size="lg"
            />
            <Button
              onClick={onAddToCart}
              disabled={product.in_stock === 0}
              className="h-12 flex-1 rounded-xl"
              size="lg"
            >
              Thêm vào giỏ
            </Button>
          </div>
          <div ref={purchaseActionSectionRef} className="h-px w-full" aria-hidden="true" />
        </div>
      ) : null}
    </>
  )
}
