import type { ReactNode } from 'react'

interface StaticFeaturePlaceholderProps {
  title: string
  description: string
  icon?: ReactNode
}

export function StaticFeaturePlaceholder({
  title,
  description,
  icon,
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
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">
            {description}
          </p>
        </div>
      </section>
    </main>
  )
}
