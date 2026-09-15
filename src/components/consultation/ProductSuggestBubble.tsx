'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { ImagePlaceholderIcon } from '@/components/icons'
import { useCart } from '@/contexts/CartContext'
import { PRICE_CONSULT } from '@/lib/constant'
import { useCategories } from '@/lib/hooks/useCategories'
import {
  buildProductCardPayload,
  mapProductUnitOptionsForCart,
  type ProductCardPayload,
} from '@/lib/services/products'
import { searchStoreProducts } from '@/lib/services/search'
import { formatVnd } from '@/lib/utils/currency'
import { toastSuccess, toastWarning } from '@/lib/utils/toast'
import type { PharmacistSeed } from './useConsultStateMachine'
import { ConsultBackIconButton } from './ConsultIconButtons'

const MAX_RESULTS = 5

type ProductSuggestBubbleProps = {
  onBack: () => void
  onEscalatePharmacist: (seed: PharmacistSeed) => void
  onLoadingChange?: (loading: boolean, label?: string) => void
}

function isConsultCard(product: ProductCardPayload): boolean {
  return (
    product.price_display === PRICE_CONSULT ||
    String(product.price) === PRICE_CONSULT
  )
}

export function ProductSuggestBubble({
  onBack,
  onEscalatePharmacist,
  onLoadingChange,
}: ProductSuggestBubbleProps) {
  const t = useTranslations('consultation.branch.medicine')
  const tRoot = useTranslations('consultation')
  const { add, items } = useCart()
  const { data: categories } = useCategories()

  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ProductCardPayload[] | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [lastQueryLabel, setLastQueryLabel] = useState<string | null>(null)

  useEffect(() => {
    onLoadingChange?.(loading, loading ? t('searching') : undefined)
    return () => onLoadingChange?.(false)
  }, [loading, onLoadingChange, t])

  const categoryChips = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return []
    const mapped = categories
      .filter((c) => c?.id && c?.name)
      .map((c) => ({ id: c.id, name: c.name, parent: c.parent ?? null }))
    const roots = mapped.filter((c) => c.parent == null)
    const pool = (roots.length > 0 ? roots : mapped).slice(0, 6)
    return pool.map(({ id, name }) => ({ id, name }))
  }, [categories])

  const runSearch = useCallback(
    async (nextQ: string, nextCategory: number | '') => {
      const trimmed = nextQ.trim()
      if (!trimmed && nextCategory === '') {
        setError(t('queryRequired'))
        return
      }
      const chipName =
        nextCategory !== ''
          ? categoryChips.find((c) => c.id === nextCategory)?.name
          : undefined
      setLoading(true)
      setError(null)
      setLastQueryLabel(trimmed || chipName || t('title'))
      try {
        const res = await searchStoreProducts({
          q: trimmed,
          page: 1,
          page_size: MAX_RESULTS,
          sort: 'relevance',
          include_facets: false,
          ...(nextCategory !== '' ? { category: nextCategory } : {}),
        })
        if (res.error || !res.data) {
          setResults([])
          setError(res.error || t('errorGeneric'))
          return
        }
        setResults(res.data.items.slice(0, MAX_RESULTS).map((p) => buildProductCardPayload(p)))
      } catch (err) {
        setResults([])
        setError(err instanceof Error ? err.message : t('errorGeneric'))
      } finally {
        setLoading(false)
      }
    },
    [t, categoryChips],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void runSearch(q, categoryId)
  }

  const onPickCategory = (id: number) => {
    setCategoryId(id)
    void runSearch(q, id)
  }

  const handleAdd = async (product: ProductCardPayload) => {
    if (isConsultCard(product)) return
    if (!product.variant_unit_id) {
      toastWarning(t('addUnavailable'))
      return
    }
    const inStock = product.in_stock ?? 0
    if (inStock === 0) {
      toastWarning(t('outOfStock'))
      return
    }
    const unitId = product.product_variant_unit_id ?? null
    const existing = items.find(
      (i) =>
        i.variant_unit_id === product.variant_unit_id &&
        (i.product_variant_unit_id ?? null) === unitId,
    )
    const currentQty = existing?.qty ?? 0
    if (currentQty + 1 > inStock) {
      toastWarning(t('stockExceeded', { stock: inStock, inCart: currentQty }))
      return
    }

    setAddingId(product.id)
    try {
      await add(
        {
          id: product.id,
          variant_unit_id: product.variant_unit_id,
          product_variant_unit_id: product.product_variant_unit_id,
          unit_options: mapProductUnitOptionsForCart(product.unit_options),
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          packaging: product.default_unit_name || product.packaging,
        },
        1,
      )
      toastSuccess(t('added'))
    } catch {
      toastWarning(t('addFailed'))
    } finally {
      setAddingId(null)
    }
  }

  const handleEscalate = (product: ProductCardPayload) => {
    onEscalatePharmacist({
      need_text: t('escalateNeedText', { name: product.name }),
      context_json: {
        source: 'medicine_consult_escalate',
        product_id: product.id,
        product_name: product.name,
        product_href: product.href || null,
        q: q.trim() || null,
        category_id: categoryId === '' ? null : categoryId,
      },
    })
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">{t('title')}</p>
          <p className="mt-0.5 text-xs leading-snug text-slate-500">{t('hint')}</p>
        </div>
        <ConsultBackIconButton onClick={onBack} />
      </div>

      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          {t('queryLabel')}
          <input
            value={q}
            onChange={(ev) => setQ(ev.target.value)}
            placeholder={t('queryPlaceholder')}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </label>

        {categoryChips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {categoryChips.map((chip) => {
              const active = categoryId === chip.id
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onPickCategory(chip.id)}
                  className={`rounded-lg border px-2 py-1 text-xs ${
                    active
                      ? 'border-primary-600 bg-primary-50 text-primary-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                  }`}
                >
                  {chip.name}
                </button>
              )
            })}
            {categoryId !== '' ? (
              <button
                type="button"
                onClick={() => {
                  setCategoryId('')
                  void runSearch(q, '')
                }}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
              >
                {t('clearCategory')}
              </button>
            ) : null}
          </div>
        ) : null}

        <Button type="submit" size="sm" disabled={loading} className="self-start">
          {loading ? t('searching') : t('search')}
        </Button>
      </form>

      {lastQueryLabel ? (
        <div className="flex flex-col items-end">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-primary-600">
            {tRoot('roleUser')}
          </p>
          <div className="max-w-[88%] rounded-2xl rounded-br-md bg-primary-600 px-3 py-1.5 text-sm text-white shadow-sm">
            {lastQueryLabel}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {results ? (
        results.length === 0 ? (
          <p className="text-sm text-slate-600">{t('empty')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((product) => {
              const consult = isConsultCard(product)
              return (
                <li
                  key={product.id}
                  className="flex gap-2 rounded-xl border border-slate-200 bg-white p-2"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-50">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImagePlaceholderIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {product.href ? (
                      <Link
                        href={product.href}
                        className="line-clamp-2 text-xs font-medium text-slate-900 hover:text-primary-700"
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <p className="line-clamp-2 text-xs font-medium text-slate-900">{product.name}</p>
                    )}
                    <p className="mt-0.5 text-xs font-semibold text-primary-700">
                      {consult ? t('consultPrice') : formatVnd(product.price)}
                    </p>
                    {consult ? (
                      <Button
                        type="button"
                        size="sm"
                        className="mt-1.5"
                        onClick={() => handleEscalate(product)}
                      >
                        {t('escalateCta')}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="mt-1.5"
                        disabled={addingId === product.id}
                        onClick={() => void handleAdd(product)}
                      >
                        {addingId === product.id ? t('adding') : t('addToCart')}
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )
      ) : null}
    </div>
  )
}
