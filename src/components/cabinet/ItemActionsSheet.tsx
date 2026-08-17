'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { ExpiryBadge } from '@/components/cabinet/ExpiryBadge'
import type { CabinetItem } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type ItemActionsSheetProps = {
  item: CabinetItem | null
  open: boolean
  onClose: () => void
  onUpdate: (id: number, payload: { quantity?: number; expiration_date?: string }) => Promise<unknown>
  onDelete: (id: number) => Promise<unknown>
}

export function ItemActionsSheet({ item, open, onClose, onUpdate, onDelete }: ItemActionsSheetProps) {
  const t = useTranslations('cabinet')
  const titleId = useId()
  const [quantity, setQuantity] = useState(1)
  const [expirationDate, setExpirationDate] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!item) return
    setQuantity(item.quantity)
    setExpirationDate(item.expiration_date)
  }, [item])

  if (!item) return null

  const run = async (fn: () => Promise<unknown>, successKey: string) => {
    setBusy(true)
    try {
      await fn()
      toastSuccess(t(successKey))
      onClose()
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    } finally {
      setBusy(false)
    }
  }

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
            disabled={busy}
            onClick={() =>
              run(
                () => onUpdate(item.id, { quantity, expiration_date: expirationDate }),
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
          <ExpiryBadge status={item.expiration_status} />
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
      </div>
    </OfferSheet>
  )
}
