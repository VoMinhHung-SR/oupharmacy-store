'use client'

import { Product } from '@/lib/services/products'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import { ProductImageGallery } from '@/components/common/ProductImageGallery'
import { ProductDescriptionSection } from '@/components/catalog/product-detail/parts/ProductDescriptionSection'
import { RelatedProducts } from '@/components/catalog/product-detail/parts/RelatedProducts'
import { RecentlyViewed } from '@/components/catalog/product-detail/parts/RecentlyViewed'
import { useProductDetailPage } from '@/components/catalog/product-detail/useProductDetailPage'
import { ProductDetailInfoColumn } from '@/components/catalog/product-detail/parts/ProductDetailInfoColumn'
import { ProductStickyAddToCartBar } from '@/components/catalog/product-detail/parts/ProductStickyAddToCartBar'
import { ProductDetailPageSkeleton } from '@/components/catalog/product-detail/ProductDetailPageSkeleton'

interface ProductDetailPageContentProps {
  product: Product | undefined
  categorySlug: string
  productSlug: string
  loading?: boolean
  error?: Error | null
}

export function ProductDetailPageContent({
  product,
  categorySlug,
  productSlug,
  loading = false,
  error = null,
}: ProductDetailPageContentProps) {
  const state = useProductDetailPage({ product, categorySlug, productSlug, loading })

  if (loading) {
    return <ProductDetailPageSkeleton />
  }

  if (error || !product) {
    const message = error?.message
    return (
      <Container className="pb-6">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/tim-kiem' },
          ]}
          className="py-4"
        />
        <div className="rounded-lg bg-white p-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="mb-2 text-lg font-medium text-amber-800">
              {message ? 'Không thể tải thông tin sản phẩm' : 'Không tìm thấy sản phẩm'}
            </p>
            <p className="mb-4 text-sm text-amber-700">
              {message ||
                'Sản phẩm không tồn tại hoặc không thuộc danh mục trong đường dẫn URL này.'}
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="/"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white transition-colors hover:bg-amber-700"
              >
                Về trang chủ
              </a>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-50"
              >
                Tải lại
              </button>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="pb-28 md:pb-32">
      <Breadcrumb items={state.breadcrumbItems} className="py-4" />

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
    </Container>
  )
}
