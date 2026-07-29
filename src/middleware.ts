import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CHECKOUT_LEGACY_STEP_PATHS } from './lib/constant'


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

  // Account routes: client ProtectedRoute opens login modal when unauthenticated.
  // /don-hang supports guest checkout (no auth required).
  
  return NextResponse.next()
}

// Narrow matcher only — PWA assets (/manifest.webmanifest, /sw.js, /workbox-*.js,
// /icons/*) are not matched and must stay unblocked for installability.
export const config = {
  matcher: [
    '/(vi|en)/:path*',
    '/don-hang/:path*',
    '/tai-khoan/:path*',
  ]
}

