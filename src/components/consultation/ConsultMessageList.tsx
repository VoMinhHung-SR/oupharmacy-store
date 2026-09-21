'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { ConsultTypingIndicator } from './ConsultTypingIndicator'

export type ConsultMessageRole = 'system' | 'user' | 'assistant'

export type ConsultMessage = {
  id: string
  role: ConsultMessageRole
  body: React.ReactNode
  /** Stretch full width (forms / rich bubbles). */
  fullWidth?: boolean
}

type ConsultMessageListProps = {
  messages: ConsultMessage[]
  showTyping?: boolean
  typingLabel?: string
}

export function ConsultMessageList({
  messages,
  showTyping = false,
  typingLabel,
}: ConsultMessageListProps) {
  const t = useTranslations('consultation')

  return (
    <div className="flex flex-col gap-2.5" role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((msg) => {
        if (msg.role === 'system') {
          return (
            <div key={msg.id} className="flex flex-col items-stretch gap-0.5">
              <p className="px-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700/80">
                {t('roleSystem')}
              </p>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-snug text-amber-950">
                {msg.body}
              </div>
            </div>
          )
        }

        const isUser = msg.role === 'user'
        const wide = msg.fullWidth ?? false

        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}
          >
            <p
              className={`px-0.5 text-[10px] font-medium uppercase tracking-wide ${
                isUser ? 'text-primary-600' : 'text-slate-500'
              }`}
            >
              {isUser ? t('roleUser') : t('roleAssistant')}
            </p>
            <div
              className={`${wide ? 'w-full max-w-full' : 'max-w-[88%]'} rounded-2xl px-2.5 py-2 text-sm leading-snug shadow-sm ${
                isUser
                  ? 'rounded-br-md bg-primary-600 text-white'
                  : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
              }`}
            >
              {msg.body}
            </div>
          </div>
        )
      })}

      {showTyping ? (
        <div className="flex flex-col items-start gap-0.5">
          <p className="px-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {t('roleAssistant')}
          </p>
          <ConsultTypingIndicator label={typingLabel} />
        </div>
      ) : null}
    </div>
  )
}
