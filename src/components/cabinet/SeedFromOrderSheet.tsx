'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, memo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { ChevronRightIcon, SearchIcon } from '@/components/icons'
import { CartLineThumb } from '@/components/cart/CartLineThumb'
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
  status: Order['status']
  createdDate?: string
  item: OrderItem
}

type OrderGroup = {
  orderNumber: string
  status: Order['status']
  createdDate?: string
  lines: OrderLine[]
}

type LineDraft = {
  checked: boolean
  quantity: number
  expirationDate: string
  lotNumber: string
}

type ListFilter = 'received' | 'incoming' | 'all'

const RECEIVED: Order['status'][] = ['DELIVERED']
const INCOMING: Order['status'][] = ['PENDING', 'CONFIRMED', 'SHIPPING']

function ordersFromQuery(data: Order[] | OrderListResponse | undefined): Order[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

function formatOrderDate(iso: string | undefined, locale: string) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function emptyDraft(line: OrderLine, checked: boolean): LineDraft {
  return {
    checked,
    quantity: Math.max(1, line.item.quantity || 1),
    expirationDate: '',
    lotNumber: '',
  }
}

export function SeedFromOrderSheet({ open, onClose, cabinetId, onAdd }: SeedFromOrderSheetProps) {
  const t = useTranslations('cabinet')
  const locale = useLocale()
  const titleId = useId()
  const { user } = useAuth()
  const ordersQuery = useOrders(open ? user?.id : undefined, {
    page_size: 50,
    ordering: '-created_date',
  })
  const [filter, setFilter] = useState<ListFilter>('received')
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<OrderGroup | null>(null)
  const [drafts, setDrafts] = useState<Record<string, LineDraft>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [addedKeys, setAddedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      setActiveGroup(null)
      setDrafts({})
      setShowErrors(false)
      setQuery('')
      setFilter('received')
      setAddedKeys([])
      setProgress({ current: 0, total: 0 })
    }
  }, [open])

  const allLines = useMemo(() => {
    const orders = ordersFromQuery(ordersQuery.data).filter((order) => order.status !== 'CANCELLED')
    const rows: OrderLine[] = []
    orders.forEach((order) => {
      order.items.forEach((item, index) => {
        if (!item.variant_unit_id) return
        const orderNumber = order.order_number || `#${order.id ?? ''}`
        rows.push({
          key: `${orderNumber}-${item.id ?? item.variant_unit_id}-${index}`,
          orderNumber,
          status: order.status,
          createdDate: order.created_date,
          item,
        })
      })
    })
    return rows
  }, [ordersQuery.data])

  const receivedCount = allLines.filter((line) => RECEIVED.includes(line.status)).length
  const incomingCount = allLines.filter((line) => INCOMING.includes(line.status)).length

  useEffect(() => {
    if (!open || ordersQuery.isLoading) return
    if (receivedCount === 0 && incomingCount > 0) setFilter('incoming')
  }, [open, ordersQuery.isLoading, receivedCount, incomingCount])

  const visibleLines = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return allLines.filter((line) => {
      if (filter === 'received' && !RECEIVED.includes(line.status)) return false
      if (filter === 'incoming' && !INCOMING.includes(line.status)) return false
      if (!needle) return true
      const name = (line.item.name || '').toLowerCase()
      return name.includes(needle) || line.orderNumber.toLowerCase().includes(needle)
    })
  }, [allLines, filter, query])

  const groups = useMemo(() => {
    const map = new Map<string, OrderGroup>()
    visibleLines.forEach((line) => {
      const current = map.get(line.orderNumber)
      if (current) {
        current.lines.push(line)
        return
      }
      map.set(line.orderNumber, {
        orderNumber: line.orderNumber,
        status: line.status,
        createdDate: line.createdDate,
        lines: [line],
      })
    })
    return Array.from(map.values())
  }, [visibleLines])

  const openGroup = useCallback((group: OrderGroup) => {
    const next: Record<string, LineDraft> = {}
    group.lines.forEach((line) => {
      next[line.key] = emptyDraft(line, true)
    })
    setDrafts(next)
    setShowErrors(false)
    setActiveGroup(group)
  }, [])

  const patchDraft = useCallback((key: string, patch: Partial<LineDraft>) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }, [])

  const setAllChecked = useCallback(
    (checked: boolean) => {
      setDrafts((prev) => {
        if (!activeGroup) return prev
        const next = { ...prev }
        activeGroup.lines.forEach((line) => {
          next[line.key] = { ...next[line.key], checked }
        })
        return next
      })
    },
    [activeGroup]
  )

  const resolveUnitId = async (item: OrderItem): Promise<number | null> => {
    if (item.product_variant_unit_id) return item.product_variant_unit_id
    const product = await getProduct(item.variant_unit_id)
    if (product.error || !product.data) return null
    const options = product.data.unit_options ?? []
    const defaultUnit = options.find((unit) => unit.is_default) ?? options[0]
    return defaultUnit?.unit_id ?? product.data.default_unit_id ?? null
  }

  const checkedLines = activeGroup
    ? activeGroup.lines.filter((line) => drafts[line.key]?.checked)
    : []
  const readyCount = checkedLines.filter((line) => drafts[line.key]?.expirationDate && drafts[line.key].quantity >= 1)
    .length

  const handleSubmit = async () => {
    if (!activeGroup) return
    if (checkedLines.length === 0) {
      toastError(t('seed.noChecked'))
      return
    }
    const missingHsd = checkedLines.filter((line) => !drafts[line.key]?.expirationDate)
    if (missingHsd.length > 0) {
      setShowErrors(true)
      toastError(t('seed.needHsd'))
      return
    }

    setSubmitting(true)
    setProgress({ current: 0, total: checkedLines.length })
    let ok = 0
    const succeeded: string[] = []
    try {
      for (let i = 0; i < checkedLines.length; i += 1) {
        const line = checkedLines[i]
        const draft = drafts[line.key]
        setProgress({ current: i + 1, total: checkedLines.length })
        const unitId = await resolveUnitId(line.item)
        if (unitId == null) {
          toastError(t('seed.missingUnit'))
          continue
        }
        try {
          await onAdd({
            cabinet: cabinetId,
            product_variant_id: line.item.variant_unit_id,
            product_variant_unit_id: unitId,
            quantity: draft.quantity,
            expiration_date: draft.expirationDate,
            ...(draft.lotNumber.trim() ? { lot_number: draft.lotNumber.trim() } : {}),
          })
          ok += 1
          succeeded.push(line.key)
        } catch (err) {
          toastError(err instanceof Error ? err.message : t('toast.addFailed'))
        }
      }
    } finally {
      setSubmitting(false)
      setProgress({ current: 0, total: 0 })
    }

    if (succeeded.length) {
      setAddedKeys((keys) => Array.from(new Set([...keys, ...succeeded])))
    }

    if (ok === checkedLines.length) {
      toastSuccess(t('seed.addedBulk', { count: ok }))
      setActiveGroup(null)
      return
    }
    if (ok > 0) {
      toastError(t('seed.partialAdded', { ok, total: checkedLines.length }))
      setDrafts((prev) => {
        const next = { ...prev }
        succeeded.forEach((key) => {
          next[key] = { ...next[key], checked: false }
        })
        return next
      })
    }
  }

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title={t('seed.title')}
      panelClassName="!max-w-xl"
      footer={
        activeGroup ? (
          <div className="flex gap-3 border-t border-slate-100 px-5 py-4">
            <Button variant="outline" className="flex-1" onClick={() => setActiveGroup(null)} disabled={submitting}>
              {t('seed.back')}
            </Button>
            <Button
              className="flex-1"
              disabled={submitting || checkedLines.length === 0}
              onClick={() => void handleSubmit()}
            >
              {submitting
                ? t('seed.addingCount', { current: progress.current, total: progress.total })
                : t('seed.addSelected', { count: readyCount || checkedLines.length })}
            </Button>
          </div>
        ) : (
          <div className="border-t border-slate-100 px-5 py-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              {addedKeys.length > 0 ? t('seed.done') : t('seed.close')}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4 px-5 py-4">
        <p className="text-sm font-medium text-primary-800">
          {activeGroup ? t('seed.step2') : t('seed.step1')}
        </p>
        {!activeGroup ? (
          <div className="space-y-4">
            <p className="text-sm text-pretty text-gray-600">{t('seed.hint')}</p>
            <TextField
              label={t('seed.searchLabel')}
              placeholder={t('seed.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="cabinet-order-search"
              autoComplete="off"
              spellCheck={false}
              fullWidth
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('seed.filterLabel')}>
              <FilterChip
                active={filter === 'received'}
                onClick={() => setFilter('received')}
                label={t('seed.filterReceived', { count: receivedCount })}
              />
              <FilterChip
                active={filter === 'incoming'}
                onClick={() => setFilter('incoming')}
                label={t('seed.filterIncoming', { count: incomingCount })}
              />
              <FilterChip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label={t('seed.filterAll', { count: allLines.length })}
              />
            </div>
            {addedKeys.length > 0 ? (
              <p className="text-sm text-emerald-800" aria-live="polite">
                {t('seed.addedThisSession', { count: addedKeys.length })}
              </p>
            ) : null}
            {ordersQuery.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}
            {!ordersQuery.isLoading && visibleLines.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                <SearchIcon className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-gray-600">
                  {allLines.length === 0 ? t('seed.empty') : t('seed.emptyFilter')}
                </p>
              </div>
            ) : null}
            <div className="space-y-2">
              {groups.map((group) => (
                <OrderCard
                  key={group.orderNumber}
                  group={group}
                  locale={locale}
                  addedCount={group.lines.filter((line) => addedKeys.includes(line.key)).length}
                  onSelect={openGroup}
                />
              ))}
            </div>
            {!ordersQuery.isLoading && allLines.length >= 50 ? (
              <p className="text-xs text-gray-500">{t('seed.listCap')}</p>
            ) : null}
          </div>
        ) : (
          <BulkExpiryForm
            group={activeGroup}
            drafts={drafts}
            showErrors={showErrors}
            submitting={submitting}
            addedKeys={addedKeys}
            onPatch={patchDraft}
            onSetAllChecked={setAllChecked}
          />
        )}
      </div>
    </OfferSheet>
  )
}

function BulkExpiryForm({
  group,
  drafts,
  showErrors,
  submitting,
  addedKeys,
  onPatch,
  onSetAllChecked,
}: {
  group: OrderGroup
  drafts: Record<string, LineDraft>
  showErrors: boolean
  submitting: boolean
  addedKeys: string[]
  onPatch: (key: string, patch: Partial<LineDraft>) => void
  onSetAllChecked: (checked: boolean) => void
}) {
  const t = useTranslations('cabinet')
  const selectAllRef = useRef<HTMLInputElement>(null)
  const [showLot, setShowLot] = useState(false)
  const checkedCount = group.lines.filter((line) => drafts[line.key]?.checked).length
  const allChecked = checkedCount === group.lines.length && group.lines.length > 0
  const someChecked = checkedCount > 0 && !allChecked

  useEffect(() => {
    const el = selectAllRef.current
    if (el) el.indeterminate = someChecked
  }, [someChecked])

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold text-slate-900" translate="no">
          {group.orderNumber}
        </p>
        <p className="text-sm text-gray-600">{t('seed.hsdHelp')}</p>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 leading-none">
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allChecked}
          disabled={submitting}
          onChange={() => onSetAllChecked(!allChecked)}
          className="cart-select-check"
        />
        <span className="text-sm font-medium leading-none text-slate-800">
          {t('seed.selectAllCount', { count: group.lines.length })}
        </span>
      </label>
      <ul className="divide-y divide-slate-100 border-t border-slate-100">
        {group.lines.map((line) => (
          <LineExpiryCard
            key={line.key}
            line={line}
            draft={drafts[line.key] ?? emptyDraft(line, true)}
            showErrors={showErrors}
            showLot={showLot}
            submitting={submitting}
            alreadyAdded={addedKeys.includes(line.key)}
            onPatch={onPatch}
          />
        ))}
      </ul>
      {!showLot ? (
        <button
          type="button"
          className="text-sm font-medium text-primary-700 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          onClick={() => setShowLot(true)}
        >
          {t('seed.showLot')}
        </button>
      ) : null}
    </div>
  )
}

const LineExpiryCard = memo(function LineExpiryCard({
  line,
  draft,
  showErrors,
  showLot,
  submitting,
  alreadyAdded,
  onPatch,
}: {
  line: OrderLine
  draft: LineDraft
  showErrors: boolean
  showLot: boolean
  submitting: boolean
  alreadyAdded: boolean
  onPatch: (key: string, patch: Partial<LineDraft>) => void
}) {
  const t = useTranslations('cabinet')
  const hsdError = showErrors && draft.checked && !draft.expirationDate
  const name = line.item.name || t('itemFallback')

  return (
    <li className="py-3">
      <div className="flex items-start gap-2.5">
        <label
          className="mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center leading-none"
          aria-label={name}
        >
          <input
            type="checkbox"
            className="cart-select-check"
            checked={draft.checked}
            disabled={submitting}
            onChange={(e) => onPatch(line.key, { checked: e.target.checked })}
          />
        </label>
        <CartLineThumb native src={line.item.image_url} alt="" size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-slate-900">{name}</p>
          {alreadyAdded ? <p className="mt-0.5 text-xs text-gray-500">{t('seed.alreadyAdded')}</p> : null}
        </div>
      </div>
      {draft.checked ? (
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-medium text-slate-700">{t('quantityLabel')}</p>
              <QuantityStepper
                value={draft.quantity}
                min={1}
                max={9999}
                fullWidth
                onChange={(value) => onPatch(line.key, { quantity: value })}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-medium text-slate-700">
                {t('expirationLabel')}
                <span className="ml-0.5 text-red-500">*</span>
              </p>
              <TextField
                type="date"
                variant="floating"
                name={`expiration_date_${line.key}`}
                autoComplete="off"
                value={draft.expirationDate}
                onChange={(e) => onPatch(line.key, { expirationDate: e.target.value })}
                fullWidth
                required
                error={hsdError}
                helperText={hsdError ? t('seed.hsdRequired') : undefined}
                disabled={submitting}
                aria-label={t('expirationLabel')}
                containerClassName="min-w-0 w-full"
                className="min-w-0 max-w-full"
              />
            </div>
          </div>
          {showLot ? (
            <TextField
              label={t('lotLabel')}
              value={draft.lotNumber}
              onChange={(e) => onPatch(line.key, { lotNumber: e.target.value })}
              name={`lot_number_${line.key}`}
              autoComplete="off"
              spellCheck={false}
              fullWidth
              disabled={submitting}
            />
          ) : null}
        </div>
      ) : null}
    </li>
  )
})

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
        active
          ? 'border-primary-600 bg-primary-50 text-primary-800'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )
}

function StatusPill({ status }: { status: Order['status'] }) {
  const t = useTranslations('cabinet')
  const tone =
    status === 'DELIVERED'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : status === 'CANCELLED'
        ? 'bg-slate-100 text-slate-600 border-slate-200'
        : 'bg-amber-50 text-amber-800 border-amber-200'
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {t(`seed.status.${status}`)}
    </span>
  )
}

function OrderItemPreview({ names, fallback }: { names: string[]; fallback: string }) {
  const t = useTranslations('cabinet')
  const labels = names.map((name) => name.trim() || fallback)
  const extra = labels.length - 2

  if (labels.length <= 1) {
    return <span className="mt-0.5 block line-clamp-3 text-sm text-gray-600">(+) {labels[0] || fallback}</span>
  }

  if (labels.length === 2) {
    return (
      <span className="mt-0.5 block text-sm text-gray-600">
        <span className="block truncate">(+) {labels[0]}</span>
        <span className="block line-clamp-2">(+) {labels[1]}</span>
      </span>
    )
  }

  return (
    <span className="mt-0.5 block text-sm text-gray-600">
      <span className="block truncate">(+) {labels[0]}</span>
      <span className="block truncate">(+) {labels[1]}</span>
      <span className="block truncate">- {t('seed.andMoreProducts', { count: extra })}</span>
    </span>
  )
}

const OrderCard = memo(function OrderCard({
  group,
  locale,
  addedCount,
  onSelect,
}: {
  group: OrderGroup
  locale: string
  addedCount: number
  onSelect: (group: OrderGroup) => void
}) {
  const t = useTranslations('cabinet')
  const first = group.lines[0]
  const extra = Math.max(0, group.lines.length - 2)
  const dateLabel = formatOrderDate(group.createdDate, locale)
  const allAdded = addedCount === group.lines.length && group.lines.length > 0
  const names = group.lines.map((line) => line.item.name || t('itemFallback'))

  return (
    <button
      type="button"
      onClick={() => onSelect(group)}
      aria-label={`${group.orderNumber}. ${names.slice(0, 2).join(', ')}${
        extra > 0 ? `, ${t('seed.andMoreProducts', { count: extra })}` : ''
      }. ${t('seed.continue')}`}
      className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <CartLineThumb native src={first?.item.image_url} alt="" size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900" translate="no">
          {group.orderNumber}
        </span>
        <OrderItemPreview names={names} fallback={t('itemFallback')} />
        <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {dateLabel ? <span>{dateLabel}</span> : null}
          <StatusPill status={group.status} />
          {allAdded ? <span>{t('seed.alreadyAdded')}</span> : null}
        </span>
      </span>
      <ChevronRightIcon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
    </button>
  )
})
