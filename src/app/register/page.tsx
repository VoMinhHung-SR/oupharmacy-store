'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)

    try {
      await registerUser(data.name.trim(), data.email.trim(), data.password)
      toastSuccess('Đăng ký thành công!')
      
      router.push('/')
    } catch (err: any) {
      const errorMsg = err.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      toastError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || authLoading

  return (
    <div className="mx-auto max-w-md space-y-6 py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Tạo tài khoản</h1>

      <form
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, (errors) => {
          // Hiển thị toast cho validation errors khi submit
          const firstError = Object.values(errors)[0]
          if (firstError?.message) {
            toastError(firstError.message)
          }
        })}
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Họ tên
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            placeholder="Nhập họ tên của bạn"
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.name
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Nhập email của bạn"
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
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
            placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            placeholder="Nhập lại mật khẩu"
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.confirmPassword
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
              Đang đăng ký...
            </span>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <div className="text-sm text-center">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-primary-700 hover:text-primary-800 hover:underline font-medium">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}
