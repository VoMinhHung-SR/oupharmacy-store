import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Tra cứu thuốc chính hãng | OUPharmacy',
  description: 'Tra cứu nguồn gốc thuốc — sắp ra mắt.',
}

export default function AuthenticProductLookupPage() {
  return (
    <ComingSoonPage
      icon="🔍"
      title="Tra cứu thuốc chính hãng"
      description="Công cụ xác thực sản phẩm đang được phát triển. Hiện tại quý khách có thể mua hàng chính hãng qua cửa hàng trực tuyến của chúng tôi."
      breadcrumbItems={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tra cứu thuốc chính hãng' },
      ]}
    />
  )
}
