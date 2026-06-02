'use client'

import { Product } from '@/lib/services/products'
import { useProductDetailPage } from '@/components/products/product-detail/hooks/useProductDetailPage'
import { ProductDetailInfoHeader } from '@/components/products/product-detail/layout/ProductDetailInfoHeader'
import { ProductDetailPurchaseBlock } from '@/components/products/product-detail/layout/ProductDetailPurchaseBlock'
import { ProductDetailSpecsPanel } from '@/components/products/product-detail/layout/ProductDetailSpecsPanel'
import { ProductDetailPoliciesBox } from '@/components/products/product-detail/layout/ProductDetailPoliciesBox'

type ProductDetailPageState = ReturnType<typeof useProductDetailPage>

interface ProductDetailInfoColumnProps {
  product: Product
  state: ProductDetailPageState
}

export function ProductDetailInfoColumn({ product, state }: ProductDetailInfoColumnProps) {
  return (
    <div className="space-y-6">
      <ProductDetailInfoHeader
        product={product}
        productName={state.productName}
        productUrl={state.productUrl}
        isInWishlist={state.isInWishlist(product.id)}
        onWishlistToggle={state.handleWishlistToggle}
      />

      <ProductDetailPurchaseBlock
        product={product}
        categorySlug={state.categorySlug}
        productSlug={state.productSlug}
        router={state.router}
        isConsultPrice={state.isConsultPrice}
        packagingVariants={state.packagingVariants}
        effectivePriceValue={state.effectivePriceValue}
        effectiveCompareAtPrice={state.effectiveCompareAtPrice}
        selectedUnitName={state.selectedUnitName}
        unitOptions={state.unitOptions}
        selectedUnit={state.selectedUnit}
        onSelectUnit={state.setSelectedUnitId}
        quantity={state.quantity}
        maxSelectableQuantity={state.maxSelectableQuantity}
        onQuantityChange={state.handleQuantityChange}
        onAddToCart={state.handleAddToCart}
        purchaseActionSectionRef={state.purchaseActionSectionRef}
      />

      <ProductDetailSpecsPanel
        product={product}
        productName={state.productName}
        productPackaging={state.productPackaging}
        categorySlug={state.categorySlug}
      />

      <ProductDetailPoliciesBox />
    </div>
  )
}
