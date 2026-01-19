'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { toastError } from '@/lib/utils/toast'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { XIcon, GoogleIcon } from '@/components/icons'

export const LoginModal: React.FC = () => {
  const router = useRouter()
  const { isOpen, returnUrl, closeModal } = useLoginModal()
  const { login, loginWithGoogle, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      await login(data.email, data.password)
      closeModal()
      
      // Navigate to returnUrl if provided and different from current path
      if (returnUrl && returnUrl !== window.location.pathname) {
        router.push(returnUrl)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      toastError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      closeModal()
      
      // Navigate to returnUrl if provided and different from current path
      if (returnUrl && returnUrl !== window.location.pathname) {
        router.push(returnUrl)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Đăng nhập với Google thất bại. Vui lòng thử lại.'
      toastError(errorMsg)
    } finally {
      setGoogleLoading(false)
    }
  }

  const isLoading = loading || authLoading

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            aria-label="Đóng"
          >
            <XIcon size={24} />
          </button>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="text-center"  >
              <h2 className="text-2xl font-semibold text-gray-900">Đăng nhập</h2>
              <p className="text-sm text-gray-600 mt-1">
              Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                if (firstError?.message) {
                  toastError(firstError.message)
                }
              })}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Nhập email của bạn"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Nhập mật khẩu"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || googleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-red-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <GoogleIcon className="h-5 w-5" />
                  <span>Đăng nhập với Google</span>
                </>
              )}
            </button>

            <div className="flex justify-between text-sm pt-4 border-t border-gray-200">
              <Link 
                href="/register" 
                onClick={closeModal}
                className="text-primary-700 hover:text-primary-800 hover:underline"
              >
                Tạo tài khoản
              </Link>
              <Link 
                href="/forgot-password" 
                onClick={closeModal}
                className="text-primary-700 hover:text-primary-800 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
