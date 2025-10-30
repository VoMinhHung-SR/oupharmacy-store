import Link from 'next/link'
import React from 'react'

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-semibold">Tạo tài khoản</h1>
      <form className="space-y-3">
        <input placeholder="Họ tên" className="w-full rounded border px-3 py-2" />
        <input placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input placeholder="Mật khẩu" type="password" className="w-full rounded border px-3 py-2" />
        <button className="w-full rounded bg-primary-600 px-4 py-2 font-semibold text-white">Đăng ký</button>
      </form>
      <div className="text-sm">
        Đã có tài khoản? <Link href="/login" className="text-primary-700">Đăng nhập</Link>
      </div>
    </div>
  )
}


