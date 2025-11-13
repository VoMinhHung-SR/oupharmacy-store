import Link from 'next/link'
import React from 'react'

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-semibold">Đăng nhập</h1>
      <form className="space-y-3">
        <input placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input placeholder="Mật khẩu" type="password" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-primary-600 px-4 py-2 font-semibold text-white">Đăng nhập</button>
      </form>
      <div className="flex justify-between text-sm">
        <Link href="/register" className="text-primary-700">Tạo tài khoản</Link>
        <Link href="/forgot-password" className="text-primary-700">Quên mật khẩu?</Link>
      </div>
    </div>
  )
}


