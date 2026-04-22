'use client'

import React, { useState } from 'react'
import { requestPasswordReset } from '@/lib/services/auth'
import { toastError, toastSuccess } from '@/lib/utils/toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)
    setIsSubmitting(true)

    const result = await requestPasswordReset(email)
    setIsSubmitting(false)

    if (result.error) {
      setSubmitError(result.error)
      toastError(result.error)
      return
    }

    const successMessage =
      result.data?.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu.'
    setSubmitSuccess(successMessage)
    toastSuccess(successMessage)
    setEmail('')
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-semibold">Quên mật khẩu</h1>
      <p className="text-sm text-gray-600">
        Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        {submitSuccess ? <p className="text-sm text-green-600">{submitSuccess}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi hướng dẫn'}
        </button>
      </form>
    </div>
  )
}
