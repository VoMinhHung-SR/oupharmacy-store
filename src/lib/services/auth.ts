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

export async function register(
  data: RegisterData | FormData
): Promise<{ data?: User; error?: string }> {
  try {
    const isFormData = data instanceof FormData
    const config = isFormData
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : {}

    const response = await axios.post<User>(
      `${MAIN_API_URL}/users/`,
      data,
      config
    )

    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.email?.[0] ||
      error.response?.data?.phone_number?.[0] ||
      error.response?.data?.message ||
      error.message ||
      'Đăng ký thất bại'
    return { error: errorMessage }
  }
}

/** Password login via Next BFF — sets HttpOnly cookies; returns access only. */
export async function login(
  email: string,
  password: string
): Promise<{ data?: LoginResponse; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })
    const data = (await response.json().catch(() => ({}))) as LoginResponse & {
      error?: string
    }
    if (!response.ok || !data.access_token) {
      return { error: data.error || 'Đăng nhập thất bại' }
    }
    return {
      data: {
        access_token: data.access_token,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in ?? 0,
      },
    }
  } catch (error: any) {
    return { error: error?.message || 'Đăng nhập thất bại' }
  }
}

/** Refresh via BFF cookie (no refresh_token in browser). */
export async function refreshAccessToken(): Promise<{
  data?: LoginResponse
  error?: string
  status?: number
}> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    const data = (await response.json().catch(() => ({}))) as LoginResponse & {
      error?: string
    }
    if (!response.ok || !data.access_token) {
      return {
        error: data.error || 'Làm mới phiên đăng nhập thất bại',
        status: response.status,
      }
    }
    return {
      data: {
        access_token: data.access_token,
        token_type: data.token_type || 'Bearer',
        expires_in: data.expires_in ?? 0,
      },
    }
  } catch (error: any) {
    return {
      error: error?.message || 'Làm mới phiên đăng nhập thất bại',
      status: 0,
    }
  }
}


export async function getCurrentUser(
  token: string
): Promise<{ data?: User; error?: string; status?: number }> {
  try {
    const response = await axios.get<User>(`${MAIN_API_URL}/users/current-user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { data: response.data, status: response.status }
  } catch (error: any) {
    return {
      error:
        error.response?.data?.detail ||
        error.message ||
        'Không thể lấy thông tin user',
      status: error.response?.status,
    }
  }
}

export interface FirebaseSocialLoginResponse {
  access_token: string
  refresh_token?: string
  user: User
}

export async function firebaseSocialLogin(
  idToken: string,
  provider: 'google' | 'facebook' = 'google'
): Promise<{ data?: FirebaseSocialLoginResponse; error?: string }> {
  try {
    const response = await fetch('/api/auth/firebase', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: idToken, provider }),
    })
    const data = (await response.json().catch(() => ({}))) as FirebaseSocialLoginResponse & {
      error?: string
    }
    if (!response.ok || !data.access_token) {
      return { error: data.error || 'Đăng nhập với tài khoản mạng xã hội thất bại' }
    }
    return {
      data: {
        access_token: data.access_token,
        user: data.user,
      },
    }
  } catch (error: any) {
    return {
      error: error?.message || 'Đăng nhập với tài khoản mạng xã hội thất bại',
    }
  }
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  phone_number?: string
}

export async function updateProfile(
  userId: number,
  data: UpdateProfileData | FormData,
  token: string
): Promise<{ data?: User; error?: string }> {
  try {
    const isFormData = data instanceof FormData
    const config = isFormData
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      : {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

    const response = await axios.patch<User>(
      `${MAIN_API_URL}/users/${userId}/`,
      data,
      config
    )

    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.email?.[0] ||
      error.response?.data?.phone_number?.[0] ||
      error.response?.data?.message ||
      error.message ||
      'Cập nhật thông tin thất bại'
    return { error: errorMessage }
  }
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

function extractApiErrorMessage(error: any, fallback: string): string {
  // TODO: Move FE-side error translation to a shared utility (or backend error codes/i18n) instead of hardcoded rules in auth service.
  const toVietnameseError = (message: string): string => {
    const normalized = message.trim()
    const lower = normalized.toLowerCase()
    // Message from BE status: TODO: enhance later
    if (lower.includes('this password is too common')) {
      return 'Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác.'
    }
    if (lower.includes('this password is too short')) {
      return 'Mật khẩu quá ngắn.'
    }
    if (lower.includes('this password is entirely numeric')) {
      return 'Mật khẩu không được chỉ bao gồm chữ số.'
    }
    if (lower.includes('this field is required')) {
      return 'Vui lòng nhập đầy đủ thông tin bắt buộc.'
    }
    if (lower.includes('unable to log in with provided credentials')) {
      return 'Thông tin đăng nhập không chính xác.'
    }
    if (lower.includes('invalid token')) {
      return 'Liên kết hoặc phiên làm việc không hợp lệ.'
    }
    if (lower.includes('token is invalid or expired')) {
      return 'Liên kết đã hết hạn hoặc không hợp lệ.'
    }
    if (lower.includes('status code 400')) {
      return 'Yêu cầu không thành công. Vui lòng kiểm tra thông tin và thử lại.'
    }
    return normalized
  }

  const data = error?.response?.data

  if (typeof data === 'string' && data.trim()) {
    return toVietnameseError(data)
  }

  if (data && typeof data === 'object') {
    const directMessage =
      data.detail ||
      data.message ||
      data.error ||
      data.non_field_errors?.[0] ||
      data.current_password?.[0] ||
      data.new_password?.[0] ||
      data.email?.[0]

    if (typeof directMessage === 'string' && directMessage.trim()) {
      return toVietnameseError(directMessage)
    }

    const firstValue = Object.values(data)[0]
    if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
      return toVietnameseError(firstValue[0])
    }
    if (typeof firstValue === 'string' && firstValue.trim()) {
      return toVietnameseError(firstValue)
    }
  }

  if (typeof error?.message === 'string') {
    return toVietnameseError(error.message)
  }

  return fallback
}

export async function changePassword(
  userId: number,
  data: ChangePasswordData,
  token: string
): Promise<{ data?: { message: string }; error?: string }> {
  try {
    const response = await axios.post<{ message: string }>(
      `${MAIN_API_URL}/users/${userId}/change-password/`,
      {
        new_password: data.new_password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return { data: response.data }
  } catch (error: any) {
    const errorMessage = extractApiErrorMessage(
      error,
      'Mật khẩu hiện tại không đúng hoặc mật khẩu mới chưa hợp lệ.'
    )
    return { error: errorMessage }
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ data?: { message?: string }; error?: string }> {
  try {
    const response = await axios.post<{ message?: string }>(
      `${MAIN_API_URL}/auth/forgot-password/`,
      { email: email.trim() }
    )
    return { data: response.data }
  } catch (error: any) {
    const errorMessage = extractApiErrorMessage(
      error,
      'Yêu cầu không thành công. Vui lòng thử lại sau.'
    )
    return { error: errorMessage }
  }
}
