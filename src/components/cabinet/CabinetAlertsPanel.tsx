'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { BellIcon } from '@/components/icons'
import { SkeletonPulse } from '@/components/skeletons'
import { useCabinetAlerts } from '@/lib/hooks/useCabinetAlerts'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type CabinetAlertsPanelProps = {
  enabled: boolean
  /** When true, show a chip to toggle unread-only list (`?unread=1`). */
  showUnreadFilter?: boolean
  /** Visual density for reminder hub vs embedded cabinet. */
  /** `embedded`: no card shell / title — parent card owns the heading. */
  variant?: 'default' | 'elevated' | 'embedded'
}

export function CabinetAlertsPanel({
  enabled,
  showUnreadFilter = false,
  variant = 'default',
}: CabinetAlertsPanelProps) {
  const t = useTranslations('cabinet')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const alerts = useCabinetAlerts(enabled, showUnreadFilter ? unreadOnly : false)

  const handleMarkRead = async (id: number) => {
    try {
      await alerts.markRead.mutateAsync(id)
      toastSuccess(t('alerts.markedRead'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    }
  }

  const handleMarkAll = async () => {
    try {
      await alerts.markAllRead.mutateAsync()
      toastSuccess(t('alerts.markedAllRead'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    }
  }

  const unread = alerts.unreadCount
  const isEmpty = !alerts.isLoading && alerts.alerts.length === 0
  const embedded = variant === 'embedded'
  const shellClass = embedded
    ? ''
    : variant === 'elevated'
      ? 'rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5'
      : 'rounded-lg border border-gray-200 bg-white p-5'

  if (isEmpty && !showUnreadFilter) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <BellIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-800">{t('alerts.title')}</p>
            <p className="text-xs text-gray-500">{t('alerts.empty')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={shellClass}>
      <div
        className={`mb-3 flex flex-wrap items-start gap-3 ${embedded ? 'justify-end' : 'justify-between'}`}
      >
        {embedded ? null : (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <BellIcon className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('alerts.title')}</h2>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">{t('alerts.hint')}</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {showUnreadFilter ? (
            <button
              type="button"
              onClick={() => setUnreadOnly((prev) => !prev)}
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                unreadOnly
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {unreadOnly ? 'Chưa đọc ✓' : 'Chỉ chưa đọc'}
            </button>
          ) : null}
          {unread > 0 ? (
            <span className="rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700 ring-1 ring-accent-100">
              {t('alerts.unreadBadge', { count: unread })}
            </span>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            disabled={unread === 0 || alerts.markAllRead.isPending}
            onClick={handleMarkAll}
          >
            {t('alerts.markAllRead')}
          </Button>
        </div>
      </div>

      {alerts.isLoading ? (
        <ul className="space-y-2" aria-busy="true" aria-label={t('loading')}>
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 sm:px-3.5"
            >
              <div className="flex items-start gap-3">
                <SkeletonPulse className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <SkeletonPulse className="h-5 w-16 rounded-full" />
                    <SkeletonPulse className="h-3 w-20" />
                  </div>
                  <SkeletonPulse className="h-4 w-4/5" />
                  <SkeletonPulse className="h-3 w-1/2" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center">
          <p className="text-sm text-gray-500">
            {unreadOnly ? 'Không có thông báo chưa đọc.' : t('alerts.empty')}
          </p>
        </div>
      ) : null}

      {alerts.alerts.length > 0 ? (
        <ul className="space-y-2">
          {alerts.alerts.map((row) => {
            const isUnread = !row.is_read
            const kindTone =
              row.kind === 'EXPIRED'
                ? 'bg-accent-50 text-accent-800 ring-accent-100'
                : 'bg-amber-50 text-amber-900 ring-amber-100'
            return (
              <li
                key={row.id}
                className={`rounded-xl border px-3 py-3 transition-colors sm:px-3.5 ${
                  isUnread
                    ? 'border-primary-200 bg-primary-50/40 shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white ${
                      isUnread ? 'bg-primary-500' : 'bg-slate-300'
                    }`}
                    aria-label={isUnread ? 'Chưa đọc' : 'Đã đọc'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${kindTone}`}
                      >
                        {t(`alerts.kind.${row.kind}`)}
                      </span>
                      {isUnread ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                          Mới
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-900">{row.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{row.body}</p>
                  </div>
                  {isUnread ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      disabled={alerts.markRead.isPending}
                      onClick={() => handleMarkRead(row.id)}
                    >
                      {t('alerts.markRead')}
                    </Button>
                  ) : (
                    <span className="shrink-0 pt-1 text-[11px] font-medium text-slate-400">
                      {t('alerts.read')}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
