'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/Container'
import { ProductCard } from '@/components/cards/ProductCard'
import { ProductSortAndView } from '@/components/catalog/_shared/listing/ProductSortAndView'
import { LoadMoreProductsButton } from '@/components/catalog/_shared/listing/LoadMoreProductsButton'
import { CategoryListingSidebar } from '@/components/catalog/category-listing/parts/CategoryListingSidebar'
import { CategoryListingMobileFilters } from '@/components/catalog/category-listing/parts/CategoryListingMobileFilters'
import {
  ActiveFilters,
  countActiveFacetFilters,
  stripFacetFilters,
} from '@/components/catalog/_shared/filters/ActiveFilters'
import { BackdropLoading } from '@/components/BackdropLoading'
import { ProductGridSkeleton } from '@/components/skeletons/ProductGridSkeleton'
import { PAGINATION } from '@/lib/constant'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import { usePreservedSearchFacets } from '@/lib/hooks/usePreservedSearchFacets'
import { pickFacetSearchParams } from '@/lib/listing/facetSearchParams'
import { getListingRequestUiFlags } from '@/lib/listing/getListingRequestUiFlags'
import {
  scatterBrandCampaignDiscounts,
  parseBrandPromoParam,
  type BrandPageMeta,
} from '@/lib/services/brandCampaigns'
import { sortOptionToStoreSearchSort } from '@/lib/services/search'
import {
  buildProductCardPayload,
  mergeUniqueProducts,
  type Product,
  type ProductFilters,
} from '@/lib/services/products'
import { PAGE_Y_SECTION } from '@/lib/layout/pageLayout'

type SortOption = 'bestselling' | 'price-low' | 'price-high'

type BrandListingPageProps = {
  meta: BrandPageMeta
}

export function BrandListingPage({ meta }: BrandListingPageProps) {
  const searchParams = useSearchParams()
  const promoFromUrl = parseBrandPromoParam(searchParams.get('promo'))
  const discountPercent = promoFromUrl ?? meta.discountPercent

  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const [sortOption, setSortOption] = useState<SortOption>('bestselling')
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({ brand: meta.id })
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE)
    setAccumulatedProducts([])
    setActiveFilters({ brand: meta.id })
  }, [meta.id])

  const facetParams = useMemo(() => pickFacetSearchParams(activeFilters), [activeFilters])

  const searchParamsApi = useMemo(
    () => ({
      q: '',
      page,
      page_size: PAGINATION.DEFAULT_PAGE_SIZE,
      sort: sortOptionToStoreSearchSort(sortOption),
      category: facetParams.category,
      brand: facetParams.brand || meta.id,
      origin_country: facetParams.origin_country,
      price_range: facetParams.price_range,
      in_stock: facetParams.in_stock,
      attrs: facetParams.attrs.length ? facetParams.attrs : undefined,
      include_facets: true,
    }),
    [page, sortOption, facetParams, meta.id]
  )

  const searchEnabled = Boolean(meta.id)
  const { data, isLoading, isFetching, isPlaceholderData, dataUpdatedAt, error } = useStoreSearch(
    searchParamsApi,
    { enabled: searchEnabled }
  )

  useEffect(() => {
    if (!data || isPlaceholderData) return
    const items = data.items ?? []
    if (page <= 1) {
      setAccumulatedProducts(items)
      return
    }
    setAccumulatedProducts((prev) => mergeUniqueProducts(prev, items))
  }, [data, dataUpdatedAt, isPlaceholderData, page])

  const hasActiveFacetFilters =
    facetParams.category != null ||
    (facetParams.brand != null && facetParams.brand !== meta.id) ||
    facetParams.origin_country != null ||
    facetParams.price_range != null ||
    facetParams.in_stock != null ||
    facetParams.attrs.length > 0

  const facetFilters = usePreservedSearchFacets(data?.facets, {
    scopeKey: `brand:${meta.id}`,
    hasActiveFacetFilters,
    isPlaceholderData,
    dataUpdatedAt,
  })

  /** Sidebar chip count excludes locked page brand (always applied). */
  const filtersForSidebar = useMemo(() => {
    const { brand: _brand, ...rest } = activeFilters
    return rest
  }, [activeFilters])

  const { isInitialLoad, isRefreshing, isFetchingMore } = getListingRequestUiFlags({
    page,
    productCount: accumulatedProducts.length,
    hasData: !!data,
    isLoading,
    isFetching,
    isPlaceholderData,
    enabled: searchEnabled,
  })

  /** Avoid "Không có bộ lọc khả dụng" flash before first facets land. */
  const filtersLoading = !data && (isLoading || isFetching || isInitialLoad)

  const totalCount = data?.meta.total ?? meta.productCount ?? accumulatedProducts.length
  const remainingCount = Math.max(0, totalCount - accumulatedProducts.length)
  const hasMore = remainingCount > 0 && accumulatedProducts.length > 0
  const activeFacetCount = countActiveFacetFilters(filtersForSidebar)

  const handleFiltersChange = (next: ProductFilters) => {
    const { page: _p, page_size: _ps, ordering: _o, price_sort: _psort, ...rest } = next
    // Keep category / attrs / etc.; always re-lock page brand.
    setActiveFilters({ ...rest, brand: meta.id })
    setPage(PAGINATION.DEFAULT_PAGE)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
    setPage(PAGINATION.DEFAULT_PAGE)
  }

  return (
    <div className="bg-[#ededed]">
      <Container className={`space-y-5 sm:space-y-6 ${PAGE_Y_SECTION}`}>
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="font-medium text-primary-600 hover:text-primary-700">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li>
              <Link href="/" className="font-medium text-primary-600 hover:text-primary-700">
                Thương hiệu
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li className="line-clamp-1 text-gray-700">{meta.name}</li>
          </ol>
        </nav>

        <header className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-primary-100">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 top-0 h-full w-1/2 bg-gradient-to-l from-primary-100/70 to-transparent md:w-[42%]"
            aria-hidden
          />

          <div className="relative z-10 grid md:grid-cols-[minmax(0,1fr)_minmax(160px,32%)]">
            <div className="flex flex-col justify-center gap-2 px-5 py-4 sm:gap-2.5 sm:px-6 sm:py-5 md:px-7 md:py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
                  Thương hiệu
                </span>
                {meta.country ? (
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                    {meta.country}
                  </span>
                ) : null}
                <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  Giảm đến {discountPercent}%
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
                {meta.name}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-gray-600">
                Sản phẩm {meta.name}
                {meta.country ? ` từ ${meta.country}` : ''} đang ưu đãi trên OUPharmacy.
              </p>
              <p className="text-sm font-semibold text-primary-700">
                {totalCount.toLocaleString('vi-VN')} sản phẩm
              </p>
            </div>

            <div className="relative flex items-center justify-center px-4 pb-4 pt-0 md:px-5 md:py-4">
              {meta.productImage ? (
                <div className="flex w-full max-w-[220px] items-center justify-center rounded-xl bg-white p-2.5 ring-1 ring-inset ring-primary-100 sm:p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- catalog CDN */}
                  <img
                    src={meta.productImage}
                    alt=""
                    className="h-24 w-auto max-w-full object-contain sm:h-28 md:h-32"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary-600 text-3xl font-bold text-white sm:h-28 sm:w-28 sm:text-4xl">
                  {meta.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row">
          <CategoryListingSidebar
            facetFilters={facetFilters}
            filtersLoading={filtersLoading}
            categoryFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
          />

          <CategoryListingMobileFilters
            open={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            facetFilters={facetFilters}
            filtersLoading={filtersLoading}
            categoryFilters={filtersForSidebar}
            onFiltersChange={handleFiltersChange}
          />

          <main className="min-w-0 flex-1">
            <ProductSortAndView
              sortOption={sortOption}
              onSortChange={handleSortChange}
              productCount={totalCount}
              onOpenFilters={() => setShowMobileFilters(true)}
              activeFacetCount={activeFacetCount}
              notice={
                <p className="text-xs leading-relaxed text-gray-400">
                  <b>Lưu ý: </b>Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
                </p>
              }
            />

            {facetFilters && facetFilters.length > 0 ? (
              <ActiveFilters
                activeFilters={filtersForSidebar}
                filterGroups={facetFilters}
                onRemoveFilter={(filterKey) => {
                  const next = { ...activeFilters }
                  delete next[filterKey as keyof ProductFilters]
                  handleFiltersChange(next)
                }}
                onClearAll={() =>
                  handleFiltersChange({ ...stripFacetFilters(activeFilters), brand: meta.id })
                }
              />
            ) : null}

            {error ? (
              <p className="py-10 text-center text-sm text-red-600">
                Không tải được sản phẩm. Thử lại sau.
              </p>
            ) : isInitialLoad ? (
              <ProductGridSkeleton count={8} columns="listing" />
            ) : accumulatedProducts.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-600">
                Chưa có sản phẩm cho thương hiệu này.
              </p>
            ) : (
              <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {scatterBrandCampaignDiscounts(
                  accumulatedProducts.map((product) => buildProductCardPayload(product)),
                  discountPercent,
                  meta.id,
                  totalCount
                ).map((card) => (
                  <ProductCard key={card.id} product={card} />
                ))}
              </div>
            )}

            {hasMore && !isRefreshing ? (
              <div className="mt-6">
                <LoadMoreProductsButton
                  remainingCount={remainingCount}
                  onLoadMore={() => setPage((p) => p + 1)}
                  loading={isFetchingMore}
                />
              </div>
            ) : null}
          </main>
        </div>
      </Container>

      <BackdropLoading
        isOpen={isRefreshing}
        loadingText="Đang lọc sản phẩm…"
        lockScroll={false}
        opacity={0.45}
        size="md"
      />
    </div>
  )
}
