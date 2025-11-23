import { apiGet } from '../api'

export interface Brand {
  id: number
  name: string
  active: boolean
  created_date: string
  updated_date: string
}

export async function getBrands() {
  return apiGet<Brand[]>('/brands/')
}

export async function getBrand(id: number) {
  return apiGet<Brand>(`/brands/${id}/`)
}

