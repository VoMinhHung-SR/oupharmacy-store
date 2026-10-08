'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { SearchableSelect } from '@/components/common/SearchableSelect'
import { PlusIcon, XIcon } from '@/components/icons'
import {
  DOSE_TIMES_MAX,
  type CabinetItem,
  type UpdateCabinetItemPayload,
} from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

const PRESET_TIMES = ['07:00', '12:00', '19:00', '21:00'] as const
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

type DoseScheduleSheetProps = {
  open: boolean
  onClose: () => void
  /** Item being edited; `null` = pick a medicine from the cabinet. */
  item: CabinetItem | null
  items: CabinetItem[]
  onSave: (id: number, payload: UpdateCabinetItemPayload) => Promise<unknown>
}

function normalizeTimes(times: string[]) {
  return Array.from(new Set(times.filter((v) => TIME_RE.test(v)))).sort()
}

export function DoseScheduleSheet({ open, onClose, item, items, onSave }: DoseScheduleSheetProps) {
  const t = useTranslations('cabinet.doses')
  const tc = useTranslations('cabinet')
  const titleId = useId()
  const [itemId, setItemId] = useState('')
  const [times, setTimes] = useState<string[]>([])
  const [draftTime, setDraftTime] = useState('')
  const [label, setLabel] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setItemId(item ? String(item.id) : '')
    setTimes(item?.dose_times?.length ? item.dose_times : [])
    setLabel(item?.dose_label ?? '')
    setDraftTime('')
  }, [open, item])

  const itemOptions = useMemo(
    () =>
      items.map((row) => ({
        value: String(row.id),
        label: `${row.product_name || tc('itemFallback')} · ${row.unit_name ?? ''}`.trim(),
      })),
    [items, tc]
  )

  const selectedItem = item ?? items.find((row) => String(row.id) === itemId) ?? null
  const atLimit = times.length >= DOSE_TIMES_MAX

  const addTime = (value: string) => {
    if (!TIME_RE.test(value) || times.includes(value) || atLimit) return
    setTimes((prev) => normalizeTimes([...prev, value]))
  }

  const togglePreset = (value: string) => {
    if (times.includes(value)) setTimes((prev) => prev.filter((v) => v !== value))
    else addTime(value)
  }

  const canSave = selectedItem != null && times.length > 0 && !busy

  const handleSave = async () => {
    if (!selectedItem || times.length === 0) {
      toastError(t('timesRequired'))
      return
    }
    setBusy(true)
    try {
      await onSave(selectedItem.id, {
        dose_enabled: true,
        dose_times: normalizeTimes(times),
        dose_label: label.trim(),
      })
      toastSuccess(t('saved'))
      onClose()
    } catch (err) {
      toastError(err instanceof Error ? err.message : tc('toast.actionFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <OfferSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      title={item ? t('editTitle') : t('addTitle')}
      footer={
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={busy}>
            {tc('cancel')}
          </Button>
          <Button className="flex-1" onClick={() => void handleSave()} disabled={!canSave}>
            {busy ? tc('loading') : t('save')}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 px-5 py-4">
        {item ? (
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-slate-900">
              {item.product_name || tc('itemFallback')}
            </p>
            <p className="text-xs text-slate-500">
              {item.quantity} {item.unit_name} · {item.expiration_date}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-800">{t('pickMedicine')}</p>
            <SearchableSelect
              id="dose-item-picker"
              value={itemId}
              onChange={setItemId}
              options={itemOptions}
              placeholder={t('pickPlaceholder')}
              searchPlaceholder={tc('searchPlaceholder')}
              title={t('pickMedicine')}
              emptyMessage={t('pickEmpty')}
            />
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-slate-800">{t('timesLabel')}</p>
            <p className="text-xs text-slate-500">
              {t('timesCount', { count: times.length, max: DOSE_TIMES_MAX })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_TIMES.map((value) => {
              const active = times.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => togglePreset(value)}
                  disabled={!active && atLimit}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors disabled:opacity-40 ${
                    active
                      ? 'border-primary-500 bg-primary-50 text-primary-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="time"
              value={draftTime}
              onChange={(e) => setDraftTime(e.target.value)}
              aria-label={t('customTime')}
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm tabular-nums focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 sm:max-w-[10rem]"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!TIME_RE.test(draftTime) || atLimit || times.includes(draftTime)}
              onClick={() => {
                addTime(draftTime)
                setDraftTime('')
              }}
            >
              <span className="inline-flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                {t('addTime')}
              </span>
            </Button>
          </div>

          {times.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label={t('timesLabel')}>
              {times.map((value) => (
                <li
                  key={value}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-600 py-1 pl-3 pr-1.5 text-sm font-semibold tabular-nums text-white"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => setTimes((prev) => prev.filter((v) => v !== value))}
                    className="rounded-full p-0.5 hover:bg-white/20"
                    aria-label={t('removeTime', { time: value })}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">{t('timesEmpty')}</p>
          )}
        </div>

        <TextField
          label={t('labelField')}
          placeholder={t('labelPlaceholder')}
          value={label}
          maxLength={80}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
        />

        <p className="text-xs leading-relaxed text-slate-500">{t('dailyNote')}</p>
      </div>
    </OfferSheet>
  )
}
