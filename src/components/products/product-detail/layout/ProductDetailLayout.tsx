'use client'

import { Product } from '@/lib/services/products'
import { ProductImageGallery } from '@/components/common/ProductImageGallery'
import { ProductDescriptionSection } from '@/components/products/shared/ProductDescriptionSection'
import { RelatedProducts } from '@/components/products/shared/RelatedProducts'
import { RecentlyViewed } from '@/components/products/shared/RecentlyViewed'
import { useProductDetailPage } from '@/components/products/product-detail/hooks/useProductDetailPage'
import { ProductDetailInfoColumn } from '@/components/products/product-detail/layout/ProductDetailInfoColumn'
import { ProductStickyAddToCartBar } from '@/components/products/product-detail/layout/ProductStickyAddToCartBar'

interface ProductDetailLayoutProps {
  product: Product
  state: ReturnType<typeof useProductDetailPage>
}

/** PDP body: hero card, description, related, sticky bar. */
export function ProductDetailLayout({ product, state }: ProductDetailLayoutProps) {
  return (
    <>
      <div className="space-y-6 rounded-lg bg-white p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <ProductImageGallery
            mainImage={state.productImageUrl ?? undefined}
            images={state.productImages}
            productName={state.productName}
          />
          <ProductDetailInfoColumn product={product} state={state} />
        </div>
      </div>

      <div className="mt-6">
        <ProductDescriptionSection product={product} />
      </div>

      <RelatedProducts currentProduct={product} />
      <RecentlyViewed />

      <ProductStickyAddToCartBar
        visible={state.showStickyPurchaseBar}
        productName={state.productName}
        imageUrl={state.productImageUrl}
        priceValue={state.effectivePriceValue}
        unitOptions={state.unitOptionsForSticky}
        selectedUnitId={state.selectedUnit?.unit_id ?? product.default_unit_id ?? null}
        onSelectUnit={state.setSelectedUnitId}
        quantity={state.quantity}
        maxQuantity={state.maxSelectableQuantity}
        onQuantityChange={state.handleQuantityChange}
        onAddToCart={state.handleAddToCart}
      />
    </>
  )
}
