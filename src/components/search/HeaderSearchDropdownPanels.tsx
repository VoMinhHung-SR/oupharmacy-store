'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { ImagePlaceholderIcon } from '@/components/icons'
import { PRICE_CONSULT } from '@/lib/constant'
import {
  buildProductCardPayload,
  getListProductKey,
  type Product,
  type ProductCardPayload,
} from '@/lib/services/products'
import { type HeaderSearchSuggestionItem, headerSearchProductHref } from './useHeaderSearchDropdown'

/* —— Thumbnail (list + mini) —— */

type ThumbVariant = 'list' | 'mini'

const thumbWrap: Record<ThumbVariant, string> = {
  list: 'relative h-14 w-14 shrink-0 rounded-lg ring-1 ring-gray-200/80 shadow-sm',
  mini: 'relative aspect-square w-full max-w-[5.75rem] shrink-0 rounded-xl ring-1 ring-gray-200/90 shadow-sm',
}

const thumbSizes: Record<ThumbVariant, string> = {
  list: '56px',
  mini: '92px',
}

function SearchThumb({
  imageUrl,
  alt,
  variant,
  objectStyle,
}: {
  imageUrl?: string | null
  alt: string
  variant: ThumbVariant
  objectStyle: 'cover' | 'contain'
}) {
  const [loaded, setLoaded] = useState(false)
  const onDone = useCallback(() => setLoaded(true), [])
  const rounded = variant === 'list' ? 'rounded-lg' : 'rounded-xl'
  const pad = objectStyle === 'contain' ? 'p-1.5' : ''

  return (
    <div
      className={`shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/90 ${thumbWrap[variant]}`}
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes={thumbSizes[variant]}
            className={`${objectStyle === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ease-out ${loaded ? 'opacity-100' : 'opacity-0'} ${rounded} ${pad}`}
            onLoadingComplete={onDone}
          />
          {!loaded ? (
            <div
              className={`pointer-events-none absolute inset-0 animate-pulse bg-gray-200/60 ${rounded}`}
              aria-hidden
            />
          ) : null}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <ImagePlaceholderIcon className={variant === 'list' ? 'h-7 w-7' : 'h-8 w-8'} />
        </div>
      )}
    </div>
  )
}

/* —— Skeletons —— */

function SuggestionsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-gray-50 px-0" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex gap-3 px-3 py-2.5">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-gray-200/80 ring-1 ring-gray-100" />
          <div className="min-w-0 flex-1 space-y-2 py-0.5">
            <div className="h-4 w-[92%] animate-pulse rounded bg-gray-200/80" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200/70" />
          </div>
        </li>
      ))}
    </ul>
  )
}

function BrowseStripSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-hidden px-3" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-[8.5rem] w-[9.25rem] shrink-0 animate-pulse rounded-xl bg-gray-100/90 ring-1 ring-gray-100"
        />
      ))}
    </div>
  )
}

/* —— Rows / cards —— */

function SuggestionRow({
  product,
  card,
  href,
  consultLabel,
  onSelect,
}: {
  product: Product
  card: ProductCardPayload
  href: string
  consultLabel: string
  onSelect: (product: Product) => void
}) {
  const isConsult =
    card.price_display === PRICE_CONSULT || String(card.price) === PRICE_CONSULT

  return (
    <li className="border-b border-gray-50 last:border-0">
      <Link
        href={href}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault()
          onSelect(product)
        }}
        className="flex w-full gap-3 px-3 py-2.5 text-left transition-colors hover:bg-primary-50/60"
      >
        <SearchThumb imageUrl={card.image_url} alt={card.name} variant="list" objectStyle="cover" />
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-sm font-medium text-gray-900">{card.name}</div>
          {card.packaging ? <div className="mt-0.5 text-xs text-gray-500">{card.packaging}</div> : null}
          <div className="mt-1 text-sm font-semibold text-primary-700">
            {isConsult ? (
              <span className="text-xs font-medium text-amber-700">{consultLabel}</span>
            ) : (
              <>
                {card.price.toLocaleString('vi-VN')}₫
                {card.originalPrice && card.originalPrice > card.price ? (
                  <span className="ml-2 text-xs font-normal text-gray-400 line-through">
                    {card.originalPrice.toLocaleString('vi-VN')}₫
                  </span>
                ) : null}
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

function MiniProductCard({
  card,
  href,
  consultLabel,
  onNavigate,
}: {
  card: ProductCardPayload
  href: string
  consultLabel: string
  onNavigate: () => void
}) {
  const isConsult =
    card.price_display === PRICE_CONSULT || String(card.price) === PRICE_CONSULT

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex w-[9.25rem] shrink-0 flex-col rounded-xl border border-gray-100/90 bg-white/95 p-2 shadow-sm ring-1 ring-gray-100/80 transition-all hover:border-primary-200 hover:shadow-md hover:ring-primary-100"
    >
      <div className="mx-auto w-full max-w-[5.75rem]">
        <SearchThumb imageUrl={card.image_url} alt={card.name} variant="mini" objectStyle="contain" />
      </div>
      <div className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-gray-900">{card.name}</div>
      <div className="mt-auto pt-1.5 text-xs font-semibold text-primary-700">
        {isConsult ? (
          <span className="text-[11px] font-medium leading-tight text-amber-800">{consultLabel}</span>
        ) : (
          `${card.price.toLocaleString('vi-VN')}₫`
        )}
      </div>
    </Link>
  )
}

/* —— Exported panels —— */

export interface HeaderSearchSuggestionsPanelProps {
  suggestionsLabel: string
  noResultsLabel: string
  suggestErrorLabel: string
  viewAllLabel: string
  suggestionItems: HeaderSearchSuggestionItem[]
  showSkeleton: boolean
  suggestEmpty: boolean
  suggestError: boolean
  consultLabel: string
  onSelectProduct: (product: HeaderSearchSuggestionItem['product']) => void
  onViewAll: () => void
}

export function HeaderSearchSuggestionsPanel({
  suggestionsLabel,
  noResultsLabel,
  suggestErrorLabel,
  viewAllLabel,
  suggestionItems,
  showSkeleton,
  suggestEmpty,
  suggestError,
  consultLabel,
  onSelectProduct,
  onViewAll,
}: HeaderSearchSuggestionsPanelProps) {
  return (
    <div className="py-2">
      <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {suggestionsLabel}
      </div>
      {showSkeleton ? (
        <SuggestionsSkeleton rows={6} />
      ) : suggestError ? (
        <div className="px-4 py-8 text-center text-sm text-amber-800">{suggestErrorLabel}</div>
      ) : suggestEmpty ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">{noResultsLabel}</div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {suggestionItems.map(({ product, card, href }) => (
            <SuggestionRow
              key={getListProductKey(product)}
              product={product}
              card={card}
              href={href}
              consultLabel={consultLabel}
              onSelect={onSelectProduct}
            />
          ))}
        </ul>
      )}
      <div className="sticky bottom-0 border-t border-gray-100/90 bg-white/95 px-3 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
        <button
          type="button"
          className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          onClick={onViewAll}
        >
          {viewAllLabel}
        </button>
      </div>
    </div>
  )
}

export interface HeaderSearchBrowsePanelProps {
  historyLabel: string
  clearHistoryLabel: string
  removeItemAriaLabel: string
  popularLabel: string
  hotLabel: string
  dealsLabel: string
  history: string[]
  popularTerms: string[]
  hotProducts: Product[]
  dealProducts: Product[]
  hotPending: boolean
  dealsPending: boolean
  consultLabel: string
  onHistorySelect: (term: string) => void
  onPopularSelect: (term: string) => void
  onRemoveHistory: (term: string) => void
  onClearHistory: () => void
  onMiniNavigate: () => void
}

export function HeaderSearchBrowsePanel({
  historyLabel,
  clearHistoryLabel,
  removeItemAriaLabel,
  popularLabel,
  hotLabel,
  dealsLabel,
  history,
  popularTerms,
  hotProducts,
  dealProducts,
  hotPending,
  dealsPending,
  consultLabel,
  onHistorySelect,
  onPopularSelect,
  onRemoveHistory,
  onClearHistory,
  onMiniNavigate,
}: HeaderSearchBrowsePanelProps) {
  return (
    <div className="space-y-4 py-3">
      {history.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {historyLabel}
            </span>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs font-medium text-primary-700 hover:underline"
            >
              {clearHistoryLabel}
            </button>
          </div>
          <ul className="space-y-0.5 px-2">
            {history.map((term) => (
              <li key={term} className="group flex items-center gap-1">
                <button
                  type="button"
                  className="flex-1 truncate rounded-lg px-2 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
                  onClick={() => onHistorySelect(term)}
                >
                  {term}
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 opacity-0 transition-opacity hover:text-gray-700 group-hover:opacity-100"
                  aria-label={removeItemAriaLabel}
                  onClick={() => onRemoveHistory(term)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {popularTerms.length > 0 ? (
        <div className="px-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{popularLabel}</div>
          <div className="flex flex-wrap gap-2">
            {popularTerms.slice(0, 12).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onPopularSelect(term)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hotPending || hotProducts.length > 0 ? (
        <div>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{hotLabel}</div>
          {hotPending && hotProducts.length === 0 ? (
            <BrowseStripSkeleton />
          ) : (
            <div className="scrollbar-subtle flex gap-2 overflow-x-auto px-3 pb-2 pt-0.5 [-webkit-overflow-scrolling:touch]">
              {hotProducts.map((p) => {
                const card = buildProductCardPayload(p)
                const href = headerSearchProductHref(card)
                if (!href) return null
                return (
                  <MiniProductCard
                    key={p.id}
                    card={card}
                    href={href}
                    consultLabel={consultLabel}
                    onNavigate={onMiniNavigate}
                  />
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {dealsPending || dealProducts.length > 0 ? (
        <div>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">{dealsLabel}</div>
          {dealsPending && dealProducts.length === 0 ? (
            <BrowseStripSkeleton />
          ) : (
            <div className="scrollbar-subtle flex gap-2 overflow-x-auto px-3 pb-2 pt-0.5 [-webkit-overflow-scrolling:touch]">
              {dealProducts.map((p) => {
                const card = buildProductCardPayload(p)
                const href = headerSearchProductHref(card)
                if (!href) return null
                return (
                  <MiniProductCard
                    key={p.id}
                    card={card}
                    href={href}
                    consultLabel={consultLabel}
                    onNavigate={onMiniNavigate}
                  />
                )
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
