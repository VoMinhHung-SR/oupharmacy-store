import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { HeartIcon, ShieldCheckIcon, TruckDeliveryIcon } from '@/components/icons'
import {
  SupportDoc,
  SupportPanel,
  supportBodyClass,
  supportSectionClass,
  supportTitleClass,
} from '@/components/support/SupportDoc'
import { STORE_SUPPORT } from '@/lib/constant'

export const metadata: Metadata = {
  title: 'Giới thiệu | OUPharmacy',
  description:
    'Nhà thuốc OUPharmacy — mua thuốc và sản phẩm sức khỏe trực tuyến, giao hàng nhanh, tư vấn dược sĩ.',
}

export default function AboutPage() {
  return (
    <SupportDoc activeHref="/about">
      <SupportPanel>
        <h1 className={`mb-2 ${supportTitleClass}`}>Về Nhà thuốc OUPharmacy</h1>
        <p className={`mb-6 ${supportBodyClass}`}>
          OUPharmacy là nhà thuốc trực tuyến độc lập — giúp bạn tìm thuốc, thực phẩm chức năng và
          thiết bị y tế, đặt hàng giao tận nơi và được hỗ trợ tư vấn khi cần.
        </p>

        <h2 className={`mb-3 ${supportSectionClass}`}>Chúng tôi mang đến</h2>
        <ul className="mb-8 grid gap-3 sm:grid-cols-3">
          <li className="rounded-lg border border-slate-100 bg-slate-50/80 p-3.5">
            <ShieldCheckIcon className="mb-2 h-6 w-6 text-primary-600" />
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Hàng chính hãng</h3>
            <p className="text-sm leading-6 text-slate-600">
              Quy cách và giá rõ trên trang sản phẩm.
            </p>
          </li>
          <li className="rounded-lg border border-slate-100 bg-slate-50/80 p-3.5">
            <TruckDeliveryIcon className="mb-2 h-6 w-6 text-primary-600" />
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Giao hàng nhanh</h3>
            <p className="text-sm leading-6 text-slate-600">
              Theo dõi đơn trong tài khoản theo phương thức đã chọn.
            </p>
          </li>
          <li className="rounded-lg border border-slate-100 bg-slate-50/80 p-3.5">
            <HeartIcon className="mb-2 h-6 w-6 text-primary-600" />
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Tư vấn tận tâm</h3>
            <p className="text-sm leading-6 text-slate-600">
              Tư vấn dược sĩ, đặt lịch khám hoặc gửi yêu cầu mua thuốc.
            </p>
          </li>
        </ul>

        <h2 className={`mb-2 ${supportSectionClass}`}>Liên hệ hỗ trợ</h2>
        <p className={`mb-5 ${supportBodyClass}`}>
          Hotline{' '}
          <a
            href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
            className="font-medium text-primary-700 hover:underline"
          >
            {STORE_SUPPORT.HOTLINE_DISPLAY}
          </a>
          , hoặc gửi tin qua trang liên hệ.
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link href={STORE_SUPPORT.CONTACT_HREF}>
            <Button>Liên hệ</Button>
          </Link>
          <Link href="/tim-kiem">
            <Button variant="outline">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </SupportPanel>
    </SupportDoc>
  )
}
