import { apiGet } from '../api'

export interface Category {
  id: number
  name: string
  slug?: string
  parent?: number | null
  level?: number
  path?: string
  path_slug?: string
  category_array?: Array<{ name: string; slug: string }>
  active?: boolean
}

export async function getCategories() {
  return apiGet<Category[]>('/categories/')
}

export async function getCategory(id: number) {
  return apiGet<Category>(`/categories/${id}/`)
}

