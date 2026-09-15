'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MessageCircleIcon, XIcon } from '@/components/icons'
import { useConsultUi } from '@/contexts/ConsultUiContext'
import { ConsultMessageList, type ConsultMessage } from './ConsultMessageList'
import { BookingActionBubble } from './BookingActionBubble'
import { IntentMenuBubble } from './IntentMenuBubble'
import { PharmacistThreadPanel } from './PharmacistThreadPanel'
import { ProductSuggestBubble } from './ProductSuggestBubble'
import {
  useConsultStateMachine,
  type ConsultIntent,
  type ConsultStep,
} from './useConsultStateMachine'

const OPEN_QUERY = 'consult'
const OPEN_VALUE = 'open'

const INTENT_BY_STEP: Partial<Record<ConsultStep, ConsultIntent>> = {
  pharmacist: 'pharmacist',
  doctor_guide: 'doctor',
  medicine_query: 'medicine',
}

/** Global FAB + consult panel. Mount under Suspense (uses useSearchParams). */
export function ConsultChatbox() {
  const t = useTranslations('consultation')
  const { isOpen, open: openUi, close: closeUi } = useConsultUi()
  const {
    step,
    pharmacistSeed,
    open,
    close,
    backToMenu,
    selectIntent,
    escalateToPharmacist,
  } = useConsultStateMachine()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [branchLoading, setBranchLoading] = useState(false)
  const [branchTypingLabel, setBranchTypingLabel] = useState<string | undefined>()

  const onBranchLoading = useCallback((loading: boolean, label?: string) => {
    setBranchLoading(loading)
    setBranchTypingLabel(loading ? label : undefined)
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    if (isOpen) open()
    else close()
  }, [isOpen, open, close])

  useEffect(() => {
    setBranchLoading(false)
    setBranchTypingLabel(undefined)
  }, [step])

  useEffect(() => {
    if (searchParams.get(OPEN_QUERY) !== OPEN_VALUE) return
    openUi()
    const next = new URLSearchParams(searchParams.toString())
    next.delete(OPEN_QUERY)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, openUi, router, pathname])

  const selectedIntent = INTENT_BY_STEP[step === 'idle' ? 'menu' : step]

  const typingLabel = useMemo(() => {
    if (branchTypingLabel) return branchTypingLabel
    if (!branchLoading) return undefined
    if (step === 'pharmacist') return t('connectingWithPharmacist')
    if (step === 'doctor_guide') return t('connectingWithDoctor')
    return t('typing')
  }, [branchTypingLabel, branchLoading, step, t])

  const messages: ConsultMessage[] = useMemo(() => {
    if (!isOpen) return []
    const activeStep: ConsultStep = step === 'idle' ? 'menu' : step
    const list: ConsultMessage[] = [
      { id: 'welcome', role: 'assistant', body: t('welcome') },
    ]

    if (activeStep === 'menu') {
      list.push({
        id: 'menu',
        role: 'assistant',
        fullWidth: true,
        body: <IntentMenuBubble onSelect={selectIntent} />,
      })
      return list
    }

    if (selectedIntent) {
      list.push({
        id: `user-intent-${selectedIntent}`,
        role: 'user',
        body: t(`menu.${selectedIntent}.title`),
      })
    }

    if (
      branchLoading &&
      (activeStep === 'pharmacist' || activeStep === 'doctor_guide') &&
      typingLabel
    ) {
      list.push({
        id: `connecting-${activeStep}`,
        role: 'assistant',
        body: typingLabel,
      })
    }

    if (activeStep === 'pharmacist') {
      list.push({
        id: 'branch-pharmacist',
        role: 'assistant',
        fullWidth: true,
        body: (
          <PharmacistThreadPanel
            onBack={backToMenu}
            seed={pharmacistSeed}
            onLoadingChange={onBranchLoading}
          />
        ),
      })
    } else if (activeStep === 'doctor_guide') {
      list.push({
        id: 'branch-doctor',
        role: 'assistant',
        fullWidth: true,
        body: <BookingActionBubble onBack={backToMenu} onLoadingChange={onBranchLoading} />,
      })
    } else if (activeStep === 'medicine_query') {
      list.push({
        id: 'branch-medicine',
        role: 'assistant',
        fullWidth: true,
        body: (
          <ProductSuggestBubble
            onBack={backToMenu}
            onEscalatePharmacist={escalateToPharmacist}
            onLoadingChange={onBranchLoading}
          />
        ),
      })
    }
    return list
  }, [
    isOpen,
    step,
    t,
    selectIntent,
    backToMenu,
    escalateToPharmacist,
    pharmacistSeed,
    selectedIntent,
    onBranchLoading,
    branchLoading,
    typingLabel,
  ])

  const messageSignature = `${step}|${branchLoading}|${typingLabel || ''}|${messages.length}|${isOpen}`

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    const run = (behavior: ScrollBehavior) => {
      if (cancelled) return
      scrollToBottom(behavior)
    }
    // Immediate + delayed passes so layout after branch mount still lands at bottom.
    const raf1 = window.requestAnimationFrame(() => run('smooth'))
    const t1 = window.setTimeout(() => run('smooth'), 80)
    const t2 = window.setTimeout(() => run('smooth'), 280)
    return () => {
      cancelled = true
      window.cancelAnimationFrame(raf1)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [isOpen, messageSignature, scrollToBottom])

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

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5 sm:px-3.5 sm:py-3">
            <ConsultMessageList
              messages={messages}
              showTyping={branchLoading}
              typingLabel={typingLabel}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
