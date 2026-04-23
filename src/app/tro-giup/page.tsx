import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trung tâm trợ giúp | OUPharmacy',
  description: 'Câu hỏi thường gặp và hướng dẫn mua hàng tại OUPharmacy.',
}

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Trung tâm trợ giúp
          </h1>
          <p className="mb-6 text-base leading-7 text-gray-700">
            Chào mừng bạn đến với Trung tâm trợ giúp OUPharmacy. Dưới đây là các câu hỏi thường gặp
            và hướng dẫn nhanh để bạn mua hàng thuận tiện hơn.
          </p>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">1. Đặt hàng</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
            <li>Tìm sản phẩm theo tên hoặc danh mục, sau đó chọn số lượng và thêm vào giỏ hàng.</li>
            <li>Vào trang giỏ hàng để kiểm tra lại sản phẩm trước khi tiến hành thanh toán.</li>
            <li>
              Nếu không đặt được hàng, vui lòng kiểm tra tồn kho, địa chỉ nhận hàng hoặc thử lại sau
              vài phút.
            </li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">2. Thanh toán</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
            <li>OUPharmacy hỗ trợ các phương thức thanh toán theo lựa chọn hiển thị tại checkout.</li>
            <li>
              Với lỗi thanh toán, bạn có thể đổi phương thức khác hoặc kiểm tra lại thông tin tài
              khoản thanh toán.
            </li>
            <li>Đơn hàng chỉ được xác nhận khi hệ thống ghi nhận thanh toán thành công.</li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">3. Đơn hàng</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Theo dõi trạng thái đơn tại mục <strong>Đơn hàng</strong> trong tài khoản của bạn.
            </li>
            <li>
              Bạn có thể hủy đơn khi đơn chưa chuyển sang trạng thái xử lý/đang giao (tùy điều kiện
              hệ thống).
            </li>
            <li>
              Nếu cần hỗ trợ thay đổi thông tin nhận hàng, vui lòng liên hệ sớm để được hỗ trợ kịp
              thời.
            </li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">4. Đổi trả và hoàn tiền</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
            <li>Chính sách đổi trả áp dụng theo điều kiện từng nhóm sản phẩm.</li>
            <li>Thời gian xử lý hoàn tiền phụ thuộc phương thức hoàn tiền đã chọn.</li>
            <li>
              Xem chi tiết tại trang <strong>Chính sách đổi trả</strong> để nắm đầy đủ điều kiện áp
              dụng.
            </li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">5. Tài khoản</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
            <li>Bạn có thể đăng ký tài khoản mới hoặc đăng nhập để quản lý đơn hàng dễ dàng hơn.</li>
            <li>Nếu quên mật khẩu, dùng chức năng “Quên mật khẩu” để nhận hướng dẫn đặt lại.</li>
            <li>Cập nhật hồ sơ, địa chỉ và cài đặt tài khoản trong mục “Tài khoản”.</li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">6. Liên hệ hỗ trợ</h2>
          <p className="text-base leading-7 text-gray-700">
            Nếu bạn chưa tìm thấy câu trả lời phù hợp, vui lòng truy cập trang Liên hệ để gửi yêu cầu
            hỗ trợ. Đội ngũ OUPharmacy sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </section>
    </main>
  )
}
