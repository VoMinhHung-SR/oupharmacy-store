'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { CartLineThumb } from '@/components/cart/CartLineThumb'
import { ClockIcon, PlusIcon } from '@/components/icons'
import { CabinetMedsListSkeleton } from '@/components/skeletons'
import { DoseScheduleSheet } from '@/components/cabinet/DoseScheduleSheet'
import type { CabinetItem, UpdateCabinetItemPayload } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type CabinetDosePanelProps = {
  items: CabinetItem[]
  isLoading: boolean
  cabinetReady: boolean
  onUpdate: (id: number, payload: UpdateCabinetItemPayload) => Promise<unknown>
  onGoToMeds: () => void
}

function TimeChips({ times, muted = false }: { times: string[]; muted?: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {times.map((value) => (
        <span
          key={value}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
            muted ? 'bg-slate-100 text-slate-500' : 'bg-primary-50 text-primary-800 ring-1 ring-primary-100'
          }`}
        >
          {value}
        </span>
      ))}
    </span>
  )
}

export function CabinetDosePanel({
  items,
  isLoading,
  cabinetReady,
  onUpdate,
  onGoToMeds,
}: CabinetDosePanelProps) {
  const t = useTranslations('cabinet.doses')
  const tc = useTranslations('cabinet')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<CabinetItem | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const active = useMemo(() => items.filter((row) => row.dose_enabled), [items])
  const paused = useMemo(
    () => items.filter((row) => !row.dose_enabled && row.dose_times?.length > 0),
    [items]
  )
  const pickable = useMemo(() => items.filter((row) => !row.dose_enabled), [items])

  const openCreate = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (row: CabinetItem) => {
    setEditing(row)
    setSheetOpen(true)
  }

  const toggle = async (row: CabinetItem, enabled: boolean) => {
    setTogglingId(row.id)
    try {
      await onUpdate(row.id, { dose_enabled: enabled })
      toastSuccess(enabled ? t('resumed') : t('paused'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : tc('toast.actionFailed'))
    } finally {
      setTogglingId(null)
    }
  }

  const hasItems = items.length > 0

  return (
    <section className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('title')}</h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{t('body')}</p>
        </div>
        {hasItems ? (
          <Button
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={openCreate}
            disabled={!cabinetReady || pickable.length === 0}
          >
            <span className="inline-flex items-center gap-1.5">
              <PlusIcon className="h-4 w-4" />
              {t('add')}
            </span>
          </Button>
        ) : null}
      </div>

      {isLoading ? <CabinetMedsListSkeleton rows={2} /> : null}

      {!isLoading && active.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-primary-200 bg-primary-50/40 px-4 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <ClockIcon className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {hasItems ? t('emptyTitle') : t('noMedsTitle')}
          </p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-600 sm:text-sm">
            {hasItems ? t('emptyBody') : t('noMedsBody')}
          </p>
          {hasItems ? (
            <Button size="sm" className="mt-4" onClick={openCreate} disabled={!cabinetReady}>
              {t('add')}
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="mt-4" onClick={onGoToMeds}>
              {t('goToMeds')}
            </Button>
          )}
        </div>
      ) : null}

      {!isLoading && active.length > 0 ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-100">
          {active.map((row) => (
            <li key={row.id} className="flex flex-col gap-2.5 bg-white px-3 py-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openEdit(row)}
                className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
              >
                <CartLineThumb src={row.image_url} alt="" size="sm" native />
                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {row.product_name || tc('itemFallback')}
                  </span>
                  {row.dose_label ? (
                    <span className="block text-xs text-slate-500">{row.dose_label}</span>
                  ) : null}
                  <TimeChips times={row.dose_times} />
                </span>
              </button>
              <div className="flex shrink-0 gap-2 pl-[4.625rem] sm:pl-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  {t('edit')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={togglingId === row.id}
                  onClick={() => void toggle(row, false)}
                >
                  {t('pause')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {!isLoading && paused.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('pausedTitle')}</p>
          <ul className="space-y-2">
            {paused.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5"
              >
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block truncate text-sm text-slate-600">
                    {row.product_name || tc('itemFallback')}
                  </span>
                  <TimeChips times={row.dose_times} muted />
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={togglingId === row.id}
                  onClick={() => void toggle(row, true)}
                >
                  {t('resume')}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-[11px] leading-relaxed text-slate-400">{t('footnote')}</p>

      <DoseScheduleSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        item={editing}
        items={pickable}
        onSave={onUpdate}
      />
    </section>
  )
}
