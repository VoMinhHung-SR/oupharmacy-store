import type { Metadata } from 'next'
import { StaticFeaturePlaceholder } from '@/components/common/StaticFeaturePlaceholder'
import { MED_REMINDER_PLACEHOLDER_ACTIONS } from '@/lib/constant'

export const metadata: Metadata = {
  title: 'Nhắc uống thuốc | OUPharmacy',
  description: 'Nhắc lịch uống thuốc theo tủ thuốc cá nhân — sắp ra mắt.',
}

export default function MedicationReminderPage() {
  return (
    <StaticFeaturePlaceholder
      icon={<span aria-hidden="true">⏰</span>}
      title="Nhắc uống thuốc"
      description="Tính năng nhắc lịch uống theo giờ đang được hoàn thiện, gắn với tủ thuốc của bạn. Hiện tại quý khách có thể quản lý thuốc trong tủ thuốc hoặc chat với dược sĩ."
      actions={MED_REMINDER_PLACEHOLDER_ACTIONS}
    />
  )
}
