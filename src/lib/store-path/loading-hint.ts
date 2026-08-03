import type { ResolvedStorePath } from './types'
import type { StoreNavIntent } from './nav-intent'

export type StorePendingShell = 'category' | 'product'

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '')
}

/**
 * Which in-page skeleton to show while resolve-path is in flight.
 * Prefer nav intent; never use a full-screen backdrop for this.
 */
export function pendingShellWhileResolving(
  storePath: string,
  opts?: {
    intent?: StoreNavIntent | null
    previous?: ResolvedStorePath | null
  }
): StorePendingShell {
  const intent = opts?.intent ?? null
  if (intent === 'product') return 'product'
  if (intent === 'category') return 'category'

  const segments = storePath.split('/').filter(Boolean)
  if (segments.length < 2) return 'category'

  const previous = opts?.previous
  if (previous?.page === 'category') {
    const next = normalizePath(storePath)
    const subs = previous.subcategories ?? []
    if (subs.some((s) => normalizePath(s.slug || '') === next)) {
      return 'category'
    }
  }

  // Cold multi-segment without intent: nested categories are common; brief
  // list→PDP on product deep-links is preferable to PDP→list on category.
  return 'category'
}
