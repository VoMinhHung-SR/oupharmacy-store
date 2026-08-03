/**
 * Soft-nav hint for store paths (category vs product share the same URL shape).
 * Set on link click; read while the next resolve is in flight.
 */

export type StoreNavIntent = 'category' | 'product'

type IntentRecord = {
  intent: StoreNavIntent
  path: string
  at: number
}

let pending: IntentRecord | null = null

function normalizePath(pathOrHref: string): string {
  try {
    if (pathOrHref.startsWith('http')) {
      pathOrHref = new URL(pathOrHref).pathname
    }
  } catch {
    /* ignore */
  }
  return pathOrHref.replace(/^\/+|\/+$/g, '').split('?')[0] ?? ''
}

export function markStoreNavIntent(intent: StoreNavIntent, pathOrHref: string): void {
  const path = normalizePath(pathOrHref)
  if (!path) return
  pending = { intent, path, at: Date.now() }
}

/** Intent for this store path if marked recently (survives brief remounts). */
export function peekStoreNavIntent(storePath: string): StoreNavIntent | null {
  if (!pending) return null
  if (pending.path !== normalizePath(storePath)) return null
  if (Date.now() - pending.at > 15_000) {
    pending = null
    return null
  }
  return pending.intent
}

export function clearStoreNavIntent(): void {
  pending = null
}
