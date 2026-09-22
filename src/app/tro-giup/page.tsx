import type { Metadata } from 'next'
import Link from 'next/link'
import {
  SupportDoc,
  SupportPanel,
  SupportSection,
  supportBodyClass,
  supportTitleClass,
} from '@/components/support/SupportDoc'
import { STORE_SUPPORT } from '@/lib/constant'

export const metadata: Metadata = {
  title: 'Trung tâm trợ giúp | OUPharmacy',
  description: 'Hướng dẫn mua hàng, thanh toán, đơn hàng và đổi trả tại OUPharmacy.',
}

export default function HelpCenterPage() {
  return (
    <SupportDoc activeHref="/tro-giup">
      <SupportPanel>
        <h1 className={`mb-2 ${supportTitleClass}`}>Trung tâm trợ giúp</h1>
        <p className={`mb-6 ${supportBodyClass}`}>
          Hướng dẫn nhanh để mua hàng, theo dõi đơn và liên hệ hỗ trợ tại Nhà thuốc OUPharmacy.
        </p>

        <div className="space-y-6">
          <SupportSection title="1. Đặt hàng">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tìm sản phẩm theo tên hoặc danh mục, chọn quy cách / số lượng rồi thêm vào giỏ.</li>
              <li>Vào giỏ hàng để kiểm tra trước khi thanh toán.</li>
              <li>
                Nếu không đặt được, kiểm tra tồn kho, địa chỉ nhận hàng hoặc thử lại sau vài phút.
              </li>
              <li>
                Cần hỗ trợ tìm thuốc: dùng{' '}
                <Link href="/dat-thuoc" className="font-medium text-primary-700 hover:underline">
                  Cần mua thuốc
                </Link>{' '}
                hoặc mở tư vấn dược sĩ trên trang chủ.
              </li>
            </ul>
          </SupportSection>

          <SupportSection title="2. Thanh toán">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Chọn phương thức tại bước thanh toán (COD, ví, chuyển khoản… tùy hệ thống hiển thị).</li>
              <li>Đơn chỉ được xác nhận khi hệ thống ghi nhận thanh toán / đặt hàng thành công.</li>
              <li>Lỗi thanh toán: thử phương thức khác hoặc liên hệ hotline để được hỗ trợ.</li>
            </ul>
          </SupportSection>

          <SupportSection title="3. Đơn hàng">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Theo dõi tại{' '}
                <Link
                  href="/tai-khoan/don-hang"
                  className="font-medium text-primary-700 hover:underline"
                >
                  Đơn hàng
                </Link>{' '}
                trong tài khoản (hoặc theo hướng dẫn trên email / SMS nếu mua guest).
              </li>
              <li>Hủy đơn chỉ khi đơn chưa sang trạng thái đang xử lý / đang giao (theo điều kiện hệ thống).</li>
              <li>Cần đổi địa chỉ nhận: liên hệ sớm kèm mã đơn.</li>
            </ul>
          </SupportSection>

          <SupportSection title="4. Đổi trả và hoàn tiền">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Điều kiện theo từng nhóm sản phẩm.</li>
              <li>
                Xem chi tiết tại{' '}
                <Link
                  href="/chinh-sach-doi-tra"
                  className="font-medium text-primary-700 hover:underline"
                >
                  Chính sách đổi trả
                </Link>
                .
              </li>
            </ul>
          </SupportSection>

          <SupportSection title="5. Tài khoản & tiện ích">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Đăng ký / đăng nhập để quản lý hồ sơ, sổ địa chỉ và đơn hàng.</li>
              <li>Quên mật khẩu: dùng “Quên mật khẩu” trên form đăng nhập.</li>
              <li>
                Tủ thuốc và tư vấn dược sĩ hỗ trợ theo dõi thuốc tại nhà — truy cập từ trang chủ hoặc
                tài khoản.
              </li>
            </ul>
          </SupportSection>

          <SupportSection title="6. Liên hệ">
            <p>
              Chưa tìm thấy câu trả lời? Gọi{' '}
              <a
                href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                className="font-medium text-primary-700 hover:underline"
              >
                {STORE_SUPPORT.HOTLINE_DISPLAY}
              </a>{' '}
              hoặc gửi tin tại{' '}
              <Link href="/lien-he" className="font-medium text-primary-700 hover:underline">
                Liên hệ
              </Link>
              .
            </p>
          </SupportSection>
        </div>
      </SupportPanel>
    </SupportDoc>
  )
}
