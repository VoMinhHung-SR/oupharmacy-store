import { NextResponse } from 'next/server'
import {
  AuthExchangeError,
  exchangeFirebaseIdToken,
  setAuthCookies,
} from '@/lib/auth/oauth.server'

/** Establish HttpOnly cookies after Firebase ID token verification on MAIN API. */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      id_token?: string
      provider?: 'google' | 'facebook'
    } | null
    const idToken = body?.id_token?.trim()
    if (!idToken) {
      return NextResponse.json({ error: 'Thiếu id_token' }, { status: 400 })
    }

    const result = await exchangeFirebaseIdToken(idToken, body?.provider || 'google')
    setAuthCookies(result)

    return NextResponse.json({
      access_token: result.access_token,
      token_type: result.token_type || 'Bearer',
      expires_in: result.expires_in,
      user: result.user,
    })
  } catch (e) {
    if (e instanceof AuthExchangeError) {
      return NextResponse.json({ error: e.message }, { status: e.status >= 400 ? e.status : 400 })
    }
    console.error('[api/auth/firebase]', e)
    return NextResponse.json({ error: 'Đăng nhập mạng xã hội thất bại' }, { status: 500 })
  }
}
