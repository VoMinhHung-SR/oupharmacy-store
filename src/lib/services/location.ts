import axios from 'axios'
import { STORAGE_KEY } from '../constant'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'

function mainApiAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem(STORAGE_KEY.TOKEN)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface City {
  id: number
  name: string
  id_province?: string | null
}

export interface District {
  id: number
  name: string
  city_id: number
  id_commune?: string | null
}

/** GET /common-cities/ */
export async function getCities(): Promise<{ data?: City[]; error?: string }> {
  try {
    const response = await axios.get<City[]>(`${MAIN_API_URL}/common-cities/`, {
      headers: { ...mainApiAuthHeaders() },
    })
    if (Array.isArray(response.data)) {
      return { data: response.data }
    }
    return { error: 'Không thể lấy danh sách tỉnh/thành phố' }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { detail?: string } }; message?: string }
    return {
      error: err.response?.data?.detail || err.message || 'Không thể lấy danh sách tỉnh/thành phố',
    }
  }
}

/** GET /common-cities/{cityId}/get-districts/ */
export async function getDistrictsByCity(
  cityId: number
): Promise<{ data?: District[]; error?: string }> {
  try {
    const response = await axios.get<District[]>(
      `${MAIN_API_URL}/common-cities/${cityId}/get-districts/`,
      { headers: { ...mainApiAuthHeaders() } }
    )
    if (Array.isArray(response.data)) {
      return { data: response.data }
    }
    return { error: 'Không thể lấy danh sách phường/xã' }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { detail?: string } }; message?: string }
    return {
      error: err.response?.data?.detail || err.message || 'Không thể lấy danh sách phường/xã',
    }
  }
}
