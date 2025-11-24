import axios from 'axios'
import { apiGet, apiPost } from '../api'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'

export interface OAuth2Info {
  client_id: string
  client_secret: string
}

export interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  expires_in: number
}

export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  name?: string
  avatar?: string
  avatar_path?: string
  phone_number?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export async function getOAuth2Info(): Promise<{ data?: OAuth2Info; error?: string }> {
  try {
    const response = await axios.get<OAuth2Info>(`${MAIN_API_URL}/oauth2-info/`)
    return { data: response.data }
  } catch (error: any) {
    return {
      error: error.response?.data?.detail || error.message || 'Không thể lấy thông tin OAuth2',
    }
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ data?: LoginResponse; error?: string }> {
  try {
    const oauthInfo = await getOAuth2Info()
    if (oauthInfo.error || !oauthInfo.data) {
      return { error: oauthInfo.error || 'Không thể lấy thông tin OAuth2' }
    }

    const response = await axios.post<LoginResponse>(
      `${MAIN_API_URL}/o/token/`,
      {
        username: email,
        password: password,
        client_id: oauthInfo.data.client_id,
        client_secret: oauthInfo.data.client_secret,
        grant_type: 'password',
      }
    )
    console.log(response.data)
    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.message ||
      'Đăng nhập thất bại'
    return { error: errorMessage }
  }
}

export async function register(
  data: RegisterData
): Promise<{ data?: User; error?: string }> {
  try {
    const response = await axios.post<User>(`${MAIN_API_URL}/users/`, {
      name: data.name,
      email: data.email,
      password: data.password,
    })

    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.email?.[0] ||
      error.response?.data?.message ||
      error.message ||
      'Đăng ký thất bại'
    return { error: errorMessage }
  }
}

export async function getCurrentUser(
  token: string
): Promise<{ data?: User; error?: string }> {
  try {
    const response = await axios.get<User>(`${MAIN_API_URL}/users/current-user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { data: response.data }
  } catch (error: any) {
    return {
      error:
        error.response?.data?.detail ||
        error.message ||
        'Không thể lấy thông tin user',
    }
  }
}

