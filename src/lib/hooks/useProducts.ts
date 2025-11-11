import { useQuery } from '@tanstack/react-query'
import { getProducts, getProduct, ProductFilters, Product, ProductListResponse } from '../services/products'

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

