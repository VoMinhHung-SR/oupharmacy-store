import Link from 'next/link'
import React from 'react'
import Container from '@/components/Container'
import { SECTION_Y } from '@/lib/layout/pageLayout'
import { STORE_SUPPORT } from '@/lib/constant'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className={SECTION_Y}>
        <div className="grid gap-6 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-sm font-semibold text-gray-800">Nhà thuốc OUPharmacy</div>
            <p className="mt-2">Hệ thống nhà thuốc trực tuyến. Giao hàng nhanh, hàng chính hãng.</p>
            <p className="mt-2">
              Hotline{' '}
              <a
                href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                className="font-medium text-primary-700 hover:underline"
              >
                {STORE_SUPPORT.HOTLINE_DISPLAY}
              </a>
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="text-sm font-semibold text-gray-800">Danh mục</div>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/duoc-my-pham" className="hover:text-primary-700">
                  Dược mỹ phẩm
                </Link>
              </li>
              <li>
                <Link href="/thiet-bi-y-te" className="hover:text-primary-700">
                  Thiết bị y tế
                </Link>
              </li>
              <li>
                <Link href="/thuc-pham-chuc-nang" className="hover:text-primary-700">
                  Thực phẩm chức năng
                </Link>
              </li>
              <li>
                <Link href="/thuoc" className="hover:text-primary-700">
                  Thuốc
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-4">
            <div className="text-sm font-semibold text-gray-800">Hỗ trợ</div>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary-700">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/tro-giup" className="hover:text-primary-700">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="hover:text-primary-700">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="hover:text-primary-700">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan" className="hover:text-primary-700">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-primary-700">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pb-[env(safe-area-inset-bottom)] text-center text-xs text-gray-500">
          © {new Date().getFullYear()} OUPharmacy. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

export default Footer
