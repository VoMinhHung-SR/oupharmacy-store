import { STORAGE_KEY } from '../constant'
import { refreshAccessToken } from '../services/auth'
import { persistAuthTokens, clearAuthStorage } from './sessionTokens'

let refreshInFlight: Promise<string | null> | null = null

/**
 * Uses refresh_token in localStorage to obtain a new access_token.
 * Concurrent callers share one in-flight refresh (rotation-safe).
 */
export function refreshSessionWithStoredRefresh(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const rt = localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN)
      if (!rt) {
        return null
      }

      const res = await refreshAccessToken(rt)
      if (res.error || !res.data?.access_token) {
        clearAuthStorage()
        return null
      }

      persistAuthTokens(res.data.access_token, res.data.refresh_token)
      return res.data.access_token
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}
