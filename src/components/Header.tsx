import Link from 'next/link'
import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-primary-700">
              OUPharmacy
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <Link href="/products" className="hover:text-gray-900">Sản phẩm</Link>
              <Link href="/categories" className="hover:text-gray-900">Danh mục</Link>
              <Link href="/brands" className="hover:text-gray-900">Thương hiệu</Link>
              <Link href="/deals" className="hover:text-gray-900">Khuyến mãi</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <form action="/search" className="hidden md:block">
              <input
                name="q"
                placeholder="Tìm sản phẩm..."
                className="w-80 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>
            <Link href="/cart" className="text-sm font-medium hover:text-primary-700">
              Giỏ hàng
            </Link>
            <Link href="/account" className="text-sm text-gray-600 hover:text-primary-700">
              Tài khoản
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


