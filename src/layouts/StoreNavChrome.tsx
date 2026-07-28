'use client'

import React from 'react'
import Header from '@/layouts/Header'
import NavigationBar from '@/layouts/NavigationBar'
import {
  MobileNavUiProvider,
  NavCategoriesProvider,
} from '@/layouts/nav/NavProviders'
import type { NavigationCategory } from '@/layouts/NavigationBar/types'

interface StoreNavChromeProps {
  categories: NavigationCategory[]
}

/**
 * Client chrome: providers + header + desktop nav bar.
 * Suspense for `useSearchParams` is provided by root layout.
 */
export function StoreNavChrome({ categories }: StoreNavChromeProps) {
  return (
    <NavCategoriesProvider categories={categories}>
      <MobileNavUiProvider>
        <Header />
        <NavigationBar categories={categories} />
      </MobileNavUiProvider>
    </NavCategoriesProvider>
  )
}
