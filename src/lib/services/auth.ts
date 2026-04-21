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

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ data?: LoginResponse; error?: string; status?: number }> {
  try {
    const oauthInfo = await getOAuth2Info()
    if (oauthInfo.error || !oauthInfo.data) {
      return {
        error: oauthInfo.error || 'Không thể lấy thông tin OAuth2',
        status: 0,
      }
    }

    const response = await axios.post<LoginResponse>(`${MAIN_API_URL}/o/token/`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: oauthInfo.data.client_id,
      client_secret: oauthInfo.data.client_secret,
    })
    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.message ||
      'Làm mới phiên đăng nhập thất bại'
    return {
      error: errorMessage,
      status: error.response?.status,
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
    const response = await axios.post<FirebaseSocialLoginResponse>(
      `${MAIN_API_URL}/auth/firebase/`,
      {
        id_token: idToken,
        provider: provider,
      }
    )

    return { data: response.data }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Đăng nhập với tài khoản mạng xã hội thất bại'
    return { error: errorMessage }
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
