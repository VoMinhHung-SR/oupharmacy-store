'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { useCabinetAlerts } from '@/lib/hooks/useCabinetAlerts'
import { toastError, toastSuccess } from '@/lib/utils/toast'

export function CabinetAlertsPanel({ enabled }: { enabled: boolean }) {
  const t = useTranslations('cabinet')
  const alerts = useCabinetAlerts(enabled, false)

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

  if (isEmpty) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800">{t('alerts.title')}</p>
          <p className="text-xs text-gray-500">{t('alerts.empty')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('alerts.title')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('alerts.hint')}</p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 ? (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
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

      {alerts.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}

      {alerts.alerts.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {alerts.alerts.map((row) => (
            <li
              key={row.id}
              className={`flex items-start gap-3 py-3 ${row.is_read ? 'opacity-70' : ''}`}
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  row.kind === 'EXPIRED' ? 'bg-red-500' : 'bg-amber-500'
                }`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{row.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{row.body}</p>
                <p className="mt-1 text-xs text-gray-400">{t(`alerts.kind.${row.kind}`)}</p>
              </div>
              {!row.is_read ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={alerts.markRead.isPending}
                  onClick={() => handleMarkRead(row.id)}
                >
                  {t('alerts.markRead')}
                </Button>
              ) : (
                <span className="text-xs text-gray-400">{t('alerts.read')}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
