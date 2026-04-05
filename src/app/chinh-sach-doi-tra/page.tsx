import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Chính sách đổi trả | OUPharmacy',
  description: 'Chính sách đổi trả hàng — sắp ra mắt.',
}

export default function ReturnsPolicyPage() {
  return (
    <ComingSoonPage
      icon="📋"
      title="Chính sách đổi trả"
      description="Nội dung chi tiết chính sách đổi trả đang được cập nhật. Quý khách có thể liên hệ để được giải đáp trước khi đặt hàng."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Chính sách đổi trả' },
      ]}
    />
  )
}
