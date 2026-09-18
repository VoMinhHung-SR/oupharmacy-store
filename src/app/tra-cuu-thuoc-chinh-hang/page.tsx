import type { Metadata } from 'next'
import { StaticFeaturePlaceholder } from '@/components/common/StaticFeaturePlaceholder'

export const metadata: Metadata = {
  title: 'Tra cứu | OUPharmacy',
  description: 'Tra cứu nguồn gốc thuốc chính hãng — sắp ra mắt.',
}

export default function AuthenticProductLookupPage() {
  return (
    <StaticFeaturePlaceholder
      icon={<span aria-hidden="true">🔍</span>}
      title="Tra cứu thuốc chính hãng"
      description="Công cụ xác thực sản phẩm đang được phát triển. Hiện tại quý khách có thể mua hàng qua cửa hàng trực tuyến hoặc chat với dược sĩ để được hỗ trợ."
    />
  )
}
