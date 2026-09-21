'use client'

import React from 'react'
import { ConsultBackIconButton } from './ConsultIconButtons'

export const consultFieldClassName =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-100'

type ConsultBranchHeaderProps = {
  title: string
  onBack?: () => void
}

/** Title on the left, back control on the right. */
export function ConsultBranchHeader({ title, onBack }: ConsultBranchHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="min-w-0 flex-1 text-sm font-semibold leading-none text-slate-900">{title}</p>
      {onBack ? <ConsultBackIconButton onClick={onBack} /> : null}
    </div>
  )
}

/** Inner card for form / thread content inside a chat bubble. */
export function ConsultMiniSurface({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50/90 p-2 ${className}`.trim()}>
      {children}
    </div>
  )
}

/** Primary actions always hug the right edge. */
export function ConsultCtaRow({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`flex items-center justify-end gap-2 ${className}`.trim()}>{children}</div>
}
