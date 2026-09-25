import React from 'react'
import { Container } from '@/components/Container'
import { PAGE_STACK, PAGE_Y, PAGE_Y_SECTION } from '@/lib/layout/pageLayout'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  /** Roomier vertical padding for sub-sections (PDP rails). */
  section?: boolean
}

/**
 * Full-width site content shell — same max-w + padding-x as header/nav (`Container`).
 * Grows with short pages so footer stays at the bottom of the viewport.
 */
export function PageShell({
  children,
  className = '',
  innerClassName = '',
  section = false,
}: PageShellProps) {
  const paddingY = section ? PAGE_Y_SECTION : PAGE_Y

  return (
    <div className="flex w-full flex-1 flex-col">
      <Container className={`flex-1 ${paddingY} ${className}`.trim()}>
        <div className={`${PAGE_STACK} ${innerClassName}`.trim()}>{children}</div>
      </Container>
    </div>
  )
}
