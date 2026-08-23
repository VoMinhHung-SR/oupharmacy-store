'use client'

import { useTranslations } from 'next-intl'
import type { ExpirationStatus } from '@/lib/services/cabinet'

const TONE: Record<ExpirationStatus, string> = {
  EXPIRED: 'bg-accent-50 text-accent-700 border-accent-200',
  EXPIRING_SOON: 'bg-accent-50 text-accent-700 border-accent-200',
  EXPIRING: 'bg-amber-50 text-amber-800 border-amber-200',
  SAFE: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

export function ExpiryBadge({ status }: { status: ExpirationStatus }) {
  const t = useTranslations('cabinet')
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${TONE[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  )
}
