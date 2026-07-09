'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { HEADER_SEARCH, STORAGE_KEY } from '@/lib/constant'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { useProducts } from '@/lib/hooks/useProducts'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import {
  buildProductCardPayload,
  type Product,
  type ProductCardPayload,
} from '@/lib/services/products'
import { recordSearch } from '@/lib/services/searchTerms'

export type HeaderSearchSuggestionItem = {
  product: Product
  card: ProductCardPayload
  href: string
}

/** Used by browse panel when mapping products to links */
export function headerSearchProductHref(card: ProductCardPayload): string | null {
  return card.href ?? null
}

function headerSearchPickTopDeals(products: Product[], limit: number): Product[] {
  return products
    .map((p) => {
      let pct =
        typeof p.discount_percent === 'number' && p.discount_percent > 0 ? p.discount_percent : 0
      if (pct === 0 && p.compare_at_price != null && p.compare_at_price > (p.price_value || 0)) {
        pct = Math.round(((p.compare_at_price - (p.price_value || 0)) / p.compare_at_price) * 100)
      }
      return { p, pct }
    })
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit)
    .map((x) => x.p)
}

function readSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY.SEARCH_HISTORY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeSearchHistory(entries: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    STORAGE_KEY.SEARCH_HISTORY,
    JSON.stringify(entries.slice(0, HEADER_SEARCH.HISTORY_MAX))
  )
}

function pushSearchHistory(term: string) {
  const t = term.trim()
  if (!t) return
  const prev = readSearchHistory()
  const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(
    0,
    HEADER_SEARCH.HISTORY_MAX
  )
  writeSearchHistory(next)
}

export function useHeaderSearchDropdown() {
  const t = useTranslations('common')
  const router = useRouter()
  const baseId = useId()
  const panelId = `${baseId}-panel`
  const rootRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const debouncedQuery = useDebouncedValue(query, HEADER_SEARCH.DEBOUNCE_MS)
  const debouncedTrimmed = debouncedQuery.trim()
  const isSearchMode = debouncedTrimmed.length >= HEADER_SEARCH.MIN_QUERY_LEN

  const suggestSearchParams = useMemo(
    () => ({
      q: debouncedTrimmed,
      page_size: HEADER_SEARCH.SUGGEST_PAGE_SIZE,
      page: 1,
      in_stock: true,
      sort: 'relevance' as const,
      include_facets: false,
    }),
    [debouncedTrimmed]
  )

  const hotFilters = useMemo(
    () => ({
      ordering: '-product_ranking' as const,
      page_size: HEADER_SEARCH.HOT_PAGE_SIZE,
      page: 1,
      in_stock: true,
    }),
    []
  )

  const dealsSourceFilters = useMemo(
    () => ({
      ordering: '-product_ranking' as const,
      page_size: HEADER_SEARCH.DEALS_FETCH_SIZE,
      page: 1,
      in_stock: true,
    }),
    []
  )

  const {
    data: suggestData,
    isPending: suggestPending,
    isFetching: suggestFetching,
    isError: suggestError,
  } = useStoreSearch(suggestSearchParams, {
    enabled: open && isSearchMode,
  })

  const { data: hotData, isPending: hotPending } = useProducts(hotFilters, {
    enabled: open && !isSearchMode,
    staleTime: HEADER_SEARCH.PANEL_STALE_MS,
  })

  const { data: dealsSourceData, isPending: dealsPending } = useProducts(dealsSourceFilters, {
    enabled: open && !isSearchMode,
    staleTime: HEADER_SEARCH.PANEL_STALE_MS,
  })

  const suggestionResults = suggestData?.items
  const hotResults = hotData?.results
  const dealsResults = dealsSourceData?.results

  const hotProducts = useMemo(
    () => (hotResults ?? []).slice(0, HEADER_SEARCH.HOT_PAGE_SIZE),
    [hotResults]
  )
  const dealProducts = useMemo(
    () => headerSearchPickTopDeals(dealsResults ?? [], HEADER_SEARCH.DEALS_SHOW),
    [dealsResults]
  )

  const showSuggestSkeleton = isSearchMode && (suggestPending || (suggestFetching && !suggestData))

  const refreshHistory = useCallback(() => {
    setHistory(readSearchHistory())
  }, [])

  useEffect(() => {
    if (open) refreshHistory()
  }, [open, refreshHistory])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const navigateSearch = useCallback(
    (q: string) => {
      const term = q.trim()
      if (!term) return
      pushSearchHistory(term)
      refreshHistory()
      void recordSearch(term)
      setOpen(false)
      router.push(`/tim-kiem?q=${encodeURIComponent(term)}`)
    },
    [router, refreshHistory]
  )

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      navigateSearch(query)
    },
    [navigateSearch, query]
  )

  const onSelectProduct = useCallback(
    (product: Product) => {
      const card = buildProductCardPayload(product)
      if (card.name) {
        pushSearchHistory(card.name)
        refreshHistory()
        void recordSearch(card.name)
      }
      const href = headerSearchProductHref(card)
      setOpen(false)
      if (href) router.push(href)
    },
    [router, refreshHistory]
  )

  const clearHistory = useCallback(() => {
    writeSearchHistory([])
    refreshHistory()
  }, [refreshHistory])

  const removeHistoryItem = useCallback(
    (term: string) => {
      writeSearchHistory(readSearchHistory().filter((h) => h !== term))
      refreshHistory()
    },
    [refreshHistory]
  )

  const clearQuery = useCallback(() => {
    setQuery('')
  }, [])

  const closePanel = useCallback(() => setOpen(false), [])

  const suggestionItems: HeaderSearchSuggestionItem[] = useMemo(() => {
    const out: HeaderSearchSuggestionItem[] = []
    for (const p of suggestionResults ?? []) {
      const card = buildProductCardPayload(p)
      const href = headerSearchProductHref(card)
      if (href) out.push({ product: p, card, href })
    }
    return out
  }, [suggestionResults])

  const suggestEmpty =
    isSearchMode && !showSuggestSkeleton && !suggestError && suggestionItems.length === 0

  return {
    t,
    panelId,
    rootRef,
    open,
    setOpen,
    query,
    setQuery,
    clearQuery,
    isSearchMode,
    history,
    hotProducts,
    dealProducts,
    suggestionItems,
    showSuggestSkeleton,
    suggestEmpty,
    suggestError,
    hotPending,
    dealsPending,
    onSubmit,
    navigateSearch,
    onSelectProduct,
    clearHistory,
    removeHistoryItem,
    closePanel,
    consultLabel: t('headerSearch.consultPrice'),
  }
}
