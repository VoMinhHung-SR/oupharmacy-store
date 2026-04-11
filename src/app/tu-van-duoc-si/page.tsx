import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Tư vấn với dược sĩ | OUPharmacy',
  description: 'Tư vấn chuyên môn với dược sĩ — sắp ra mắt.',
}

export default function ConsultationPage() {
  return (
    <ComingSoonPage
      icon="👨‍⚕️"
      title="Tư vấn với dược sĩ"
      description="Kênh tư vấn trực tuyến với dược sĩ đang được hoàn thiện. Quý khách có thể mua thuốc OTC qua tìm kiếm sản phẩm hoặc liên hệ để được hỗ trợ."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tư vấn với dược sĩ' },
      ]}
    />
  )
}
