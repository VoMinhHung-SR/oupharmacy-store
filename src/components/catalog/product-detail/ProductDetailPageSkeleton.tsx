import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'

/** PDP loading placeholder (resolve-path + product detail fetch). */
export function ProductDetailPageSkeleton() {
  return (
    <Container className="pb-28 md:pb-32">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sản phẩm', href: '/tim-kiem' },
          { label: 'Đang tải...' },
        ]}
        className="py-4"
      />
      <div className="space-y-6 rounded-lg bg-white p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 w-20 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
            <div className="space-y-3 border-t border-gray-200 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
            <div className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </Container>
  )
}
