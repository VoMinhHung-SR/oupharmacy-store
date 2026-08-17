'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { SelectOptionPill } from '@/components/common/SelectOptionPill'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import type { Product } from '@/lib/services/products'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type AddMedicineSheetProps = {
  open: boolean
  onClose: () => void
  cabinetId: number
  onAdd: (payload: {
    cabinet: number
    product_variant_id: number
    product_variant_unit_id: number
    quantity: number
    expiration_date: string
  }) => Promise<unknown>
}

export function AddMedicineSheet({ open, onClose, cabinetId, onAdd }: AddMedicineSheetProps) {
  const t = useTranslations('cabinet')
  const titleId = useId()
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [unitId, setUnitId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expirationDate, setExpirationDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setDebounced('')
      setSelected(null)
      setUnitId(null)
      setQuantity(1)
      setExpirationDate('')
    }
  }, [open])

  const search = useStoreSearch(
    debounced.length >= 2 ? { q: debounced, page_size: 8, include_facets: false } : undefined
  )
  const results = search.data?.items ?? []
  const units = selected?.unit_options ?? []

  const handleSelect = (product: Product) => {
    setSelected(product)
    const defaultUnit = product.unit_options?.find((u) => u.is_default) ?? product.unit_options?.[0]
    setUnitId(defaultUnit?.unit_id ?? product.default_unit_id ?? null)
  }

  const handleSubmit = async () => {
    if (!selected || unitId == null || !expirationDate || quantity < 1) return
    setSubmitting(true)
    try {
      await onAdd({
        cabinet: cabinetId,
        product_variant_id: selected.id,
        product_variant_unit_id: unitId,
        quantity,
        expiration_date: expirationDate,
      })
      toastSuccess(t('toast.added'))
      onClose()
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.addFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title={t('addTitle')}
      panelClassName="max-w-lg"
      footer={
        <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            className="flex-1"
            disabled={!selected || unitId == null || !expirationDate || submitting}
            onClick={handleSubmit}
          >
            {t('confirmAdd')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-4">
        <TextField
          label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        {!selected ? (
          <div className="space-y-2">
            {search.isFetching ? <p className="text-sm text-gray-500">{t('searching')}</p> : null}
            {debounced.length >= 2 && !search.isFetching && results.length === 0 ? (
              <p className="text-sm text-gray-500">{t('searchEmpty')}</p>
            ) : null}
            <ul className="divide-y divide-slate-100">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                    onClick={() => handleSelect(product)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900">
                        {product.product.web_name || product.product.name}
                      </span>
                      <span className="block truncate text-sm text-gray-500">
                        {product.packing}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-900">
                {selected.product.web_name || selected.product.name}
              </p>
              <p className="text-sm text-gray-500">{selected.packing}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-primary-700"
                onClick={() => setSelected(null)}
              >
                {t('changeMedicine')}
              </button>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">{t('unitLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {units.map((unit) => (
                  <SelectOptionPill
                    key={unit.unit_id}
                    label={unit.unit_name}
                    selected={unitId === unit.unit_id}
                    onSelect={() => setUnitId(unit.unit_id)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">{t('quantityLabel')}</p>
              <QuantityStepper value={quantity} min={1} max={9999} onChange={setQuantity} />
            </div>
            <TextField
              type="date"
              label={t('expirationLabel')}
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              fullWidth
            />
          </div>
        )}
      </div>
    </OfferSheet>
  )
}
