"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'
import type { City } from '@/lib/services/location'
import { CommonCitiesProvider } from '@/contexts/CommonCitiesContext'
import Toaster from '@/components/Toaster'

export function Providers({
  children,
  initialCities = [],
  initialCitiesError = null,
}: {
  children: ReactNode
  initialCities?: City[]
  initialCitiesError?: string | null
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: true,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <CommonCitiesProvider initialCities={initialCities} initialCitiesError={initialCitiesError}>
        {children}
      </CommonCitiesProvider>
      <Toaster />
    </QueryClientProvider>
  )
}

