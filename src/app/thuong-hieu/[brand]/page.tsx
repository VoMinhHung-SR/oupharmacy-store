import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BrandListingPage } from '@/components/catalog/brand/BrandListingPage'
import {
  getBrandPageMetaSSG,
  parseBrandPromoParam,
} from '@/lib/services/brandCampaigns'

type BrandPageProps = {
  params: { brand: string }
  searchParams: { bid?: string; promo?: string }
}

export async function generateMetadata({
  params,
  searchParams,
}: BrandPageProps): Promise<Metadata> {
  const meta = await getBrandPageMetaSSG({
    slug: decodeURIComponent(params.brand),
    brandId: typeof searchParams.bid === 'string' ? searchParams.bid : undefined,
    promo: parseBrandPromoParam(
      typeof searchParams.promo === 'string' ? searchParams.promo : undefined
    ),
  })
  if (!meta) {
    return { title: 'Không tìm thấy thương hiệu — OUPharmacy' }
  }
  return {
    title: `${meta.name} — Thương hiệu | OUPharmacy`,
    description: `Sản phẩm ${meta.name}${meta.country ? ` từ ${meta.country}` : ''} tại OUPharmacy. Giảm đến ${meta.discountPercent}%.`,
  }
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const meta = await getBrandPageMetaSSG({
    slug: decodeURIComponent(params.brand),
    brandId: typeof searchParams.bid === 'string' ? searchParams.bid : undefined,
    promo: parseBrandPromoParam(
      typeof searchParams.promo === 'string' ? searchParams.promo : undefined
    ),
  })

  if (!meta) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ededed] py-10 text-center text-sm text-gray-500">
          Đang tải thương hiệu…
        </div>
      }
    >
      <BrandListingPage meta={meta} />
    </Suspense>
  )
}
