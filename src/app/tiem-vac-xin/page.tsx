import type { Metadata } from 'next'
import { StaticFeaturePlaceholder } from '@/components/common/StaticFeaturePlaceholder'

export const metadata: Metadata = {
  title: 'Tiêm vắc xin | OUPharmacy',
  description: 'Đặt lịch tiêm vắc xin — sắp ra mắt.',
}

export default function VaccinationPage() {
  return (
    <StaticFeaturePlaceholder
      icon={<span aria-hidden="true">💉</span>}
      title="Tiêm vắc xin"
      description="Dịch vụ đặt lịch và thông tin tiêm chủng đang được chuẩn bị. Quý khách vui lòng theo dõi thông báo trên trang chủ."
    />
  )
}
