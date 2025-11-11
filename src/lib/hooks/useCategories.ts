import { useQuery } from '@tanstack/react-query'
import { getCategories, getCategory, Category } from '../services/categories'

export function useCategories() {
  return useQuery<Category[] | undefined, Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

export function useCategory(id: number) {
  return useQuery<Category | undefined, Error>({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await getCategory(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!id,
  })
}

