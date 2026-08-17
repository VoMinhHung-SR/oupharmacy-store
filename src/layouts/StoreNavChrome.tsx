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
 * Home atmosphere lives in page hero band (not here).
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
