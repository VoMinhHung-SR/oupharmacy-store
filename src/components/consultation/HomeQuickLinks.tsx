'use client'

import Link from 'next/link'
import { HOME_QUICK_LINKS } from '@/lib/constant'
import { resolveHomeQuickLinkIcon } from '@/components/icons/categoryIconMap'
import { useConsultUi } from '@/contexts/ConsultUiContext'

const linkClassName =
  'relative grid h-full grid-rows-[1fr_auto_1fr] justify-items-center rounded-lg border border-slate-200/90 bg-white px-1.5 py-2 text-center shadow-sm transition-all hover:border-primary-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 sm:py-2.5'

export function HomeQuickLinks() {
  const { open: openConsult } = useConsultUi()

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5" aria-label="Lối tắt dịch vụ">
      {HOME_QUICK_LINKS.map((link) => {
        const Icon = resolveHomeQuickLinkIcon(link.iconId)
        const body = (
          <>
            {link.comingSoon ? (
              <span className="absolute right-1 top-1 z-10 rounded bg-amber-100 px-1 py-px text-[9px] font-semibold leading-none text-amber-800">
                Sắp có
              </span>
            ) : null}
            <span aria-hidden />
            <span className="flex flex-col items-center">
              <span className="flex h-8 w-8 items-center justify-center text-primary-600 sm:h-9 sm:w-9" aria-hidden>
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <span className="mt-0.5 line-clamp-2 max-w-full text-[11px] font-medium leading-tight text-slate-800 sm:text-xs">
                {link.title}
              </span>
            </span>
            <span aria-hidden />
          </>
        )

        if (link.openConsult) {
          return (
            <button
              key={link.title}
              type="button"
              onClick={openConsult}
              className={linkClassName}
            >
              {body}
            </button>
          )
        }

        return (
          <Link key={link.href} href={link.href} className={linkClassName}>
            {body}
          </Link>
        )
      })}
    </div>
  )
}
