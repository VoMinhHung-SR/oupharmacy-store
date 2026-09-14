'use client'

import React, { useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { MessageCircleIcon, XIcon } from '@/components/icons'
import { useConsultUi } from '@/contexts/ConsultUiContext'
import { ConsultMessageList, type ConsultMessage } from './ConsultMessageList'
import { BookingActionBubble } from './BookingActionBubble'
import { IntentMenuBubble } from './IntentMenuBubble'
import { PharmacistThreadPanel } from './PharmacistThreadPanel'
import {
  useConsultStateMachine,
  type ConsultStep,
} from './useConsultStateMachine'

const OPEN_QUERY = 'consult'
const OPEN_VALUE = 'open'

function MedicineBranchStub({ onBack }: { onBack: () => void }) {
  const t = useTranslations('consultation')

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-900">{t('branch.medicine.title')}</p>
      <p className="text-sm text-slate-600">{t('branch.medicine.stub')}</p>
      <Button type="button" variant="outline" size="sm" onClick={onBack} className="self-start">
        {t('backToMenu')}
      </Button>
    </div>
  )
}

/** Global FAB + consult panel. Mount under Suspense (uses useSearchParams). */
export function ConsultChatbox() {
  const t = useTranslations('consultation')
  const { isOpen, open: openUi, close: closeUi } = useConsultUi()
  const { step, open, close, backToMenu, selectIntent } = useConsultStateMachine()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) open()
    else close()
  }, [isOpen, open, close])

  useEffect(() => {
    if (searchParams.get(OPEN_QUERY) !== OPEN_VALUE) return
    openUi()
    const next = new URLSearchParams(searchParams.toString())
    next.delete(OPEN_QUERY)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, openUi, router, pathname])

  const messages: ConsultMessage[] = useMemo(() => {
    if (!isOpen) return []
    const activeStep: ConsultStep = step === 'idle' ? 'menu' : step
    const list: ConsultMessage[] = [
      { id: 'disclaimer', role: 'system', body: t('disclaimer') },
      { id: 'welcome', role: 'assistant', body: t('welcome') },
    ]
    if (activeStep === 'menu') {
      list.push({
        id: 'menu',
        role: 'assistant',
        body: <IntentMenuBubble onSelect={selectIntent} />,
      })
    } else if (activeStep === 'pharmacist') {
      list.push({
        id: 'branch-pharmacist',
        role: 'assistant',
        body: <PharmacistThreadPanel onBack={backToMenu} />,
      })
    } else if (activeStep === 'doctor_guide') {
      list.push({
        id: 'branch-doctor',
        role: 'assistant',
        body: <BookingActionBubble onBack={backToMenu} />,
      })
    } else if (activeStep === 'medicine_query') {
      list.push({
        id: 'branch-medicine',
        role: 'assistant',
        body: <MedicineBranchStub onBack={backToMenu} />,
      })
    }
    return list
  }, [isOpen, step, t, selectIntent, backToMenu])

  return (
    <>
      <button
        type="button"
        onClick={() => (isOpen ? closeUi() : openUi())}
        aria-label={isOpen ? t('fabCloseAria') : t('fabOpenAria')}
        aria-expanded={isOpen}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MessageCircleIcon className="h-7 w-7" />}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(85vh,640px)] flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-[#f8fafc] shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(70vh,560px)] sm:w-[380px] sm:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={t('panelTitle')}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-primary-600 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{t('panelTitle')}</p>
              <p className="truncate text-xs text-primary-100">{t('panelSubtitle')}</p>
            </div>
            <button
              type="button"
              onClick={closeUi}
              className="rounded-lg p-1.5 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('fabCloseAria')}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <ConsultMessageList messages={messages} />
          </div>
        </div>
      ) : null}
    </>
  )
}
