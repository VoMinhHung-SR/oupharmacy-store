'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ConsultBackIconButton, ConsultSendIconButton } from './ConsultIconButtons'
import { usePharmacistThread } from './usePharmacistThread'
import type { PharmacistSeed } from './useConsultStateMachine'

type PharmacistThreadPanelProps = {
  onBack: () => void
  seed?: PharmacistSeed | null
  onLoadingChange?: (loading: boolean, label?: string) => void
}

export function PharmacistThreadPanel({
  onBack,
  seed = null,
  onLoadingChange,
}: PharmacistThreadPanelProps) {
  const t = useTranslations('consultation')
  const threadScrollRef = useRef<HTMLDivElement>(null)
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
  } = usePharmacistThread(true, seed)

  useEffect(() => {
    if (status === 'starting' || status === 'idle') {
      onLoadingChange?.(true, t('connectingWithPharmacist'))
    } else if (sending) {
      onLoadingChange?.(true, t('typing'))
    } else {
      onLoadingChange?.(false)
    }
    return () => onLoadingChange?.(false)
  }, [status, sending, onLoadingChange, t])

  useEffect(() => {
    if (status !== 'ready') return
    const el = threadScrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, status, sending])

  if (status === 'starting' || status === 'idle') {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 flex-1 text-xs leading-snug text-slate-500">
          {t('branch.pharmacist.connectingHint')}
        </p>
        <ConsultBackIconButton onClick={onBack} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">
            {t('branch.pharmacist.title')}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-500">
            {status === 'error'
              ? t('branch.pharmacist.error')
              : waitingForPharmacist
                ? t('branch.pharmacist.waiting')
                : t('branch.pharmacist.connected')}
          </p>
        </div>
        <ConsultBackIconButton onClick={onBack} />
      </div>

      {status === 'error' ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-sm leading-snug text-red-800">
          {error || t('branch.pharmacist.error')}
        </p>
      ) : null}

      {status === 'ready' ? (
        <>
          <div
            ref={threadScrollRef}
            className="flex max-h-52 min-h-[120px] flex-col gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/80 p-2"
          >
            {messages.length === 0 ? (
              <p className="px-1 py-1.5 text-xs leading-snug text-slate-500">
                {t('branch.pharmacist.empty')}
              </p>
            ) : (
              messages.map((msg) => {
                const mine = userId != null && msg.user === userId
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-0.5 ${mine ? 'items-end' : 'items-start'}`}
                  >
                    <p
                      className={`px-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        mine ? 'text-primary-600' : 'text-slate-500'
                      }`}
                    >
                      {mine ? t('roleUser') : t('rolePharmacist')}
                    </p>
                    <div
                      className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 text-sm leading-snug shadow-sm ${
                        mine
                          ? 'rounded-br-md bg-primary-600 text-white'
                          : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
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
            className="flex items-center gap-2"
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
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm leading-snug focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={sending}
            />
            <ConsultSendIconButton disabled={!draft.trim()} loading={sending} />
          </form>
        </>
      ) : null}
    </div>
  )
}
