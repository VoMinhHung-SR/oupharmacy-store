const GUEST_SESSION_STORAGE_KEY = 'oupharmacy_guest_session'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function getGuestSessionId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(GUEST_SESSION_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Create or return persisted guest cart session id (UUID v4). */
export function ensureGuestSessionId(): string {
  const existing = getGuestSessionId()
  if (existing) {
    if (UUID_RE.test(existing.trim())) return existing.trim().toLowerCase()
    clearGuestSessionId()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    const id = crypto.randomUUID()
    try {
      sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, id)
    } catch {}
    return id
  }
  throw new Error('crypto.randomUUID is not available; cannot create guest session')
}

export function clearGuestSessionId(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GUEST_SESSION_STORAGE_KEY)
  } catch {}
}
