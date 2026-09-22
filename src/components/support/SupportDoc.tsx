import Link from 'next/link'
import React from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { STORE_SUPPORT } from '@/lib/constant'

/** Shared heading scale for support / legal / contact pages. */
export const supportTitleClass =
  'text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]'
export const supportSectionClass = 'text-lg font-semibold text-slate-900'
export const supportBodyClass = 'text-sm leading-6 text-slate-600 sm:text-[0.9375rem] sm:leading-7'
export const supportMutedClass = 'text-sm leading-6 text-slate-500'

export const SUPPORT_NAV_ITEMS = [
  { href: '/about', label: 'Giới thiệu' },
  { href: '/tro-giup', label: 'Trung tâm trợ giúp' },
  { href: '/chinh-sach-doi-tra', label: 'Chính sách đổi trả' },
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  { href: '/dieu-khoan', label: 'Điều khoản sử dụng' },
  { href: '/lien-he', label: 'Liên hệ' },
] as const

type SupportDocProps = {
  children: React.ReactNode
  activeHref: string
  aside?: React.ReactNode
}

export function SupportDoc({ children, activeHref, aside }: SupportDocProps) {
  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <PageShell>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <aside className="lg:col-span-3">
            <nav
              aria-label="Hỗ trợ"
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hỗ trợ
              </p>
              <ul className="space-y-0.5">
                {SUPPORT_NAV_ITEMS.map((item) => {
                  const active = item.href === activeHref
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          'block rounded-lg px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-primary-50 font-semibold text-primary-800'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        ].join(' ')}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3.5 px-3">
                  <span className="shrink-0 text-xs font-medium text-slate-500">Hotline</span>
                  <a
                    href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                    className="text-sm font-semibold text-primary-700 hover:underline"
                  >
                    {STORE_SUPPORT.HOTLINE_DISPLAY}
                  </a>
                </div>
              </div>
            </nav>
            {aside}
          </aside>

          <div className="lg:col-span-9">{children}</div>
        </div>
      </PageShell>
    </div>
  )
}

export function SupportPanel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function SupportSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
      <h2 className={`mb-2.5 ${supportSectionClass}`}>{title}</h2>
      <div className={`space-y-3 ${supportBodyClass}`}>{children}</div>
    </section>
  )
}
