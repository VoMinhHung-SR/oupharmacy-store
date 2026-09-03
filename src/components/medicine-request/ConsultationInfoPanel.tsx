import Link from 'next/link'

export function ConsultationInfoPanel() {
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Quy trình tư vấn tại OUPharmacy</h2>
        <ol className="space-y-3 text-sm leading-6 text-gray-700">
          <li>
            <span className="font-semibold text-primary-700">1.</span> Quý khách điền thông tin liên hệ và
            tên sản phẩm cần tư vấn (nếu có).
          </li>
          <li>
            <span className="font-semibold text-primary-700">2.</span> Dược sĩ chuyên môn sẽ gọi lại tư vấn
            miễn phí.
          </li>
          <li>
            <span className="font-semibold text-primary-700">3.</span> Quý khách có thể đặt mua trực tiếp
            trên hệ thống.
          </li>
        </ol>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <p className="font-semibold">Lưu ý</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Thuốc kê đơn cần mang theo đơn khi mua tại nhà thuốc.</li>
          <li>Dược sĩ vẫn tư vấn khi quý khách chưa có đơn.</li>
        </ul>
      </div>
      <Link
        href="/tai-khoan/don-hang"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline"
      >
        Xem lại đơn hàng của tôi
      </Link>
    </aside>
  )
}
