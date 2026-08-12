'use client'

import { useState } from 'react'
import { HtmlContent } from '@/components/common/HtmlContent'

export interface CampaignTermsBlockProps {
  html: string
  heading: string
  moreLabel: string
  lessLabel: string
}

export function CampaignTermsBlock({
  html,
  heading,
  moreLabel,
  lessLabel,
}: CampaignTermsBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{heading}</h2>
      <div className={open ? 'mt-4' : 'relative mt-4 max-h-40 overflow-hidden sm:max-h-48'}>
        <HtmlContent html={html} className="prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900" />
        {open ? null : (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white"
            aria-hidden
          />
        )}
      </div>
      <button
        type="button"
        className="mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? lessLabel : moreLabel}
      </button>
    </section>
  )
}
