import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'

export interface ApiResponse<T> {
  data?: T
  error?: string
  status?: number
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/store'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    // Add Accept-Language header from URL
    if (typeof window !== 'undefined') {
      const locale = window.location.pathname.split('/')[1] || 'vi'
      config.headers['Accept-Language'] = locale
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - xử lý errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

function handleAxiosError<T>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    let errorMessage = `HTTP ${axiosError.response?.status || 0}`

    if (axiosError.response?.data) {
      const errorData = axiosError.response.data as any
      errorMessage =
        errorData.detail || errorData.message || errorData.error || errorMessage
    } else if (axiosError.message) {
      errorMessage = axiosError.message
    }

    return {
      error: errorMessage,
      status: axiosError.response?.status || 0,
    }
  }

  return {
    error: error instanceof Error ? error.message : 'Network error',
    status: 0,
  }
}

function handleAxiosResponse<T>(response: any): ApiResponse<T> {
  if (response.status === 204 || !response.data) {
    return { data: undefined as unknown as T, status: response.status }
  }

  return {
    data: response.data as T,
    status: response.status,
  }
}

export async function apiGet<T>(
  path: string,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    }
    const response = await axiosInstance.get<T>(path, config)
    return handleAxiosResponse<T>(response)
  } catch (error) {
    return handleAxiosError<T>(error)
  }
}

export async function apiPost<T>(
  path: string,
  body?: any,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    }
    const response = await axiosInstance.post<T>(path, body, config)
    return handleAxiosResponse<T>(response)
  } catch (error) {
    return handleAxiosError<T>(error)
  }
}

export async function apiPut<T>(
  path: string,
  body?: any,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    }
    const response = await axiosInstance.put<T>(path, body, config)
    return handleAxiosResponse<T>(response)
  } catch (error) {
    return handleAxiosError<T>(error)
  }
}

export async function apiPatch<T>(
  path: string,
  body?: any,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    }
    const response = await axiosInstance.patch<T>(path, body, config)
    return handleAxiosResponse<T>(response)
  } catch (error) {
    return handleAxiosError<T>(error)
  }
}

export async function apiDelete<T>(
  path: string,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    }
    const response = await axiosInstance.delete<T>(path, config)
    return handleAxiosResponse<T>(response)
  } catch (error) {
    return handleAxiosError<T>(error)
  }
}

export { axiosInstance }

