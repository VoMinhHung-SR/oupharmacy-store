import { STORAGE_KEY } from '../constant'
import { removeEncodedItem } from '../utils/storage'

/** Mirror access token TTL (keep in sync with BE `OAUTH2_ACCESS_LIFETIME_SEC`, default 12h). */
const ACCESS_COOKIE_MAX_AGE_SEC = 12 * 60 * 60

/** Persist access (+ optional refresh). Only updates refresh when `refreshToken` is truthy. */
export function persistAuthTokens(accessToken: string, refreshToken?: string | null) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY.TOKEN, accessToken)
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, refreshToken)
  }
  if (typeof document !== 'undefined') {
    document.cookie = `token=${accessToken}; path=/; max-age=${ACCESS_COOKIE_MAX_AGE_SEC}; SameSite=Lax`
  }
}

export function clearAuthStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY.TOKEN)
  localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN)
  removeEncodedItem(STORAGE_KEY.USER)
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; max-age=0'
  }
}
