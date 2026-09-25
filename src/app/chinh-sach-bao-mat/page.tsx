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
  title: 'Chính sách bảo mật | OUPharmacy',
  description: 'Cách OUPharmacy thu thập, sử dụng và bảo vệ thông tin cá nhân.',
}

export default function PrivacyPolicyPage() {
  return (
    <SupportDoc activeHref="/chinh-sach-bao-mat">
      <SupportPanel>
        <h1 className={`mb-2 ${supportTitleClass}`}>Chính sách bảo mật</h1>
        <p className={`mb-6 ${supportBodyClass}`}>
          Mô tả cách Nhà thuốc OUPharmacy xử lý thông tin khi bạn dùng website và đặt hàng trực
          tuyến. Nội dung có thể cập nhật khi nghiệp vụ thay đổi.
        </p>

        <div className="space-y-6">
          <SupportSection title="1. Thông tin thu thập">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tài khoản: họ tên, email, số điện thoại.</li>
              <li>Giao hàng: địa chỉ, người nhận, SĐT liên hệ đơn.</li>
              <li>Đơn hàng và hỗ trợ: sản phẩm đã mua, nội dung form liên hệ / yêu cầu mua thuốc.</li>
              <li>Dữ liệu kỹ thuật cần thiết (phiên đăng nhập, giỏ hàng trên thiết bị).</li>
            </ul>
          </SupportSection>

          <SupportSection title="2. Mục đích sử dụng">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Xử lý đơn, giao nhận và chăm sóc khách hàng.</li>
              <li>Xác thực tài khoản, bảo mật phiên.</li>
              <li>Phản hồi hỗ trợ, tư vấn hoặc khiếu nại.</li>
              <li>Cải thiện trải nghiệm và tuân thủ nghĩa vụ pháp lý liên quan.</li>
            </ul>
          </SupportSection>

          <SupportSection title="3. Chia sẻ thông tin">
            <p>
              Chúng tôi không bán thông tin cá nhân. Có thể chia sẻ với đối tác vận hành cần thiết
              (giao hàng, cổng thanh toán) hoặc theo yêu cầu cơ quan có thẩm quyền đúng pháp luật.
            </p>
          </SupportSection>

          <SupportSection title="4. Lưu trữ và bảo vệ">
            <p>
              Áp dụng biện pháp kỹ thuật và tổ chức phù hợp để hạn chế truy cập trái phép. Thời gian
              lưu gắn với xử lý đơn, hỗ trợ và nghĩa vụ pháp lý.
            </p>
          </SupportSection>

          <SupportSection title="5. Quyền của bạn">
            <p>
              Bạn có thể cập nhật hồ sơ trong tài khoản, hoặc liên hệ để được hỗ trợ liên quan dữ
              liệu cá nhân trong phạm vi pháp luật cho phép.
            </p>
          </SupportSection>

          <SupportSection title="6. Liên hệ">
            <p>
              Hotline{' '}
              <a
                href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                className="font-medium text-primary-700 hover:underline"
              >
                {STORE_SUPPORT.HOTLINE_DISPLAY}
              </a>
              {' · '}
              <Link href="/lien-he" className="font-medium text-primary-700 hover:underline">
                Trang liên hệ
              </Link>
              .
            </p>
          </SupportSection>
        </div>
      </SupportPanel>
    </SupportDoc>
  )
}
