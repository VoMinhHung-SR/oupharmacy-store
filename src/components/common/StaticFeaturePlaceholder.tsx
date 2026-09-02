import Link from 'next/link'
import type { ReactNode } from 'react'
import { PLACEHOLDER_PAGE_ACTIONS, type PlaceholderPageAction } from '@/lib/constant'

interface StaticFeaturePlaceholderProps {
  title: string
  description: string
  icon?: ReactNode
  badge?: string
  actions?: PlaceholderPageAction[]
}

export function StaticFeaturePlaceholder({
  title,
  description,
  icon,
  badge = 'Sắp ra mắt',
  actions = PLACEHOLDER_PAGE_ACTIONS,
}: StaticFeaturePlaceholderProps) {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center sm:p-12">
          {icon ? (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-2xl">
              {icon}
            </div>
          ) : null}
          {badge ? (
            <p className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {badge}
            </p>
          ) : null}
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">{description}</p>
          {actions.length > 0 ? (
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              {actions.map((action) => (
                <Link
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  className={
                    action.variant === 'outline'
                      ? 'inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                      : 'inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700'
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
