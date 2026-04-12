'use client'
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { login as loginApi, register as registerApi, getCurrentUser, firebaseSocialLogin, type User } from '@/lib/services/auth'
import { STORAGE_KEY } from '@/lib/constant'
import { clearAuthStorage, persistAuthTokens, refreshSessionWithStoredRefresh } from '@/lib/auth'
import { setEncodedItem, getEncodedItem } from '@/lib/utils/storage'
import { toastSuccess } from '@/lib/utils/toast'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAuth = async () => {
      try {
        let storedToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY.TOKEN) : null
        const storedRefresh = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN) : null

        if (!storedToken && storedRefresh) {
          storedToken = await refreshSessionWithStoredRefresh()
        }

        if (!storedToken) {
          return
        }

        setToken(storedToken)

        let userResult = await getCurrentUser(storedToken)
        if (!userResult.data && userResult.status === 401 && storedRefresh) {
          const newAccess = await refreshSessionWithStoredRefresh()
          if (newAccess) {
            storedToken = newAccess
            setToken(newAccess)
            userResult = await getCurrentUser(newAccess)
          }
        }

        if (userResult.data) {
          setUser(userResult.data)
          setEncodedItem(STORAGE_KEY.USER, userResult.data)
        } else {
          clearAuthStorage()
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading auth:', error)
        clearAuthStorage()
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password)
    
    if (result.error || !result.data) {
      throw new Error(result.error || 'Đăng nhập thất bại')
    }

    const { access_token, refresh_token } = result.data

    setToken(access_token)
    persistAuthTokens(access_token, refresh_token)

    const userResult = await getCurrentUser(access_token)
    if (userResult.data) {
      setUser(userResult.data)
      setEncodedItem(STORAGE_KEY.USER, userResult.data)

      toastSuccess('Đăng nhập thành công')
    } else {
      throw new Error(userResult.error || 'Không thể lấy thông tin user')
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    // Dynamic import để tránh lỗi SSR
    const { signInWithPopup } = await import('firebase/auth')
    const { auth, googleProvider } = await import('@/lib/config/firebase')

    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()

    const response = await firebaseSocialLogin(idToken, 'google')

    if (response.error || !response.data) {
      throw new Error(response.error || 'Đăng nhập với Google thất bại')
    }

    const { access_token, refresh_token, user } = response.data

    setToken(access_token)
    persistAuthTokens(access_token, refresh_token)

    setUser(user)
    setEncodedItem(STORAGE_KEY.USER, user)

    toastSuccess('Đăng nhập với Google thành công')
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerApi({ name, email, password })
    
    if (result.error || !result.data) {
      throw new Error(result.error || 'Đăng ký thất bại')
    }

    await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    clearAuthStorage()
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return

    let accessToken = token
    let result = await getCurrentUser(accessToken)
    if (!result.data && result.status === 401) {
      const newAccess = await refreshSessionWithStoredRefresh()
      if (newAccess) {
        accessToken = newAccess
        setToken(newAccess)
        result = await getCurrentUser(newAccess)
      }
    }

    if (result.data) {
      setUser(result.data)
      setEncodedItem(STORAGE_KEY.USER, result.data)
    } else {
      logout()
    }
  }, [token, logout])

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      token,
      loading,
      login,
      loginWithGoogle,
      logout,
      register,
      refreshUser,
    }),
    [user, isAuthenticated, token, loading, login, loginWithGoogle, logout, register, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}