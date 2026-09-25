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
  title: 'Điều khoản sử dụng | OUPharmacy',
  description: 'Điều khoản sử dụng website và dịch vụ đặt hàng tại Nhà thuốc OUPharmacy.',
}

export default function TermsOfServicePage() {
  return (
    <SupportDoc activeHref="/dieu-khoan">
      <SupportPanel>
        <h1 className={`mb-2 ${supportTitleClass}`}>Điều khoản sử dụng</h1>
        <p className={`mb-6 ${supportBodyClass}`}>
          Khi truy cập website và đặt hàng tại Nhà thuốc OUPharmacy, bạn đồng ý với các điều khoản
          dưới đây. Vui lòng đọc kèm{' '}
          <Link href="/chinh-sach-bao-mat" className="font-medium text-primary-700 hover:underline">
            chính sách bảo mật
          </Link>{' '}
          và{' '}
          <Link href="/chinh-sach-doi-tra" className="font-medium text-primary-700 hover:underline">
            chính sách đổi trả
          </Link>
          .
        </p>

        <div className="space-y-6">
          <SupportSection title="1. Phạm vi dịch vụ">
            <p>
              Website cung cấp thông tin sản phẩm, đặt hàng trực tuyến, theo dõi đơn và các tiện ích
              liên quan (tư vấn, tủ thuốc, yêu cầu mua thuốc) theo tính năng đang mở trên hệ thống.
            </p>
          </SupportSection>

          <SupportSection title="2. Tài khoản và thông tin">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và hoạt động trên tài khoản.</li>
              <li>Thông tin đặt hàng và giao nhận cần chính xác để xử lý đơn.</li>
              <li>Khách chưa đăng nhập vẫn có thể đặt hàng theo luồng guest hiện có.</li>
            </ul>
          </SupportSection>

          <SupportSection title="3. Đơn hàng và thanh toán">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Đơn được xác nhận theo trạng thái hệ thống sau khi hoàn tất đặt hàng.</li>
              <li>Phương thức thanh toán hiển thị tại bước thanh toán.</li>
              <li>Giá, tồn kho và khuyến mãi có thể thay đổi; đơn áp dụng theo thời điểm đặt.</li>
            </ul>
          </SupportSection>

          <SupportSection title="4. Sản phẩm và tư vấn">
            <p>
              Thông tin trên website mang tính tham khảo. Với thuốc kê đơn hoặc tình trạng sức khỏe
              đặc biệt, hãy hỏi bác sĩ / dược sĩ. Tư vấn trên web không thay thế khám chữa bệnh trực
              tiếp khi cần thiết.
            </p>
          </SupportSection>

          <SupportSection title="5. Hành vi không được phép">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Gian lận, phá hoại hoặc xâm phạm hệ thống.</li>
              <li>Đăng tải nội dung sai sự thật, xúc phạm hoặc vi phạm pháp luật.</li>
              <li>Thu thập dữ liệu hàng loạt hoặc can thiệp trái phép vào dịch vụ.</li>
            </ul>
          </SupportSection>

          <SupportSection title="6. Giới hạn trách nhiệm">
            <p>
              OUPharmacy nỗ lực duy trì website ổn định nhưng không cam kết không gián đoạn. Trách
              nhiệm liên quan đơn hàng, đổi trả và hoàn tiền tuân theo chính sách công bố và pháp luật
              hiện hành.
            </p>
          </SupportSection>

          <SupportSection title="7. Liên hệ">
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
