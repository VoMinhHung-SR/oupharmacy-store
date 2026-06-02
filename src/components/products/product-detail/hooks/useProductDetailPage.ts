'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CrumbItem } from '@/components/Breadcrumb'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useSectionStickyVisibility } from '@/lib/hooks/useSectionStickyVisibility'
import { PRICE_CONSULT } from '@/lib/constant'
import { toastWarning } from '@/lib/utils/toast'
import {
  Product,
  buildCategoryBreadcrumbFromPath,
  buildProductCanonicalHref,
  buildProductHref,
  getProductName,
  getProductPackaging,
  mapProductUnitOptionsForCart,
} from '@/lib/services/products'
import { saveToRecentlyViewed } from '@/components/products/shared/RecentlyViewed'

export const MAX_PURCHASE_QUANTITY = 99

interface UseProductDetailPageParams {
  product: Product | undefined
  categorySlug: string
  productSlug: string
  loading?: boolean
}

export function useProductDetailPage({
  product,
  categorySlug,
  productSlug,
  loading = false,
}: UseProductDetailPageParams) {
  const router = useRouter()
  const { add, items } = useCart()
  const { toggle: toggleWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null)
  const purchaseActionSectionRef = useRef<HTMLDivElement | null>(null)

  const productImages = product?.images || []
  const productImageUrl = product
    ? product.image_url || (productImages.length > 0 ? productImages[0] : null)
    : null
  const productName = product ? getProductName(product) : ''
  const productPackaging = product ? getProductPackaging(product) : ''
  const packagingVariants = useMemo(() => product?.variants ?? [], [product?.variants])
  const unitOptions = useMemo(() => product?.unit_options || [], [product?.unit_options])
  const selectedUnit =
    unitOptions.find((unit) => unit.unit_id === selectedUnitId) ||
    unitOptions.find((unit) => unit.is_default) ||
    unitOptions[0] ||
    null
  const effectivePriceValue = selectedUnit?.price_value ?? product?.price_value ?? 0
  const effectivePriceDisplay = selectedUnit?.price_display ?? product?.price_display
  const effectiveCompareAtPrice = selectedUnit?.compare_at_price ?? product?.compare_at_price ?? null
  const selectedUnitName = selectedUnit?.unit_name || productPackaging
  const isConsultPrice =
    effectivePriceDisplay === PRICE_CONSULT || String(effectivePriceValue) === PRICE_CONSULT

  const maxSelectableQuantity = product
    ? Math.min(product.in_stock, MAX_PURCHASE_QUANTITY)
    : MAX_PURCHASE_QUANTITY

  const showStickyPurchaseBar = useSectionStickyVisibility({
    targetRef: purchaseActionSectionRef,
    enabled: !loading && Boolean(product) && !isConsultPrice && (product?.in_stock ?? 0) > 0,
  })

  const getCartItem = () => {
    if (!product) throw new Error('Product is not available')
    return {
      id: product.id.toString(),
      variant_unit_id: product.id,
      product_variant_unit_id: selectedUnit?.unit_id ?? product.default_unit_id ?? undefined,
      unit_options: mapProductUnitOptionsForCart(unitOptions),
      name: productName,
      price: effectivePriceValue,
      image_url: productImageUrl || product.image_url,
      packaging: selectedUnitName,
    }
  }

  const validateStock = () => {
    if (!product) return false

    if (quantity > MAX_PURCHASE_QUANTITY) {
      toastWarning(`Số lượng tối đa cho mỗi lần mua là ${MAX_PURCHASE_QUANTITY} sản phẩm.`)
      return false
    }

    const selectedUnitIdForCart = selectedUnit?.unit_id ?? product.default_unit_id ?? null
    const existingItem = items.find(
      (i) =>
        i.variant_unit_id === product.id &&
        (i.product_variant_unit_id ?? null) === selectedUnitIdForCart
    )
    const currentQtyInCart = existingItem?.qty ?? 0
    const totalQty = currentQtyInCart + quantity

    if (product.in_stock === 0) {
      toastWarning('Sản phẩm đã hết hàng')
      return false
    }

    if (totalQty > product.in_stock) {
      toastWarning(
        `Số lượng vượt quá tồn kho. Hiện có ${product.in_stock} sản phẩm trong kho. Bạn đã có ${currentQtyInCart} sản phẩm trong giỏ hàng.`
      )
      return false
    }

    return { currentQtyInCart, totalQty }
  }

  const handleQuantityChange = (next: number) => {
    if (next > MAX_PURCHASE_QUANTITY) {
      toastWarning(`Số lượng tối đa cho mỗi lần mua là ${MAX_PURCHASE_QUANTITY} sản phẩm.`)
      setQuantity(Math.min(maxSelectableQuantity, MAX_PURCHASE_QUANTITY))
      return
    }
    setQuantity(Math.max(1, Math.min(maxSelectableQuantity, next)))
  }

  const handleAddToCart = () => {
    if (!product) return
    const validation = validateStock()
    if (!validation) return
    void add(getCartItem(), quantity)
  }

  const handleWishlistToggle = () => {
    if (!product) return

    toggleWishlist({
      id: product.id.toString(),
      variant_unit_id: product.id,
      product_variant_unit_id: selectedUnit?.unit_id ?? product.default_unit_id ?? undefined,
      name: productName,
      price: effectivePriceValue,
      price_display: effectivePriceDisplay || undefined,
      image_url: productImageUrl || product.image_url,
      packaging: selectedUnitName,
      category_slug: categorySlug,
      product_slug: productSlug,
    })
  }

  useEffect(() => {
    if (product) {
      saveToRecentlyViewed(product, categorySlug)
    }
  }, [product, categorySlug])

  useEffect(() => {
    if (!product || loading || typeof document === 'undefined') return
    const canonical = buildProductCanonicalHref(product)
    if (!canonical) return

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    link.href = `${origin}${canonical}`
  }, [product, loading])

  useEffect(() => {
    if (!unitOptions.length) {
      setSelectedUnitId(null)
      return
    }
    const defaultUnitId =
      unitOptions.find((unit) => unit.is_default)?.unit_id || unitOptions[0]?.unit_id || null
    setSelectedUnitId(defaultUnitId)
  }, [product?.id, unitOptions])

  const breadcrumbItems: CrumbItem[] = useMemo(() => {
    if (!product) {
      return [
        { label: 'Trang chủ', href: '/' },
        { label: 'Sản phẩm', href: '/tim-kiem' },
      ]
    }

    const items: CrumbItem[] = [{ label: 'Trang chủ', href: '/' }]
    buildCategoryBreadcrumbFromPath(categorySlug, product).forEach((segment) => {
      items.push({ label: segment.name, href: segment.href })
    })
    items.push({
      label: productName,
      href: buildProductHref(categorySlug, productSlug) ?? `/${categorySlug}/${productSlug}`,
    })
    return items
  }, [categorySlug, product, productName, productSlug])

  const productUrl =
    typeof window !== 'undefined' ? window.location.href : `/${categorySlug}/${productSlug}`

  const unitOptionsForSticky =
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

  return {
    router,
    product,
    categorySlug,
    productSlug,
    productImages,
    productImageUrl,
    productName,
    productPackaging,
    packagingVariants,
    unitOptions,
    selectedUnit,
    selectedUnitId,
    setSelectedUnitId,
    selectedUnitName,
    effectivePriceValue,
    effectiveCompareAtPrice,
    isConsultPrice,
    quantity,
    maxSelectableQuantity,
    purchaseActionSectionRef,
    showStickyPurchaseBar,
    handleQuantityChange,
    handleAddToCart,
    handleWishlistToggle,
    isInWishlist,
    breadcrumbItems,
    productUrl,
    unitOptionsForSticky,
  }
}
