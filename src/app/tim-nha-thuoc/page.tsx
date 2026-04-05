import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Tìm nhà thuốc | OUPharmacy',
  description: 'Tìm nhà thuốc gần bạn — sắp ra mắt.',
}

export default function PharmacyFinderPage() {
  return (
    <ComingSoonPage
      icon="📍"
      title="Tìm nhà thuốc"
      description="Bản đồ và danh sách nhà thuốc đang được tích hợp. Quý khách vui lòng quay lại sau hoặc liên hệ để được chỉ dẫn."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tìm nhà thuốc' },
      ]}
    />
  )
}
