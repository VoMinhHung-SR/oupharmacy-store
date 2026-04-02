import { useQuery } from '@tanstack/react-query'
import {
  getProducts,
  getProduct,
  getProductsByCategorySlug,
  getProductByCategoryAndProductSlug,
  ProductFilters,
  Product,
  ProductListResponse,
  CategoryProductsResponse,
} from '../services/products'

export function useProducts(filters?: ProductFilters, options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false
  return useQuery<ProductListResponse | undefined, Error>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await getProducts(filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled,
  })
}

export function useProduct(id: number | string | undefined) {
  const productId = typeof id === 'string' ? parseInt(id) : id

  return useQuery<Product | undefined, Error>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || isNaN(productId)) {
        throw new Error('Invalid product ID')
      }
      const response = await getProduct(productId)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!productId && !isNaN(productId),
  })
}

/**
 * Hook để lấy danh sách sản phẩm theo category slug từ URL path
 * @param categorySlug - Category slug (ví dụ: 'thuc-pham-chuc-nang')
 * @param filters - Optional filters (min_price, max_price, in_stock, page, page_size, etc.)
 */
export function useProductsByCategorySlug(
  categorySlug: string | undefined,
  filters?: Omit<ProductFilters, 'category'>
) {
  return useQuery<CategoryProductsResponse | undefined, Error>({
    queryKey: ['products-by-category-slug', categorySlug, filters],
    queryFn: async () => {
      if (!categorySlug) {
        throw new Error('Category slug is required')
      }
      const response = await getProductsByCategorySlug(categorySlug, filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!categorySlug,
  })
}

/**
 * Chi tiết sản phẩm theo category path + product slug (segment cuối URL).
 */
export function useProductByCategoryAndProductSlug(
  categorySlug: string | undefined,
  productSlug: string | undefined
) {
  return useQuery<Product | undefined, Error>({
    queryKey: ['product-by-category-product-slug', categorySlug, productSlug],
    queryFn: async () => {
      if (!categorySlug || !productSlug) {
        throw new Error('Category slug and product slug are required')
      }
      const response = await getProductByCategoryAndProductSlug(categorySlug, productSlug)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!categorySlug && !!productSlug,
  })
}
