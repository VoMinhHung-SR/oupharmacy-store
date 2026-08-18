'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { ExpiryBadge } from '@/components/cabinet/ExpiryBadge'
import { InventoryBadge } from '@/components/cabinet/InventoryBadge'
import type { CabinetItem, UpdateCabinetItemPayload } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type ItemActionsSheetProps = {
  item: CabinetItem | null
  open: boolean
  onClose: () => void
  onUpdate: (id: number, payload: UpdateCabinetItemPayload) => Promise<unknown>
  onDelete: (id: number) => Promise<unknown>
}

export function ItemActionsSheet({ item, open, onClose, onUpdate, onDelete }: ItemActionsSheetProps) {
  const t = useTranslations('cabinet')
  const titleId = useId()
  const [quantity, setQuantity] = useState(1)
  const [expirationDate, setExpirationDate] = useState('')
  const [lotNumber, setLotNumber] = useState('')
  const [threshold, setThreshold] = useState('')
  const [onRefill, setOnRefill] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!item) return
    setQuantity(item.quantity)
    setExpirationDate(item.expiration_date)
    setLotNumber(item.lot_number ?? '')
    setThreshold(item.low_stock_threshold != null ? String(item.low_stock_threshold) : '')
    setOnRefill(item.on_refill_list)
  }, [item])

  if (!item) return null

  const run = async (fn: () => Promise<unknown>, successKey: string, close = true) => {
    setBusy(true)
    try {
      await fn()
      toastSuccess(t(successKey))
      if (close) onClose()
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    } finally {
      setBusy(false)
    }
  }

  const parsedThreshold = threshold.trim() === '' ? null : Number(threshold)
  const thresholdValid = parsedThreshold == null || (Number.isFinite(parsedThreshold) && parsedThreshold >= 0)

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title={item.product_name || t('itemFallback')}
      footer={
        <div className="space-y-2 border-t border-slate-100 px-5 py-4">
          <Button
            className="w-full"
            disabled={busy || !thresholdValid}
            onClick={() =>
              run(
                () =>
                  onUpdate(item.id, {
                    quantity,
                    expiration_date: expirationDate,
                    lot_number: lotNumber.trim() || null,
                    low_stock_threshold: parsedThreshold,
                    on_refill_list: onRefill,
                  }),
                'toast.updated'
              )
            }
          >
            {t('saveChanges')}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={busy}
            onClick={() => run(() => onUpdate(item.id, { quantity: 0 }), 'toast.usedUp')}
          >
            {t('markUsedUp')}
          </Button>
          <button
            type="button"
            className="w-full py-2 text-sm font-medium text-accent-600 hover:text-accent-700"
            disabled={busy}
            onClick={() => run(() => onDelete(item.id), 'toast.removed')}
          >
            {t('remove')}
          </button>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">{item.packing}</p>
            <p className="text-sm text-gray-500">
              {item.quantity} {item.unit_name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ExpiryBadge status={item.expiration_status} />
            <InventoryBadge status={item.inventory_status} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">{t('quantityLabel')}</p>
          <QuantityStepper value={quantity} min={0} max={9999} onChange={setQuantity} />
        </div>
        <TextField
          type="date"
          label={t('expirationLabel')}
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          fullWidth
        />
        <TextField
          label={t('lotLabel')}
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
          fullWidth
        />
        <TextField
          type="number"
          min={0}
          label={t('thresholdLabel')}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          helperText={t('thresholdHint')}
          fullWidth
        />
        <label className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600"
            checked={onRefill}
            onChange={(e) => setOnRefill(e.target.checked)}
            disabled={busy}
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">{t('refill.toggle')}</span>
            <span className="block text-xs text-gray-500">{t('refill.hint')}</span>
          </span>
        </label>
      </div>
    </OfferSheet>
  )
}
