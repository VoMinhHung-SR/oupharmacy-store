import { NextResponse } from 'next/server'
import {
  AuthExchangeError,
  clearAuthCookies,
  exchangeRefreshGrant,
  readRefreshCookie,
  setAuthCookies,
} from '@/lib/auth/oauth.server'

export async function POST() {
  try {
    const refresh = readRefreshCookie()
    if (!refresh) {
      clearAuthCookies()
      return NextResponse.json({ error: 'Không có phiên làm mới' }, { status: 401 })
    }

    const tokens = await exchangeRefreshGrant(refresh)
    setAuthCookies(tokens)

    return NextResponse.json({
      access_token: tokens.access_token,
      token_type: tokens.token_type || 'Bearer',
      expires_in: tokens.expires_in,
    })
  } catch (e) {
    clearAuthCookies()
    if (e instanceof AuthExchangeError) {
      return NextResponse.json({ error: e.message }, { status: e.status >= 400 ? e.status : 401 })
    }
    console.error('[api/auth/refresh]', e)
    return NextResponse.json({ error: 'Làm mới phiên thất bại' }, { status: 500 })
  }
}
