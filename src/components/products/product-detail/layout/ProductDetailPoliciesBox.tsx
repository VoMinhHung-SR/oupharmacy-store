import { PRODUCT_DETAIL_POLICIES } from '@/components/products/product-detail/constants/product-detail-policies'

export function ProductDetailPoliciesBox() {
  return (
    <div className="relative z-10 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {PRODUCT_DETAIL_POLICIES.map((text) => (
        <div key={text} className="text-sm text-gray-700">
          <span className="font-medium">{text}</span>
        </div>
      ))}
    </div>
  )
}
