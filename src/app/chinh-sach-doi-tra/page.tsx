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
  title: 'Chính sách đổi trả | OUPharmacy',
  description: 'Điều kiện đổi trả và hoàn tiền tại Nhà thuốc OUPharmacy.',
}

export default function ReturnsPolicyPage() {
  return (
    <SupportDoc activeHref="/chinh-sach-doi-tra">
      <SupportPanel>
        <h1 className={`mb-2 ${supportTitleClass}`}>Chính sách đổi trả</h1>
        <p className={`mb-6 ${supportBodyClass}`}>
          Áp dụng cho đơn hàng mua trên website Nhà thuốc OUPharmacy. Chi tiết có thể được cập nhật;
          khi có thay đổi chúng tôi công bố trên trang này.
        </p>

        <div className="space-y-6">
          <SupportSection title="1. Điều kiện đổi trả">
            <p>
              Sản phẩm mua tại OUPharmacy được xem xét đổi trả miễn phí trong các trường hợp sau:
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    <th className="w-2/5 border-b border-slate-200 px-3 py-2.5 font-semibold">
                      Tình trạng
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">
                      Điều kiện
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr>
                    <td className="border-b border-slate-100 px-3 py-2.5 align-top">
                      Lỗi nhà sản xuất
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2.5">
                      Trong 30 ngày kể từ ngày nhận hàng (thiết bị y tế: tối đa 12 tháng theo hướng
                      dẫn sản phẩm).
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 align-top">Không lỗi NSX, không thuộc nhóm loại trừ</td>
                    <td className="px-3 py-2.5">
                      <ul className="list-disc space-y-1 pl-4">
                        <li>Trong 30 ngày kể từ ngày nhận hàng.</li>
                        <li>Sản phẩm chưa sử dụng, còn nguyên tem / bao bì.</li>
                        <li>Đơn không quá 5 sản phẩm cùng mã.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SupportSection>

          <SupportSection title="2. Nhóm sản phẩm loại trừ">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Thuốc đặc trị (ví dụ ung thư giá cao), hàng tiêm chích, hàng lạnh, hàng cắt liều.</li>
              <li>Hàng đặt theo yêu cầu riêng / dự án.</li>
              <li>Sản phẩm không thể tái sử dụng: que thử, kim, một số dụng cụ dùng một lần…</li>
              <li>Dạng nước / kem / gel đã mở; sản phẩm đã xé tem niêm phong hoặc mất vỏ hộp.</li>
              <li>Hàng khuyến mãi hoặc mặt hàng đã ghi loại trừ trên trang sản phẩm / đơn hàng.</li>
            </ul>
          </SupportSection>

          <SupportSection title="3. Cách yêu cầu đổi trả">
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Liên hệ hotline{' '}
                <a
                  href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                  className="font-medium text-primary-700 hover:underline"
                >
                  {STORE_SUPPORT.HOTLINE_DISPLAY}
                </a>{' '}
                hoặc gửi yêu cầu tại{' '}
                <Link href="/lien-he" className="font-medium text-primary-700 hover:underline">
                  trang Liên hệ
                </Link>{' '}
                (chủ đề Khiếu nại / Đơn hàng), kèm mã đơn và lý do.
              </li>
              <li>
                Giữ sản phẩm, hóa đơn / mã đơn và phụ kiện kèm theo (hướng dẫn sử dụng, quà tặng nếu
                có) đến khi được hướng dẫn gửi lại hoặc đối soát.
              </li>
              <li>
                Sau khi OUPharmacy xác nhận đủ điều kiện, chúng tôi hướng dẫn quy trình hoàn / đổi
                và thời gian dự kiến.
              </li>
            </ol>
          </SupportSection>

          <SupportSection title="4. Hình thức hoàn tiền">
            <p>Tùy phương thức thanh toán của đơn, bạn có thể được hỗ trợ:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <span className="font-medium text-slate-800">Hoàn về phương thức đã thanh toán</span>{' '}
                (ví / thẻ / chuyển khoản) trong khoảng 2–5 ngày làm việc sau khi xác nhận (không kể
                cuối tuần và ngày lễ).
              </li>
              <li>
                <span className="font-medium text-slate-800">Đơn COD / tiền mặt:</span> hoàn qua
                chuyển khoản theo thông tin bạn cung cấp sau khi yêu cầu được duyệt.
              </li>
            </ul>
            <p>
              Nếu đơn có sản phẩm tặng kèm, vui lòng hoàn trả kèm theo hoặc trừ giá trị quà theo
              thông báo trên đơn / chương trình.
            </p>
          </SupportSection>
        </div>
      </SupportPanel>
    </SupportDoc>
  )
}
