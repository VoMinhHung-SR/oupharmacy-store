import React from 'react'

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-semibold">Quên mật khẩu</h1>
      <form className="space-y-3">
        <input placeholder="Email" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-primary-600 px-4 py-2 font-semibold text-white">Gửi hướng dẫn</button>
      </form>
    </div>
  )
}


