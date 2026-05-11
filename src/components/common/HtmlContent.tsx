'use client'

import { useEffect, useState } from 'react'

const ALLOWED_TAGS = [
  'p', 'br', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 'sub', 'sup', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
]

// No attributes allowed on any tag (no href, no target, no rel).
const ALLOWED_ATTR: string[] = []

function wrapPlainText(input: string): string {
  if (input.includes('<') && /<\w+/.test(input)) return input
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const paragraphs = escaped.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  if (paragraphs.length === 0) return ''
  return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('')
}

interface HtmlContentProps {
  html?: string | null
  className?: string
}

/**
 * Render sanitized HTML content from product description fields.
 *
 * Two-layer XSS defense:
 *   1. Scraper-side whitelist sanitization (source of truth, also good for SEO at SSR).
 *   2. Browser-side DOMPurify re-sanitization after hydration (defense-in-depth).
 *
 * SSR renders the BE-sanitized HTML directly so initial paint and crawler indexing
 * still see the description. After mount, DOMPurify is dynamically imported and
 * re-sanitizes the same HTML, guaranteeing browser-side safety even if BE data drifts.
 *
 * dompurify is browser-only (uses native DOMParser) — no jsdom/undici in the bundle.
 */
export function HtmlContent({ html, className = '' }: HtmlContentProps) {
  const [safe, setSafe] = useState<string>(() => (html ? wrapPlainText(html) : ''))

  useEffect(() => {
    if (!html) {
      setSafe('')
      return
    }
    let cancelled = false
    import('dompurify').then(({ default: DOMPurify }) => {
      if (cancelled) return
      const wrapped = wrapPlainText(html)
      const sanitized = DOMPurify.sanitize(wrapped, { ALLOWED_TAGS, ALLOWED_ATTR })
      setSafe(sanitized)
    })
    return () => {
      cancelled = true
    }
  }, [html])

  if (!safe) return null

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}
