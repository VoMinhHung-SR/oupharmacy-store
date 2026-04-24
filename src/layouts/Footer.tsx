import Link from 'next/link'
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-semibold text-gray-800">Nhà thuốc OUPharmacy</div>
            <p className="mt-2">Hệ thống nhà thuốc trực tuyến. Giao hàng nhanh, hàng chính hãng.</p>
          </div>
          <div className="lg:col-span-2">
            <div className="font-semibold text-gray-800">Danh mục</div>
            <ul className="mt-2 space-y-2">
              <li><Link href="/duoc-my-pham" className="hover:text-primary-700">Dược mỹ phẩm</Link></li>
              <li><Link href="/thiet-bi-y-te" className="hover:text-primary-700">Thiết bị y tế</Link></li>
              <li><Link href="/thuc-pham-chuc-nang" className="hover:text-primary-700">Thực phẩm chức năng</Link></li>
              <li><Link href="/thuoc" className="hover:text-primary-700">Thuốc</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="font-semibold text-gray-800">Hỗ trợ</div>
            <ul className="mt-2 space-y-2">
              <li><Link href="/tro-giup" className="hover:text-primary-700">Trung tâm trợ giúp</Link></li>
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-primary-700">Chính sách đổi trả</Link></li>
              <li><Link href="/lien-he" className="hover:text-primary-700">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="font-semibold text-gray-800">Tải ứng dụng</div>
            <p className="mt-2">Sắp ra mắt trên iOS và Android.</p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} OUPharmacy. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default Footer

