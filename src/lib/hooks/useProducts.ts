import { useQuery } from '@tanstack/react-query'
import { getProducts, getProduct, getProductsByCategorySlug, getProductByCategoryAndMedicineSlug, ProductFilters, Product, ProductListResponse, CategoryProductsResponse } from '../services/products'

export function useProducts(filters?: ProductFilters) {
  return useQuery<ProductListResponse | undefined, Error>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await getProducts(filters)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: true,
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
 * Hook để lấy chi tiết sản phẩm theo category slug và medicine slug
 * @param categorySlug - Category slug (ví dụ: 'thuc-pham-chuc-nang')
 * @param medicineSlug - Medicine slug (ví dụ: 'vitamin-c-1000mg')
 */
export function useProductByCategoryAndMedicineSlug(
  categorySlug: string | undefined,
  medicineSlug: string | undefined
) {
  return useQuery<Product | undefined, Error>({
    queryKey: ['product-by-category-medicine-slug', categorySlug, medicineSlug],
    queryFn: async () => {
      if (!categorySlug || !medicineSlug) {
        throw new Error('Category slug and medicine slug are required')
      }
      const response = await getProductByCategoryAndMedicineSlug(categorySlug, medicineSlug)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!categorySlug && !!medicineSlug,
  })
}

