import { Product } from '@/lib/services/products'
import { ProductBrandMeta } from '@/components/catalog/product-detail/parts/ProductBrandMeta'
import { ShareButton } from '@/components/catalog/product-detail/parts/ShareButton'

interface ProductDetailInfoHeaderProps {
  product: Product
  productName: string
  productUrl: string
  isInWishlist: boolean
  onWishlistToggle: () => void
}

export function ProductDetailInfoHeader({
  product,
  productName,
  productUrl,
  isInWishlist,
  onWishlistToggle,
}: ProductDetailInfoHeaderProps) {
  return (
    <>
      {product.brand ? (
        <div className="flex items-center justify-between gap-3">
          <ProductBrandMeta
            brandName={product.brand.name}
            brandCountry={product.brand.country}
            variant="pdp"
          />
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onWishlistToggle}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isInWishlist
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg className="h-4 w-4" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <ShareButton productName={productName} productUrl={productUrl} />
          </div>
        </div>
      ) : null}

      <h1 className="flex-1 text-2xl font-semibold leading-tight text-gray-900">{productName}</h1>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{product.id.toString().padStart(8, '0')}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>5</span>
        </span>
        <span>•</span>
        <span>1 đánh giá</span>
        <span>•</span>
        <span>9 bình luận</span>
      </div>
    </>
  )
}
