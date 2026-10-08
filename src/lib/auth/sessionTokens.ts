import { STORAGE_KEY } from '../constant'
import { removeEncodedItem } from '../utils/storage'

/** In-memory access token for Authorization headers (refresh lives in HttpOnly cookie). */
let memoryAccessToken: string | null = null

export function getAccessToken(): string | null {
  return memoryAccessToken
}

export function setAccessToken(token: string | null) {
  memoryAccessToken = token
}

function clearLegacyLocalTokens() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY.TOKEN)
  localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN)
}

/** Keep access in memory only; refresh is set by BFF cookies (ignore refresh arg). */
export function persistAuthTokens(accessToken: string, _refreshToken?: string | null) {
  if (typeof window === 'undefined') return
  memoryAccessToken = accessToken
  clearLegacyLocalTokens()
}

/** Clear client auth state. Does not call logout API (caller should). */
export function clearAuthStorage() {
  memoryAccessToken = null
  if (typeof window === 'undefined') return
  clearLegacyLocalTokens()
  removeEncodedItem(STORAGE_KEY.USER)
  // Drop legacy non-HttpOnly cookie if present
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; max-age=0'
  }
}
