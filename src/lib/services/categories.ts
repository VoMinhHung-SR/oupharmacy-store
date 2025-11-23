import { apiGet } from '../api'

export interface Category {
  id: number
  name: string
}

export async function getCategories() {
  return apiGet<Category[]>('/categories/')
}

export async function getCategory(id: number) {
  return apiGet<Category>(`/categories/${id}/`)
}

