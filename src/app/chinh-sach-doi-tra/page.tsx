import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | OUPharmacy',
  description: 'Chi tiết chính sách đổi trả và hoàn tiền tại OUPharmacy.',
}

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Chính sách đổi trả
          </h1>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">1. Chính sách đổi trả</h2>
          <p className="mb-4 text-base leading-7 text-gray-700">
            Sản phẩm mua tại hệ thống Nhà thuốc OUPharmacy được áp dụng chính sách đổi trả miễn
            phí trong các trường hợp sau:
          </p>

          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100 text-gray-900">
                <tr>
                  <th className="w-2/5 border border-gray-200 px-4 py-3 font-semibold">Tình trạng</th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">Điều kiện áp dụng</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Sản phẩm có lỗi nhà sản xuất</td>
                  <td className="border border-gray-200 px-4 py-3">
                    Thời gian đổi trả không quá 30 ngày kể từ ngày mua, áp dụng cho tất cả ngành
                    hàng và 1 năm đổi với máy thiết bị y tế.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">
                    Sản phẩm không có lỗi nhà sản xuất và không thuộc nhóm loại trừ (*)
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Thời gian đổi trả không quá 30 ngày kể từ ngày mua.</li>
                      <li>Sản phẩm chưa sử dụng (**).</li>
                      <li>Chỉ áp dụng với đơn hàng mua không quá 5 sản phẩm cùng mã trên đơn hàng.</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 text-lg font-semibold text-gray-900">Lưu ý:</h3>

          <p className="mb-2 font-semibold text-gray-900">(*) Nhóm sản phẩm loại trừ:</p>
          <ul className="mb-5 list-disc space-y-2 pl-6 text-gray-700">
            <li>Thuốc điều trị Covid (Molnupiravir), thuốc ung thư (giá từ 5 triệu đồng).</li>
            <li>Hàng tiêm chích, hàng lạnh, hàng cắt liều, hàng đặt theo yêu cầu khách hàng/dự án.</li>
            <li>Sản phẩm không thể tái sử dụng: bút, que thử, vớ, nẹp, kim các loại, ...</li>
            <li>Sản phẩm dạng nước (bình xịt, ...), dạng kem/gel (tuýp bôi, ...).</li>
            <li>
              Sản phẩm đã xé tem niêm phong/màng co, đã mở hộp, không còn nguyên vẹn (ví dụ thuốc đã
              cắt thành viên hoặc sử dụng 1 phần; hộp gồm nhiều gói/chai và đã sử dụng từ 1 gói/chai).
              Sản phẩm còn nguyên nhưng mất vỏ hộp thu phí 30% giá trị hóa đơn.
            </li>
            <li>
              Sản phẩm khuyến mãi hoặc các mặt hàng đã có thông báo loại trừ từ trước trên website/tại
              cửa hàng.
            </li>
          </ul>

          <p className="mb-2 font-semibold text-gray-900">(**) Quy định về quy cách sản phẩm đổi trả:</p>
          <ul className="mb-5 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Đối với thuốc đặc trị ung thư (có giá dưới 5 triệu đồng):
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Bán nguyên hộp: chỉ áp dụng đổi trả nguyên hộp.</li>
                <li>Bán lẻ: áp dụng đổi trả lẻ.</li>
              </ul>
            </li>
            <li>
              Ngoại trừ thuốc đặc trị ung thư, áp dụng đổi/trả một phần và toàn bộ sản phẩm (ví dụ:
              khách hàng mua 1 hộp 3 vỉ thuốc, khách hàng có thể đổi trả 1 vỉ nguyên hoặc cả hộp
              thuốc ...), số tiền hoàn lại được tính dựa theo số lượng thực tế trả hàng và các loại
              phí theo chính sách (nếu có).
            </li>
            <li>
              Các trường hợp đổi/trả dành cho khách hàng có thông tin số điện thoại trên bill để phục
              vụ tra cứu.
            </li>
            <li>
              Quý khách vui lòng hoàn trả các sản phẩm tặng kèm (nếu có) khi phát sinh đổi/trả hàng
              hóa, hoặc Long Châu thu lại số tiền tương đương mức giá của sản phẩm tặng kèm đã được
              công bố.
            </li>
          </ul>

          <h2 className="mb-3 text-2xl font-semibold text-gray-900">2. Phương thức thanh toán</h2>
          <p className="mb-3 text-base leading-7 text-gray-700">
            Khách hàng mang sản phẩm đã mua (bao gồm vỏ hộp, giấy hướng dẫn sử dụng kèm theo) tới cửa
            hàng Nhà thuốc Long Châu gần nhất để được thực hiện đổi trả và hoàn tiền.
          </p>
          <p className="mb-2 text-base leading-7 text-gray-700">
            Để nhận tiền hoàn, khách hàng có 2 lựa chọn:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <span className="font-semibold text-gray-900">Hoàn tiền tại quầy:</span> Cửa hàng chi
              tiền mặt tại quầy cho khách hàng.
            </li>
            <li>
              <span className="font-semibold text-gray-900">Hoàn tiền qua chuyển khoản:</span> Sau khi
              tiếp nhận yêu cầu hoàn tiền qua chuyển khoản của khách hàng, Nhà thuốc Long Châu sẽ gửi
              tới khách hàng một đường link điền thông tin nhận số tiền hoàn và số điện thoại mua hàng
              trên đơn hàng. Sau khi khách hàng gửi thông tin thành công, Nhà thuốc Long Châu sẽ hoàn
              lại tiền trong vòng từ 2-3 ngày (không kể thứ 7, chủ nhật hoặc ngày lễ, Tết).
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
