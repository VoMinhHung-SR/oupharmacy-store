'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import type { ConsultIntent } from './useConsultStateMachine'

type IntentMenuBubbleProps = {
  onSelect: (intent: ConsultIntent) => void
}

const OPTIONS: { intent: ConsultIntent; key: 'pharmacist' | 'doctor' | 'medicine'; n: '1' | '2' | '3' }[] = [
  { intent: 'pharmacist', key: 'pharmacist', n: '1' },
  { intent: 'doctor', key: 'doctor', n: '2' },
  { intent: 'medicine', key: 'medicine', n: '3' },
]

export function IntentMenuBubble({ onSelect }: IntentMenuBubbleProps) {
  const t = useTranslations('consultation')

  return (
    <div className="flex flex-col gap-2.5" role="group" aria-label={t('menu.aria')}>
      <p className="text-sm leading-snug text-slate-600">{t('menu.prompt')}</p>
      <div className="flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.intent}
            type="button"
            onClick={() => onSelect(opt.intent)}
            className="flex items-center gap-2.5 rounded-xl border border-primary-200 bg-white px-2.5 py-2 text-left transition-colors hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-sm font-semibold text-white">
              {opt.n}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-snug text-slate-900">
                {t(`menu.${opt.key}.title`)}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                {t(`menu.${opt.key}.desc`)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
