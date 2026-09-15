'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

/** Animated typing dots for assistant / in-progress states. */
export function ConsultTypingIndicator({ label }: { label?: string }) {
  const t = useTranslations('consultation')
  const text = label || t('typing')

  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <span className="flex items-center gap-1" aria-hidden>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </span>
      <span className="text-xs text-slate-500">{text}</span>
    </div>
  )
}
