import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CHECKOUT_LEGACY_STEP_PATHS } from './lib/constant'
import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from './lib/auth/cookieNames'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (CHECKOUT_LEGACY_STEP_PATHS.includes(pathname as (typeof CHECKOUT_LEGACY_STEP_PATHS)[number])) {
    return NextResponse.redirect(new URL('/don-hang', request.url))
  }

  if (pathname.startsWith('/vi') || pathname.startsWith('/en')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/(vi|en)/, '') || '/'
    return NextResponse.redirect(url)
  }

  // Account area requires BFF auth cookie (access or refresh). Guest checkout stays open.
  if (pathname.startsWith('/tai-khoan')) {
    const hasSession =
      Boolean(request.cookies.get(AUTH_ACCESS_COOKIE)?.value) ||
      Boolean(request.cookies.get(AUTH_REFRESH_COOKIE)?.value)
    if (!hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('login', '1')
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Narrow matcher only — PWA assets (/manifest.webmanifest, /sw.js, /workbox-*.js,
// /icons/*) are not matched and must stay unblocked for installability.
export const config = {
  matcher: ['/(vi|en)/:path*', '/don-hang/:path*', '/tai-khoan/:path*'],
}
