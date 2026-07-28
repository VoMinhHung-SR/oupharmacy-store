const GUEST_SESSION_STORAGE_KEY = 'oupharmacy_guest_session'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** UUID v4 — works outside secure contexts (http://LAN-IP) where randomUUID is missing. */
function createUuidV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  // Last resort (non-crypto) — LAN preview / ancient browsers only.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

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
  const id = createUuidV4()
  try {
    sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, id)
  } catch {}
  return id
}

export function clearGuestSessionId(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(GUEST_SESSION_STORAGE_KEY)
  } catch {}
}
