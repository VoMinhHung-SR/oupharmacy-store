export const CONSULTATION_STEPS = [
  'Quý khách điền thông tin liên hệ và tên sản phẩm cần tư vấn (nếu có).',
  'Dược sĩ chuyên môn sẽ gọi lại tư vấn miễn phí.',
  'Quý khách có thể đặt mua trực tiếp trên hệ thống.',
] as const

export const CONSULTATION_NOTES = [
  'Thuốc kê đơn cần mang theo đơn khi mua tại nhà thuốc.',
  'Dược sĩ vẫn tư vấn khi quý khách chưa có đơn.',
] as const

/** Shared process + notes body (sidebar + guide sheet). */
export function ConsultationProcessBody() {
  return (
    <div className="space-y-5">
      <ol className="space-y-4">
        {CONSULTATION_STEPS.map((text, index) => (
          <li key={text} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-slate-600">{text}</p>
          </li>
        ))}
      </ol>
      <div className="rounded-lg bg-primary-50 px-4 py-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-900">Lưu ý</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          {CONSULTATION_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
