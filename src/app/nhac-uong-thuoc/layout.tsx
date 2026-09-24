import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nhắc uống thuốc | OUPharmacy',
  description: 'Xem nhắc hạn dùng và trạng thái nhắc từ tủ thuốc của bạn.',
}

export default function MedicationReminderLayout({ children }: { children: React.ReactNode }) {
  return children
}
