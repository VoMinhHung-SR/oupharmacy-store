'use client'

import { useTranslations } from 'next-intl'
import type { InventoryStatus } from '@/lib/services/cabinet'

const TONE: Record<InventoryStatus, string> = {
  IN_STOCK: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  LOW_STOCK: 'bg-amber-50 text-amber-800 border-amber-200',
  OUT_OF_STOCK: 'bg-slate-100 text-slate-700 border-slate-200',
}

export function InventoryBadge({ status }: { status: InventoryStatus }) {
  const t = useTranslations('cabinet')
  if (status === 'IN_STOCK') return null
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${TONE[status]}`}
    >
      {t(`inventory.${status}`)}
    </span>
  )
}
