import React from 'react'
import Container from '@/components/Container'
import { CartIcon, MenuIcon, SearchIcon, UserIcon } from '@/components/icons'

/**
 * Suspense fallback for `StoreNavShell` while category tree loads.
 * Keep real chrome (icons + search shell) — no gray skeleton blocks.
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
                <span className="justify-self-start rounded-lg p-2 text-white" aria-hidden>
                  <MenuIcon className="h-6 w-6" />
                </span>
                <div className="text-center">
                  <span className="block whitespace-nowrap text-base font-bold leading-tight text-white">
                    NHÀ THUỐC
                  </span>
                  <span className="block whitespace-nowrap text-xs font-semibold leading-tight text-primary-100">
                    OUPHARMACY
                  </span>
                </div>
                <span
                  className="justify-self-end inline-flex rounded-full bg-primary-700 px-2.5 py-2 text-white sm:px-3"
                  aria-hidden
                >
                  <CartIcon className="h-5 w-5" strokeWidth={2} />
                </span>
              </div>
              <div className="relative mt-2.5 w-full">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <div className="h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm leading-10 text-slate-400">
                  Tìm thuốc, thực phẩm chức năng…
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="shrink-0">
                <span className="block whitespace-nowrap text-2xl font-bold leading-tight text-white">
                  NHÀ THUỐC
                </span>
                <span className="block whitespace-nowrap text-lg font-semibold leading-tight text-primary-100">
                  OUPHARMACY
                </span>
              </div>
              <div className="relative min-w-0 flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <div className="h-11 w-full rounded-lg bg-white pl-9 pr-3 text-sm leading-[2.75rem] text-slate-400">
                  Tìm thuốc, thực phẩm chức năng…
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-white" aria-hidden>
                <UserIcon className="h-5 w-5" />
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-3 py-2 text-sm text-white"
                aria-hidden
              >
                <CartIcon className="h-5 w-5" strokeWidth={2} />
                <span>Giỏ hàng</span>
              </span>
            </div>
          </Container>
        </div>
      </header>

      <div className="hidden border-b border-gray-200 bg-white lg:block" aria-hidden="true">
        <Container>
          <div className="flex h-12 items-center gap-6 text-sm text-slate-400">
            <span>Danh mục</span>
          </div>
        </Container>
      </div>
    </>
  )
}
