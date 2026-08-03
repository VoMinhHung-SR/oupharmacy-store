'use client'

import React from 'react'
import Header from '@/layouts/Header'
import {
  MobileNavUiProvider,
  NavCategoriesProvider,
} from '@/layouts/nav/NavProviders'

/**
 * Shown while category tree is fetching — keeps sticky header visible so
 * page content cannot paint above an empty Suspense hole (fallback={null}).
 */
export function StoreNavFallback() {
  return (
    <NavCategoriesProvider categories={[]}>
      <MobileNavUiProvider>
        <Header />
        <div
          className="hidden h-11 w-full border-b border-slate-200 bg-white lg:block"
          aria-hidden
        />
      </MobileNavUiProvider>
    </NavCategoriesProvider>
  )
}
