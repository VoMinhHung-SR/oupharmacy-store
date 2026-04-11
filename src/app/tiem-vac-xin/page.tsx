import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Tiêm vắc xin | OUPharmacy',
  description: 'Đặt lịch tiêm vắc xin — sắp ra mắt.',
}

export default function VaccinationPage() {
  return (
    <ComingSoonPage
      icon="💉"
      title="Tiêm vắc xin"
      description="Dịch vụ đặt lịch và thông tin tiêm chủng đang được chuẩn bị. Quý khách vui lòng theo dõi thông báo trên trang chủ."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tiêm vắc xin' },
      ]}
    />
  )
}
