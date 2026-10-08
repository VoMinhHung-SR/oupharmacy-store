import { persistAuthTokens, clearAuthStorage, setAccessToken } from './sessionTokens'

let refreshInFlight: Promise<string | null> | null = null

/**
 * Ask BFF to rotate tokens using HttpOnly refresh cookie.
 * Concurrent callers share one in-flight refresh.
 */
export function refreshSessionWithStoredRefresh(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) {
          clearAuthStorage()
          return null
        }
        const data = (await res.json()) as { access_token?: string }
        if (!data.access_token) {
          clearAuthStorage()
          return null
        }
        persistAuthTokens(data.access_token)
        return data.access_token
      } catch {
        clearAuthStorage()
        return null
      }
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

/** Bootstrap access token from BFF session cookies. */
export async function fetchSessionAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  try {
    const res = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      setAccessToken(null)
      return null
    }
    const data = (await res.json()) as { access_token?: string }
    if (!data.access_token) {
      setAccessToken(null)
      return null
    }
    persistAuthTokens(data.access_token)
    return data.access_token
  } catch {
    setAccessToken(null)
    return null
  }
}

export async function logoutViaBff(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // ignore network errors — local clear still runs
  }
}
