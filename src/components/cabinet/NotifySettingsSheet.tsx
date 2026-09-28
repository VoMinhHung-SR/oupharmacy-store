'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { OfferSheet } from '@/components/sheets'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { BellIcon, ClockIcon } from '@/components/icons'
import type { UpdateCabinetPayload } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type NotifySettingsSheetProps = {
  open: boolean
  onClose: () => void
  reminderEnabled: boolean
  doseReminderEnabled: boolean
  soonDays: number
  canSave: boolean
  onSave: (payload: UpdateCabinetPayload) => Promise<unknown>
  onConfigureDoses: () => void
}

function SettingSwitch({
  checked,
  onChange,
  labelledBy,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  labelledBy: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        checked ? 'bg-primary-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function NotifySettingsSheet({
  open,
  onClose,
  reminderEnabled,
  doseReminderEnabled,
  soonDays,
  canSave,
  onSave,
  onConfigureDoses,
}: NotifySettingsSheetProps) {
  const t = useTranslations('cabinet')
  const titleId = useId()
  const expiryLabelId = useId()
  const doseLabelId = useId()
  const [expiryOn, setExpiryOn] = useState(false)
  const [doseOn, setDoseOn] = useState(false)
  const [days, setDays] = useState('30')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setExpiryOn(reminderEnabled)
    setDoseOn(doseReminderEnabled)
    setDays(String(soonDays || 30))
  }, [open, reminderEnabled, doseReminderEnabled, soonDays])

  const handleSave = async () => {
    const parsed = Number(days)
    if (expiryOn && (!Number.isFinite(parsed) || parsed < 1 || parsed > 365)) {
      toastError(t('settings.daysInvalid'))
      return
    }
    setBusy(true)
    try {
      await onSave({
        reminder_enabled: expiryOn,
        dose_reminder_enabled: doseOn,
        ...(expiryOn ? { expiring_soon_days: parsed } : {}),
      })
      toastSuccess(t('toast.settingsSaved'))
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
      title={t('notify.title')}
      panelClassName="sm:max-w-md"
      footer={
        <div className="flex gap-3 border-t border-slate-100 bg-white px-5 py-3.5">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={busy}>
            {t('cancel')}
          </Button>
          <Button className="flex-1" onClick={() => void handleSave()} disabled={!canSave || busy}>
            {busy ? t('loading') : t('notify.save')}
          </Button>
        </div>
      }
    >
      <div className="px-5 py-4">
        <p className="text-sm leading-snug text-slate-500">{t('notify.body')}</p>

        <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
          <li className="px-3.5 py-3.5 sm:px-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <BellIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 pr-1">
                    <p id={expiryLabelId} className="text-sm font-semibold text-slate-900">
                      {t('notify.expiryLabel')}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t('notify.expiryHint')}</p>
                  </div>
                  <SettingSwitch
                    checked={expiryOn}
                    onChange={setExpiryOn}
                    labelledBy={expiryLabelId}
                  />
                </div>
                {expiryOn ? (
                  <div className="mt-3 max-w-[11rem]">
                    <TextField
                      type="number"
                      min={1}
                      max={365}
                      label={t('notify.soonDaysShort')}
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      helperText={t('notify.soonDaysHelper')}
                      fullWidth
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </li>

          <li className="px-3.5 py-3.5 sm:px-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <ClockIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 pr-1">
                    <p id={doseLabelId} className="text-sm font-semibold text-slate-900">
                      {t('notify.doseLabel')}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{t('notify.doseHint')}</p>
                  </div>
                  <SettingSwitch checked={doseOn} onChange={setDoseOn} labelledBy={doseLabelId} />
                </div>
                {doseOn ? (
                  <button
                    type="button"
                    onClick={onConfigureDoses}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
                  >
                    <ClockIcon className="h-4 w-4" />
                    {t('notify.configureDoses')}
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        </ul>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">{t('notify.footnote')}</p>
      </div>
    </OfferSheet>
  )
}
