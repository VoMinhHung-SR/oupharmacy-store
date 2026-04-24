import type { Metadata } from 'next'
import { StaticFeaturePlaceholder } from '@/components/common/StaticFeaturePlaceholder'

export const metadata: Metadata = {
  title: 'Tìm nhà thuốc | OUPharmacy',
  description: 'Tìm nhà thuốc gần bạn — sắp ra mắt.',
}

export default function PharmacyFinderPage() {
  return (
    <StaticFeaturePlaceholder
      icon={<span aria-hidden="true">📍</span>}
      title="Tìm nhà thuốc"
      description="Bản đồ và danh sách nhà thuốc đang được tích hợp. Quý khách vui lòng quay lại sau hoặc liên hệ để được chỉ dẫn."
    />
  )
}
