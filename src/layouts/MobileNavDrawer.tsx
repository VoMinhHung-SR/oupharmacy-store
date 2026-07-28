'use client'

import Link from 'next/link'
import React, { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { CloseIcon, ChevronDownIcon } from '@/components/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { useMobileNavUi, useNavCategories } from '@/layouts/nav/NavProviders'
import type { NavigationCategory } from '@/layouts/NavigationBar/types'

function displayName(user: {
  name?: string | null
  first_name?: string | null
  last_name?: string | null
  email?: string | null
}): string {
  return (
    user.name ||
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    user.email ||
    'Tài khoản'
  )
}

function CategoryAccordion({
  category,
  onNavigate,
}: {
  category: NavigationCategory
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = (category.children?.length ?? 0) > 0

  if (!hasChildren) {
    return (
      <Link
        href={category.href}
        onClick={onNavigate}
        className="block border-b border-gray-100 px-4 py-3.5 text-sm font-medium text-gray-800"
      >
        {category.name}
      </Link>
    )
  }

  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left text-sm font-medium text-gray-800 focus:outline-none focus-visible:bg-primary-50"
        aria-expanded={expanded}
      >
        <span className={expanded ? 'text-primary-700' : undefined}>{category.name}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180 text-primary-600' : ''}`}
        />
      </button>

      {expanded ? (
        <div className="bg-primary-50/60 pb-2">
          <Link
            href={category.href}
            onClick={onNavigate}
            className="block px-4 py-2 text-sm font-medium text-primary-700"
          >
            Xem tất cả {category.name}
          </Link>
          {category.children.map((child) => (
            <div key={child.id} className="px-2">
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block rounded-lg px-3 py-2 text-sm text-gray-800"
              >
                {child.name}
              </Link>
              {child.level2?.length > 0 ? (
                <ul className="mb-1 ml-2 space-y-0.5 border-l border-primary-100 pl-3">
                  {child.level2.map((l2) => (
                    <li key={l2.id}>
                      <Link
                        href={l2.href}
                        onClick={onNavigate}
                        className="block py-1.5 text-xs text-gray-600"
                      >
                        {l2.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** Left slide-over category + auth menu (mobile only). */
export function MobileNavDrawer() {
  const { open, closeNav } = useMobileNavUi()
  const categories = useNavCategories()
  const { isAuthenticated, user } = useAuth()
  const { openModal } = useLoginModal()
  const pathname = usePathname()
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    closeNav()
  }, [pathname, closeNav])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeNav])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Đóng menu"
        onClick={closeNav}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 left-0 flex w-[min(20.5rem,86vw)] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div id={titleId} className="min-w-0">
            <p className="truncate text-sm font-bold text-primary-700">NHÀ THUỐC</p>
            <p className="truncate text-xs font-semibold text-gray-500">OUPHARMACY</p>
          </div>
          <button
            type="button"
            onClick={closeNav}
            className="rounded-lg p-2 text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Đóng"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 bg-primary-600 px-4 py-3 text-white">
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <p className="text-sm font-medium leading-snug">Xin chào, {displayName(user)}</p>
              <Link
                href="/tai-khoan"
                onClick={closeNav}
                className="inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-primary-700"
              >
                Tài khoản của tôi
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-xs leading-relaxed text-primary-50">
                Đăng nhập để hưởng những đặc quyền dành riêng cho thành viên.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeNav()
                    openModal()
                  }}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary-700"
                >
                  Đăng nhập
                </button>
                <Link
                  href="/register"
                  onClick={closeNav}
                  className="flex-1 rounded-lg border border-white/70 bg-primary-700/40 px-3 py-2 text-center text-xs font-semibold text-white"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          )}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain" aria-label="Danh mục">
          {categories.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">Chưa có danh mục</p>
          ) : (
            categories.map((cat) => (
              <CategoryAccordion key={cat.id} category={cat} onNavigate={closeNav} />
            ))
          )}
        </nav>

        <div className="space-y-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-500">Trải nghiệm tốt hơn khi thêm lối tắt ra màn hình chính.</p>
          <Link
            href="/tu-van-duoc-si"
            onClick={closeNav}
            className="flex w-full items-center justify-center rounded-lg bg-primary-50 px-3 py-2.5 text-sm font-semibold text-primary-700"
          >
            Tư vấn dược sĩ
          </Link>
        </div>
      </aside>
    </div>,
    document.body
  )
}
