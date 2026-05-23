'use client'

import React, { createContext, useContext, useMemo } from 'react'
import type { City } from '@/lib/services/location'

export interface CommonCitiesContextValue {
  cities: City[]
  citiesError: string | null
}

const CommonCitiesContext = createContext<CommonCitiesContextValue | null>(null)

export function CommonCitiesProvider({
  children,
  initialCities,
  initialCitiesError = null,
}: {
  children: React.ReactNode
  initialCities: City[]
  initialCitiesError?: string | null
}) {
  const value = useMemo(
    () => ({
      cities: initialCities,
      citiesError: initialCitiesError ?? null,
    }),
    [initialCities, initialCitiesError]
  )
  return <CommonCitiesContext.Provider value={value}>{children}</CommonCitiesContext.Provider>
}

export function useCommonCities(): CommonCitiesContextValue {
  const ctx = useContext(CommonCitiesContext)
  if (!ctx) {
    throw new Error('useCommonCities must be used within CommonCitiesProvider (wrap in root layout)')
  }
  return ctx
}
