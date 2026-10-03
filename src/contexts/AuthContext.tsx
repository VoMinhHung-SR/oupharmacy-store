'use client'
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { login as loginApi, register as registerApi, getCurrentUser, firebaseSocialLogin, type User } from '@/lib/services/auth'
import { STORAGE_KEY } from '@/lib/constant'
import {
  clearAuthStorage,
  persistAuthTokens,
  refreshSessionWithStoredRefresh,
  fetchSessionAccessToken,
  logoutViaBff,
} from '@/lib/auth'
import { setEncodedItem } from '@/lib/utils/storage'
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
    let cancelled = false
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const loadAuth = async () => {
      try {
        let access = await fetchSessionAccessToken()
        if (cancelled) return
        if (!access) {
          clearAuthStorage()
          return
        }

        setToken(access)

        let userResult = await getCurrentUser(access)
        if (cancelled) return
        if (!userResult.data && userResult.status === 401) {
          const newAccess = await refreshSessionWithStoredRefresh()
          if (cancelled) return
          if (newAccess) {
            access = newAccess
            setToken(newAccess)
            userResult = await getCurrentUser(newAccess)
            if (cancelled) return
          }
        }

        if (userResult.data) {
          setUser(userResult.data)
          setEncodedItem(STORAGE_KEY.USER, userResult.data)
        } else {
          await logoutViaBff()
          if (cancelled) return
          clearAuthStorage()
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading auth:', error)
        await logoutViaBff()
        if (cancelled) return
        clearAuthStorage()
        setToken(null)
        setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const schedule = () => {
      if (!cancelled) void loadAuth()
    }

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(schedule, { timeout: 600 })
    } else {
      timeoutId = setTimeout(schedule, 0)
    }

    return () => {
      cancelled = true
      if (idleId != null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password)

    if (result.error || !result.data) {
      throw new Error(result.error || 'Đăng nhập thất bại')
    }

    const { access_token } = result.data

    setToken(access_token)
    persistAuthTokens(access_token)

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
    const { signInWithPopup } = await import('firebase/auth')
    const { auth, googleProvider } = await import('@/lib/config/firebase')

    const result = await signInWithPopup(auth, googleProvider)
    const idToken = await result.user.getIdToken()

    const response = await firebaseSocialLogin(idToken, 'google')

    if (response.error || !response.data) {
      throw new Error(response.error || 'Đăng nhập với Google thất bại')
    }

    const { access_token, user: socialUser } = response.data

    setToken(access_token)
    persistAuthTokens(access_token)

    if (socialUser) {
      setUser(socialUser)
      setEncodedItem(STORAGE_KEY.USER, socialUser)
    } else {
      const userResult = await getCurrentUser(access_token)
      if (!userResult.data) {
        throw new Error(userResult.error || 'Không thể lấy thông tin user')
      }
      setUser(userResult.data)
      setEncodedItem(STORAGE_KEY.USER, userResult.data)
    }

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
    void logoutViaBff().finally(() => {
      setToken(null)
      setUser(null)
      clearAuthStorage()
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/tai-khoan')) {
        window.location.assign('/')
      }
    })
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
