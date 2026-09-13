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
    <div className="flex flex-col gap-2" role="group" aria-label={t('menu.aria')}>
      <p className="text-sm text-slate-600">{t('menu.prompt')}</p>
      <div className="flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.intent}
            type="button"
            onClick={() => onSelect(opt.intent)}
            className="flex items-start gap-3 rounded-lg border border-primary-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-600 text-sm font-semibold text-white">
              {opt.n}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-900">{t(`menu.${opt.key}.title`)}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{t(`menu.${opt.key}.desc`)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
