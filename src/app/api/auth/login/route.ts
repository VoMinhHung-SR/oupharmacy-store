import { NextResponse } from 'next/server'
import {
  AuthExchangeError,
  exchangePasswordGrant,
  setAuthCookies,
} from '@/lib/auth/oauth.server'

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      username?: string
      password?: string
    } | null
    const username = body?.username?.trim()
    const password = body?.password
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      )
    }

    const tokens = await exchangePasswordGrant(username, password)
    setAuthCookies(tokens)

    return NextResponse.json({
      access_token: tokens.access_token,
      token_type: tokens.token_type || 'Bearer',
      expires_in: tokens.expires_in,
    })
  } catch (e) {
    if (e instanceof AuthExchangeError) {
      return NextResponse.json({ error: e.message }, { status: e.status >= 400 ? e.status : 400 })
    }
    console.error('[api/auth/login]', e)
    return NextResponse.json({ error: 'Đăng nhập thất bại' }, { status: 500 })
  }
}
