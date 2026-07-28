'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { NavigationCategory } from '@/layouts/NavigationBar/types'

interface NavCategoriesContextValue {
  categories: NavigationCategory[]
}

const NavCategoriesContext = createContext<NavCategoriesContextValue | null>(null)

export function NavCategoriesProvider({
  categories,
  children,
}: {
  categories: NavigationCategory[]
  children: React.ReactNode
}) {
  const value = useMemo(() => ({ categories }), [categories])
  return <NavCategoriesContext.Provider value={value}>{children}</NavCategoriesContext.Provider>
}

export function useNavCategories(): NavigationCategory[] {
  const ctx = useContext(NavCategoriesContext)
  return ctx?.categories ?? []
}

interface MobileNavUiContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  openNav: () => void
  closeNav: () => void
}

const MobileNavUiContext = createContext<MobileNavUiContextValue | null>(null)

export function MobileNavUiProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const openNav = useCallback(() => setOpen(true), [])
  const closeNav = useCallback(() => setOpen(false), [])
  const value = useMemo(
    () => ({ open, setOpen, openNav, closeNav }),
    [open, openNav, closeNav]
  )
  return <MobileNavUiContext.Provider value={value}>{children}</MobileNavUiContext.Provider>
}

export function useMobileNavUi(): MobileNavUiContextValue {
  const ctx = useContext(MobileNavUiContext)
  if (!ctx) {
    // Avoid hard crash during HMR / partial remount outside provider.
    return {
      open: false,
      setOpen: () => undefined,
      openNav: () => undefined,
      closeNav: () => undefined,
    }
  }
  return ctx
}
