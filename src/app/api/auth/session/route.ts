import { NextResponse } from 'next/server'
import {
  AuthExchangeError,
  clearAuthCookies,
  exchangeRefreshGrant,
  readAccessCookie,
  readRefreshCookie,
  setAuthCookies,
} from '@/lib/auth/oauth.server'

/**
 * Bootstrap access token for the client (in-memory Authorization header).
 * Never returns refresh_token.
 */
export async function GET() {
  try {
    const access = readAccessCookie()
    if (access) {
      return NextResponse.json({ access_token: access })
    }

    const refresh = readRefreshCookie()
    if (!refresh) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const tokens = await exchangeRefreshGrant(refresh)
    setAuthCookies(tokens)
    return NextResponse.json({ access_token: tokens.access_token })
  } catch (e) {
    clearAuthCookies()
    if (e instanceof AuthExchangeError) {
      return NextResponse.json({ error: e.message }, { status: 401 })
    }
    console.error('[api/auth/session]', e)
    return NextResponse.json({ error: 'Session unavailable' }, { status: 500 })
  }
}
