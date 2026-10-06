'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import {
  Product,
  buildCategoryBreadcrumbFromPath,
  buildProductCanonicalHref,
  getProductImageUrl,
  getProductName,
} from '@/lib/services/products'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import { ProductImageGallery } from '@/components/common/ProductImageGallery'
import { useProductDetailPage } from '@/components/catalog/product-detail/useProductDetailPage'
import { ProductDetailInfoColumn } from '@/components/catalog/product-detail/parts/ProductDetailInfoColumn'
import { ProductDetailPageSkeleton } from '@/components/catalog/product-detail/ProductDetailPageSkeleton'
import { DeferredRailMount } from '@/components/carousel/ProgressiveRailItem'
import { JsonLd } from '@/components/seo/JsonLd'

const ProductDetailPoliciesBox = dynamic(
  () =>
    import('@/components/catalog/product-detail/parts/ProductDetailPoliciesBox').then((m) => ({
      default: m.ProductDetailPoliciesBox,
    })),
  { ssr: false, loading: () => <div className="min-h-[5rem]" aria-hidden /> }
)

const ProductStickyAddToCartBar = dynamic(
  () =>
    import('@/components/catalog/product-detail/parts/ProductStickyAddToCartBar').then((m) => ({
      default: m.ProductStickyAddToCartBar,
    })),
  { ssr: false, loading: () => null }
)

const ProductDescriptionSection = dynamic(
  () =>
    import('@/components/catalog/product-detail/parts/ProductDescriptionSection').then((m) => ({
      default: m.ProductDescriptionSection,
    })),
  { loading: () => <div className="mt-6 min-h-[8rem] rounded-lg bg-white" aria-hidden /> }
)

const RelatedProducts = dynamic(
  () =>
    import('@/components/catalog/product-detail/parts/RelatedProducts').then((m) => ({
      default: m.RelatedProducts,
    })),
  { ssr: false, loading: () => <div className="min-h-[16rem]" aria-hidden /> }
)

const RecentlyViewed = dynamic(
  () =>
    import('@/components/catalog/product-detail/parts/RecentlyViewed').then((m) => ({
      default: m.RecentlyViewed,
    })),
  { ssr: false, loading: () => null }
)

interface ProductDetailPageContentProps {
  product: Product | undefined
  categorySlug: string
  productSlug: string
  loading?: boolean
  error?: Error | null
}

function buildProductJsonLd(product: Product, categorySlug: string) {
  const name = getProductName(product)
  const image = getProductImageUrl(product)
  const canonical = buildProductCanonicalHref(product)
  const path = canonical || `/${categorySlug}/${product.product?.slug || ''}`.replace(/\/+/g, '/')
  const crumbs = [
    { name: 'Trang chủ', item: '/' },
    ...buildCategoryBreadcrumbFromPath(categorySlug, product).map((s) => ({
      name: s.name,
      item: s.href,
    })),
    { name, item: path },
  ]

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description:
      product.product?.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ||
      undefined,
    image: image || undefined,
    sku: product.product?.mid || String(product.product_entity_id ?? product.id),
    brand: product.brand?.name
      ? { '@type': 'Brand', name: product.brand.name }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: path,
      priceCurrency: 'VND',
      price: product.price_value ?? undefined,
      availability:
        product.in_stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  }

  return [productLd, breadcrumbLd]
}

export function ProductDetailPageContent({
  product,
  categorySlug,
  productSlug,
  loading = false,
  error = null,
}: ProductDetailPageContentProps) {
  const state = useProductDetailPage({ product, categorySlug, productSlug, loading })
  const jsonLd = useMemo(
    () => (product ? buildProductJsonLd(product, categorySlug) : null),
    [product, categorySlug]
  )

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
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <Breadcrumb
        items={state.breadcrumbItems}
        className="py-4 max-md:[&_ol>li:last-child]:hidden max-md:[&_ol>li:nth-last-child(2)>span:last-child]:hidden"
        maxItemLength={20}
      />

      <div className="space-y-4 rounded-lg bg-white p-3 sm:space-y-6 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
            <ProductImageGallery
              mainImage={state.productImageUrl ?? undefined}
              images={state.productImages}
              productName={state.productName}
            />
            <ProductDetailPoliciesBox />
          </div>
          <ProductDetailInfoColumn product={product} state={state} />
        </div>
      </div>

      <DeferredRailMount minHeightClassName="mt-6 min-h-[8rem]" rootMargin="120px 0px">
        <ProductDescriptionSection product={product} />
      </DeferredRailMount>

      <DeferredRailMount minHeightClassName="min-h-[16rem]" rootMargin="200px 0px">
        <RelatedProducts currentProduct={product} />
      </DeferredRailMount>
      <DeferredRailMount minHeightClassName="min-h-0" rootMargin="200px 0px">
        <RecentlyViewed />
      </DeferredRailMount>

      {state.showStickyPurchaseBar ? (
        <ProductStickyAddToCartBar
          visible
          productName={state.productName}
          imageUrl={state.productImageUrl}
          priceValue={state.effectivePriceValue}
          compareAtPrice={state.catalogPriceDisplay.compareAtPrice}
          discountPercent={state.catalogPriceDisplay.discountPercent}
          unitOptions={state.unitOptionsForSticky}
          selectedUnitId={state.selectedUnit?.unit_id ?? product.default_unit_id ?? null}
          onSelectUnit={state.setSelectedUnitId}
          quantity={state.quantity}
          maxQuantity={state.maxSelectableQuantity}
          onQuantityChange={state.handleQuantityChange}
          onAddToCart={state.handleAddToCart}
          addToCartLabel={
            product.in_stock <= 0 && product.allow_preorder ? 'Đặt trước' : 'Thêm vào giỏ'
          }
        />
      ) : null}
    </Container>
  )
}
