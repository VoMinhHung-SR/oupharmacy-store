'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeftIcon, SendIcon, SpinnerIcon } from '@/components/icons'

type IconBtnProps = {
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

/** Icon-only back control with hover/focus tooltip “Quay lại”. */
export function ConsultBackIconButton({
  onClick,
  disabled,
  type = 'button',
  className = '',
}: IconBtnProps) {
  const t = useTranslations('consultation')
  const label = t('backTooltip')

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="peer inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary-600 text-primary-600 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}

/** Icon-only send control for pharmacist chat input. */
export function ConsultSendIconButton({
  onClick,
  disabled,
  type = 'submit',
  className = '',
  loading = false,
}: IconBtnProps & { loading?: boolean }) {
  const t = useTranslations('consultation')
  const label = t('branch.pharmacist.send')

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={label}
        className="peer inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}
