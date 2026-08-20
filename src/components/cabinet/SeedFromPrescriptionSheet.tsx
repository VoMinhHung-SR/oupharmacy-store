'use client'

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { CartLineThumb } from '@/components/cart/CartLineThumb'
import type { CreateCabinetItemPayload } from '@/lib/services/cabinet'
import {
  listCabinetPrescriptionLines,
  type CabinetPrescriptionLine,
} from '@/lib/services/cabinetPrescriptions'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type SeedFromPrescriptionSheetProps = {
  open: boolean
  onClose: () => void
  cabinetId: number
  onAdd: (payload: CreateCabinetItemPayload) => Promise<unknown>
}

type LineDraft = {
  checked: boolean
  quantity: number
  expirationDate: string
  lotNumber: string
  showLot: boolean
}

function formatDate(iso: string | null, locale: string) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function emptyDraft(row: CabinetPrescriptionLine): LineDraft {
  return {
    checked: false,
    quantity: Math.max(1, row.quantity || 1),
    expirationDate: '',
    lotNumber: '',
    showLot: false,
  }
}

export function SeedFromPrescriptionSheet({
  open,
  onClose,
  cabinetId,
  onAdd,
}: SeedFromPrescriptionSheetProps) {
  const t = useTranslations('cabinet')
  const locale = useLocale()
  const titleId = useId()
  const [drafts, setDrafts] = useState<Record<number, LineDraft>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [addedIds, setAddedIds] = useState<number[]>([])

  const linesQuery = useQuery({
    queryKey: ['cabinet-prescription-lines'],
    queryFn: listCabinetPrescriptionLines,
    enabled: open,
  })

  const lines = useMemo(() => linesQuery.data ?? [], [linesQuery.data])
  const addedSet = useMemo(() => new Set(addedIds), [addedIds])

  useEffect(() => {
    if (!open) {
      setDrafts({})
      setShowErrors(false)
      setAddedIds([])
      setProgress({ current: 0, total: 0 })
      return
    }
    setDrafts((prev) => {
      const next: Record<number, LineDraft> = {}
      for (const row of lines) {
        next[row.id] = prev[row.id] ?? emptyDraft(row)
      }
      return next
    })
  }, [open, lines])

  const groups = useMemo(() => {
    const map = new Map<number, CabinetPrescriptionLine[]>()
    for (const row of lines) {
      const list = map.get(row.prescribing_id) ?? []
      list.push(row)
      map.set(row.prescribing_id, list)
    }
    return Array.from(map.entries()).map(([prescribingId, groupLines]) => ({
      prescribingId,
      label: groupLines[0]?.diagnosis_label || t('seedRx.rxFallback', { id: prescribingId }),
      date: groupLines[0]?.prescribed_at ?? null,
      lines: groupLines,
    }))
  }, [lines, t])

  const selectable = useMemo(() => lines.filter((row) => row.variant_available), [lines])
  const checkedLines = useMemo(
    () => selectable.filter((row) => drafts[row.id]?.checked),
    [selectable, drafts]
  )
  const readyCount = useMemo(
    () =>
      checkedLines.filter((row) => drafts[row.id]?.expirationDate && drafts[row.id].quantity >= 1)
        .length,
    [checkedLines, drafts]
  )

  const setAllChecked = useCallback(
    (checked: boolean) => {
      setDrafts((prev) => {
        const next = { ...prev }
        for (const row of selectable) {
          next[row.id] = { ...next[row.id], checked }
        }
        return next
      })
    },
    [selectable]
  )

  const patchDraft = useCallback((id: number, patch: Partial<LineDraft>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  const handleSubmit = async () => {
    if (checkedLines.length === 0) {
      toastError(t('seedRx.noChecked'))
      return
    }
    if (checkedLines.some((row) => !drafts[row.id]?.expirationDate)) {
      setShowErrors(true)
      toastError(t('seedRx.needHsd'))
      return
    }

    setSubmitting(true)
    setProgress({ current: 0, total: checkedLines.length })
    let ok = 0
    const succeeded: number[] = []
    try {
      for (let i = 0; i < checkedLines.length; i += 1) {
        const row = checkedLines[i]
        const draft = drafts[row.id]
        setProgress({ current: i + 1, total: checkedLines.length })
        if (row.product_variant_id == null || row.product_variant_unit_id == null) {
          toastError(t('seedRx.missingVariant'))
          continue
        }
        try {
          await onAdd({
            cabinet: cabinetId,
            product_variant_id: row.product_variant_id,
            product_variant_unit_id: row.product_variant_unit_id,
            quantity: draft.quantity,
            expiration_date: draft.expirationDate,
            ...(draft.lotNumber.trim() ? { lot_number: draft.lotNumber.trim() } : {}),
          })
          ok += 1
          succeeded.push(row.id)
        } catch (err) {
          toastError(err instanceof Error ? err.message : t('toast.addFailed'))
        }
      }
    } finally {
      setSubmitting(false)
      setProgress({ current: 0, total: 0 })
    }

    if (succeeded.length) {
      setAddedIds((ids) => Array.from(new Set([...ids, ...succeeded])))
      setDrafts((prev) => {
        const next = { ...prev }
        for (const id of succeeded) {
          next[id] = { ...next[id], checked: false }
        }
        return next
      })
    }

    if (ok === checkedLines.length) {
      toastSuccess(t('seedRx.addedBulk', { count: ok }))
      onClose()
      return
    }
    if (ok > 0) {
      toastError(t('seedRx.partialAdded', { ok, total: checkedLines.length }))
    }
  }

  const allSelectableChecked =
    selectable.length > 0 && selectable.every((row) => drafts[row.id]?.checked)

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title={t('seedRx.title')}
      panelClassName="!max-w-xl"
      footer={
        <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
            {addedIds.length > 0 ? t('seedRx.done') : t('seedRx.close')}
          </Button>
          <Button
            className="flex-1"
            disabled={submitting || checkedLines.length === 0}
            onClick={() => void handleSubmit()}
          >
            {submitting
              ? t('seedRx.addingCount', { current: progress.current, total: progress.total })
              : t('seedRx.addSelected', { count: readyCount || checkedLines.length })}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-4">
        <p className="text-sm text-pretty text-gray-600">{t('seedRx.hint')}</p>
        <p className="text-xs text-gray-500">{t('seedRx.hsdHelp')}</p>

        {linesQuery.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}
        {!linesQuery.isLoading && groups.length === 0 ? (
          <p className="text-sm text-gray-500">{t('seedRx.empty')}</p>
        ) : null}

        {selectable.length > 0 ? (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              className="cart-select-check h-4 w-4 rounded-full border-slate-300 text-primary-600"
              checked={allSelectableChecked}
              onChange={(e) => setAllChecked(e.target.checked)}
              disabled={submitting}
            />
            {t('seedRx.selectAllCount', { count: selectable.length })}
          </label>
        ) : null}

        <ul className="divide-y divide-slate-100">
          {groups.map((group) => (
            <li key={group.prescribingId} className="py-3">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                {group.label}
                {group.date ? (
                  <span className="ml-2 font-normal text-gray-500">{formatDate(group.date, locale)}</span>
                ) : null}
              </p>
              <ul className="space-y-3">
                {group.lines.map((row) => {
                  const draft = drafts[row.id]
                  const unavailable = !row.variant_available
                  const added = addedSet.has(row.id)
                  const hsdError = showErrors && draft?.checked && !draft.expirationDate
                  return (
                    <li key={row.id} className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          className="cart-select-check mt-2 h-4 w-4 rounded-full border-slate-300 text-primary-600"
                          checked={Boolean(draft?.checked)}
                          disabled={unavailable || submitting || added}
                          onChange={(e) => patchDraft(row.id, { checked: e.target.checked })}
                        />
                        <CartLineThumb src={row.image_url} alt="" size="sm" native />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {row.item_name || t('itemFallback')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {row.quantity} {row.unit_name}
                            {row.uses ? ` · ${row.uses}` : ''}
                          </p>
                          {unavailable ? (
                            <p className="mt-1 text-xs text-amber-800">{t('seedRx.missingVariant')}</p>
                          ) : null}
                          {added ? (
                            <p className="mt-1 text-xs text-emerald-700">{t('seedRx.alreadyAdded')}</p>
                          ) : null}
                        </div>
                      </div>
                      {draft?.checked && !unavailable ? (
                        <div className="ml-8 space-y-2">
                          <div className="flex gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="mb-1 text-xs font-medium text-slate-600">{t('quantityLabel')}</p>
                              <QuantityStepper
                                value={draft.quantity}
                                min={1}
                                max={9999}
                                onChange={(value) => patchDraft(row.id, { quantity: value })}
                                fullWidth
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <TextField
                                type="date"
                                label={t('expirationLabel')}
                                value={draft.expirationDate}
                                onChange={(e) => patchDraft(row.id, { expirationDate: e.target.value })}
                                error={hsdError}
                                helperText={hsdError ? t('seedRx.hsdRequired') : undefined}
                                fullWidth
                              />
                            </div>
                          </div>
                          {draft.showLot ? (
                            <TextField
                              label={t('lotLabel')}
                              value={draft.lotNumber}
                              onChange={(e) => patchDraft(row.id, { lotNumber: e.target.value })}
                              fullWidth
                            />
                          ) : (
                            <button
                              type="button"
                              className="text-xs font-medium text-primary-700 hover:text-primary-800"
                              onClick={() => patchDraft(row.id, { showLot: true })}
                            >
                              {t('seedRx.showLot')}
                            </button>
                          )}
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </OfferSheet>
  )
}
