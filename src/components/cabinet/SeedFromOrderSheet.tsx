'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/lib/hooks/useOrders'
import { getProduct } from '@/lib/services/products'
import type { CreateCabinetItemPayload } from '@/lib/services/cabinet'
import type { Order, OrderItem, OrderListResponse } from '@/lib/services/orders'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type SeedFromOrderSheetProps = {
  open: boolean
  onClose: () => void
  cabinetId: number
  onAdd: (payload: CreateCabinetItemPayload) => Promise<unknown>
}

type OrderLine = {
  key: string
  orderNumber: string
  item: OrderItem
}

function ordersFromQuery(data: Order[] | OrderListResponse | undefined): Order[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

export function SeedFromOrderSheet({ open, onClose, cabinetId, onAdd }: SeedFromOrderSheetProps) {
  const t = useTranslations('cabinet')
  const titleId = useId()
  const { user } = useAuth()
  const ordersQuery = useOrders(open ? user?.id : undefined, {
    page_size: 20,
    ordering: '-created_date',
  })
  const [selected, setSelected] = useState<OrderLine | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expirationDate, setExpirationDate] = useState('')
  const [lotNumber, setLotNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelected(null)
      setQuantity(1)
      setExpirationDate('')
      setLotNumber('')
    }
  }, [open])

  const lines = useMemo(() => {
    const orders = ordersFromQuery(ordersQuery.data).filter((order) => order.status !== 'CANCELLED')
    const rows: OrderLine[] = []
    orders.forEach((order) => {
      order.items.forEach((item, index) => {
        if (!item.variant_unit_id) return
        rows.push({
          key: `${order.order_number ?? order.id ?? 'order'}-${item.id ?? item.variant_unit_id}-${index}`,
          orderNumber: order.order_number || `#${order.id ?? ''}`,
          item,
        })
      })
    })
    return rows
  }, [ordersQuery.data])

  const handlePick = (line: OrderLine) => {
    setSelected(line)
    setQuantity(Math.max(1, line.item.quantity || 1))
    setExpirationDate('')
    setLotNumber('')
  }

  const resolveUnitId = async (item: OrderItem): Promise<number | null> => {
    if (item.product_variant_unit_id) return item.product_variant_unit_id
    const product = await getProduct(item.variant_unit_id)
    if (product.error || !product.data) return null
    const options = product.data.unit_options ?? []
    const defaultUnit = options.find((unit) => unit.is_default) ?? options[0]
    return defaultUnit?.unit_id ?? product.data.default_unit_id ?? null
  }

  const handleSubmit = async () => {
    if (!selected || !expirationDate || quantity < 1) return
    setSubmitting(true)
    try {
      const unitId = await resolveUnitId(selected.item)
      if (unitId == null) {
        toastError(t('seed.missingUnit'))
        return
      }
      await onAdd({
        cabinet: cabinetId,
        product_variant_id: selected.item.variant_unit_id,
        product_variant_unit_id: unitId,
        quantity,
        expiration_date: expirationDate,
        ...(lotNumber.trim() ? { lot_number: lotNumber.trim() } : {}),
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
      title={t('seed.title')}
      panelClassName="max-w-lg"
      footer={
        selected ? (
          <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
            <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
              {t('seed.back')}
            </Button>
            <Button
              className="flex-1"
              disabled={!expirationDate || submitting}
              onClick={() => void handleSubmit()}
            >
              {t('confirmAdd')}
            </Button>
          </div>
        ) : (
          <div className="border-t border-slate-100 px-5 py-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              {t('cancel')}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4 px-5 py-4">
        {!selected ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{t('seed.hint')}</p>
            {ordersQuery.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}
            {!ordersQuery.isLoading && lines.length === 0 ? (
              <p className="text-sm text-gray-500">{t('seed.empty')}</p>
            ) : null}
            <ul className="divide-y divide-slate-100">
              {lines.map((line) => (
                <li key={line.key}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                    onClick={() => handlePick(line)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-900">
                        {line.item.name || t('itemFallback')}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {line.orderNumber} · x{line.item.quantity}
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
                {selected.item.name || t('itemFallback')}
              </p>
              <p className="text-sm text-gray-500">{selected.orderNumber}</p>
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
              required
              helperText={t('seed.hsdRequired')}
            />
            <TextField
              label={t('lotLabel')}
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              fullWidth
            />
          </div>
        )}
      </div>
    </OfferSheet>
  )
}
