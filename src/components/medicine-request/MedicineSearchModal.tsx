'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { useStoreSearch } from '@/lib/hooks/useStoreSearch'
import { getProductImageUrl, getProductPackaging } from '@/lib/services/products'
import type { SelectedMedicine } from '@/components/medicine-request/types'

/** Fixed width/height so search results do not resize the dialog. */
const MODAL_PANEL_CLASS =
  '!w-full !max-w-none sm:!w-[32rem] sm:!max-w-[32rem] sm:rounded-2xl'
const RESULTS_HEIGHT_CLASS = 'h-[16rem] overflow-y-auto sm:h-[18rem]'

type MedicineSearchModalProps = {
  open: boolean
  onClose: () => void
  selected: SelectedMedicine[]
  onComplete: (items: SelectedMedicine[]) => void
}

export function MedicineSearchModal({
  open,
  onClose,
  selected,
  onComplete,
}: MedicineSearchModalProps) {
  const titleId = useId()
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [draft, setDraft] = useState<SelectedMedicine[]>(selected)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setDebounced('')
      return
    }
    setDraft(selected)
  }, [open, selected])

  const search = useStoreSearch(
    debounced.length >= 2 ? { q: debounced, page_size: 8, include_facets: false } : undefined
  )
  const results = search.data?.items ?? []
  const selectedIds = useMemo(() => new Set(draft.map((item) => item.productId)), [draft])

  const toggleProduct = (
    productId: number,
    productName: string,
    packing?: string,
    imageUrl?: string
  ) => {
    setDraft((prev) => {
      if (prev.some((item) => item.productId === productId)) {
        return prev.filter((item) => item.productId !== productId)
      }
      return [...prev, { productId, productName, packing, imageUrl, quantity: 1 }]
    })
  }

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title="Tìm thuốc/sản phẩm cần tư vấn"
      panelClassName={MODAL_PANEL_CLASS}
      footer={
        <div className="border-t border-slate-100 px-5 py-4">
          <Button type="button" className="w-full" onClick={() => onComplete(draft)}>
            Hoàn tất
          </Button>
        </div>
      }
    >
      <div className="space-y-3 px-5 py-4">
        <TextField
          variant="outline"
          label="Tìm kiếm"
          placeholder="Nhập tên thuốc, dược chất..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
        <p className="text-xs text-gray-500">
          Bạn có thể tìm theo tên sản phẩm hoặc tên thuốc.
        </p>
        <div className={RESULTS_HEIGHT_CLASS}>
          {search.isFetching ? <p className="text-sm text-gray-500">Đang tìm...</p> : null}
          {debounced.length >= 2 && !search.isFetching && results.length === 0 ? (
            <p className="text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : null}
          {debounced.length < 2 && !search.isFetching ? (
            <p className="text-sm text-gray-400">Nhập ít nhất 2 ký tự để tìm kiếm.</p>
          ) : null}
          <ul className="divide-y divide-slate-100">
            {results.map((product) => {
              const name = product.product.web_name || product.product.name
              const packing = getProductPackaging(product)
              const imageUrl = getProductImageUrl(product)
              const isOn = selectedIds.has(product.id)
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                    onClick={() => toggleProduct(product.id, name, packing, imageUrl)}
                    aria-pressed={isOn}
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span className="h-12 w-12 shrink-0 rounded-md bg-slate-100" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900">{name}</span>
                      {packing ? (
                        <span className="block truncate text-sm text-gray-500">{packing}</span>
                      ) : null}
                    </span>
                    <span
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        isOn ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                      aria-hidden
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          isOn ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </OfferSheet>
  )
}
