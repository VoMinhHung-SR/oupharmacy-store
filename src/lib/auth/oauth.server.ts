import { cookies } from 'next/headers'
import {
  AUTH_ACCESS_COOKIE,
  AUTH_ACCESS_MAX_AGE_SEC,
  AUTH_REFRESH_COOKIE,
  AUTH_REFRESH_MAX_AGE_SEC,
} from './cookieNames'

export type OAuthTokenPayload = {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
}

function mainApiBaseUrl(): string {
  const raw =
    process.env.MAIN_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAIN_API_URL?.trim() ||
    'http://localhost:8000'
  return raw.replace(/\/$/, '')
}

function cookieSecure(): boolean {
  return process.env.NODE_ENV === 'production'
}

export async function resolveOAuthClient(): Promise<{
  client_id: string
  client_secret: string
}> {
  const clientId = process.env.OAUTH2_CLIENT_ID?.trim()
  const clientSecret = process.env.OAUTH2_CLIENT_SECRET?.trim()
  if (clientId && clientSecret) {
    return { client_id: clientId, client_secret: clientSecret }
  }

  // Local DX fallback — never expose this endpoint to the browser.
  const res = await fetch(`${mainApiBaseUrl()}/oauth2-info/`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('OAuth client credentials missing (set OAUTH2_CLIENT_ID/SECRET)')
  }
  const data = (await res.json()) as { client_id?: string; client_secret?: string }
  if (!data.client_id || !data.client_secret) {
    throw new Error('oauth2-info response incomplete')
  }
  return { client_id: data.client_id, client_secret: data.client_secret }
}

export async function exchangePasswordGrant(
  username: string,
  password: string
): Promise<OAuthTokenPayload> {
  const client = await resolveOAuthClient()
  const res = await fetch(`${mainApiBaseUrl()}/o/token/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      grant_type: 'password',
      client_id: client.client_id,
      client_secret: client.client_secret,
    }),
    cache: 'no-store',
  })
  const data = (await res.json().catch(() => ({}))) as OAuthTokenPayload & {
    error?: string
    error_description?: string
    detail?: string
  }
  if (!res.ok || !data.access_token) {
    throw new AuthExchangeError(
      data.error_description || data.error || data.detail || 'Đăng nhập thất bại',
      res.status || 400
    )
  }
  return data
}

export async function exchangeRefreshGrant(
  refreshToken: string
): Promise<OAuthTokenPayload> {
  const client = await resolveOAuthClient()
  const res = await fetch(`${mainApiBaseUrl()}/o/token/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: client.client_id,
      client_secret: client.client_secret,
    }),
    cache: 'no-store',
  })
  const data = (await res.json().catch(() => ({}))) as OAuthTokenPayload & {
    error?: string
    error_description?: string
    detail?: string
  }
  if (!res.ok || !data.access_token) {
    throw new AuthExchangeError(
      data.error_description || data.error || data.detail || 'Làm mới phiên thất bại',
      res.status || 400
    )
  }
  return data
}

export type FirebaseExchangeResult = OAuthTokenPayload & {
  user?: unknown
}

export async function exchangeFirebaseIdToken(
  idToken: string,
  provider: 'google' | 'facebook' = 'google'
): Promise<FirebaseExchangeResult> {
  const res = await fetch(`${mainApiBaseUrl()}/auth/firebase/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token: idToken, provider }),
    cache: 'no-store',
  })
  const data = (await res.json().catch(() => ({}))) as FirebaseExchangeResult & {
    detail?: string
    message?: string
  }
  if (!res.ok || !data.access_token) {
    throw new AuthExchangeError(
      data.detail || data.message || 'Đăng nhập mạng xã hội thất bại',
      res.status || 400
    )
  }
  return data
}

export class AuthExchangeError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'AuthExchangeError'
    this.status = status
  }
}

export function setAuthCookies(tokens: OAuthTokenPayload) {
  const jar = cookies()
  const secure = cookieSecure()
  const accessMax =
    typeof tokens.expires_in === 'number' && tokens.expires_in > 0
      ? tokens.expires_in
      : AUTH_ACCESS_MAX_AGE_SEC

  jar.set(AUTH_ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: accessMax,
  })

  if (tokens.refresh_token) {
    const refreshMax = Number(process.env.OAUTH2_REFRESH_MAX_AGE_SEC) || AUTH_REFRESH_MAX_AGE_SEC
    jar.set(AUTH_REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: refreshMax,
    })
  }
}

export function clearAuthCookies() {
  const jar = cookies()
  jar.set(AUTH_ACCESS_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  jar.set(AUTH_REFRESH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export function readRefreshCookie(): string | undefined {
  return cookies().get(AUTH_REFRESH_COOKIE)?.value
}

export function readAccessCookie(): string | undefined {
  return cookies().get(AUTH_ACCESS_COOKIE)?.value
}
