import React from 'react'
import { StoreNavChrome } from '@/layouts/StoreNavChrome'
import { loadNavigationCategories } from '@/layouts/nav/mapNavigationCategories'

/**
 * Fetches category tree once (SSG/ISR) and renders mobile + desktop nav chrome.
 */
export default async function StoreNavShell() {
  const categories = await loadNavigationCategories()
  return <StoreNavChrome categories={categories} />
}
