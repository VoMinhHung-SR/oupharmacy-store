'use client'

import Link from 'next/link'
import React from 'react'
import { Container } from '@/components/Container'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'

const DEFAULT_DESCRIPTION =
  'Tính năng đang được hoàn thiện. Quý khách vui lòng quay lại sau hoặc liên hệ để được hỗ trợ.'

export interface ComingSoonPageProps {
  title: string
  description?: string
  breadcrumbItems: CrumbItem[]
  /** Optional emoji or short symbol shown above the title */
  icon?: string
}

export function ComingSoonPage({
  title,
  description = DEFAULT_DESCRIPTION,
  breadcrumbItems,
  icon = '✨',
}: ComingSoonPageProps) {
  return (
    <Container className="py-8 pb-16">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <div className="text-5xl" aria-hidden>
          {icon}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary-600">Sắp ra mắt</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">{description}</p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Về trang chủ
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </Container>
  )
}
