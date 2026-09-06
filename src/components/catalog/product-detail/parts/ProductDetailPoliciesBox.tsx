import { PRODUCT_DETAIL_POLICIES } from '@/components/catalog/product-detail/constants/product-detail-policies'

/** Purchase-policy strip under the product gallery — title + subtitle, one line each. */
export function ProductDetailPoliciesBox() {
  return (
    <ul
      className="grid list-none grid-cols-3 gap-1.5 sm:gap-2 md:gap-3"
      aria-label="Chính sách mua hàng"
    >
      {PRODUCT_DETAIL_POLICIES.map(({ title, subtitle, Icon }) => (
        <li key={title} className="flex min-w-0 items-start gap-1 sm:gap-1.5 md:gap-2">
          <Icon
            className="mt-px h-5 w-5 shrink-0 text-primary-600 sm:h-6 sm:w-6 md:h-7 md:w-7"
            strokeWidth={1.75}
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[9px] font-semibold text-slate-800 sm:text-[10px] md:text-[11px]" title={title}>
              {title}
            </p>
            <p className="truncate text-[9px] text-slate-500 sm:text-[10px] md:text-[11px]" title={subtitle}>
              {subtitle}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
