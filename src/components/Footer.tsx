import Link from 'next/link'
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3 text-sm text-gray-600">
          <div>
            <div className="font-semibold text-gray-800">OUPharmacy</div>
            <p className="mt-2">Hệ thống nhà thuốc trực tuyến. Giao hàng nhanh, hàng chính hãng.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-800">Hỗ trợ</div>
            <ul className="mt-2 space-y-2">
              <li><Link href="/help" className="hover:text-primary-700">Trung tâm trợ giúp</Link></li>
              <li><Link href="/policies/returns" className="hover:text-primary-700">Chính sách đổi trả</Link></li>
              <li><Link href="/contact" className="hover:text-primary-700">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
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


