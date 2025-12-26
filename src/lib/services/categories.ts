import { apiGet } from '../api'

export interface CategoryLevel2 {
  id: number
  name: string
  slug: string
  path_slug: string
  total?: number
}

export interface CategoryLevel1 {
  id: number
  name: string
  slug: string
  path_slug: string
  level2: CategoryLevel2[]
}

export interface CategoryLevel0 {
  id: number
  name: string
  slug: string
  path_slug: string
  level1: CategoryLevel1[]
}

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

/**
 * Server-side function để fetch categories cho SSG
 * Sử dụng fetch trực tiếp thay vì axios để tránh interceptors
 * 
 * SSG: Static Site Generation - fetch tại build time
 * ISR: Incremental Static Regeneration - revalidate mỗi 1 giờ (3600 giây)
 */
export async function getCategoriesSSG(): Promise<CategoryLevel0[]> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/store'
  const url = `${BASE_URL}/categories/`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      // SSG với ISR: revalidate mỗi 1 giờ
      // Nếu muốn pure SSG (không revalidate), dùng: cache: 'force-cache'
      next: { revalidate: 3600 }, // 1 giờ
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as CategoryLevel0[]
  } catch (error) {
    console.error('Error fetching categories for SSG:', error)
    throw error
  }
}

