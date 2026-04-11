import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Trung tâm trợ giúp | OUPharmacy',
  description: 'Câu hỏi thường gặp và hướng dẫn — sắp ra mắt.',
}

export default function HelpCenterPage() {
  return (
    <ComingSoonPage
      icon="💬"
      title="Trung tâm trợ giúp"
      description="FAQ và hướng dẫn mua hàng đang được biên soạn. Tạm thời quý khách vui lòng liên hệ trực tiếp để được hỗ trợ nhanh nhất."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Trung tâm trợ giúp' },
      ]}
    />
  )
}
