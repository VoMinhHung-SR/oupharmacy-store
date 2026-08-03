import React from 'react'
import Container from '@/components/Container'

/**
 * Suspense fallback for `StoreNavShell` while category tree loads.
 * Must not be `null` — otherwise the sticky header disappears on load / RSC refresh.
 */
export function StoreNavFallback() {
  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-40 w-full bg-primary-600 pt-[env(safe-area-inset-top)] text-white shadow-lg"
        aria-busy="true"
        aria-label="Đang tải thanh điều hướng"
      >
        <div className="hidden border-b border-white/10 bg-primary-700/80 py-1.5 lg:block">
          <Container>
            <div className="h-4" />
          </Container>
        </div>

        <div className="py-2.5 lg:py-3">
          <Container>
            <div className="lg:hidden">
              <div className="grid grid-cols-[minmax(2.75rem,1fr)_auto_minmax(2.75rem,1fr)] items-center gap-x-2">
                <div className="h-9 w-9 justify-self-start rounded-md bg-white/20" />
                <div className="text-center">
                  <span className="block whitespace-nowrap text-base font-bold leading-tight text-white">
                    NHÀ THUỐC
                  </span>
                  <span className="block whitespace-nowrap text-xs font-semibold leading-tight text-primary-100">
                    OUPHARMACY
                  </span>
                </div>
                <div className="h-9 w-9 justify-self-end rounded-md bg-white/20" />
              </div>
              <div className="mt-2.5 h-10 w-full rounded-lg bg-white/20" />
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <div className="shrink-0">
                <span className="block whitespace-nowrap text-2xl font-bold leading-tight text-white">
                  NHÀ THUỐC
                </span>
                <span className="block whitespace-nowrap text-lg font-semibold leading-tight text-primary-100">
                  OUPHARMACY
                </span>
              </div>
              <div className="h-11 min-w-0 flex-1 rounded-lg bg-white/20" />
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/20" />
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/20" />
            </div>
          </Container>
        </div>
      </header>

      <div
        className="hidden border-b border-gray-200 bg-white lg:block"
        aria-hidden="true"
      >
        <Container>
          <div className="flex h-12 items-center gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 w-20 rounded bg-gray-200" />
            ))}
          </div>
        </Container>
      </div>
    </>
  )
}
