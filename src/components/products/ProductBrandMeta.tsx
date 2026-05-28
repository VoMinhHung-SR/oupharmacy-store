import { CountryTag } from './CountryTag'

type ProductBrandMetaProps = {
  brandName: string
  brandCountry?: string | null
  variant?: 'pdp' | 'card'
}

export function ProductBrandMeta({
  brandName,
  brandCountry,
  variant = 'pdp',
}: ProductBrandMetaProps) {
  const country = brandCountry?.trim()
  const brandClassName =
    variant === 'pdp' ? 'font-medium text-primary-600' : 'font-medium text-gray-800'

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {country ? <CountryTag label={country} /> : null}
      <p className="text-sm text-gray-600">
        Thương hiệu: <span className={brandClassName}>{brandName}</span>
      </p>
    </div>
  )
}
