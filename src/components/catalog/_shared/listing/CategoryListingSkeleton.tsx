import { Container } from '@/components/Container'
import { SIDEBAR } from '@/lib/constant'

export function CategoryListingSkeleton() {
  return (
    <Container className="py-4">
      <div className="mb-4">
        <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden flex-shrink-0 lg:block" style={{ width: `${SIDEBAR.WIDTH}px` }}>
          <div
            className="sticky w-full space-y-4 rounded-lg border border-gray-200 bg-white p-4"
            style={{ top: `${SIDEBAR.STICKY_TOP}px` }}
          >
            <div className="h-8 animate-pulse rounded bg-gray-200" />
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <main className="min-w-0 flex-1 space-y-6">
          <div className="lg:hidden">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>

          <div className="h-16 w-full animate-pulse rounded-lg bg-gray-200" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Container>
  )
}
