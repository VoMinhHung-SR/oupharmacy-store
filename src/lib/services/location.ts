import axios from 'axios'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'

export interface City {
  id: number
  name: string
}

export interface District {
  id: number
  name: string
  city: number
}

export interface Location {
  id: number
  address: string
  lat: string
  lng: string
  city: number
  district: number
  city_info?: { id: number; name: string }
  district_info?: { id: number; name: string }
}

export interface CreateLocationData {
  lat: string
  lng: string
  city: number
  district: number
  address: string
}

export async function getCities(): Promise<{ data?: City[]; error?: string }> {
  try {
    const response = await axios.get<{ cityOptions: City[] }>(`${MAIN_API_URL}/common-configs/`)
    if (response.data?.cityOptions) {
      return { data: response.data.cityOptions }
    }
    return { error: 'Không thể lấy danh sách thành phố' }
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || error.message || 'Không thể lấy danh sách thành phố',
    }
  }
}

export async function getDistrictsByCity(
  cityId: number
): Promise<{ data?: District[]; error?: string }> {
  try {
    const response = await axios.post<District[]>(
      `${MAIN_API_URL}/common-districts/get-by-city/`,
      { city: cityId }
    )
    return { data: response.data }
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || error.message || 'Không thể lấy danh sách quận/huyện',
    }
  }
}

export async function createLocation(
  data: CreateLocationData
): Promise<{ data?: Location; error?: string }> {
  try {
    const response = await axios.post<Location>(`${MAIN_API_URL}/common-locations/`, data)
    if (response.status === 201 && response.data) {
      return { data: response.data }
    }
    return { error: 'Không thể tạo địa chỉ' }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Không thể tạo địa chỉ'
    return { error: errorMessage }
  }
}