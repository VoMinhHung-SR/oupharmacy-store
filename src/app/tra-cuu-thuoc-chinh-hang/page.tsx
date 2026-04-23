import type { Metadata } from 'next'
import { StaticFeaturePlaceholder } from '@/components/common/StaticFeaturePlaceholder'

export const metadata: Metadata = {
  title: 'Tra cứu thuốc chính hãng | OUPharmacy',
  description: 'Tra cứu nguồn gốc thuốc — sắp ra mắt.',
}

export default function AuthenticProductLookupPage() {
  return (
    <StaticFeaturePlaceholder
      icon={<span aria-hidden="true">🔍</span>}
      title="Tra cứu thuốc chính hãng"
      description="Công cụ xác thực sản phẩm đang được phát triển. Hiện tại quý khách có thể mua hàng chính hãng qua cửa hàng trực tuyến của chúng tôi."
    />
  )
}
