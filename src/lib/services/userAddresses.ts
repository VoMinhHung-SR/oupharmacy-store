import axios from 'axios'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'
const ADDRESSES_PATH = '/users/me/addresses/'

export const USER_ADDRESS_LIMIT = 10

export type PlaceInfo = {
  id: number
  name: string
}

export type UserAddress = {
  id: number
  address: string
  lat?: number | null
  lng?: number | null
  city_info?: PlaceInfo | Record<string, never>
  district_info?: PlaceInfo | Record<string, never>
  is_default: boolean
}

export type UserAddressWrite = {
  address: string
  city: number
  district: number
  is_default?: boolean
}

type ApiResult<T> = { data?: T; error?: string }

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

function mainApiError(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: Record<string, unknown> }; message?: string }
  const data = err.response?.data
  if (!data) return err.message || fallback
  if (typeof data.detail === 'string') return data.detail
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
    if (typeof value === 'string') return value
  }
  return err.message || fallback
}

function unwrapAddressList(data: unknown): UserAddress[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: unknown }).results)) {
    return (data as { results: UserAddress[] }).results
  }
  return []
}

export function placeInfo(info?: PlaceInfo | Record<string, never>): PlaceInfo | null {
  if (!info || typeof info !== 'object') return null
  if (typeof (info as PlaceInfo).id === 'number' && typeof (info as PlaceInfo).name === 'string') {
    return info as PlaceInfo
  }
  return null
}

export function formatUserAddressLine(addr: UserAddress): string {
  const city = placeInfo(addr.city_info)?.name
  const commune = placeInfo(addr.district_info)?.name
  return [addr.address?.trim(), commune, city].filter(Boolean).join(', ')
}

export function pickDefaultUserAddress(list: UserAddress[]): UserAddress | null {
  return list.find((item) => item.is_default) || list[0] || null
}

export function userAddressToCheckoutFields(addr: UserAddress) {
  const city = placeInfo(addr.city_info)
  const commune = placeInfo(addr.district_info)
  return {
    address: addr.address?.trim() || '',
    city_id: city?.id,
    commune_id: commune?.id,
    province: city?.name ?? '',
    ward: commune?.name ?? '',
    district: '',
  }
}

export async function listUserAddresses(token: string): Promise<ApiResult<UserAddress[]>> {
  try {
    const response = await axios.get(`${MAIN_API_URL}${ADDRESSES_PATH}`, {
      headers: authHeaders(token),
    })
    return { data: unwrapAddressList(response.data) }
  } catch (error: unknown) {
    return { error: mainApiError(error, 'Không thể tải sổ địa chỉ') }
  }
}

export async function createUserAddress(
  token: string,
  payload: UserAddressWrite
): Promise<ApiResult<UserAddress>> {
  try {
    const response = await axios.post<UserAddress>(`${MAIN_API_URL}${ADDRESSES_PATH}`, payload, {
      headers: authHeaders(token),
    })
    return { data: response.data }
  } catch (error: unknown) {
    return { error: mainApiError(error, 'Không thể thêm địa chỉ') }
  }
}

export async function updateUserAddress(
  token: string,
  id: number,
  payload: Partial<UserAddressWrite>
): Promise<ApiResult<UserAddress>> {
  try {
    const response = await axios.patch<UserAddress>(
      `${MAIN_API_URL}${ADDRESSES_PATH}${id}/`,
      payload,
      { headers: authHeaders(token) }
    )
    return { data: response.data }
  } catch (error: unknown) {
    return { error: mainApiError(error, 'Không thể cập nhật địa chỉ') }
  }
}

export async function deleteUserAddress(token: string, id: number): Promise<ApiResult<true>> {
  try {
    await axios.delete(`${MAIN_API_URL}${ADDRESSES_PATH}${id}/`, {
      headers: authHeaders(token),
    })
    return { data: true }
  } catch (error: unknown) {
    return { error: mainApiError(error, 'Không thể xóa địa chỉ') }
  }
}

export async function setDefaultUserAddress(
  token: string,
  id: number
): Promise<ApiResult<UserAddress>> {
  return updateUserAddress(token, id, { is_default: true })
}
