'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { usePharmacistThread } from './usePharmacistThread'

type PharmacistThreadPanelProps = {
  onBack: () => void
}

export function PharmacistThreadPanel({ onBack }: PharmacistThreadPanelProps) {
  const t = useTranslations('consultation')
  const {
    status,
    error,
    messages,
    draft,
    setDraft,
    send,
    sending,
    userId,
    waitingForPharmacist,
  } = usePharmacistThread(true)

  return (
    <div className="flex min-h-[280px] flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{t('branch.pharmacist.title')}</p>
          <p className="text-xs text-slate-500">
            {status === 'starting' || status === 'idle'
              ? t('branch.pharmacist.connecting')
              : status === 'error'
                ? t('branch.pharmacist.error')
                : waitingForPharmacist
                  ? t('branch.pharmacist.waiting')
                  : t('branch.pharmacist.connected')}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          {t('backToMenu')}
        </Button>
      </div>

      {status === 'starting' || status === 'idle' ? (
        <p className="text-sm text-slate-600">{t('branch.pharmacist.connectingHint')}</p>
      ) : null}

      {status === 'error' ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error || t('branch.pharmacist.error')}
        </p>
      ) : null}

      {status === 'ready' ? (
        <>
          <div className="flex max-h-56 min-h-[140px] flex-col gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
            {messages.length === 0 ? (
              <p className="px-1 py-2 text-xs text-slate-500">{t('branch.pharmacist.empty')}</p>
            ) : (
              messages.map((msg) => {
                const mine = userId != null && msg.user === userId
                return (
                  <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${
                        mine ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('branch.pharmacist.inputPlaceholder')}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={sending}
            />
            <Button type="submit" size="sm" disabled={sending || !draft.trim()}>
              {t('branch.pharmacist.send')}
            </Button>
          </form>
        </>
      ) : null}
    </div>
  )
}
