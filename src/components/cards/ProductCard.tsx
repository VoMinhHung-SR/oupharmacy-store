'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { ImagePlaceholderIcon } from '@/components/icons'
import { PRICE_CONSULT, STORE_SUPPORT } from '@/lib/constant'
import { useCart } from '@/contexts/CartContext'
import { toastWarning } from '@/lib/utils/toast'
import { CardBadge } from '@/components/badges/CardBadge'
import {
  CARD_CORNER_TAB_IMAGE_CLEARANCE,
  cardCornerTabLeftOverlayClass,
  cardCornerTabRightPromoClass,
} from '@/components/badges/cardCornerStyles'
import { mapProductUnitOptionsForCart, type ProductUnitOption } from '@/lib/services/products'
import { formatUpcomingPriceTeaser } from '@/lib/services/homeMerch'
import { catalogDiscountPercentFromListSale } from '@/lib/utils/cartPricing'
import { formatVnd } from '@/lib/utils/currency'
import { markStoreNavIntent } from '@/lib/store-path/nav-intent'
import { ProductCardMerchRailCta } from '@/components/cards/ProductCardMerchRailCta'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price_display?: string
    price: number
    originalPrice?: number
    discount?: number
    image_url?: string
    packaging?: string
    variant_unit_id?: number
    product_variant_unit_id?: number
    unit_options?: ProductUnitOption[]
    default_unit_name?: string
    category_slug?: string
    product_slug?: string
    href?: string
    in_stock?: number
    variant_count?: number
    brand_name?: string
    brand_country?: string | null
    /** Flash upcoming window — badge `-xx%`, masked price (D-01). */
    discountTeaser?: boolean
  }
  ctaVariant?: 'addToCart' | 'viewDetail'
  merchShockOffer?: 'off' | 'compact'
}

const getProductLink = (product: ProductCardProps['product']): string | null =>
  product.href ?? null

/** Sale unit for `price / Hộp` — unit_name, else first word of packaging. */
function unitSaleLabel(unitName?: string, packaging?: string): string | undefined {
  const named = unitName?.trim()
  if (named) return named
  const first = packaging?.trim().split(/\s+/)[0]
  return first || undefined
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  ctaVariant = 'addToCart',
  merchShockOffer = 'off',
}) => {
  const productLink = useMemo(() => getProductLink(product), [product])
  const { add, items } = useCart()
  const unitOptions = useMemo(() => product.unit_options || [], [product.unit_options])
  const defaultUnitId = useMemo(() => {
    if (!unitOptions.length) return product.product_variant_unit_id
    return unitOptions.find((unit) => unit.is_default)?.unit_id || unitOptions[0]?.unit_id
  }, [unitOptions, product.product_variant_unit_id])
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(defaultUnitId)
  const selectedUnit = useMemo(
    () => unitOptions.find((unit) => unit.unit_id === selectedUnitId) || unitOptions[0],
    [unitOptions, selectedUnitId]
  )
  const unitGridClassName = useMemo(() => {
    const count = unitOptions.length
    if (count === 2) return 'grid-cols-2'
    if (count === 3) return 'grid-cols-3'
    if (count === 4) return 'grid-cols-2'
    return 'grid-cols-3'
  }, [unitOptions.length])
  const unitLabel = unitSaleLabel(selectedUnit?.unit_name || product.default_unit_name, product.packaging)
  const salePrice = selectedUnit?.price_value ?? product.price
  const catalogCompareAt = selectedUnit?.compare_at_price ?? null
  const hasCatalogCompare =
    catalogCompareAt != null && catalogCompareAt > salePrice
  /** Home merch (flash live): synthetic compare on card when unit has no catalog compare_at. */
  const merchAppliesToUnit =
    !hasCatalogCompare &&
    !product.discountTeaser &&
    (product.discount ?? 0) > 0 &&
    salePrice === product.price
  const displayCompareAt = hasCatalogCompare
    ? catalogCompareAt
    : merchAppliesToUnit && product.originalPrice != null && product.originalPrice > salePrice
      ? product.originalPrice
      : null
  const discount = useMemo(() => {
    if (product.discountTeaser) return 0
    if (displayCompareAt != null && displayCompareAt > salePrice) {
      return catalogDiscountPercentFromListSale(displayCompareAt, salePrice)
    }
    if (merchAppliesToUnit && product.discount != null && product.discount > 0) {
      return Math.round(product.discount)
    }
    return 0
  }, [
    displayCompareAt,
    merchAppliesToUnit,
    product.discount,
    product.discountTeaser,
    salePrice,
  ])

  const isConsultPrice = useMemo(
    () =>
      (selectedUnit?.price_display || product.price_display) === PRICE_CONSULT ||
      String(selectedUnit?.price_value ?? product.price) === PRICE_CONSULT,
    [product.price_display, product.price, selectedUnit]
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isConsultPrice) {
      return
    }

    if (!product.variant_unit_id) return

    const inStock = product.in_stock ?? 0
    const selectedUnitIdForCart = selectedUnit?.unit_id ?? product.product_variant_unit_id ?? null
    const existingItem = items.find(
      (i) =>
        i.variant_unit_id === product.variant_unit_id &&
        (i.product_variant_unit_id ?? null) === selectedUnitIdForCart
    )
    const currentQtyInCart = existingItem?.qty ?? 0
    const totalQty = currentQtyInCart + 1

    if (inStock === 0) {
      toastWarning('Sản phẩm đã hết hàng')
      return
    }

    if (totalQty > inStock) {
      toastWarning(
        `Số lượng vượt quá tồn kho. Hiện có ${inStock} sản phẩm trong kho. Bạn đã có ${currentQtyInCart} sản phẩm trong giỏ hàng.`
      )
      return
    }

    add(
      {
        id: product.id,
        variant_unit_id: product.variant_unit_id,
        product_variant_unit_id: selectedUnit?.unit_id ?? product.product_variant_unit_id,
        unit_options: mapProductUnitOptionsForCart(unitOptions),
        name: product.name,
        price: selectedUnit?.price_value ?? product.price,
        image_url: product.image_url,
        packaging: selectedUnit?.unit_name || product.packaging,
      },
      1
    )
  }

  const handleConsult = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = STORE_SUPPORT.CONSULT_HREF
  }

  const handleFindPharmacy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = STORE_SUPPORT.PHARMACY_FINDER_HREF
  }

  // Nếu không có link, hiển thị thông báo thay vì crash
  if (!productLink) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Sản phẩm tạm thời không khả dụng</p>
          <p className="text-xs text-gray-500">Thông tin sản phẩm đang được cập nhật</p>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={productLink}
      onClick={() => markStoreNavIntent('product', productLink)}
      className="group relative flex h-full flex-col rounded-xl bg-white transition-shadow duration-200 hover:shadow-lg"
    >
      {/* Flush corner badges (z-10); border overlay (z-20) so edges stay visible idle + hover. */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl">
        {product.brand_country ? (
          <CardBadge
            country={product.brand_country}
            variant="corner"
            className={cardCornerTabLeftOverlayClass}
          />
        ) : null}
        {product.discountTeaser ? (
          <span className={cardCornerTabRightPromoClass}>-xx%</span>
        ) : discount > 0 ? (
          <span className={cardCornerTabRightPromoClass}>-{discount}%</span>
        ) : null}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-xl shadow-[inset_0_0_0_1px_theme(colors.gray.200)] transition-[box-shadow] duration-200 group-hover:shadow-[inset_0_0_0_2px_theme(colors.primary.400)]"
        />

        <div className="relative z-0 flex min-h-0 flex-1 flex-col p-3 sm:p-4">
          <div className="relative shrink-0">
            <div
              className={`mb-2.5 aspect-square w-full rounded-lg bg-white p-1 ${CARD_CORNER_TAB_IMAGE_CLEARANCE}`.trim()}
            >
              <div className="relative h-full w-full overflow-hidden rounded-md bg-white">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 text-gray-400">
                    <ImagePlaceholderIcon className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
              {product.name}
            </div>

            {isConsultPrice ? (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                <p className="text-xs text-amber-800">
                  <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
                </p>
              </div>
            ) : (
              <div className="mt-2 space-y-1">
                <div className="min-w-0">
                  {product.discountTeaser ? (
                    <>
                      <div className="flex min-h-[1.5rem] flex-wrap items-baseline gap-x-1">
                        <span className="text-base font-bold tabular-nums text-primary-700">
                          {product.variant_count && product.variant_count > 1 ? 'Từ ' : ''}
                          {formatUpcomingPriceTeaser(salePrice)}
                        </span>
                        {unitLabel ? (
                          <span className="text-sm font-semibold text-primary-700">/ {unitLabel}</span>
                        ) : null}
                      </div>
                      <div className="text-xs tabular-nums text-gray-400 line-through">
                        {formatVnd(salePrice)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex min-h-[1.5rem] flex-wrap items-baseline gap-x-1">
                        <span className="text-base font-bold tabular-nums text-primary-700">
                          {product.variant_count && product.variant_count > 1 ? 'Từ ' : ''}
                          {formatVnd(salePrice)}
                        </span>
                        {unitLabel ? (
                          <span className="text-sm font-semibold text-primary-700">/ {unitLabel}</span>
                        ) : null}
                      </div>
                      {displayCompareAt != null ? (
                        <div className="text-xs tabular-nums text-gray-400 line-through">
                          {formatVnd(displayCompareAt)}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                <div className="min-h-[1rem] truncate text-xs text-gray-500">
                  {product.packaging || '\u00a0'}
                </div>

                {unitOptions.length > 1 ? (
                  <div className={`grid w-full ${unitGridClassName} gap-1 pt-1`}>
                    {unitOptions.map((unit) => (
                      <button
                        key={unit.unit_id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedUnitId(unit.unit_id)
                        }}
                        className={`h-7 rounded-md border px-2 text-center text-xs transition-colors ${
                          (selectedUnit?.unit_id ?? defaultUnitId) === unit.unit_id
                            ? 'border-primary-600 bg-white text-primary-700'
                            : 'border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {unit.unit_name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            <div className={`mt-auto pt-3 ${isConsultPrice ? 'flex flex-col gap-1.5' : ''}`}>
              {isConsultPrice ? (
                <>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                    onClick={handleConsult}
                  >
                    Tư vấn ngay
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-gray-100 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    onClick={handleFindPharmacy}
                  >
                    Tìm nhà thuốc
                  </button>
                </>
              ) : ctaVariant === 'viewDetail' ? (
                <ProductCardMerchRailCta shockOffer={merchShockOffer} />
              ) : (
                <button
                  type="button"
                  className="w-full rounded-xl bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
